-- CreateEnum
CREATE TYPE "AcademicalCourses" AS ENUM ('INFORMATION_TECHNOLOGY', 'ECONOMY', 'MANAGEMENT', 'CHEMICAL_ENGINEERING', 'MECHANICAL_ENGINEERING', 'CIVIL_ENGINEERING', 'ELECTRICAL_ENGINEERING', 'PETROLEUM_ENGINEERING', 'INDUSTRIAL_PRODUCTION_ENGINEERING');

-- DropForeignKey
ALTER TABLE "_ResourceTags" DROP CONSTRAINT "_ResourceTags_A_fkey";

-- CreateTable
CREATE TABLE "Monograph" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "advisor" TEXT NOT NULL,
    "course" "AcademicalCourses" NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "resourceType" "ResourceType" NOT NULL DEFAULT 'MONOGRAPH',
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tags" TEXT[],

    CONSTRAINT "Monograph_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,
    "resourceType" "ResourceType" NOT NULL DEFAULT 'BOOK',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "_ResourceTags" ADD CONSTRAINT "_ResourceTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
