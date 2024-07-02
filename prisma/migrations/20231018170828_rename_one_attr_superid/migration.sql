/*
  Warnings:

  - You are about to drop the column `idendityCardId` on the `SuperId` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SuperId" DROP COLUMN "idendityCardId",
ADD COLUMN     "identityCardId" TEXT;
