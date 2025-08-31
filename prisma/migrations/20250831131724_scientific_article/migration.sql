-- CreateTable
CREATE TABLE "ScientificArticle" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "abstract" TEXT NOT NULL,
    "keywords" TEXT[],
    "doi" TEXT,
    "url" TEXT NOT NULL,
    "journal" TEXT,
    "resourceType" "ResourceType" NOT NULL DEFAULT 'SCIENTIFIC_ARTICLE',
    "volume" TEXT,
    "issue" TEXT,
    "pages" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "license" "LicenseType" NOT NULL DEFAULT 'CC_BY',

    CONSTRAINT "ScientificArticle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScientificArticleAuthor" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "affiliation" TEXT,
    "email" TEXT,

    CONSTRAINT "ScientificArticleAuthor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reference" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "citation" TEXT NOT NULL,
    "doi" TEXT,
    "url" TEXT,

    CONSTRAINT "Reference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryToScientificArticle" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CategoryToScientificArticle_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ArticleTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ArticleTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "ScientificArticle_doi_key" ON "ScientificArticle"("doi");

-- CreateIndex
CREATE INDEX "_CategoryToScientificArticle_B_index" ON "_CategoryToScientificArticle"("B");

-- CreateIndex
CREATE INDEX "_ArticleTags_B_index" ON "_ArticleTags"("B");

-- AddForeignKey
ALTER TABLE "ScientificArticleAuthor" ADD CONSTRAINT "ScientificArticleAuthor_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "ScientificArticle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScientificArticleAuthor" ADD CONSTRAINT "ScientificArticleAuthor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reference" ADD CONSTRAINT "Reference_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "ScientificArticle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToScientificArticle" ADD CONSTRAINT "_CategoryToScientificArticle_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToScientificArticle" ADD CONSTRAINT "_CategoryToScientificArticle_B_fkey" FOREIGN KEY ("B") REFERENCES "ScientificArticle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleTags" ADD CONSTRAINT "_ArticleTags_A_fkey" FOREIGN KEY ("A") REFERENCES "ScientificArticle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleTags" ADD CONSTRAINT "_ArticleTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
