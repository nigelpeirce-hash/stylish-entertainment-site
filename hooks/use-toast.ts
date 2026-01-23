"use client";

import { useState, useCallback } from "react";
import type { Toast } from "@/components/ui/toast";

export function useToast() {
  const [toastState, setToastState] = useState<Toast | null>(null);

  const showToast = useCallback((options: { title: string; description?: string; variant?: "default" | "destructive" }) => {
    const id = Math.random().toString(36).substring(7);
    const message = options.description 
      ? `${options.title}: ${options.description}` 
      : options.title;
    const type = options.variant === "destructive" ? "error" : "success";
    
    setToastState({ id, message, type });
    
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setToastState(null);
    }, 3000);
  }, []);

  return {
    toastState,
    toast: showToast,
  };
}
