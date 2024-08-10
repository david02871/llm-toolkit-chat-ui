"use client";

import React, { memo } from "react";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
// import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkSupersub from "remark-supersub";
import "katex/dist/katex.min.css";
import CodeBlock from "./codeBlock";

const preprocessLaTeX = (content: string) => {
  // Replace block-level LaTeX delimiters \[ \] with $$ $$

  const blockProcessedContent = content.replace(
    /\\\[(.*?)\\\]/gs,
    (_, equation) => `$$${equation}$$`
  );
  // Replace inline LaTeX delimiters \( \) with $ $
  const inlineProcessedContent = blockProcessedContent.replace(
    /\\\((.*?)\\\)/gs,
    (_, equation) => `$${equation}$`
  );
  return inlineProcessedContent;
};

export const code = memo((props: any) => {
  if (!Array.isArray(props.children)) {
    return <code>{props.children}</code>;
  } else {
    return <CodeBlock className={props.className}>{props.children}</CodeBlock>;
  }
});

code.displayName = "Code";

const AssistantMessage = ({ text }: { text: string }) => {
  const rehypePlugins: any = [
    [rehypeKatex, { output: "mathml" }],
    [rehypeHighlight, { detect: true }],
  ];

  return (
    <div className="flex markdown">
      <div className="px-5 py-2.5 overflow-scroll prose dark:prose-invert text-text-primary">
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
          {preprocessLaTeX(text)}
        </Markdown>
      </div>
    </div>
  );
};

export default AssistantMessage;
