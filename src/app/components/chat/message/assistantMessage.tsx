"use client";

import React from "react";
import styles from "../chat.module.css";
import Markdown from "react-markdown";

const AssistantMessage = ({ text }: { text: string }) => {
    return (
      <div className={styles.assistantMessage}>
        <Markdown>{text}</Markdown>
      </div>
    );
  };

export default AssistantMessage;