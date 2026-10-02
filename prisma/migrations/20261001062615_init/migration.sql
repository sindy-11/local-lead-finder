-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "source" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "data" TEXT,
    "noWebsiteListed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Search" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "city" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "requested" INTEGER NOT NULL,
    "found" INTEGER NOT NULL,
    "operations" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SearchBusiness" (
    "searchId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,

    PRIMARY KEY ("searchId", "businessId"),
    CONSTRAINT "SearchBusiness_searchId_fkey" FOREIGN KEY ("searchId") REFERENCES "Search" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SearchBusiness_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SavedLead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessId" TEXT NOT NULL,
    "saved" BOOLEAN NOT NULL DEFAULT true,
    "contactStatus" TEXT NOT NULL DEFAULT 'NEW',
    "websiteStatus" TEXT,
    "verificationNote" TEXT NOT NULL DEFAULT '',
    "notes" TEXT NOT NULL DEFAULT '',
    "instagram" TEXT,
    "whatsapp" TEXT,
    "email" TEXT,
    "manualName" TEXT,
    "manualPhone" TEXT,
    "manualWebsite" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SavedLead_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Template" (
    "category" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Business_source_sourceId_key" ON "Business"("source", "sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedLead_businessId_key" ON "SavedLead"("businessId");
