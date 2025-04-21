'use client';

import type { CardProps} from "@heroui/react";
import React from "react";
import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid} from "recharts"; // Added CartesianGrid
import {
  Card,
  Button, 
  Select,
  SelectItem,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  cn,
} from "@heroui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";

type BarChartData = {
  name: string; // Represents the date/label on X-axis
  value: number; // Represents the bar height on Y-axis
};

// Remove hardcoded barColor

export type BarChartCardProps = {
  title: string;
  chartData: BarChartData[];
  barColorClass?: string; // <-- Add prop for bar color class
};

// Tooltip formatter
const formatTooltipValue = (value: number) => {
  return `${value}`;
};

export const BarChartCard = React.forwardRef<
  HTMLDivElement,
  Omit<CardProps, "children"> & BarChartCardProps
>(({className, title, chartData, barColorClass = "fill-primary", ...props}, ref) => { // <-- Add prop and default
  return (
    <Card
      ref={ref}
      className={cn("border border-default-200 dark:border-default-100 shadow-none", className)}
      {...props}
    >
      {/* Header - Use full p-4 */}
      <div className="flex items-center justify-between gap-x-2 p-4">
        <dt>
          {/* Updated title style */}
          <h3 className="text-sm font-medium text-default-500">{title}</h3>
        </dt>
        <div className="flex items-center justify-end gap-x-2">
          <Select
            aria-label="Time Range"
            classNames={{
              trigger: "min-w-[100px] min-h-7 h-7",
              value: "text-tiny !text-default-500",
              selectorIcon: "text-default-500",
              popoverContent: "min-w-[120px]",
            }}
            defaultSelectedKeys={["last-7-days"]}
            listboxProps={{ itemClasses: { title: "text-tiny" }}}
            placeholder="Last 7 Days"
            size="sm"
          >
            <SelectItem key="last-7-days">Last 7 Days</SelectItem>
            <SelectItem key="last-30-days">Last 30 Days</SelectItem>
            <SelectItem key="last-90-days">Last 90 Days</SelectItem>
          </Select>
          {/* Removed dropdown trigger button */}
        </div>
      </div>

      {/* Chart Area - Keep fixed height and only px */}
      <div className="h-[250px] px-4"> 
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            margin={{ top: 5, right: 10, left: -25, bottom: 15 }}
            barGap={6}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--heroui-default-200))"/>
            <XAxis
              dataKey="name" // Use "name" for the date/label
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              style={{ fontSize: "var(--heroui-font-size-tiny)", fill: "hsl(var(--heroui-default-500))" }}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              style={{ fontSize: "var(--heroui-font-size-tiny)", fill: "hsl(var(--heroui-default-500))" }}
            />
            <Tooltip
              cursor={{fill: "hsl(var(--heroui-default-100))", radius: "4px"}}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-md bg-content1 p-2 shadow-medium border border-transparent dark:border-default-100">
                      <span className="text-xs font-medium text-default-700">{label}</span>
                      <br/>
                      <span className="text-sm text-default-500">Tickets: {payload[0].value}</span>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="value" 
              className={barColorClass} // <-- Use prop for color class
              radius={[4, 4, 0, 0]} 
              barSize={32} // <-- Increased from 24
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Removed bottom legend */}
    </Card>
  );
});

BarChartCard.displayName = "BarChartCard"; 