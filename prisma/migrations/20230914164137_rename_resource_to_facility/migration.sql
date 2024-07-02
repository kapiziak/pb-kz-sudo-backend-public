/*
  Warnings:

  - You are about to drop the `Resource` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AuthorizationToResource` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AuthorizationToResource" DROP CONSTRAINT "_AuthorizationToResource_A_fkey";

-- DropForeignKey
ALTER TABLE "_AuthorizationToResource" DROP CONSTRAINT "_AuthorizationToResource_B_fkey";

-- DropTable
DROP TABLE "Resource";

-- DropTable
DROP TABLE "_AuthorizationToResource";

-- CreateTable
CREATE TABLE "Facility" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Facility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AuthorizationToFacility" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AuthorizationToFacility_AB_unique" ON "_AuthorizationToFacility"("A", "B");

-- CreateIndex
CREATE INDEX "_AuthorizationToFacility_B_index" ON "_AuthorizationToFacility"("B");

-- AddForeignKey
ALTER TABLE "_AuthorizationToFacility" ADD CONSTRAINT "_AuthorizationToFacility_A_fkey" FOREIGN KEY ("A") REFERENCES "Authorization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuthorizationToFacility" ADD CONSTRAINT "_AuthorizationToFacility_B_fkey" FOREIGN KEY ("B") REFERENCES "Facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;
