/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CourseLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "level" "CourseLevel" NOT NULL DEFAULT 'BEGINNER',
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "thumbnail" TEXT;

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "estimatedTime" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug");
