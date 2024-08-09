"use client";

import React from "react";
import styles from "../chat.module.css";

const UserMessage = ({ text }: { text: string }) => {
    return <div className={styles.userMessage}>{text}</div>;
};

export default UserMessage;