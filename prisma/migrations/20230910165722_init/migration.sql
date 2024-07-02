-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EMPLOYEE', 'VISITOR');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileAttribute" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ProfileAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileAttributeOnProfile" (
    "profileAttributeId" INTEGER NOT NULL,
    "profileId" INTEGER NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "ProfileAttributeOnProfile_pkey" PRIMARY KEY ("profileAttributeId","profileId")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Authorization" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expireAt" TIMESTAMP(3),
    "createdByUserId" INTEGER NOT NULL,

    CONSTRAINT "Authorization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entrybook" (
    "id" SERIAL NOT NULL,
    "entryAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorizationId" INTEGER,
    "authorizedById" INTEGER NOT NULL,

    CONSTRAINT "Entrybook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AuthorizationToResource" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_assignedTo" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Authorization_createdByUserId_key" ON "Authorization"("createdByUserId");

-- CreateIndex
CREATE UNIQUE INDEX "_AuthorizationToResource_AB_unique" ON "_AuthorizationToResource"("A", "B");

-- CreateIndex
CREATE INDEX "_AuthorizationToResource_B_index" ON "_AuthorizationToResource"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_assignedTo_AB_unique" ON "_assignedTo"("A", "B");

-- CreateIndex
CREATE INDEX "_assignedTo_B_index" ON "_assignedTo"("B");

-- AddForeignKey
ALTER TABLE "ProfileAttributeOnProfile" ADD CONSTRAINT "ProfileAttributeOnProfile_profileAttributeId_fkey" FOREIGN KEY ("profileAttributeId") REFERENCES "ProfileAttribute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileAttributeOnProfile" ADD CONSTRAINT "ProfileAttributeOnProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Authorization" ADD CONSTRAINT "Authorization_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrybook" ADD CONSTRAINT "Entrybook_authorizationId_fkey" FOREIGN KEY ("authorizationId") REFERENCES "Authorization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrybook" ADD CONSTRAINT "Entrybook_authorizedById_fkey" FOREIGN KEY ("authorizedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuthorizationToResource" ADD CONSTRAINT "_AuthorizationToResource_A_fkey" FOREIGN KEY ("A") REFERENCES "Authorization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuthorizationToResource" ADD CONSTRAINT "_AuthorizationToResource_B_fkey" FOREIGN KEY ("B") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_assignedTo" ADD CONSTRAINT "_assignedTo_A_fkey" FOREIGN KEY ("A") REFERENCES "Authorization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_assignedTo" ADD CONSTRAINT "_assignedTo_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
