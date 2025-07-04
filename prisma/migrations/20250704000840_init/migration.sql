/*
  Warnings:

  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Token` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DocumentTokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_DocumentTokens" DROP CONSTRAINT "_DocumentTokens_A_fkey";

-- DropForeignKey
ALTER TABLE "_DocumentTokens" DROP CONSTRAINT "_DocumentTokens_B_fkey";

-- DropTable
DROP TABLE "Document";

-- DropTable
DROP TABLE "Token";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "_DocumentTokens";

-- CreateTable
CREATE TABLE "documents" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "datePosted" TIMESTAMP(3),
    "snippet" TEXT,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "token_document" (
    "tokenId" INTEGER NOT NULL,
    "documentId" INTEGER NOT NULL,
    "frequency" INTEGER NOT NULL,

    CONSTRAINT "token_document_pkey" PRIMARY KEY ("tokenId","documentId")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_history" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "query" TEXT NOT NULL,
    "searched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "search_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "documents_url_key" ON "documents"("url");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_token_key" ON "tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "token_document" ADD CONSTRAINT "token_document_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "tokens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "token_document" ADD CONSTRAINT "token_document_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "search_history" ADD CONSTRAINT "search_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
