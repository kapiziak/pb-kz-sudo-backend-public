/*
  Warnings:

  - The primary key for the `FacilityOccupancy` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `occupancyId` on the `FacilityOccupancy` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FacilityOccupancy" DROP CONSTRAINT "FacilityOccupancy_pkey",
DROP COLUMN "occupancyId",
ADD CONSTRAINT "FacilityOccupancy_pkey" PRIMARY KEY ("facilityId", "isOccupied");
