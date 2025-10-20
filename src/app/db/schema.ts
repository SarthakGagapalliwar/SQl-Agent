import { pgTable, serial, text, integer, real, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Products table
export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: real("price").notNull(),
  stock: integer("stock").notNull().default(0),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Sales table
export const salesTable = pgTable("sales", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => productsTable.id),
  quantity: integer("quantity").notNull(),
  totalAmount: real("total_amount").notNull(),
  saleDate: timestamp("sale_date").default(sql`CURRENT_TIMESTAMP`),
  customerName: text("customer_name").notNull(),
  region: text("region").notNull(),
});
