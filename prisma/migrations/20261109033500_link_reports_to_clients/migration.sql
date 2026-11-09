-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ServiceReport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "shopName" TEXT NOT NULL,
    "address" TEXT,
    "concern" TEXT,
    "type" TEXT NOT NULL DEFAULT 'REPAIR',
    "technicians" TEXT,
    "contactName" TEXT,
    "clientId" TEXT,
    "linkedId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ServiceReport_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ServiceReport" ("address", "clientId", "concern", "contactName", "createdAt", "date", "id", "shopName", "technicians", "type", "updatedAt") SELECT "address", "clientId", "concern", "contactName", "createdAt", "date", "id", "shopName", "technicians", "type", "updatedAt" FROM "ServiceReport";
DROP TABLE "ServiceReport";
ALTER TABLE "new_ServiceReport" RENAME TO "ServiceReport";
CREATE INDEX "ServiceReport_date_idx" ON "ServiceReport"("date");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
