import { Card, Avatar, Tooltip, Popover, PopoverTrigger, PopoverContent, Input, Button, Divider } from "@heroui/react";
import { MapPinIcon, UserIcon } from "@heroicons/react/24/solid";
import { useRef, useState, useEffect } from "react";

type TicketType = 'professional' | 'maintenance';

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
}

export const TicketCard = ({ ticket }: { ticket: Ticket }) => {
  const locationRef = useRef<HTMLSpanElement>(null);
  const [isLocationTruncated, setIsLocationTruncated] = useState(false);

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
    <Card className="p-3 bg-white shadow-none border-none hover:bg-default-100 group">
      <div className="flex flex-col gap-2">
        {/* Header - Ticket number and assignee */}
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
            <Popover placement="bottom-end">
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

        {/* Subject */}
        <div className="text-[14px] font-medium">{ticket.subject}</div>

        {/* Ticket Info */}
        {ticket.type === 'maintenance' ? (
          <div className="flex flex-col gap-1">
            {/* Default visible fields */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-default-400">Serial:</span>
              <span className="font-medium text-default-700">{ticket.serialNumber}</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-default-400">Contract:</span>
              <span className="font-medium text-default-700">{ticket.contract}</span>
            </div>
            
            {/* Hidden fields that show on hover */}
            <div className="hidden group-hover:flex flex-col gap-1">
              <div className="flex items-center gap-1 text-xs">
                <span className="text-default-400">Partner:</span>
                <span className="font-medium text-default-700">{ticket.partner}</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-default-400">End Customer:</span>
                <span className="font-medium text-default-700">{ticket.endCustomer}</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-default-400">Vendor:</span>
                <span className="font-medium text-default-700">{ticket.partner}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {/* Default visible field */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-default-400">Work Type:</span>
              <span className="font-medium text-default-700">{ticket.workType}</span>
            </div>
            
            {/* Hidden fields that show on hover */}
            <div className="hidden group-hover:flex flex-col gap-1">
              <div className="flex items-center gap-1 text-xs">
                <span className="text-default-400">Partner:</span>
                <span className="font-medium text-default-700">{ticket.partner}</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-default-400">End Customer:</span>
                <span className="font-medium text-default-700">{ticket.endCustomer}</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-default-400">Vendor:</span>
                <span className="font-medium text-default-700">{ticket.partner}</span>
              </div>
            </div>
          </div>
        )}

        <div className="h-[1px] w-full bg-divider my-1" />

        {/* Location */}
        <div 
          className="flex items-center gap-2 cursor-pointer text-xs"
          onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ticket.location)}`, '_blank')}
        >
          <MapPinIcon className="w-3 h-3 text-default-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            {isLocationTruncated ? (
              <Tooltip content={ticket.location} size="sm" delay={0} closeDelay={0}>
                <span ref={locationRef} className="truncate font-medium block">{ticket.location}</span>
              </Tooltip>
            ) : (
              <span ref={locationRef} className="truncate font-medium block">{ticket.location}</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}; 