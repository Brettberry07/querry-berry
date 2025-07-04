-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "datePosted" TIMESTAMP(3),
    "snippet" TEXT,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "word" TEXT NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "history" TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DocumentTokens" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_DocumentTokens_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Document_url_key" ON "Document"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Token_word_key" ON "Token"("word");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "_DocumentTokens_B_index" ON "_DocumentTokens"("B");

-- AddForeignKey
ALTER TABLE "_DocumentTokens" ADD CONSTRAINT "_DocumentTokens_A_fkey" FOREIGN KEY ("A") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentTokens" ADD CONSTRAINT "_DocumentTokens_B_fkey" FOREIGN KEY ("B") REFERENCES "Token"("id") ON DELETE CASCADE ON UPDATE CASCADE;
