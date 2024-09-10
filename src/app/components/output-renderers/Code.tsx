import React, { memo } from "react"

interface CodeProps {
  value: string
}

const wrapInMarkdownCodeBlock = (value: string) => {
  return `\`\`\`\n${value}\n\`\`\``
}

import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import remarkGfm from "remark-gfm"
import remarkSupersub from "remark-supersub"
import CodeBlock from "../chat/message/codeBlock"

export const code = memo((props: any) => {
  if (!Array.isArray(props.children)) {
    return <code>{props.children}</code>
  } else {
    return <CodeBlock className={props.className}>{props.children}</CodeBlock>
  }
})

code.displayName = "Code"

const Code: React.FC<CodeProps> = ({ value }) => {
  const rehypePlugins: any = [[rehypeHighlight, { detect: true }]]

  return (
    <div className="flex markdown w-full">
      <div className="py-2.5 overflow-scroll prose dark:prose-invert text-text-primary w-full">
        <Markdown
          remarkPlugins={[remarkSupersub, remarkGfm]}
          rehypePlugins={rehypePlugins}
          components={{
            // @ts-ignore
            code,
          }}
        >
          {wrapInMarkdownCodeBlock(value)}
        </Markdown>
      </div>
    </div>
  )
}

export default Code
