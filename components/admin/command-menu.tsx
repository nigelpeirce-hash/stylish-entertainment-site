"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { CalendarPlus, Inbox, Mail, Settings, Users, Package } from "lucide-react";
import { AddBookingModal } from "@/components/admin/bookings/add-booking-modal";

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const router = useRouter();
  const [showNewBookingModal, setShowNewBookingModal] = React.useState(false);

  const runCommand = React.useCallback((command: () => void) => {
    onOpenChange(false);
    command();
  }, [onOpenChange]);

  return (
    <>
      <CommandDialog open={open} onOpenChange={onOpenChange}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          <CommandGroup heading="Actions">
            <CommandItem
              onSelect={() => runCommand(() => setShowNewBookingModal(true))}
            >
              <CalendarPlus className="mr-2 h-4 w-4" />
              <span>New Booking</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
          </CommandGroup>

          <CommandGroup heading="Navigation">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/admin/inbox"))}
            >
              <Inbox className="mr-2 h-4 w-4" />
              <span>Inbox</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/admin/90-day-command"))}
            >
              <CalendarPlus className="mr-2 h-4 w-4" />
              <span>90-Day Command Centre</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/admin/bookings"))}
            >
              <CalendarPlus className="mr-2 h-4 w-4" />
              <span>Manage Bookings</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/admin/settings"))}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/admin/staff-management"))}
            >
              <Users className="mr-2 h-4 w-4" />
              <span>Staff Management</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/admin/orders"))}
            >
              <Package className="mr-2 h-4 w-4" />
              <span>Hire Orders</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <AddBookingModal
        open={showNewBookingModal}
        onOpenChange={setShowNewBookingModal}
        onSuccess={() => {
          // Optionally refresh data or show success message
        }}
      />
    </>
  );
}
