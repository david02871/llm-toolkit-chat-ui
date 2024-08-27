import openai from "@/app/openai"
import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { MessageCreateParams } from "openai/resources/beta/threads/messages"

export const runtime = "nodejs"

interface Params {
  params: {
    threadId: string
  }
}

interface RequestBody {
  assistantId: string
}

export async function POST(
  request: NextRequest,
  { params: { threadId } }: Params,
): Promise<NextResponse> {
  const { assistantId }: RequestBody = await request.json()

  // If there are pending files, upload them and send a message with the file ID
  const fileId = await uploadPendingFile()
  if (fileId) {
    const _result = await sendMessageWithFileId({
      threadId,
      content: `The file has been uploaded with ID: ${fileId}.`,
      fileId,
      assistantId,
    })

    const stream = openai.beta.threads.runs.stream(threadId, {
      assistant_id: assistantId,
    })

    // @ts-ignore
    return new Response(stream.toReadableStream())
  }

  return NextResponse.json({ message: false })
}

const uploadPendingFile = async () => {
  if (fs.existsSync(path.join(process.cwd(), "temp-files", "results.json"))) {
    const filePath = path.join(process.cwd(), "temp-files", "results.json")
    const file = await openai.files.create({
      file: fs.createReadStream(filePath),
      purpose: "assistants",
    })

    if (file.id) {
      const newFilePath = path.join(
        process.cwd(),
        "temp-files",
        "uploaded",
        `${file.id}.json`,
      )
    }

    return file.id
  }

  return false
}

type SendMessageWithFileIdParams = {
  threadId: string
  content: string
  assistantId: string
  fileId: string
}

const sendMessageWithFileId = async ({
  threadId,
  content,
  assistantId,
  fileId,
}: SendMessageWithFileIdParams) => {
  let params = {
    role: "user",
    content,
  } as MessageCreateParams

  if (fileId) {
    params = {
      ...params,
      attachments: [
        {
          file_id: fileId,
          tools: [{ type: "code_interpreter" }],
        },
      ],
    }
  }

  await openai.beta.threads.messages.create(threadId, params)
}
