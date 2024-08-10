"use client";

import React from "react";
import styles from "../chat.module.css";

const UserMessage = ({ text }: { text: string }) => {
return (
    <div className="flex justify-end">
        <div className="max-w-[70%] rounded-3xl bg-[#3b3b3b] px-5 py-2.5 overflow-hidden">
            {text}
        </div>
    </div>
);
};

export default UserMessage;
