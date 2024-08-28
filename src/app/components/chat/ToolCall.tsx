"use client"

import React, { memo, useState } from "react"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import remarkSupersub from "remark-supersub"
import * as Collapsible from "@radix-ui/react-collapsible"
import { ChevronDownIcon } from "@radix-ui/react-icons"
import { FiTool } from "react-icons/fi"

const CollapsibleSection = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => {
  const [open, setOpen] = useState(false)

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen} className="w-full">
      <div
        className="flex items-center justify-between cursor-pointer w-full mb-0"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center space-x-2">
          <FiTool className="text-lg" />
          <h2 className="text-lg font-semibold tool-call">{title}</h2>
        </div>
        <ChevronDownIcon
          className={`transform transition-transform ${open ? "rotate-180" : "rotate-0"}`}
        />
      </div>
      <Collapsible.Content>{children}</Collapsible.Content>
    </Collapsible.Root>
  )
}

export const code = memo((props: any) => {
  if (!Array.isArray(props.children)) {
    return <code>{props.children}</code>
  } else {
    return (
      <code className={`${props.className} text-sm`}>{props.children}</code>
    )
  }
})

code.displayName = "Code"

const convertToCodeBlock = (text: string, language: string) => {
  return "```" + language + "\n" + text + "\n```"
}

const ToolCall = ({
  name,
  args,
  output,
}: {
  name: string
  args: string
  output: string | null
}) => {
  const rehypePlugins: any = [[rehypeHighlight, { detect: true }]]

  const hasArgs = args && args !== "{}"

  return (
    <div className="flex markdown rounded-3xl bg-background-surface px-5 py-2.5">
      <CollapsibleSection title={name}>
        <div className="prose dark:prose-invert text-text-primary mt-2">
          {/* Arguments */}
          {hasArgs && (
            <Markdown
              remarkPlugins={[
                remarkSupersub,
                remarkGfm,
                [remarkMath, { singleDollarTextMath: true }],
              ]}
              rehypePlugins={rehypePlugins}
              components={{
                // @ts-ignore
                code,
              }}
            >
              {convertToCodeBlock(args, "json")}
            </Markdown>
          )}
          {/* Output */}
          {output && (
            <Markdown
              remarkPlugins={[
                remarkSupersub,
                remarkGfm,
                [remarkMath, { singleDollarTextMath: true }],
              ]}
              rehypePlugins={rehypePlugins}
              components={{
                // @ts-ignore
                code,
              }}
            >
              {convertToCodeBlock(output, "json")}
            </Markdown>
          )}
        </div>
      </CollapsibleSection>
    </div>
  )
}

export default ToolCall
