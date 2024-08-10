"use client";

import React from "react";
import styles from "../chat.module.css";

const CodeMessage = ({ text }: { text: string }) => {
  return (
    <div className="rounded-3xl bg-[#f4f4f4] px-5 py-2.5 overflow-scroll">
      {text.split("\n").map((line, index) => (
        <div key={index}>
          <span>{`${index + 1}. `}</span>
          {line}
        </div>
      ))}
    </div>
  );
};

export default CodeMessage;
