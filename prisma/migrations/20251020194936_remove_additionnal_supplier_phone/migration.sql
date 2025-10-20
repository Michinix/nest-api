/*
  Warnings:

  - Made the column `phone` on table `Supplier` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Supplier" ALTER COLUMN "phone" SET NOT NULL;
