-- Script to replace non-UUID category IDs with proper UUIDs
-- This will create a mapping table, generate new UUIDs, and update all references

-- Step 1: Create a temporary mapping table to track old ID -> new UUID mappings
CREATE TEMP
TABLE category_id_mapping
(
    old_id VARCHAR NOT NULL,
    new_id UUID NOT NULL DEFAULT gen_random_uuid
(),
    PRIMARY KEY
(old_id)
);

-- Step 2: Insert all existing category IDs into the mapping table
INSERT INTO category_id_mapping
    (old_id)
SELECT DISTINCT id
FROM categories;

-- Step 3: Add a new temporary column for the new UUID
ALTER TABLE categories ADD COLUMN new_id UUID;
ALTER TABLE categories ADD COLUMN new_parent_id UUID;

-- Step 4: Update categories with new UUIDs
UPDATE categories 
SET new_id = (SELECT new_id
FROM category_id_mapping
WHERE old_id = categories.id);

-- Step 5: Update parent references with new UUIDs
UPDATE categories 
SET new_parent_id = (
    SELECT mapping.new_id
FROM category_id_mapping mapping
WHERE mapping.old_id = categories."parentId"
)
WHERE categories."parentId" IS NOT NULL;

-- Step 6: Update products table to reference new category IDs
ALTER TABLE products ADD COLUMN new_category_id UUID;

UPDATE products 
SET new_category_id = (
    SELECT mapping.new_id
FROM category_id_mapping mapping
WHERE mapping.old_id = products."categoryId"
);

-- Step 7: Update ProductAttributeTemplate table to reference new category IDs
ALTER TABLE "ProductAttributeTemplate" ADD COLUMN new_category_id UUID;

UPDATE "ProductAttributeTemplate" 
SET new_category_id = (
    SELECT mapping.new_id
FROM category_id_mapping mapping
WHERE mapping.old_id = "ProductAttributeTemplate"."categoryId"
)
WHERE "ProductAttributeTemplate"."categoryId" IS NOT NULL;

-- Step 8: Drop foreign key constraints temporarily
ALTER TABLE products DROP CONSTRAINT IF EXISTS "products_categoryId_fkey";
ALTER TABLE "ProductAttributeTemplate" DROP CONSTRAINT IF EXISTS "ProductAttributeTemplate_categoryId_fkey";
ALTER TABLE categories DROP CONSTRAINT IF EXISTS "categories_parentId_fkey";

-- Step 9: Drop old columns and rename new ones
ALTER TABLE categories DROP COLUMN id;
ALTER TABLE categories DROP COLUMN "parentId";
ALTER TABLE categories RENAME COLUMN new_id TO id;
ALTER TABLE categories RENAME COLUMN new_parent_id TO "parentId";

ALTER TABLE products DROP COLUMN "categoryId";
ALTER TABLE products RENAME COLUMN new_category_id TO "categoryId";

ALTER TABLE "ProductAttributeTemplate" DROP COLUMN "categoryId";
ALTER TABLE "ProductAttributeTemplate" RENAME COLUMN new_category_id TO "categoryId";

-- Step 10: Add primary key and foreign key constraints back
ALTER TABLE categories ADD PRIMARY KEY (id);
ALTER TABLE categories ADD CONSTRAINT "categories_parentId_fkey" 
    FOREIGN KEY ("parentId") REFERENCES categories(id) ON DELETE SET NULL ON UPDATE CASCADE;

-- Step 11: Update products foreign key constraint
ALTER TABLE products ADD CONSTRAINT "products_categoryId_fkey" 
    FOREIGN KEY ("categoryId") REFERENCES categories(id)
ON DELETE RESTRICT ON
UPDATE CASCADE;

-- Step 12: Update ProductAttributeTemplate foreign key constraint
ALTER TABLE "ProductAttributeTemplate" ADD CONSTRAINT "ProductAttributeTemplate_categoryId_fkey" 
    FOREIGN KEY ("categoryId") REFERENCES categories(id) ON DELETE SET NULL ON UPDATE CASCADE;

-- Step 13: Ensure NOT NULL constraint on category id
ALTER TABLE categories ALTER COLUMN id
SET
NOT NULL;
ALTER TABLE products ALTER COLUMN "categoryId"
SET
NOT NULL;

-- Output the mapping for reference
SELECT
    old_id as "Old Category ID",
    new_id as "New Category ID"
FROM category_id_mapping
ORDER BY old_id;
