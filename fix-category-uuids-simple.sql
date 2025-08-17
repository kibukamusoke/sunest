-- Script to replace non-UUID category IDs with proper UUIDs
-- Step 1: Create a temporary mapping table
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

-- Step 3: Check if we have any non-UUID IDs
SELECT COUNT(*) as "Non-UUID Categories"
FROM categories
WHERE id
!~ '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$';

-- Display the mapping
SELECT
    old_id as "Old Category ID",
    new_id as "New Category ID"
FROM category_id_mapping
ORDER BY old_id;
