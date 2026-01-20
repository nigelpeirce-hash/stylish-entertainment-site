"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  label?: string;
  maskedValue?: string; // For displaying masked password when editing existing
}

export function PasswordInput({
  value,
  onChange,
  placeholder = "Enter password",
  className = "",
  id,
  label,
  maskedValue,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Determine what to show in the input
  const getDisplayValue = () => {
    if (showPassword) return value;
    if (isEditing || value) return value; // While editing or has value, show actual value (browser handles masking)
    if (maskedValue && !value) return ""; // Show placeholder instead
    return "";
  };

  const getPlaceholder = () => {
    if (maskedValue && !isEditing && !value) return maskedValue;
    return placeholder;
  };

  return (
    <div className="relative">
      <Input
        id={id}
        type={showPassword ? "text" : "password"}
        value={getDisplayValue()}
        onChange={(e) => {
          setIsEditing(true);
          onChange(e.target.value);
        }}
        onFocus={() => setIsEditing(true)}
        placeholder={getPlaceholder()}
        className={`pr-10 ${className} ${maskedValue && !isEditing && !value ? "placeholder:text-gray-500 placeholder:font-mono" : ""}`}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-gray-400 hover:text-gray-300"
        onClick={() => {
          setShowPassword(!showPassword);
          if (!showPassword) {
            setIsEditing(true);
          }
        }}
      >
        {showPassword ? (
          <EyeOff className="w-4 h-4" />
        ) : (
          <Eye className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}
