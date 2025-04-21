import {
  Breadcrumbs,
  BreadcrumbItem,
  Divider,
  Button,
  Tooltip,
  Card
} from "@heroui/react";
import { 
  HomeIcon as HomeSolidIcon,
  FunnelIcon,
} from "@heroicons/react/24/solid";
import { KpiCard } from "./components/KpiCard";
import { CircleChartCard } from "./components/CircleChartCard";
import { BarChartCard } from "./components/BarChartCard";
import { DashboardTable } from "./components/DashboardTable";

// Placeholder data for charts
const ticketsByStatusData = [
  {name: "New", value: 3},      
  {name: "On Hold", value: 1},     
  {name: "Triage", value: 2},      
  {name: "In Progress", value: 2}, 
  {name: "Review", value: 2},      
  {name: "Closed", value: 2},     
];
// Reordered categories to match logical flow
const ticketsByStatusCategories = ["New", "On Hold", "Triage", "In Progress", "Review", "Closed"];

const maintenanceTicketsData = [
  {name: "HP", value: 3},          // Adjusted
  {name: "Not Specified", value: 2},// Adjusted
  {name: "Dell", value: 3},         // Adjusted
  {name: "Cisco", value: 5}        // Adjusted
];
const maintenanceTicketsCategories = ["HP", "Not Specified", "Dell", "Cisco"];

// Placeholder data for Bar Charts
const newRequestsData = [
  { name: "04/10", value: 6 },
  { name: "04/11", value: 13 },
  { name: "04/14", value: 2 }, 
  { name: "04/15", value: 7 },
  { name: "04/16", value: 2 },
];

const closedRequestsData = [
  { name: "04/10", value: 19 },
  { name: "04/11", value: 2 },
  { name: "04/14", value: 1 },
  { name: "04/15", value: 1 },
  { name: "04/16", value: 1 },
];

// Placeholder data for Tables
const partnerRequestsColumns = [
  { key: "name", label: "Customer" },
  { key: "value", label: "Active Requests" },
];
const partnerRequestsItems = [
  { id: 1, name: "A-Company customer", value: 54 },
  { id: 2, name: "Resell A26", value: 51 },
  { id: 3, name: "Service Corporation", value: 25 },
  { id: 4, name: "A-ProCustomer", value: 22 },
  { id: 5, name: "2nd Gear", value: 20 },
];

const endCustomerRequestsColumns = [
  { key: "name", label: "Customer" },
  { key: "value", label: "Active Requests" },
];
const endCustomerRequestsItems = [
  { id: 1, name: "Integrate Corp A", value: 51 },
  { id: 2, name: "Maine Drilling and Blasting", value: 20 },
  { id: 3, name: "Total End Cover 2025", value: 12 },
  { id: 4, name: "A-Pro End Customer", value: 9 },
  { id: 5, name: "Ricoh", value: 5 },
];

const vendorEventsColumns = [
  { key: "name", label: "Vendor" },
  { key: "value", label: "Active Events" },
];
const vendorEventsItems = [
  { id: 1, name: "Technical Solutions A", value: 96 },
  { id: 2, name: "Test Company", value: 42 },
  { id: 3, name: "AngySupport", value: 40 },
  { id: 4, name: "Cloudcover (InHouseVendor)", value: 33 },
  { id: 5, name: "Total Cover LLC_25", value: 30 },
];

// Define data for Aging Events table
const agingEventsColumns = [
  { key: "event", label: "Event" },
  { key: "eventType", label: "Event Type" },
  { key: "status", label: "Status" },
  { key: "partner", label: "Partner" },
  { key: "timeAged", label: "Time Aged" },
];

const agingEventsItems = [
  { id: 1, event: "INC00256-003", eventType: "Remote Support", status: "New", partner: "Massive Dynamics", timeAged: "353d 17h" },
  { id: 2, event: "INC00259-003", eventType: "Remote Support", status: "New", partner: "Massive Dynamics", timeAged: "352d 15h" },
  { id: 3, event: "INC00260-003", eventType: "Remote Support", status: "Sourcing", partner: "Massive Dynamics", timeAged: "352d 15h" },
  { id: 4, event: "INC00258-003", eventType: "Remote Support", status: "Sourcing", partner: "CDW", timeAged: "349d 18h" },
  { id: 5, event: "INC00263-003", eventType: "Remote Support", status: "New", partner: "Massive Dynamics", timeAged: "349d 18h" },
];

// Define data for SLA At Risk table
const slaRiskColumns = [
  { key: "event", label: "Event" },
  { key: "eventType", label: "Event Type" },
  { key: "status", label: "Status" },
  { key: "partner", label: "Partner" },
  { key: "timeBreach", label: "Time Before Breach" },
];

const slaRiskItems = [
  { id: 1, event: "INC00301-001", eventType: "Field Engineering", status: "Pending", partner: "Tech Solutions", timeBreach: "1h 30m" },
  { id: 2, event: "INC00305-002", eventType: "Remote Support", status: "Active", partner: "Global Corp", timeBreach: "2h 15m" },
  { id: 3, event: "INC00310-001", eventType: "Parts", status: "Pending Dispatch", partner: "CDW", timeBreach: "3h 0m" },
  { id: 4, event: "INC00312-003", eventType: "Remote Support", status: "Active", partner: "Massive Dynamics", timeBreach: "4h 45m" },
  { id: 5, event: "INC00315-001", eventType: "Remote Support", status: "Scheduled", partner: "Local Business", timeBreach: "5h 0m" },
];

