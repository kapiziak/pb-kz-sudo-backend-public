/*
  Warnings:

  - You are about to drop the `Entrybook` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Entrybook" DROP CONSTRAINT "Entrybook_authorizationId_fkey";

-- DropForeignKey
ALTER TABLE "Entrybook" DROP CONSTRAINT "Entrybook_authorizedById_fkey";

-- DropForeignKey
ALTER TABLE "FacilityOccupancy" DROP CONSTRAINT "FacilityOccupancy_relatedEntryId_fkey";

-- DropTable
DROP TABLE "Entrybook";

-- CreateTable
CREATE TABLE "Entry" (
    "id" SERIAL NOT NULL,
    "entryAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorizationId" INTEGER,
    "authorizedById" INTEGER NOT NULL,

    CONSTRAINT "Entry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FacilityOccupancy" ADD CONSTRAINT "FacilityOccupancy_relatedEntryId_fkey" FOREIGN KEY ("relatedEntryId") REFERENCES "Entry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_authorizationId_fkey" FOREIGN KEY ("authorizationId") REFERENCES "Authorization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_authorizedById_fkey" FOREIGN KEY ("authorizedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
