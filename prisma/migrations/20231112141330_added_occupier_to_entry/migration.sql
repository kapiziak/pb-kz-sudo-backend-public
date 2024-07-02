/*
  Warnings:

  - Added the required column `occupierId` to the `Entry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Entry" ADD COLUMN     "occupierId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_occupierId_fkey" FOREIGN KEY ("occupierId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
