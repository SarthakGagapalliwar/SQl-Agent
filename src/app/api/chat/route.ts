import { mistral } from "@ai-sdk/mistral";
import { streamText, UIMessage, convertToModelMessages } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  if (!process.env.MISTRAL_API_KEY) {
    return new Response("Missing MISTRAL_API_KEY environment variable.", {
      status: 500,
    });
  }

  const { messages }: { messages: UIMessage[] } = await req.json();

  try {
    const result = streamText({
      model: mistral("codestral-latest"),
      messages: convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error while generating Mistral response.", error);
    return new Response("Failed to generate response.", { status: 500 });
  }
}   
