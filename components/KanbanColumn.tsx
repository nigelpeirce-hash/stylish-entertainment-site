"use client";

import { useDroppable } from "@dnd-kit/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";

interface KanbanColumnProps {
  id: string;
  title: string;
  color: string;
  enquiryCount: number;
  children: ReactNode;
}

export function KanbanColumn({
  id,
  title,
  color,
  enquiryCount,
  children,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <Card
      ref={setNodeRef}
      className={`${color} transition-colors ${
        isOver ? "ring-2 ring-champagne-gold ring-offset-2" : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-white">
            {title}
          </CardTitle>
          <Badge
            variant="secondary"
            className="bg-gray-700 text-gray-300 border-gray-600"
          >
            {enquiryCount}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="min-h-[600px] max-h-[800px] overflow-y-auto">
        {children}
      </CardContent>
    </Card>
  );
}
