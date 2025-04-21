'use client';

import React, { useState } from "react";
import {Button, Card, Chip, cn} from "@heroui/react";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MinusIcon,
  UsersIcon,         // Keep existing UsersIcon import
  WalletIcon,        
  CurrencyDollarIcon, 
  TicketIcon,         
  CalendarDaysIcon,   
  ChevronDownIcon,    // <-- Import ChevronDownIcon
  ChevronUpIcon,      // <-- Import ChevronUpIcon
  WrenchScrewdriverIcon, // <-- Import Wrench icon
  BriefcaseIcon,      // <-- Import Briefcase icon
  BuildingOfficeIcon, // <-- Add BuildingOfficeIcon
  UserGroupIcon,      // <-- Add UserGroupIcon
  DocumentTextIcon,   // <-- Add DocumentTextIcon
  DocumentPlusIcon,      // <-- Add new icons
  ClockIcon,             // <-- Add new icons
  DocumentCheckIcon,     // <-- Add new icons
} from "@heroicons/react/24/solid";

// Map string keys to actual icon components
const iconMap: Record<string, React.ElementType> = {
  ticket: TicketIcon, 
  calendar: CalendarDaysIcon, 
  users: UsersIcon, 
  wallet: WalletIcon,
  currencyDollar: CurrencyDollarIcon,
  wrench: WrenchScrewdriverIcon, // <-- Add wrench key
  briefcase: BriefcaseIcon,      // <-- Add briefcase key
  building: BuildingOfficeIcon, // <-- Add building key
  group: UserGroupIcon,         // <-- Add group key
  document: DocumentTextIcon,   // <-- Add document key
  documentPlus: DocumentPlusIcon, // <-- Add new keys
  clock: ClockIcon,               // <-- Add new keys
  documentCheck: DocumentCheckIcon, // <-- Add new keys
  // Add other icons used in the dashboard here
};

export type KpiCardProps = {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "neutral" | "negative";
  trendType?: "up" | "neutral" | "down";
  icon: keyof typeof iconMap; 
  iconBgColor?: string; 
  trendChipPosition?: "top" | "bottom";
  children?: React.ReactNode; // <-- Add children prop type
  isExpandable?: boolean; // <-- Add prop to control if chevron is shown
};

export const KpiCard = ({
  title,
  value,
  change,
  changeType = "neutral",
  trendType = "neutral",
  icon, 
  iconBgColor = 'bg-default-50', 
  trendChipPosition = "top",
  children, // <-- Destructure children
  isExpandable = false, // <-- Default to not expandable
}: KpiCardProps) => {
  const showTrendChip = change !== undefined;
  const [isExpanded, setIsExpanded] = useState(false); // <-- Add state for expansion

  // Log component render
  console.log(`KpiCard Render: ${title}, isExpanded: ${isExpanded}`);

  // Look up the actual Icon component from the map
  const IconComponent = iconMap[icon];

  const trendIcon = 
    trendType === "up" ? (
      <ArrowTrendingUpIcon className="w-3 h-3" />
    ) : trendType === "neutral" ? (
      <MinusIcon className="w-3 h-3" />
    ) : (
      <ArrowTrendingDownIcon className="w-3 h-3" />
    );

  const iconColorClass = 
    changeType === "positive" ? "text-success" : 
    changeType === "negative" ? "text-danger" : 
    "text-default-600"; // <-- Default to neutral color

  return (
    <Card 
      className={cn(
        "border border-default-200 dark:border-default-100 overflow-hidden transition-all shadow-none",
        isExpandable && "cursor-pointer hover:border-default-300 dark:hover:border-default-300 hover:shadow-sm"
      )}
    >
      {/* Main content area - Make this div clickable */}
      <div 
        className="p-4" 
        onClick={isExpandable ? () => setIsExpanded(!isExpanded) : undefined} // <-- Toggle on click if expandable
      >
        {/* Top row: Use items-start to align icon with title */}
        <div className="flex items-start gap-4"> 
          {/* Left Icon */}
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md", 
              iconBgColor 
            )}
          >
            <IconComponent className={cn("w-5 h-5", iconColorClass)} />
          </div>

          {/* Middle: Title and Value - remove flex-1 */}
          <div className="flex flex-col gap-y-0"> 
            <dt className="text-sm font-medium text-default-500">{title}</dt>
            <dd className="text-2xl font-semibold text-default-700">{value}</dd>
          </div>

          {/* Spacer to push button to the right */}
          <div className="flex-grow"></div>

          {/* Right: Chevron Button (visual only IF expandable AND has children) */}
          {isExpandable && children && (
            <Button 
              isIconOnly 
              variant="light"
              size="sm"
              className="h-8 w-8 self-center -mr-1 pointer-events-none" // <-- Make non-interactive
              tabIndex={-1} // Prevent tabbing
            >
              {isExpanded ? (
                <ChevronUpIcon className="w-5 h-5 text-default-400" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 text-default-400" />
              )}
            </Button>
          )}
        </div>

        {/* Trend Chip (positioning might need adjustment if shown) */}
        {showTrendChip && (
          <div className="mt-2"> { /* Add margin if chip is shown */ }
            <Chip
              className={cn({ /* Chip is no longer absolute */
                // Adjust chip position if needed, e.g., using flex on parent
              })}
              classNames={{
                content: "font-semibold text-[0.65rem]",
              }}
              color={
                changeType === "positive"
                  ? "success"
                  : changeType === "neutral"
                    ? "warning"
                    : "danger"
              }
              radius="sm"
              size="sm"
              startContent={trendIcon}
              variant="flat"
            >
              {change}
            </Chip>
          </div>
        )}
      </div>

      {/* Expandable Content Area (only render if expandable AND has children) */}
      {isExpandable && children && (
        <div 
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            { 
              'max-h-0': !isExpanded,
              'max-h-96': isExpanded, // Adjust max-h as needed
            }
          )}
        >
          <div className="p-4 border-t border-default-100">
            {children} {/* Render nested content */}
          </div>
        </div>
      )}
    </Card>
  );
}; 