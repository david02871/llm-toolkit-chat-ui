import fs from "fs"
import path from "path"
import openai from "@/app/openai"
import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

interface Params {
  params: {
    fileId: string
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const fileId = request.nextUrl.searchParams.get("file_id")
  const fileName = request.nextUrl.searchParams.get("file_name")

  if (fileId) {
    return serveOpenAIImage(fileId)
  } else if (fileName) {
    return serveLocalFile(fileName)
  }

  return new NextResponse()
}

const serveOpenAIImage = async (fileId: string) => {
  try {
    const response = await openai.files.content(fileId)
    const image_data = await response.arrayBuffer()
    const image_data_buffer = Buffer.from(image_data)

    // Set the appropriate headers
    return new NextResponse(image_data_buffer, {
      headers: {
        "Content-Type": "image/jpeg", // or 'image/png', 'image/gif', etc.
        "Content-Length": image_data_buffer.length.toString(),
      },
    })
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch and serve the image." }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}

const serveLocalFile = async (fileName: string) => {
  try {
    const filePath = path.join(
      process.cwd(),
      "python-tools",
      "work_dir",
      fileName,
    )
    console.log(`Serving file: ${filePath}`)
    const file = fs.readFileSync(filePath)

    // Set the appropriate headers
    return new NextResponse(file, {
      headers: {
        "Content-Type": "application/json",
        "Content-Length": file.length.toString(),
      },
    })
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch and serve the file." }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}
