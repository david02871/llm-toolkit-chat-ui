import { NextRequest, NextResponse } from "next/server"
import { getFunctionMap, FunctionMap, FunctionResponse } from "@/app/assistants"

export const runtime = "nodejs"

export async function POST(request: NextRequest): Promise<NextResponse> {
  let data
  try {
    data = await request.json()
  } catch (error) {
    console.error({ error, request })

    return NextResponse.json(
      { message: "Invalid JSON in request body" },
      { status: 400 },
    )
  }

  let functionCall = data.functionCall
  let currentAssistantId = data.currentAssistant

  let args
  try {
    args = JSON.parse(functionCall.function.arguments)
  } catch (error) {
    console.error({ error, functionCall })
    return NextResponse.json(
      { message: "Invalid JSON in function arguments" },
      { status: 400 },
    )
  }

  let functionResponse: FunctionResponse

  const functionMap = await getFunctionMap(currentAssistantId)

  if (!functionMap) {
    return NextResponse.json(
      { message: "Assistant not found" },
      { status: 404 },
    )
  }

  if (Object.keys(functionMap).includes(functionCall?.function?.name)) {
    functionResponse = await callFunction(
      functionMap,
      functionCall?.function?.name,
      args,
    )

    if (functionResponse?.result) {
      if (functionResponse.result.length > 3000) {
        functionResponse.result =
          functionResponse.result.substring(0, 3000) +
          "... Result trimmed to 3000 characters."
      }

      // @ts-ignore
      return Response.json(functionResponse)
    }
  }

  // @ts-ignore
  return Response.json({ message: "There was an unknown error" })
}

async function callFunction(
  functionMapping: FunctionMap,
  name: string,
  params: any,
): Promise<FunctionResponse> {
  const func = functionMapping[name]

  if (!func) {
    throw new Error(`Function ${name} not found`)
  }

  const response: FunctionResponse = await func(params)
  return response
}
