export type TicketType = 'professional' | 'maintenance';
export type Status = 'new' | 'on-hold' | 'triage' | 'in-progress' | 'review' | 'closed';

export interface Ticket {
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
  slaAcknowledgment?: {
    warning?: boolean;
    breach?: boolean;
  };
  unreadMessages?: {
    count: number;
    readBy?: string[];
  };
  vendorOwned?: boolean;
} 