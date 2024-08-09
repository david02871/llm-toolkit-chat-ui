import openai from "@/app/openai";
import { NextRequest, NextResponse } from "next/server";

// Define the structure of the request body
interface ToolCallOutput {
  output: any; // replace `any` with the actual type of `output` if known
  tool_call_id: string;
}

interface RequestBody {
  toolCallOutputs: ToolCallOutput[];
  runId: string;
}

// Define the parameters type
interface Params {
  params: {
    threadId: string;
  };
}

// Send a new message to a thread
export async function POST(
  request: NextRequest,
  { params: { threadId } }: Params
): Promise<NextResponse> {
  // Parse the request body
  const { toolCallOutputs, runId }: RequestBody = await request.json();

  // Use the OpenAI API
  const stream = openai.beta.threads.runs.submitToolOutputsStream(
    threadId,
    runId,
    { tool_outputs: toolCallOutputs }
  );

  // Return the response as a readable stream
  // @ts-ignore
  return new Response(stream.toReadableStream());
}