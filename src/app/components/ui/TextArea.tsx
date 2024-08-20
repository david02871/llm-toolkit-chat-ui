"use client";

import React from "react";

interface TextAreaProps {
  id: string;
  label: string;
  placeholder?: string;
  rows?: number;
}

const TextArea: React.FC<TextAreaProps> = ({
  id,
  label,
  placeholder,
  rows = 4,
}) => (
  <div className="flex flex-col">
    <label htmlFor={id} className="text-text-primary font-semibold mb-1">
      {label}
    </label>
    <textarea
      id={id}
      name={id}
      className="p-3 border rounded-md bg-background-surface border-border-medium"
      placeholder={placeholder}
      rows={rows}
    ></textarea>
  </div>
);

export default TextArea;
