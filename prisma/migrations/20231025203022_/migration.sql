-- CreateTable
CREATE TABLE "SuperIdChallenge" (
    "challengeId" TEXT NOT NULL,
    "superIdId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validTo" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SuperIdChallenge_pkey" PRIMARY KEY ("challengeId")
);

-- AddForeignKey
ALTER TABLE "SuperIdChallenge" ADD CONSTRAINT "SuperIdChallenge_superIdId_fkey" FOREIGN KEY ("superIdId") REFERENCES "SuperId"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
