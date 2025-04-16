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
  Avatar,
  Card,
  Badge,
  Link
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
  MapPinIcon,
  UserIcon,
  ArrowTopRightOnSquareIcon
} from "@heroicons/react/24/solid";
import { useState, useRef, useEffect } from "react";

type TicketType = 'professional' | 'maintenance';
type Status = 'new' | 'on-hold' | 'triage' | 'in-progress' | 'review' | 'closed';

interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  partner: string;
  endCustomer: string;
  serialNumber?: string;
  contract?: string;
  workType?: string;
  location: string;
  assignedTo?: string;
  type: TicketType;
  status: Status;
}

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
    status: 'new'
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
    status: 'triage'
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
    status: 'triage'
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
    status: 'review'
  }
];

const RequestCard = ({ ticket }: { ticket: Ticket }) => {
  const locationRef = useRef<HTMLSpanElement>(null);
  const [isLocationTruncated, setIsLocationTruncated] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const checkTruncation = () => {
      if (locationRef.current) {
        const isOverflowing = locationRef.current.offsetWidth < locationRef.current.scrollWidth;
        setIsLocationTruncated(isOverflowing);
      }
    };

    const resizeObserver = new ResizeObserver(checkTruncation);
    if (locationRef.current) {
      resizeObserver.observe(locationRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [ticket.location]);

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

  return (
    <Card className={`p-3 bg-white border border-default-100 hover:border-default-200 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] hover:shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] transition-all group ${isExpanded ? 'border-default-200 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)]' : ''}`}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-default-600">{ticket.ticketNumber}</span>
          {ticket.assignedTo ? (
            <Tooltip content={ticket.assignedTo} size="sm" delay={0} closeDelay={0}>
              <Avatar
                name={getInitials(ticket.assignedTo)}
                size="sm"
                className={`w-6 h-6 text-white ${getAvatarColor(ticket.assignedTo)}`}
                classNames={{
                  name: "text-tiny font-medium"
                }}
              />
            </Tooltip>
          ) : (
            <Popover 
              placement="bottom-end" 
              onOpenChange={(open) => setIsExpanded(open)}
            >
              <PopoverTrigger>
                <div>
                  <Tooltip content="Assign this request" size="sm" delay={0} closeDelay={0}>
                    <div className="w-6 h-6 rounded-full border-2 border-dotted border-default-300 flex items-center justify-center hover:border-default-400 transition-colors cursor-pointer">
                      <UserIcon className="w-3.5 h-3.5 text-default-300" />
                    </div>
                  </Tooltip>
                </div>
              </PopoverTrigger>
              <PopoverContent className="py-3 px-2">
                <div className="flex items-center gap-2 w-[300px]">
                  <Input
                    placeholder="Name or email"
                    size="sm"
                    className="flex-1 h-9"
                    startContent={<UserIcon className="w-4 h-4 text-default-400 flex-shrink-0" />}
                    classNames={{
                      base: "max-w-full",
                      input: "text-[14px] text-default-500 placeholder:text-default-400",
                      inputWrapper: "h-9"
                    }}
                  />
                  <span className="text-[14px] text-default-500 whitespace-nowrap">or</span>
                  <Button size="sm" variant="flat" className="flex-shrink-0 h-9 text-[14px] whitespace-nowrap">
                    Assign to Me
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        <div className="text-[14px] font-medium">{ticket.subject}</div>

        {ticket.type === 'maintenance' ? (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 text-xs">
              <span className="text-default-400">Serial:</span>
              <span className="font-medium text-default-600">{ticket.serialNumber}</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-default-400">Contract:</span>
              <span className="font-medium text-default-600">{ticket.contract}</span>
            </div>
            <div className="flex flex-col gap-1 max-h-0 group-hover:max-h-[200px] overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]" style={{ maxHeight: isExpanded ? '200px' : undefined }}>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-default-400">Partner:</span>
                <span className="font-medium text-default-600">{ticket.partner}</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-default-400">End Customer:</span>
                <span className="font-medium text-default-600">{ticket.endCustomer}</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-default-400">Vendor:</span>
                <span className="font-medium text-default-600">{ticket.partner}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 text-xs">
              <span className="text-default-400">Work Type:</span>
              <span className="font-medium text-default-600">{ticket.workType}</span>
            </div>
            <div className="flex flex-col gap-1 max-h-0 group-hover:max-h-[200px] overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]" style={{ maxHeight: isExpanded ? '200px' : undefined }}>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-default-400">Partner:</span>
                <span className="font-medium text-default-600">{ticket.partner}</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-default-400">End Customer:</span>
                <span className="font-medium text-default-600">{ticket.endCustomer}</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-default-400">Vendor:</span>
                <span className="font-medium text-default-600">{ticket.partner}</span>
              </div>
            </div>
          </div>
        )}

        <div className="h-[1px] w-full bg-default-100 my-1" />

        <div 
          className="flex items-center gap-2 cursor-pointer text-xs"
          onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ticket.location)}`, '_blank')}
        >
          <MapPinIcon className="w-3 h-3 text-default-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            {isLocationTruncated ? (
              <Tooltip content={ticket.location} size="sm" delay={0} closeDelay={0}>
                <span ref={locationRef} className="truncate font-medium text-default-600 block">{ticket.location}</span>
              </Tooltip>
            ) : (
              <span ref={locationRef} className="truncate font-medium text-default-600 block">{ticket.location}</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default function ClientRequestsPage() {
  const [isBoardView, setIsBoardView] = useState(true);
  const [showClosed, setShowClosed] = useState(false);
  const [showOnHold, setShowOnHold] = useState(false);

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

  // Group tickets by status
  const ticketsByStatus = SAMPLE_TICKETS.reduce((acc, ticket) => {
    if (!acc[ticket.status]) {
      acc[ticket.status] = [];
    }
    acc[ticket.status].push(ticket);
    return acc;
  }, {} as Record<Status, Ticket[]>);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header Section */}
      <div className="flex-none">
        {/* Title and Breadcrumbs */}
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

        {/* Search and Actions */}
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
                <Tooltip content="Export" size="sm" delay={0} closeDelay={0}>
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

      {/* Board View - Scrollable Content */}
      {isBoardView && (
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
                    {status === 'new' && (
                      <Tooltip content="New Request" size="sm" delay={0} closeDelay={0}>
                        <div>
                          <Button 
                            isIconOnly 
                            variant="light"
                            size="sm"
                            radius="sm"
                          >
                            <PlusIcon className="w-5 h-5 text-default-600" />
                          </Button>
                        </div>
                      </Tooltip>
                    )}
                  </h2>
                </div>
                {ticketsByStatus[status]?.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {ticketsByStatus[status]?.map((ticket) => (
                      <RequestCard key={ticket.id} ticket={ticket} />
                    ))}
                  </div>
                ) : (
                  <div className="h-[400px] bg-gradient-to-b from-default-200/30 from-5% via-default-200/25 via-60% to-transparent to-90% rounded-lg" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 