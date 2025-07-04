/*
  Warnings:

  - Added the required column `num_tokens` to the `documents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "num_tokens" INTEGER NOT NULL;
