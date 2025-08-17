-- Complete script to replace non-UUID category IDs with proper UUIDs
BEGIN;

-- Step 1: Create a mapping table for old ID to new UUID
CREATE TEMP TABLE category_id_mapping (
    old_id TEXT NOT NULL,
    new_id UUID NOT NULL DEFAULT gen_random_uuid(),
    PRIMARY KEY (old_id)
);

-- Step 2: Populate mapping with all existing category IDs
INSERT INTO category_id_mapping (old_id)
SELECT DISTINCT id FROM categories;

-- Step 3: Disable foreign key constraints temporarily
SET session_replication_role = replica;

-- Step 4: Update categories table
-- Add temporary columns
ALTER TABLE categories ADD COLUMN temp_new_id UUID;
ALTER TABLE categories ADD COLUMN temp_new_parent_id UUID;

-- Set new IDs
UPDATE categories 
SET temp_new_id = (SELECT new_id FROM category_id_mapping WHERE old_id = categories.id);

-- Set new parent IDs where applicable
UPDATE categories 
SET temp_new_parent_id = (
    SELECT mapping.new_id 
    FROM category_id_mapping mapping 
    WHERE mapping.old_id = categories."parentId"
)
WHERE categories."parentId" IS NOT NULL;

-- Step 5: Update products table if it exists and has data
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'products') THEN
        -- Add temporary column for new category ID
        ALTER TABLE products ADD COLUMN temp_new_category_id UUID;
        
        -- Update products with new category IDs
        UPDATE products 
        SET temp_new_category_id = (
            SELECT mapping.new_id 
            FROM category_id_mapping mapping 
            WHERE mapping.old_id = products."categoryId"
        );
    END IF;
END $$;

-- Step 6: Replace old columns with new ones
-- Categories table
ALTER TABLE categories DROP COLUMN id CASCADE;
ALTER TABLE categories DROP COLUMN "parentId";
ALTER TABLE categories RENAME COLUMN temp_new_id TO id;
ALTER TABLE categories RENAME COLUMN temp_new_parent_id TO "parentId";

-- Add primary key constraint
ALTER TABLE categories ADD PRIMARY KEY (id);

-- Products table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'products') THEN
        ALTER TABLE products DROP COLUMN "categoryId";
        ALTER TABLE products RENAME COLUMN temp_new_category_id TO "categoryId";
    END IF;
END $$;

-- Step 7: Re-enable foreign key constraints
SET session_replication_role = DEFAULT;

-- Step 8: Add back foreign key constraints
ALTER TABLE categories 
ADD CONSTRAINT "categories_parentId_fkey" 
FOREIGN KEY ("parentId") REFERENCES categories(id) ON DELETE SET NULL ON UPDATE CASCADE;

-- Add products constraint if table exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'products') THEN
        ALTER TABLE products 
        ADD CONSTRAINT "products_categoryId_fkey" 
        FOREIGN KEY ("categoryId") REFERENCES categories(id) ON DELETE RESTRICT ON UPDATE CASCADE;
        
        -- Make categoryId NOT NULL if there are products
        IF EXISTS (SELECT 1 FROM products LIMIT 1) THEN
            ALTER TABLE products ALTER COLUMN "categoryId" SET NOT NULL;
        END IF;
    END IF;
END $$;

COMMIT;
