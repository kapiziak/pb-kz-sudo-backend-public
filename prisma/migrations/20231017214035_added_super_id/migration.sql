-- CreateTable
CREATE TABLE "SuperId" (
    "id" SERIAL NOT NULL,
    "secret" TEXT NOT NULL,
    "validTo" TIMESTAMP(3),
    "pin" TEXT,
    "studentId" TEXT,
    "idendityCardId" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SuperId_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SuperId_userId_key" ON "SuperId"("userId");

-- AddForeignKey
ALTER TABLE "SuperId" ADD CONSTRAINT "SuperId_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
