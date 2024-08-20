import React, { useRef, useState, RefObject } from "react";

type CodeBarProps = {
  lang: string;
  codeRef: RefObject<HTMLElement>;
};

const CodeBar = ({ lang, codeRef }: CodeBarProps) => {
  const copyCode = () => {
    if (codeRef.current) {
      navigator.clipboard.writeText(codeRef.current.innerText);
    }
  };

  return (
    <div className="flex relative -mx-4 px-3 py-1.5 flex-row justify-between bg-background-surface text-text-secondary text-xs top-[-15px]">
      <div>{lang}</div> <button onClick={copyCode}>Copy code</button>
    </div>
  );
};

const CodeBlock = (props: any) => {
  let lang = "text";
  if (props.className) {
    const match = /language-(\w+)/.exec(props.className || "");
    if (match && match[1]) {
      lang = match && match[1];
    }
  }

  const codeRef = useRef<HTMLElement>(null);

  return (
    <>
      <CodeBar lang={lang} codeRef={codeRef} />
      <code ref={codeRef} className={`${props.className} text-sm`}>
        {props.children}
      </code>
    </>
  );
};

export default CodeBlock;
