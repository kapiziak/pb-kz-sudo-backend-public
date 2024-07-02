-- CreateTable
CREATE TABLE "FacilityOccupancy" (
    "facilityId" INTEGER NOT NULL,
    "relatedEntryId" INTEGER NOT NULL,
    "isOccupied" BOOLEAN NOT NULL,

    CONSTRAINT "FacilityOccupancy_pkey" PRIMARY KEY ("facilityId")
);

-- AddForeignKey
ALTER TABLE "FacilityOccupancy" ADD CONSTRAINT "FacilityOccupancy_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacilityOccupancy" ADD CONSTRAINT "FacilityOccupancy_relatedEntryId_fkey" FOREIGN KEY ("relatedEntryId") REFERENCES "Entrybook"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
