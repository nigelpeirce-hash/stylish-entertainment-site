"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KanbanColumn } from "@/components/KanbanColumn";
import { EnquiryCard } from "@/components/EnquiryCard";
import { EnquiryDrawer } from "@/components/EnquiryDrawer";
import { Enquiry } from "@/components/EnquiryDashboard";

interface EnquiryKanbanProps {
  enquiries: Enquiry[];
  onStatusChange: (enquiryId: string, newStatus: string, source?: string) => void;
  onEnquiryClick: (enquiry: Enquiry) => void;
}

const COLUMNS = [
  { id: "pending", title: "New", color: "bg-yellow-900/30 border-yellow-500/50" },
  { id: "checking_availability", title: "Checking Availability", color: "bg-blue-900/30 border-blue-500/50" },
  { id: "quoted", title: "Quoted", color: "bg-purple-900/30 border-purple-500/50" },
  { id: "contract_sent", title: "Contract Sent", color: "bg-green-900/30 border-green-500/50" },
];

export function EnquiryKanban({
  enquiries,
  onStatusChange,
  onEnquiryClick,
}: EnquiryKanbanProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Sort "New" column by urgency (sooner dates first)
  const sortByUrgency = (a: Enquiry, b: Enquiry) => {
    const dateA = new Date(a.eventDate).getTime();
    const dateB = new Date(b.eventDate).getTime();
    return dateA - dateB;
  };

  const getEnquiriesByStatus = (status: string) => {
    const filtered = enquiries.filter((e) => e.status === status);
    // Sort "New" column by urgency
    if (status === "pending") {
      return filtered.sort(sortByUrgency);
    }
    // For other columns, sort by creation date (newest first)
    return filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const enquiryId = active.id as string;
    const newStatus = over.id as string;
    const enquiry = enquiries.find(e => e.id === enquiryId);

    // Check if dropped on a valid column
    if (COLUMNS.some((col) => col.id === newStatus)) {
      onStatusChange(enquiryId, newStatus, enquiry?.source);
    }
  };

  const handleCardClick = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsDrawerOpen(true);
  };

  return (
    <div className="w-full">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {COLUMNS.map((column) => {
            const columnEnquiries = getEnquiriesByStatus(column.id);
            return (
              <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                color={column.color}
                enquiryCount={columnEnquiries.length}
              >
                <SortableContext
                  items={columnEnquiries.map((e) => e.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {columnEnquiries.map((enquiry) => (
                      <EnquiryCard
                        key={enquiry.id}
                        enquiry={enquiry}
                        onClick={() => handleCardClick(enquiry)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </KanbanColumn>
            );
          })}
        </div>

        <DragOverlay>
          {activeId ? (
            <EnquiryCard
              enquiry={enquiries.find((e) => e.id === activeId)!}
              onClick={() => {}}
              isDragging
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Enquiry Drawer */}
      {selectedEnquiry && (
        <EnquiryDrawer
          enquiry={selectedEnquiry}
          isOpen={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
            setSelectedEnquiry(null);
          }}
          onUpdate={() => {
            // Refresh data
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
