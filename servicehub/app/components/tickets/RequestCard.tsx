'use client';

import {
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Avatar,
  Card,
  Input,
  Button,
  Chip
} from "@heroui/react";
import { 
  MapPinIcon,
  UserIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftIcon,
  BuildingOfficeIcon,
  LinkIcon
} from "@heroicons/react/24/solid";
import { useState, useRef, useEffect } from "react";
import { Ticket } from "./types";

interface RequestCardProps {
  ticket: Ticket;
  onAssign: (ticketId: string, assignee: string) => void;
}

export const RequestCard = ({ ticket, onAssign }: RequestCardProps) => {
  const locationRef = useRef<HTMLSpanElement>(null);
  const [isLocationTruncated, setIsLocationTruncated] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

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
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center group/link">
              <span className="text-xs font-medium text-default-600 hover:underline cursor-pointer">{ticket.ticketNumber}</span>
              <div className="ml-1 hidden group-hover/link:inline-block relative">
                <Tooltip 
                  content={isCopied ? "Copied" : "Copy Link"}
                  size="sm" 
                  delay={isCopied ? 0 : 500}
                  key={isCopied ? 'copied-tip' : 'copy-tip'}
                >
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    className="w-5 h-5 min-w-0 data-[hover=true]:bg-default-200"
                    aria-label="Copy ticket link"
                    onClick={() => {
                      const ticketUrl = `${window.location.origin}/client-requests/${ticket.id}`;
                      navigator.clipboard.writeText(ticketUrl)
                        .then(() => {
                          setIsCopied(true);
                          console.log('Ticket link copied!');
                          setTimeout(() => {
                            setIsCopied(false);
                          }, 2000);
                        })
                        .catch(err => {
                          console.error('Failed to copy ticket link: ', err);
                        });
                    }}
                  >
                    <LinkIcon className="w-4 h-4 text-default-500" />
                  </Button>
                </Tooltip>
              </div>
            </div>
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
          {ticket.assignedTo ? (
            <Tooltip 
              content={ticket.assignedTo === 'MC' ? 'Mike Certoma' : ticket.assignedTo}
              size="sm" 
              delay={0} 
              closeDelay={0}
            >
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
              <PopoverContent className="py-3 px-3">
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
                  <Button 
                    size="sm" 
                    variant="flat" 
                    className="flex-shrink-0 h-9 text-[14px] whitespace-nowrap"
                    onClick={() => {
                      onAssign(ticket.id, "MC");
                      setIsExpanded(false);
                    }}
                  >
                    Assign to Me
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        <div className="text-[14px] font-medium">{ticket.subject}</div>

        {/* Status Indicators */}
        {(ticket.slaAcknowledgment || ticket.vendorOwned) && (
          <div className="flex items-center gap-2 flex-wrap">
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
        )}

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
                <span className="font-medium text-default-600">Cisco Systems</span>
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
                <span className="text-default-400">End Customer:</span>
                <span className="font-medium text-default-600">{ticket.endCustomer}</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-default-400">Vendor:</span>
                <span className="font-medium text-default-600">Cisco Systems</span>
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