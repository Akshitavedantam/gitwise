-- Step 0: Fill existing NULLs with a placeholder
UPDATE "User" SET "name" = 'Unknown' WHERE "name" IS NULL;

-- Step 1: Alter the column to be NOT NULL
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;

-- Step 2: (Optional) You can also ensure other constraints are fine
