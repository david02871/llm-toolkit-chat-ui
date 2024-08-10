"use client";

import React from "react";
import styles from "../chat.module.css";
import Markdown from "react-markdown";

const AssistantMessage = ({ text }: { text: string }) => {
    return (
      <div className="flex justify-end">
          <div className="bg-[#1e1e1e] px-5 py-2.5 overflow-scroll">
          <Markdown>{text}</Markdown>
          </div>
      </div>
    );
  };

export default AssistantMessage;