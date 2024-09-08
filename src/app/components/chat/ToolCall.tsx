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
import OutputRenderer from "../output-renderers"
import { ReloadIcon } from "@radix-ui/react-icons"

const CollapsibleSection = ({
  title,
  children,
  isLoading = false,
}: {
  title: string
  children: React.ReactNode
  isLoading?: boolean
}) => {
  const [open, setOpen] = useState(false)

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen} className="w-full">
      <div
        className="flex items-center justify-between cursor-pointer w-full mb-0"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center space-x-2">
          {isLoading ? (
            <ReloadIcon className="animate-spin text-lg" />
          ) : (
            <FiTool className="text-lg" />
          )}
          <h2 className="text-md">{title}</h2>
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

const getOutputRendererName = (text: string) => {
  const parts = text.split("__")

  if (parts.length === 1) {
    return null
  }

  return parts.slice(1).find((part) => part !== "CONFIRM") || null
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

  const outputRendererName = getOutputRendererName(name)

  return (
    <div className="flex flex-col markdown px-3 py-1 dark:text-neutral-400 text-neutral-400">
      <CollapsibleSection title={name} isLoading={output === null}>
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
      {outputRendererName && (
        <div className="flex justify-center items-center pt-4">
          <OutputRenderer name={outputRendererName} props={output} />
        </div>
      )}
    </div>
  )
}

export default ToolCall