export default function DashboardPage() {
  return (
    <div className="h-full flex flex-col overflow-hidden"> 
      {/* Header Section */}
      <div className="flex-none">
        {/* Title, Breadcrumbs, and Actions in one row */}
        <div className="flex items-center justify-between px-6 h-[57px]">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          
          {/* Group Breadcrumbs and Filter Button */}
          <div className="flex items-center gap-3">
            <Breadcrumbs size="sm">
              <BreadcrumbItem>
                <HomeSolidIcon className="w-4 h-4 text-default-600" />
              </BreadcrumbItem>
              <BreadcrumbItem>Dashboard</BreadcrumbItem>
            </Breadcrumbs>

            {/* Filter Button */}
            <Tooltip content="Filter" size="sm" delay={0} closeDelay={0}>
              <div> { /* Tooltip requires a direct child div/span for ref */ }
                <Button 
                  isIconOnly 
                  variant="light"
                  size="sm"
                  className="h-9 w-9" // Match size used in Client Requests page
                >
                  <FunnelIcon className="w-5 h-5 text-default-600" />
                </Button>
              </div>
            </Tooltip>
          </div>
        </div>

        <Divider className="w-full" />
      </div>

      {/* Content Area */}      
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Grid for KPI Cards - Add items-start */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 items-start"> 
          {/* Open Client Requests Card - Expandable */}
          <KpiCard 
            title="Open Client Requests"
            value="223"
            icon="users"
            changeType="neutral"
            iconBgColor="bg-default-100"
            isExpandable={true} // <-- Make this card expandable
          >
            {/* Nested horizontal grid for breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <KpiCard 
                title="Maintenance"
                value="148" // Placeholder
                icon="wrench"
                changeType="neutral"
                iconBgColor="bg-default-100"
              />
              <KpiCard 
                title="Professional Services"
                value="75" // Placeholder
                icon="briefcase"
                changeType="neutral"
                iconBgColor="bg-default-100"
              />
            </div>
          </KpiCard>

          {/* Open Events Card (Expandable) */}
          <KpiCard 
            title="Open Events"
            value="611"
            icon="calendar"
            changeType="neutral"
            iconBgColor="bg-default-100"
            isExpandable={true} // <-- Make expandable
          >
            {/* Nested 2x2 grid for breakdown */}
            <div className="grid grid-cols-2 gap-4">
              <KpiCard 
                title="In House"
                value="33" // Placeholder
                icon="building"
                changeType="neutral"
                iconBgColor="bg-default-100"
              />
              <KpiCard 
                title="Partner"
                value="245" // Placeholder
                icon="group"
                changeType="neutral"
                iconBgColor="bg-default-100"
              />
              <KpiCard 
                title="Maintenance"
                value="412" // Placeholder
                icon="wrench"
                changeType="neutral"
                iconBgColor="bg-default-100"
              />
              <KpiCard 
                title="Professional Services"
                value="199"
                icon="briefcase"
                changeType="neutral"
                iconBgColor="bg-default-100"
              />
            </div>
          </KpiCard>
        </div>

        {/* Other Dashboard Sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <KpiCard 
            title="New Client Requests"
            value="10" // Placeholder
            icon="documentPlus"
            changeType="neutral"
            iconBgColor="bg-default-100"
            isExpandable={true} // <-- Add prop for hover effect
          />
          <KpiCard 
            title="T&M Client Requests"
            value="10" // Placeholder
            icon="clock"
            changeType="neutral"
            iconBgColor="bg-default-100"
            isExpandable={true} // <-- Add prop for hover effect
          />
           <KpiCard 
            title="Created Today"
            value="5" // Placeholder
            icon="calendar" // Reusing calendar icon
            changeType="neutral"
            iconBgColor="bg-default-100"
            isExpandable={true} // <-- Add prop for hover effect
          />
           <KpiCard 
            title="Closed Today"
            value="5" // Placeholder
            icon="documentCheck"
            changeType="neutral"
            iconBgColor="bg-default-100"
            isExpandable={true} // <-- Add prop for hover effect
          />
        </div>

        {/* Spacer div */}
        <div className="h-6"></div> 

        {/* Row for Circle Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <CircleChartCard 
            title="Tickets By Status"
            categories={ticketsByStatusCategories}
            chartData={ticketsByStatusData}
            palette="status" // <-- Use status palette
          />
          <CircleChartCard 
            title="Maintenance Tickets by OEM"
            categories={maintenanceTicketsCategories}
            chartData={maintenanceTicketsData}
            palette="oem" // <-- Use oem palette
          />
        </div>

        {/* Row for Bar Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <BarChartCard 
            title="New Client Requests By Day" 
            chartData={newRequestsData}
            barColorClass="fill-violet-400" // <-- Set bar color
          />
          <BarChartCard 
            title="Closed Client Requests By Day" 
            chartData={closedRequestsData}
            barColorClass="fill-rose-300" // <-- Changed to pastel rose
          />
        </div>

        {/* Active Requests and Events Tables */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <DashboardTable
            title="Active Requests by Partner"
            columns={partnerRequestsColumns}
            items={partnerRequestsItems}
          />
          <DashboardTable
            title="Active Requests by End Customer"
            columns={endCustomerRequestsColumns}
            items={endCustomerRequestsItems}
          />
          <DashboardTable
            title="Active Events by Vendor"
            columns={vendorEventsColumns}
            items={vendorEventsItems}
          />
        </div>

        {/* New Row for Aging Events and SLA Risk */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <DashboardTable
            title="Aging Events"
            columns={agingEventsColumns}
            items={agingEventsItems}
          />
          <DashboardTable
            title="SLA At Risk"
            columns={slaRiskColumns}
            items={slaRiskItems}
          />
        </div>
      </div>
    </div>
  );
} 