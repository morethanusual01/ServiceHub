'use client';

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tabs,
  Tab,
  Tooltip,
  Avatar,
  Chip,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Input,
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
import { Status, Ticket } from "@/app/components/tickets/types";
import { useState, useRef } from "react";

interface ClientRequestsTableProps {
  tickets: Ticket[];
  showOnHold?: boolean;
  showClosed?: boolean;
  onAssign: (ticketId: string, assignee: string) => void;
}

export const ClientRequestsTable = ({ tickets, showOnHold = false, showClosed = false, onAssign }: ClientRequestsTableProps) => {
  const [selectedStatus, setSelectedStatus] = useState<Status>("new");
  const [showTooltip, setShowTooltip] = useState<Record<string, boolean>>({});
  const [assigningTicketId, setAssigningTicketId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleTextRef = (id: string) => (element: HTMLSpanElement | null) => {
    if (element) {
      setShowTooltip(prev => ({
        ...prev,
        [id]: element.scrollWidth > element.clientWidth
      }));
    }
  };

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-primary-400',
      'bg-success-400',
      'bg-warning-400',
      'bg-secondary-400',
      'bg-danger-400',
    ];
    
    const hash = name.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  const statuses: Status[] = [
    'new',
    ...(showOnHold ? ['on-hold' as Status] : []),
    'triage',
    'in-progress',
    'review',
    ...(showClosed ? ['closed' as Status] : [])
  ];

  const statusTitles: Record<Status, string> = {
    'new': 'New',
    'on-hold': 'On Hold',
    'triage': 'Triage',
    'in-progress': 'In Progress',
    'review': 'Review',
    'closed': 'Closed'
  };

  // Mapping for Export button text based on status
  const exportButtonTitles: Record<Status, string> = {
    'new': 'Export New Requests',
    'on-hold': 'Export Requests On Hold',
    'triage': 'Export Requests in Triage',
    'in-progress': 'Export Requests in Progress',
    'review': 'Export Requests in Review',
    'closed': 'Export Closed Requests'
  };

  const filteredTickets = tickets.filter(ticket => ticket.status === selectedStatus);
  const showMaintenanceColumns = filteredTickets.some(t => t.type === 'maintenance');

  const columns = [
    { key: "ticket", label: "TICKET", width: 180 },
    { key: "assignedTo", label: "ASSIGNEE", width: 96, className: "text-center" },
    { key: "subject", label: "SUBJECT", width: 250 },
    { key: "requestType", label: "REQUEST TYPE", width: 165 },
    { key: "partner", label: "PARTNER", width: 180 },
    { key: "endCustomer", label: "END CUSTOMER", width: 180 },
    { key: "workType", label: "WORK TYPE", width: 150 },
    { key: "serialNumber", label: "SERIAL NUMBER", width: 150 },
    { key: "vendor", label: "VENDOR", width: 150 },
    { key: "location", label: "LOCATION", width: 200 },
    { key: "requestedStart", label: "REQUESTED START", width: 150 },
  ];

  const renderValue = (value: string | undefined) => {
    return value || ""; // Return empty string for empty values
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex w-full flex-col">
          <Tabs 
            selectedKey={selectedStatus}
            onSelectionChange={(key) => setSelectedStatus(key.toString() as Status)}
            aria-label="Client request statuses"
            size="md"
            classNames={{
              tab: "data-[selected=true]:font-medium"
            }}
          >
            {statuses.map((status) => (
              <Tab 
                key={status} 
                title={
                  <div className="flex items-center gap-2">
                    <span>{statusTitles[status]}</span>
                    <span className="text-default-500 font-medium">
                      {tickets.filter(t => t.status === status).length}
                    </span>
                  </div>
                }
              />
            ))}
          </Tabs>
        </div>
        {/* Render Export button with dynamic text based on selectedStatus */}
        {/* Check if the current status exists in the button titles before rendering */}
        {exportButtonTitles[selectedStatus] && (
          <Button
            variant="flat" 
            size="sm"
            startContent={<ArrowDownTrayIcon className="w-4 h-4" />}
            className="flex-shrink-0 h-9 text-[14px] whitespace-nowrap" // Added whitespace-nowrap
          >
            {exportButtonTitles[selectedStatus]} {/* Dynamic text */}
          </Button>
        )}
      </div>

      <div className="w-full">
        {/* Conditionally render EITHER Empty State OR the Table Container + Table */}
        {filteredTickets.length === 0 ? (
          // Render Centered Empty State Message
          <div className="flex flex-col items-center justify-center h-80"> 
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-12 h-12 text-default-300 mb-3"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
            <p className="text-base font-medium text-default-600">No Tickets Found</p>
            <p className="text-xs text-default-500 mt-1">
              There are no tickets in the '{statusTitles[selectedStatus]}' status.
            </p>
          </div>
        ) : (
          // Render Table Container and Table
          <div
            ref={scrollRef}
            className="w-full border border-divider bg-white overflow-x-auto rounded-lg"
          >
            <Table
              aria-label="Client requests table"
              layout="fixed"
              removeWrapper
              radius="none"
              classNames={{
                base: "w-full border-collapse min-w-[1200px]",
                thead: "[&>tr:last-child]:hidden",
                th: [
                  "bg-default-100 text-default-800 text-xs font-semibold h-10",
                  "border-b border-r",
                  "last:border-r-0",
                  "rounded-none",
                  "last:rounded-br-none",
                  "first:rounded-bl-none"
                ].join(" "),
                td: [
                  "h-14 text-sm",
                  "border-b border-r",
                  "last:border-r-0",
                  "rounded-none"
                ].join(" "),
                tr: [
                  "hover:bg-default-100 data-[selected=true]:bg-default-100",
                  "[&:last-child>td]:border-b-0"
                ].join(" ")
              }}
            >
              <TableHeader>
                {columns.map(column => (
                  <TableColumn 
                    key={column.key} 
                    width={column.width}
                    className={column.key === "assignedTo" ? "text-center" : ""}
                  >
                    {column.label}
                  </TableColumn>
                ))}
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow 
                    key={ticket.id}
                    className={assigningTicketId === ticket.id ? 'bg-default-100' : ''}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="hover:underline cursor-pointer">{ticket.ticketNumber}</span>
                        
                        {ticket.slaAcknowledgment?.breach && (
                          <Tooltip content="SLA Acknowledge Breach Alert" size="sm">
                            <Chip
                              startContent={<ExclamationTriangleIcon className="w-4 h-4" />}
                              variant="flat"
                              color="danger"
                              size="sm"
                              classNames={{
                                base: "max-w-fit",
                                content: "hidden"
                              }}
                            />
                          </Tooltip>
                        )}
                        {ticket.slaAcknowledgment?.warning && (
                          <Tooltip content="SLA Acknowledge Warning Alert" size="sm">
                            <Chip
                              startContent={<ClockIcon className="w-4 h-4" />}
                              variant="flat"
                              color="warning"
                              size="sm"
                              classNames={{
                                base: "max-w-fit",
                                content: "hidden"
                              }}
                            />
                          </Tooltip>
                        )}
                        {ticket.vendorOwned && (
                          <Tooltip content="Vendor Owned" size="sm">
                            <Chip
                              startContent={<BuildingOfficeIcon className="w-4 h-4" />}
                              variant="flat"
                              color="secondary"
                              size="sm"
                              classNames={{
                                base: "max-w-fit",
                                content: "hidden"
                              }}
                            />
                          </Tooltip>
                        )}
                        {ticket.unreadMessages && (
                          <Tooltip 
                            content={
                              ticket.unreadMessages.readBy ? 
                                `Read by: ${ticket.unreadMessages.readBy.join(', ')}` : 
                                'Unread messages'
                            }
                            size="sm" 
                            delay={0} 
                            closeDelay={0}
                          >
                            <Chip 
                              size="sm" 
                              variant="flat" 
                              color={ticket.unreadMessages.readBy ? 'success' : 'danger'}
                              startContent={<div className="ml-0.5"><ChatBubbleLeftIcon className="w-3.5 h-3.5" /></div>}
                              classNames={{
                                base: "max-w-fit",
                                content: "font-medium"
                              }}
                            >
                              {ticket.unreadMessages.count}
                            </Chip>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {ticket.ticketNumber === "INC01005" ? (
                        <Tooltip content="Sarah Anderson" size="sm">
                          <div className="flex justify-center">
                            <Avatar name={getInitials("Sarah Anderson")} size="sm" className={`w-8 h-8 text-white ${getAvatarColor("Sarah Anderson")}`} classNames={{name: "text-tiny font-medium"}} />
                          </div>
                        </Tooltip>
                      ) : ticket.assignedTo ? (
                        <Tooltip 
                          content={ticket.assignedTo === 'MC' ? 'Mike Certoma' : ticket.assignedTo}
                          size="sm"
                        >
                          <div className="flex justify-center">
                            <Avatar name={getInitials(ticket.assignedTo)} size="sm" className={`w-8 h-8 text-white ${getAvatarColor(ticket.assignedTo)}`} classNames={{name: "text-tiny font-medium"}} />
                          </div>
                        </Tooltip>
                      ) : (
                        <div className="flex justify-center">
                          <Popover 
                            placement="bottom-end"
                            onOpenChange={(isOpen) => {
                              setAssigningTicketId(isOpen ? ticket.id : null);
                            }}
                          >
                            <PopoverTrigger>
                              <div>
                                <Tooltip content="Assign this request" size="sm">
                                  <div className="w-8 h-8 rounded-full border-2 border-dotted border-[#DFE1E6] flex items-center justify-center hover:border-[#C1C7D0] transition-colors cursor-pointer">
                                    <UserIcon className="w-4 h-4 text-[#6B778C]" />
                                  </div>
                                </Tooltip>
                              </div>
                            </PopoverTrigger>
                            <PopoverContent className="py-3 px-3">
                              <div className="flex items-center gap-2 w-[300px]">
                                <Input placeholder="Name or email" size="sm" className="flex-1 h-9" startContent={<UserIcon className="w-4 h-4 text-[#6B778C] flex-shrink-0" />} classNames={{base: "max-w-full", input: "text-[14px] text-[#42526E] placeholder:text-[#6B778C]", inputWrapper: "h-9"}} />
                                <span className="text-[14px] text-[#6B778C] whitespace-nowrap">or</span>
                                <Button 
                                  size="sm" 
                                  variant="flat" 
                                  className="flex-shrink-0 h-9 text-[14px] whitespace-nowrap"
                                  onClick={() => {
                                    onAssign(ticket.id, "MC");
                                  }}
                                >
                                  Assign to Me
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="block truncate max-w-[260px]">{ticket.subject}</span>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        size="sm" 
                        variant="flat" 
                        color={ticket.type === 'professional' ? 'primary' : 'secondary'} 
                        classNames={{
                          base: "max-w-fit", 
                          content: "font-medium"
                        }}
                      >
                        {ticket.type === 'professional' ? 'Professional Services' : 'Maintenance'}
                      </Chip>
                    </TableCell>
                    <TableCell>{ticket.type === 'maintenance' ? renderValue(ticket.partner) : ""}</TableCell>
                    <TableCell>{renderValue(ticket.endCustomer)}</TableCell>
                    <TableCell>{ticket.type === 'professional' ? renderValue(ticket.workType) : ""}</TableCell>
                    <TableCell>{ticket.type === 'maintenance' ? renderValue(ticket.serialNumber) : ""}</TableCell>
                    <TableCell>Cisco Systems</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm transition-colors cursor-pointer" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ticket.location)}`, '_blank')}>
                        <MapPinIcon className="w-4 h-4 text-default-500 flex-shrink-0" />
                        <Tooltip content={ticket.location} size="sm" showArrow>
                          <span className="truncate max-w-[160px]">{ticket.location}</span>
                        </Tooltip>
                      </div>
                    </TableCell>
                    <TableCell>
                      {ticket.type === 'professional' ? "4/12/25 at 5PM" : ""}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}; 