"use client";

import { useState, type ReactNode } from "react";

interface DropdownItem {
  label: string;
  value: string;
  icon?: ReactNode;
  danger?: boolean;
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  onSelect: (value: string) => void;
  align?: "left" | "right";
  className?: string;
}

export default function Dropdown({
  trigger,
  items,
  onSelect,
  align = "right",
  className = "",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative inline-block ${className}`}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div
            className={`absolute z-40 mt-2 min-w-[180px] rounded-lg border border-neutral-200 bg-white py-1 shadow-dropdown ${
              align === "right" ? "right-0" : "left-0"
            }`}
            role="menu"
          >
            {items.map((item) => (
              <button
                key={item.value}
                type="button"
                role="menuitem"
                onClick={() => {
                  onSelect(item.value);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors hover:bg-neutral-50 ${
                  item.danger
                    ? "text-error-600 hover:bg-error-50"
                    : "text-neutral-700"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
