import { db } from "@/app/db";
import { mistral } from "@ai-sdk/mistral";
import { streamText, UIMessage, convertToModelMessages, tool, stepCountIs } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  if (!process.env.MISTRAL_API_KEY) {
    return new Response("Missing MISTRAL_API_KEY environment variable.", {
      status: 500,
    });
  }
  const { messages }: { messages: UIMessage[] } = await req.json();

  const SYSTEM_PROMPT = `You are an expert PostgreSQL assistant that helps users query their database from natural language instructions.

  ${new Date().toLocaleString('sv-SE')}

You can call the following tools:
1. schema tool — fetch the latest database schema before writing a query.
2. db tool — execute a generated query against the production database.

Rules:
- Use the schema returned by the schema tool; do not guess table or column names.
- Produce valid ANSI SQL that is compatible with PostgreSQL 15.
- Prefer explicit column lists and include LIMIT when the result set could be large.
- ALWAYS ANSWER IN HUMAN NATURAL LANGUAGE NO RETURNING TABLES OR ANYTHING 

Maintain a concise, professional tone while explaining your reasoning.`;

  try {
    const result = streamText({
      model: mistral("codestral-latest"),
      messages: convertToModelMessages(messages),
      system: SYSTEM_PROMPT,
      stopWhen: stepCountIs(5),
      tools: {
        schema: tool({
          description: "Call this tool to get database schema information.",
          inputSchema: z.object({}),
          execute: async () => {
            return `CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price REAL NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sales (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  quantity INTEGER NOT NULL,
  total_amount REAL NOT NULL,
  sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  customer_name TEXT NOT NULL,
  region TEXT NOT NULL
);`;
          },
        }),
        db: tool({
          description: "Call this tool to query the database",
          inputSchema: z.object({
            query: z.string().describe("The Sql query to be run."),
          }),
          execute: async ({ query }) => {
            console.log("Query", query);
            //make db call
            return await db.execute(query);
          },
        }),
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error while generating Mistral response.", error);
    return new Response("Failed to generate response.", { status: 500 });
  }
}
