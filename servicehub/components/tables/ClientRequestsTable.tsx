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
  BuildingOfficeIcon
} from "@heroicons/react/24/solid";
import { Status, Ticket } from "@/app/components/tickets/types";
import { useState, useRef } from "react";

interface ClientRequestsTableProps {
  tickets: Ticket[];
  showOnHold?: boolean;
  showClosed?: boolean;
}

export const ClientRequestsTable = ({ tickets, showOnHold = false, showClosed = false }: ClientRequestsTableProps) => {
  const [selectedStatus, setSelectedStatus] = useState<Status>("new");
  const [showTooltip, setShowTooltip] = useState<Record<string, boolean>>({});

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

  const filteredTickets = tickets.filter(ticket => ticket.status === selectedStatus);
  const showMaintenanceColumns = filteredTickets.some(t => t.type === 'maintenance');

  const columns = [
    { key: "ticket", label: "TICKET", width: 120 },
    { key: "alerts", label: "ALERTS", width: 150 },
    { key: "subject", label: "SUBJECT", width: 300 },
    { key: "requestType", label: "REQUEST TYPE", width: 180 },
    { key: "partner", label: "PARTNER", width: 150 },
    { key: "endCustomer", label: "END CUSTOMER", width: 180 },
    { key: "workType", label: "WORK TYPE", width: 150 },
    { key: "serialNumber", label: "SERIAL NUMBER", width: 150 },
    { key: "vendor", label: "VENDOR", width: 150 },
    { key: "location", label: "LOCATION", width: 200 },
    { key: "assignedTo", label: "ASSIGNED TO", width: 120 },
  ];

  const renderValue = (value: string | undefined) => {
    return value || "—"; // Using an em dash for empty values
  };

  return (
    <div className="flex flex-col gap-4">
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

      <div className="w-full overflow-x-auto">
        <Table
          aria-label="Client requests table"
          layout="fixed"
          classNames={{
            base: "min-w-[1200px]",
            th: "bg-default-100 text-default-800 text-xs font-semibold h-10 border-b border-divider",
            td: "h-[60px] text-sm border-b border-divider",
            tr: "hover:bg-default-100 data-[selected=true]:bg-default-100"
          }}
        >
          <TableHeader>
            {columns.map(column => (
              <TableColumn key={column.key} width={column.width}>{column.label}</TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{ticket.ticketNumber}</span>
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
                <TableCell>
                  <div className="flex items-center gap-2">
                    {ticket.slaAcknowledgment?.warning && (
                      <Tooltip content="SLA Acknowledge Warning Alert" size="sm">
                        <Chip size="sm" variant="flat" color="warning" startContent={<ClockIcon className="w-3.5 h-3.5" />} classNames={{content: "font-medium"}}>
                          SLA Warning
                        </Chip>
                      </Tooltip>
                    )}
                    {ticket.slaAcknowledgment?.breach && (
                      <Tooltip content="SLA Acknowledge Breach Alert" size="sm">
                        <Chip size="sm" variant="flat" color="danger" startContent={<ExclamationTriangleIcon className="w-3.5 h-3.5" />} classNames={{content: "font-medium"}}>
                          SLA Breach
                        </Chip>
                      </Tooltip>
                    )}
                    {ticket.vendorOwned && (
                      <Chip size="sm" variant="flat" color="secondary" startContent={<BuildingOfficeIcon className="w-3.5 h-3.5" />} classNames={{content: "font-medium"}}>
                        Vendor Owned
                      </Chip>
                    )}
                  </div>
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
                <TableCell>{ticket.type === 'maintenance' ? renderValue(ticket.partner) : "—"}</TableCell>
                <TableCell>{renderValue(ticket.endCustomer)}</TableCell>
                <TableCell>{ticket.type === 'professional' ? renderValue(ticket.workType) : "—"}</TableCell>
                <TableCell>{ticket.type === 'maintenance' ? renderValue(ticket.serialNumber) : "—"}</TableCell>
                <TableCell>Cisco Systems</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm hover:text-primary transition-colors cursor-pointer" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ticket.location)}`, '_blank')}>
                    <MapPinIcon className="w-4 h-4 text-default-500 flex-shrink-0" />
                    <Tooltip content={ticket.location} size="sm" showArrow>
                      <span className="truncate max-w-[160px]">{ticket.location}</span>
                    </Tooltip>
                  </div>
                </TableCell>
                <TableCell>
                  {ticket.assignedTo ? (
                    <Tooltip content={ticket.assignedTo} size="sm">
                      <Avatar name={getInitials(ticket.assignedTo)} size="sm" className={`w-8 h-8 text-white ${getAvatarColor(ticket.assignedTo)}`} classNames={{name: "text-tiny font-medium"}} />
                    </Tooltip>
                  ) : (
                    <Popover placement="bottom-end">
                      <PopoverTrigger>
                        <div>
                          <Tooltip content="Assign this request" size="sm">
                            <div className="w-8 h-8 rounded-full border-2 border-dotted border-[#DFE1E6] flex items-center justify-center hover:border-[#C1C7D0] transition-colors cursor-pointer">
                              <UserIcon className="w-4 h-4 text-[#6B778C]" />
                            </div>
                          </Tooltip>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="py-3 px-2">
                        <div className="flex items-center gap-2 w-[300px]">
                          <Input placeholder="Name or email" size="sm" className="flex-1 h-9" startContent={<UserIcon className="w-4 h-4 text-[#6B778C] flex-shrink-0" />} classNames={{base: "max-w-full", input: "text-[14px] text-[#42526E] placeholder:text-[#6B778C]", inputWrapper: "h-9"}} />
                          <span className="text-[14px] text-[#6B778C] whitespace-nowrap">or</span>
                          <Button size="sm" variant="flat" className="flex-shrink-0 h-9 text-[14px] whitespace-nowrap">Assign to Me</Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}; 