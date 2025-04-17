'use client';

import {
  Input,
  Button,
  Breadcrumbs,
  BreadcrumbItem,
  Switch,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Divider,
} from "@heroui/react";
import { HomeIcon } from "@heroicons/react/24/outline";
import { 
  HomeIcon as HomeSolidIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  TableCellsIcon,
  ListBulletIcon,
  FunnelIcon,
  EyeIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import { RequestCard } from "../components/tickets/RequestCard";
import { ClientRequestsTable } from "@/components/tables/ClientRequestsTable";
import { Status, Ticket } from "../components/tickets/types";

const SAMPLE_TICKETS: Ticket[] = [
  {
    id: '1',
    ticketNumber: 'INC01001',
    subject: 'Network Infrastructure Setup',
    partner: 'Tech Solutions Inc',
    endCustomer: 'Global Corp',
    workType: 'Installation',
    location: '350 5th Avenue, New York, NY 10118',
    type: 'professional',
    status: 'new',
    slaAcknowledgment: {
      warning: true
    }
  },
  {
    id: '7',
    ticketNumber: 'INC01007',
    subject: 'Router Hardware Replacement',
    partner: 'Network Solutions',
    endCustomer: 'Finance Corp',
    serialNumber: 'RTR-789012',
    contract: 'GOLD-2024',
    location: '123 Wall Street, New York, NY 10005',
    type: 'maintenance',
    status: 'new',
    slaAcknowledgment: {
      warning: true
    },
    unreadMessages: {
      count: 1
    }
  },
  {
    id: '2',
    ticketNumber: 'INC01002',
    subject: 'Server Maintenance',
    partner: 'IT Services Ltd',
    endCustomer: 'Local Business',
    serialNumber: 'SRV-123456',
    contract: 'GOLD-2024',
    location: '10 Finsbury Square, London EC2A 1AF',
    assignedTo: 'John Doe',
    type: 'maintenance',
    status: 'triage',
    unreadMessages: {
      count: 3,
      readBy: ['Jane Smith', 'Mike Johnson']
    }
  },
  {
    id: '8',
    ticketNumber: 'INC01008',
    subject: 'Switch Firmware Update',
    partner: 'Network Plus',
    endCustomer: 'Tech Solutions',
    serialNumber: 'SWT-456789',
    contract: 'PLATINUM-2024',
    location: '789 Tech Avenue, San Jose, CA 95110',
    type: 'maintenance',
    status: 'new',
    vendorOwned: true,
    slaAcknowledgment: {
      breach: true
    }
  },
  {
    id: '3',
    ticketNumber: 'INC01003',
    subject: 'Cloud Migration Project',
    partner: 'Cloud Experts',
    endCustomer: 'StartUp Inc',
    workType: 'Migration',
    location: '100 Federal Street, Boston, MA 02110',
    assignedTo: 'Jane Smith',
    type: 'professional',
    status: 'triage',
    vendorOwned: true,
    slaAcknowledgment: {
      breach: true
    }
  },
  {
    id: '4',
    ticketNumber: 'INC01004',
    subject: 'Hardware Replacement',
    partner: 'Hardware Plus',
    endCustomer: 'Big Corp',
    serialNumber: 'HW-789012',
    contract: 'PLATINUM-2024',
    location: '1 Avenue des Champs-Élysées, 75008 Paris',
    type: 'maintenance',
    status: 'review',
    assignedTo: 'Victor Danu'
  },
  {
    id: '5',
    ticketNumber: 'INC01005',
    subject: 'Software License Renewal',
    partner: 'Software Solutions',
    endCustomer: 'Tech Corp',
    workType: 'Renewal',
    location: '100 Technology Drive, San Jose, CA 95110',
    type: 'professional',
    status: 'new',
    unreadMessages: {
      count: 2
    },
    slaAcknowledgment: {
      warning: true
    }
  },
  {
    id: '6',
    ticketNumber: 'INC01006',
    subject: 'Database Server Setup',
    partner: 'Data Systems Ltd',
    endCustomer: 'Enterprise Corp',
    workType: 'Installation',
    location: '200 Park Avenue, New York, NY 10166',
    type: 'professional',
    status: 'new',
    slaAcknowledgment: {
      breach: true
    }
  }
];

export default function ClientRequestsPage() {
  const [isBoardView, setIsBoardView] = useState(true);
  const [showClosed, setShowClosed] = useState(false);
  const [showOnHold, setShowOnHold] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>(SAMPLE_TICKETS);

  const displayedTickets = tickets.filter(ticket => {
    if (!showOnHold && ticket.status === 'on-hold') return false;
    if (!showClosed && ticket.status === 'closed') return false;
    return true;
  });

  const columns: Status[] = [
    'new',
    ...(showOnHold ? ['on-hold' as Status] : []),
    'triage',
    'in-progress',
    'review',
    ...(showClosed ? ['closed' as Status] : [])
  ];

  const columnTitles: Record<Status, string> = {
    'new': 'New',
    'on-hold': 'On Hold',
    'triage': 'Triage',
    'in-progress': 'In Progress',
    'review': 'Review',
    'closed': 'Closed'
  };

  const exportButtonTitles: Record<Status, string> = {
    'new': 'Export New Requests',
    'on-hold': 'Export Requests On Hold',
    'triage': 'Export Requests in Triage',
    'in-progress': 'Export Requests in Progress',
    'review': 'Export Requests in Review',
    'closed': 'Export Closed Requests'
  };

  const ticketsByStatus = displayedTickets.reduce((acc, ticket) => {
    if (!acc[ticket.status]) {
      acc[ticket.status] = [];
    }
    acc[ticket.status].push(ticket);
    return acc;
  }, {} as Record<Status, Ticket[]>);

  const handleAssign = (ticketId: string, assignee: string) => {
    setTickets(currentTickets => 
      currentTickets.map(ticket => 
        ticket.id === ticketId ? { ...ticket, assignedTo: assignee } : ticket
      )
    );
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-none">
        <div className="flex items-center justify-between px-6 h-[57px]">
          <h1 className="text-xl font-semibold">Client Requests</h1>
          <Breadcrumbs size="sm">
            <BreadcrumbItem>
              <HomeSolidIcon className="w-4 h-4 text-default-600" />
            </BreadcrumbItem>
            <BreadcrumbItem>Client Requests</BreadcrumbItem>
          </Breadcrumbs>
        </div>

        <Divider className="w-full" />

        <div className="px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="w-[200px]">
              <Input
                placeholder="Search requests..."
                startContent={<MagnifyingGlassIcon className="w-5 h-5 text-default-400 flex-shrink-0" />}
                size="sm"
                className="flex-1 h-9"
                classNames={{
                  base: "max-w-full",
                  input: "text-[14px] text-default-500 placeholder:text-default-400 font-medium",
                  inputWrapper: "h-9"
                }}
              />
            </div>

            <div className="flex items-center gap-3">
              <Button 
                color="primary" 
                startContent={<PlusIcon className="w-5 h-5" />}
                size="sm"
                radius="sm"
                className="h-9 text-[14px]"
              >
                New Request
              </Button>

              <div className="flex items-center gap-2">
                <Tooltip content="Export All Client Requests" size="sm" delay={0} closeDelay={0}>
                  <div>
                    <Button 
                      isIconOnly 
                      variant="light"
                      size="sm"
                      className="h-9 w-9"
                    >
                      <ArrowDownTrayIcon className="w-5 h-5 text-default-600" />
                    </Button>
                  </div>
                </Tooltip>

                <Tooltip content={isBoardView ? "List View" : "Board View"} size="sm" delay={0} closeDelay={0}>
                  <div>
                    <Button 
                      isIconOnly 
                      variant="light"
                      size="sm"
                      onClick={() => setIsBoardView(!isBoardView)}
                      className="h-9 w-9"
                    >
                      {isBoardView ? (
                        <ListBulletIcon className="w-5 h-5 text-default-600" />
                      ) : (
                        <TableCellsIcon className="w-5 h-5 text-default-600" />
                      )}
                    </Button>
                  </div>
                </Tooltip>

                <Tooltip content="Visibility" size="sm" delay={0} closeDelay={0}>
                  <div>
                    <Popover placement="bottom-end">
                      <PopoverTrigger>
                        <Button 
                          isIconOnly 
                          variant="light"
                          size="sm"
                          className="h-9 w-9"
                        >
                          <EyeIcon className="w-5 h-5 text-default-600" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-3">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <Switch 
                              size="sm"
                              isSelected={showOnHold}
                              onValueChange={setShowOnHold}
                            />
                            <span className="text-sm text-default-600">Show On Hold</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch 
                              size="sm"
                              isSelected={showClosed}
                              onValueChange={setShowClosed}
                            />
                            <span className="text-sm text-default-600">Show Closed</span>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </Tooltip>

                <Tooltip content="Filter" size="sm" delay={0} closeDelay={0}>
                  <div>
                    <Button 
                      isIconOnly 
                      variant="light"
                      size="sm"
                      className="h-9 w-9"
                    >
                      <FunnelIcon className="w-5 h-5 text-default-600" />
                    </Button>
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

        <Divider className="w-full" />
      </div>

      {isBoardView ? (
        <div className="flex-1 px-6 py-4 bg-default-100/50 overflow-y-auto min-h-0">
          <div className="flex gap-6">
            {columns.map((status) => (
              <div key={status} className="flex-1 min-w-[280px]">
                <div className="mb-3">
                  <h2 className="text-sm font-semibold text-default-800 flex items-center justify-between min-h-[32px]">
                    <div className="flex items-center">
                      {columnTitles[status]}
                      <span className="ml-2 text-default-500">
                        {(ticketsByStatus[status]?.length || 0)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Tooltip content={exportButtonTitles[status]} size="sm" delay={0} closeDelay={0}>
                        <div>
                          <Button 
                            isIconOnly 
                            variant="light"
                            size="sm"
                            radius="sm"
                            className="h-8 w-8"
                          >
                            <ArrowDownTrayIcon className="w-5 h-5 text-default-600" />
                          </Button>
                        </div>
                      </Tooltip>
                      {status === 'new' && (
                        <Tooltip content="New Request" size="sm" delay={0} closeDelay={0}>
                          <div>
                            <Button 
                              isIconOnly 
                              variant="light"
                              size="sm"
                              radius="sm"
                              className="h-8 w-8"
                            >
                              <PlusIcon className="w-5 h-5 text-default-600" />
                            </Button>
                          </div>
                        </Tooltip>
                      )}
                    </div>
                  </h2>
                </div>
                {ticketsByStatus[status]?.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {ticketsByStatus[status]?.map((ticket) => (
                      <RequestCard 
                        key={ticket.id} 
                        ticket={ticket} 
                        onAssign={handleAssign}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="h-[400px] bg-gradient-to-b from-default-200/30 from-5% via-default-200/25 via-60% to-transparent to-90% rounded-lg" />
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 px-6 py-4 overflow-y-auto min-h-0">
          <ClientRequestsTable 
            tickets={displayedTickets}
            showOnHold={showOnHold}
            showClosed={showClosed}
            onAssign={handleAssign}
          />
        </div>
      )}
    </div>
  );
} 