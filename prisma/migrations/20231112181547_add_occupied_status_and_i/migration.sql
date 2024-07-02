/*
  Warnings:

  - The primary key for the `FacilityOccupancy` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `isOccupied` to the `FacilityOccupancy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FacilityOccupancy" DROP CONSTRAINT "FacilityOccupancy_pkey",
ADD COLUMN     "isOccupied" BOOLEAN NOT NULL,
ADD COLUMN     "occupancyId" SERIAL NOT NULL,
ADD CONSTRAINT "FacilityOccupancy_pkey" PRIMARY KEY ("occupancyId");
