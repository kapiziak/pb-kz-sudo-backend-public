/*
  Warnings:

  - The primary key for the `FacilityOccupancy` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "FacilityOccupancy" DROP CONSTRAINT "FacilityOccupancy_pkey",
ADD CONSTRAINT "FacilityOccupancy_pkey" PRIMARY KEY ("occupancyId", "facilityId", "isOccupied");
