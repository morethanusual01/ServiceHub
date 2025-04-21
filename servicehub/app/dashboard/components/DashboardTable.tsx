'use client';

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tabs, // Keep Tabs for potential future filtering if needed
  Tab,  // Keep Tab
  Tooltip,
  Avatar,
  Chip,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Input,
  Card,
  getKeyValue
} from "@heroui/react";
import { 
  MapPinIcon,
  UserIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftIcon,
  BuildingOfficeIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/solid";
// Adjust import path for types if necessary
import { Status, Ticket } from "@/app/components/tickets/types"; 
import { useState, useRef } from "react";

// Define status colors for Chip component
const statusColorMap: Record<string, "default" | "primary" | "secondary" | "success" | "warning" | "danger"> = {
  New: "primary",
  Sourcing: "warning",
  Pending: "secondary",
  Active: "success",
  Scheduled: "default",
  "Pending Dispatch": "warning", // Example for multi-word status
};

// Rename interface
interface DashboardTableProps {
  // Define props needed for the dashboard tables
  // For now, let's assume generic data structure
  title: string;
  columns: { key: string; label: string }[];
  items: Array<Record<string, any>>; // Generic items array
}

// Rename component
export const DashboardTable = ({ title, columns, items }: DashboardTableProps) => {
  // Remove unnecessary state and functions from original table
  // const [selectedStatus, setSelectedStatus] = useState<Status>("new");
  // const [showTooltip, setShowTooltip] = useState<Record<string, boolean>>({});
  // const [assigningTicketId, setAssigningTicketId] = useState<string | null>(null);
  // const scrollRef = useRef<HTMLDivElement>(null);
  // ... remove handleTextRef, getInitials, getAvatarColor, etc. ...

  // Adjust data filtering if needed, for now just use passed items
  // const filteredTickets = tickets.filter(ticket => ticket.status === selectedStatus);
  const displayedItems = items; 

  // Simplified renderValue or adapt as needed
  const renderValue = (value: any) => {
    return value ?? ""; // Return empty string for empty/null values
  };

  return (
    <Card className="p-4 shadow-none border border-default-200 dark:border-default-100">
      {/* Title */}
      <h3 className="text-sm font-medium text-default-500 mb-4">{title}</h3>

      {/* Wrap Table in a bordered and rounded div */}
      <div className="w-full overflow-x-auto border border-default-200 rounded-lg"> 
        <Table
          aria-label={`${title} table`}
          removeWrapper
          radius="none" // Remove radius from Table itself
          classNames={{
            base: "w-full border-collapse min-w-[250px]",
            thead: "[&>tr:last-child]:hidden",
            th: [
              "bg-default-100 text-default-800 text-xs font-semibold h-10",
              "border-b border-r",
              "last:border-r-0",
              "rounded-none", // Header cells should not be rounded
              "first:rounded-bl-none", // Force first header cell's bottom-left corner to be square
              "last:rounded-br-none", // Force last header cell's bottom-right corner to be square
              // Remove specific corner rounding for header
            ].join(" "),
            td: [
              "h-11 text-sm",
              "border-b border-default-200 border-r", 
              "last:border-r-0",
              "rounded-none", // Body cells should not be rounded
              // Apply padding/alignment in TableCell conditional logic now
              // "[&[data-column-key='value']]:text-right pr-4"
            ].join(" "),
            tr: [
              "hover:bg-default-100",
              "[&:last-child>td]:border-b-0", // Only remove bottom border on last row inside the container
              "cursor-pointer" // Add pointer cursor on hover
            ].join(" "),
            tbody: "",
          }}
        >
          <TableHeader columns={columns}> 
            {(column) => (
              <TableColumn 
                key={column.key} 
                className={column.key === 'value' ? 'text-right pr-4' : 'pl-4'}
              >
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={displayedItems}>
            {(item) => (
              <TableRow key={item.id || JSON.stringify(item)}> 
                {(columnKey) => {
                  const cellValue = getKeyValue(item, columnKey);
                  
                  // Explicit column type checks
                  const isTruncatedTextColumn = ['name', 'event', 'eventType', 'partner'].includes(columnKey as string);
                  const isStatusColumn = columnKey === 'status';
                  const isValueOrTimeColumn = ['value', 'timeAged', 'timeBreach'].includes(columnKey as string);
                  
                  // Determine className based on column type
                  const cellClassName = isValueOrTimeColumn ? 'text-right pr-4' : 'pl-4';

                  return (
                    <TableCell className={cellClassName}>
                      {isStatusColumn ? (
                        // Status: Render Chip
                        <Chip 
                          size="sm" 
                          variant="flat" 
                          color={statusColorMap[cellValue as string] || "default"}
                          className="font-medium"
                        >
                          {cellValue}
                        </Chip>
                      ) : isTruncatedTextColumn ? (
                        // Truncated Text: Render Tooltip + Span
                        <Tooltip content={cellValue} placement="top-start" delay={0} closeDelay={0}>
                          <span 
                            className={`block overflow-hidden whitespace-nowrap text-ellipsis ${columnKey === 'event' ? 'hover:underline' : ''}`}
                          >
                            {cellValue}
                          </span>
                        </Tooltip>
                      ) : isValueOrTimeColumn ? (
                        // Value/Time: Render Span with hover underline
                        <span className="hover:underline">
                          {cellValue}
                        </span>
                      ) : (
                        // Default: Render raw value (shouldn't happen with current columns)
                        cellValue
                      )}
                    </TableCell>
                  );
                }}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}; 