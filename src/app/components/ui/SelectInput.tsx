"use client";

import React from "react";

interface SelectInputProps {
  id: string;
  label: string;
  options: { id: string | number; label: string }[];
}

const SelectInput: React.FC<SelectInputProps> = ({ id, label, options }) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-text-primary font-semibold mb-1">
        {label}
      </label>
      <select
        id={id}
        name={id}
        className="p-3 border rounded-md bg-background-surface border-border-medium"
      >
        {options.map((option, index) => (
          <option key={index} value={option.id}>
            {option.id}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
