/*
  Warnings:

  - The required column `public_id` was added to the `Customer` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `public_id` was added to the `Order` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `tracking_token` was added to the `Order` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Customer" (
    "customer_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "phone" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "public_id" TEXT NOT NULL
);
INSERT INTO "new_Customer" ("customer_id", "first_name", "last_name", "password_hash", "phone") SELECT "customer_id", "first_name", "last_name", "password_hash", "phone" FROM "Customer";
DROP TABLE "Customer";
ALTER TABLE "new_Customer" RENAME TO "Customer";
CREATE UNIQUE INDEX "Customer_phone_key" ON "Customer"("phone");
CREATE UNIQUE INDEX "Customer_public_id_key" ON "Customer"("public_id");
CREATE TABLE "new_Order" (
    "order_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "purchase_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_delivered" DATETIME,
    "status_id" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "tracking_token" TEXT NOT NULL,
    "public_id" TEXT NOT NULL,
    "customer_id" INTEGER NOT NULL,
    CONSTRAINT "Order_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer" ("customer_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Order_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "Status" ("status_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("customer_id", "date_delivered", "order_id", "price", "purchase_date", "status_id") SELECT "customer_id", "date_delivered", "order_id", "price", "purchase_date", "status_id" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_tracking_token_key" ON "Order"("tracking_token");
CREATE UNIQUE INDEX "Order_public_id_key" ON "Order"("public_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
