import { NextRequest, NextResponse } from "next/server"
import civicrmAssistant from "@/app/assistants/civicrm-assistant"

export const runtime = "nodejs"

export async function POST(request: NextRequest): Promise<NextResponse> {
  let functionCall = await request.json()
  let args = JSON.parse(functionCall.function.arguments)
  let result = ""

  const functionMap = civicrmAssistant.functionMap

  if (Object.keys(functionMap).includes(functionCall?.function?.name)) {
    result = await callFunction(functionMap, functionCall?.function?.name, args)

    if (result) {
      if (result.length > 3000) {
        result =
          result.substring(0, 3000) + "... Result trimmed to 3000 characters."
      }

      // @ts-ignore
      return Response.json({ message: result })
    }
  }

  // @ts-ignore
  return Response.json({ message: "There was an unknown error" })
}

type FunctionMap = {
  [key: string]: (params: any) => Promise<any>
}

async function callFunction(
  functionMapping: FunctionMap,
  name: string,
  params: any,
) {
  // @ts-ignore
  const func = functionMapping[name]

  if (!func) {
    throw new Error(`Function ${name} not found`)
  }

  return await func(params)
}
