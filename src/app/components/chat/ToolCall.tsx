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

interface CollapsibleSectionProps {
  title: string
  children: React.ReactNode
  isLoading?: boolean
  isEmpty?: boolean
  defaultOpen?: boolean
}

interface ToolCallProps {
  name: string
  args: string
  output: string | null
  cancelled?: boolean
}

const CollapsibleSection = ({
  title,
  children,
  isLoading = false,
  isEmpty = false,
  defaultOpen = false,
}: CollapsibleSectionProps) => {
  const [open, setOpen] = useState(defaultOpen || false)

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen} className="w-full">
      <div
        className={`flex items-center justify-between cursor-pointer w-full mb-0`}
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
        {!isEmpty && (
          <ChevronDownIcon
            className={`transform transition-transform ${open ? "rotate-180" : "rotate-0"}`}
          />
        )}
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

type ArgToRender = {
  name: string
  value: string
  componentName: string
}

const parseArgs = (args: Record<string, unknown>): ArgToRender[] => {
  let argsToRender: ArgToRender[] = []
  Object.entries(args).forEach(([key, value]) => {
    let parts = key.split("__")
    if (parts.length > 1) {
      argsToRender.push({
        name: parts[0],
        value: String(value),
        componentName: parts[1],
      })
    }
  })

  return argsToRender
}

const ToolCall = ({ name, args, output, cancelled }: ToolCallProps) => {
  const rehypePlugins: any = [[rehypeHighlight, { detect: true }]]
  const hasArgs = args && args !== "{}"
  let argsObject = null
  if (hasArgs) {
    try {
      argsObject = JSON.parse(args)
    } catch (error) {
      console.error("Error parsing args:", error)
    }
  }
  let argsToRender = hasArgs ? parseArgs(argsObject) : null

  const outputRendererName = getOutputRendererName(name)

  return (
    <div
      className={`flex flex-col markdown px-3 py-1 dark:text-neutral-400 text-neutral-400 ${
        cancelled ? "bg-red-100 dark:bg-red-900" : ""
      }`}
    >
      <CollapsibleSection
        title={name.split("__")[0]}
        isLoading={output === null && !cancelled}
        isEmpty={!output && !hasArgs}
        defaultOpen={name.includes("__CONFIRM")}
      >
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
          {hasArgs && argsToRender && (
            <div>
              {argsToRender.map((arg) => (
                <div key={arg.name}>
                  <h3>
                    <code>{arg.name}:</code>
                  </h3>
                  <div>
                    <OutputRenderer
                      key={arg.name}
                      name={arg.componentName}
                      value={arg.value}
                    />
                  </div>
                </div>
              ))}
            </div>
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
      {outputRendererName && Boolean(output) && (
        <div className="flex justify-center items-center pt-4">
          <OutputRenderer name={outputRendererName} value={output} />
        </div>
      )}
    </div>
  )
}

export default ToolCall
