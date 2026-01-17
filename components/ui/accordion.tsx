"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionContextValue {
  value: string | string[];
  onValueChange: (value: string) => void;
  type: "single" | "multiple";
}

const AccordionContext = React.createContext<AccordionContextValue | undefined>(undefined);
const AccordionItemContext = React.createContext<{ value: string } | undefined>(undefined);

interface AccordionProps {
  type?: "single" | "multiple";
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  children: React.ReactNode;
  className?: string;
}

export function Accordion({
  type = "single",
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  className,
}: AccordionProps) {
  const [internalValue, setInternalValue] = React.useState<string | string[]>(
    defaultValue || (type === "multiple" ? [] : "")
  );
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleValueChange = React.useCallback(
    (itemValue: string) => {
      if (type === "single") {
        const newValue = value === itemValue ? "" : itemValue;
        if (controlledValue === undefined) {
          setInternalValue(newValue);
        }
        onValueChange?.(newValue);
      } else {
        const currentValue = Array.isArray(value) ? value : [];
        const newValue = currentValue.includes(itemValue)
          ? currentValue.filter((v) => v !== itemValue)
          : [...currentValue, itemValue];
        if (controlledValue === undefined) {
          setInternalValue(newValue);
        }
        onValueChange?.(newValue);
      }
    },
    [type, value, controlledValue, onValueChange]
  );

  return (
    <AccordionContext.Provider value={{ value, onValueChange: handleValueChange, type }}>
      <div className={cn("w-full", className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function AccordionItem({ value, children, className }: AccordionItemProps) {
  return (
    <AccordionItemContext.Provider value={{ value }}>
      <div className={cn("border-b border-champagne-gold/20", className)} data-value={value}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
}

export function AccordionTrigger({ children, className }: AccordionTriggerProps) {
  const context = React.useContext(AccordionContext);
  if (!context) throw new Error("AccordionTrigger must be used within Accordion");

  const itemContext = React.useContext(AccordionItemContext);
  if (!itemContext) throw new Error("AccordionTrigger must be used within AccordionItem");

  const isOpen = Array.isArray(context.value)
    ? context.value.includes(itemContext.value)
    : context.value === itemContext.value;

  return (
    <button
      onClick={() => context.onValueChange(itemContext.value)}
      className={cn(
        "flex w-full items-center justify-between py-4 text-left font-medium transition-all hover:text-champagne-gold",
        className
      )}
      data-state={isOpen ? "open" : "closed"}
    >
      <span className="text-white">{children}</span>
      <ChevronDown
        className={cn(
          "h-4 w-4 shrink-0 text-champagne-gold transition-transform duration-200",
          isOpen && "rotate-180"
        )}
      />
    </button>
  );
}

interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
}

export function AccordionContent({ children, className }: AccordionContentProps) {
  const context = React.useContext(AccordionContext);
  if (!context) throw new Error("AccordionContent must be used within Accordion");

  const itemContext = React.useContext(AccordionItemContext);
  if (!itemContext) throw new Error("AccordionContent must be used within AccordionItem");

  const isOpen = Array.isArray(context.value)
    ? context.value.includes(itemContext.value)
    : context.value === itemContext.value;

  if (!isOpen) return null;

  return (
    <div className={cn("overflow-hidden text-sm text-gray-200 pb-4", className)}>
      {children}
    </div>
  );
}
