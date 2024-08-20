"use client";

import React from "react";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";

export const TitleSelectItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Select.Item>
>(({ children, ...props }, ref) => {
  return (
    <Select.Item
      ref={ref}
      className="relative flex items-center px-8 py-2 cursor-pointer rounded-md hover:bg-background-surface-secondary focus:bg-background-surface-secondary radix-highlighted:bg-background-surface-secondary outline-none"
      {...props}
    >
      <Select.ItemText>{children}</Select.ItemText>
    </Select.Item>
  );
});

TitleSelectItem.displayName = "TitleSelectItem";

interface TitleSelectProps extends React.ComponentProps<typeof Select.Root> {
  placeholder?: string;
}

export const TitleSelect = React.forwardRef<HTMLDivElement, TitleSelectProps>(
  ({ children, placeholder = "Select item", ...props }, forwardedRef) => {
    return (
      <div className="flex">
        <Select.Root {...props}>
          <Select.Trigger
            className="flex items-center justify-between p-3 h-[60px] bg-background-primary rounded-md text-left cursor-pointer hover:bg-background-surface outline-none text-xl font-bold"
            aria-label="Food"
          >
            <Select.Value placeholder={placeholder} />
            <Select.Icon className="ml-2">
              <ChevronDownIcon />
            </Select.Icon>
          </Select.Trigger>

          <Select.Portal>
            <Select.Content
              className="z-10 rounded-md shadow-lg bg-background-primary dark:bg-background-surface py-50 border border-black border-opacity-10"
              position="popper"
              sideOffset={0}
            >
              <Select.ScrollUpButton className="flex items-center justify-center p-2 text-gray-500">
                <ChevronUpIcon />
              </Select.ScrollUpButton>

              <Select.Viewport className="p-2">{children}</Select.Viewport>

              <Select.ScrollDownButton className="flex items-center justify-center p-2 text-gray-500">
                <ChevronDownIcon />
              </Select.ScrollDownButton>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>
    );
  }
);

TitleSelect.displayName = "TitleSelect";
