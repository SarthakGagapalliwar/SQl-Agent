import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { productsTable, salesTable } from "./schema";

async function seed() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL environment variable is not set.");
  }

  const sql = neon(url);
  const db = drizzle(sql);

  const productSeed = [
    { name: "Organic Quinoa", category: "Groceries", price: 12.5, stock: 150 },
    {
      name: "Cold Brew Coffee Concentrate",
      category: "Beverages",
      price: 18.75,
      stock: 80,
    },
    {
      name: "Wireless Noise-Canceling Headphones",
      category: "Electronics",
      price: 249.99,
      stock: 35,
    },
    {
      name: "Ergonomic Office Chair",
      category: "Furniture",
      price: 329,
      stock: 20,
    },
    {
      name: "Bamboo Cutting Board Set",
      category: "Kitchen",
      price: 42.45,
      stock: 120,
    },
  ];

  const salesSeed = [
    {
      productName: "Organic Quinoa",
      quantity: 24,
      customerName: "Avery Johnson",
      region: "North America",
      saleDate: new Date("2025-01-11T14:05:00Z"),
    },
    {
      productName: "Cold Brew Coffee Concentrate",
      quantity: 18,
      customerName: "Maya Chen",
      region: "Asia-Pacific",
      saleDate: new Date("2025-02-08T09:45:00Z"),
    },
    {
      productName: "Wireless Noise-Canceling Headphones",
      quantity: 7,
      customerName: "Daniel Ibrahim",
      region: "Europe",
      saleDate: new Date("2025-03-21T16:30:00Z"),
    },
    {
      productName: "Ergonomic Office Chair",
      quantity: 5,
      customerName: "Priya Patel",
      region: "North America",
      saleDate: new Date("2025-04-02T12:10:00Z"),
    },
    {
      productName: "Bamboo Cutting Board Set",
      quantity: 32,
      customerName: "Liam O'Connor",
      region: "Europe",
      saleDate: new Date("2025-05-19T10:55:00Z"),
    },
    {
      productName: "Cold Brew Coffee Concentrate",
      quantity: 22,
      customerName: "Sophia Martinez",
      region: "South America",
      saleDate: new Date("2025-06-07T08:20:00Z"),
    },
    {
      productName: "Organic Quinoa",
      quantity: 15,
      customerName: "Noah Williams",
      region: "Africa",
      saleDate: new Date("2025-07-12T17:40:00Z"),
    },
  ];

  await db.delete(salesTable);
  await db.delete(productsTable);

  const insertedProducts = await db
    .insert(productsTable)
    .values(productSeed)
    .returning({
      id: productsTable.id,
      name: productsTable.name,
      price: productsTable.price,
    });

  const productLookup = new Map(
    insertedProducts.map((product) => [product.name, product])
  );

  const salesValues = salesSeed.map((entry) => {
    const product = productLookup.get(entry.productName);
    if (!product) {
      throw new Error(
        `Product ${entry.productName} not found while seeding sales data.`
      );
    }

    const totalAmount = Number((entry.quantity * product.price).toFixed(2));

    return {
      productId: product.id,
      quantity: entry.quantity,
      totalAmount,
      saleDate: entry.saleDate,
      customerName: entry.customerName,
      region: entry.region,
    };
  });

  await db.insert(salesTable).values(salesValues);

  console.log("Seed data inserted successfully.");
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
