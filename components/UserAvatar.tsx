"use client";

import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name: string;
  email: string;
  isSelected: boolean;
  onClick?: () => void;
  className?: string;
}

export function UserAvatar({ 
  name, 
  email, 
  isSelected, 
  onClick,
  className 
}: UserAvatarProps) {
  // Get initials from name
  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(name);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300",
        isSelected
          ? "bg-champagne-gold text-black shadow-lg shadow-champagne-gold/50 ring-2 ring-champagne-gold ring-offset-2 ring-offset-slate-900 scale-110"
          : "bg-gray-600 text-gray-300 hover:bg-gray-500 scale-100",
        onClick && "cursor-pointer hover:scale-105",
        !onClick && "cursor-default",
        className
      )}
      title={`${name} (${email})`}
    >
      <span className="text-sm font-semibold">{initials}</span>
      {isSelected && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900" />
      )}
    </button>
  );
}
