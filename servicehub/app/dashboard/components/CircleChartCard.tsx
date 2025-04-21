'use client';

import type { CardProps} from "@heroui/react"; // Removed ButtonProps
import React, { useState } from "react";
import {ResponsiveContainer, PieChart, Pie, Tooltip, Cell} from "recharts";
import {
  Card,
  Button, // Still needed for dropdown trigger if we add it back
  Select,
  SelectItem,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tabs,
  Tab,
  cn,
} from "@heroui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";

type ChartData = {
  name: string;
  [key: string]: string | number;
};

// Define specific pastel-like color palettes (using Tailwind fill classes - Lighter)
const statusColorPalette = [
  "fill-orange-300",    // <-- Replaced Cyan (New)
  "fill-teal-300",      // In Progress
  "fill-rose-300",      // Closed
  "fill-amber-300",     // On Hold
  "fill-sky-300",       // Triage
  "fill-violet-300",    // <-- Changed Review to Violet
];

const oemColorPalette = [
  "fill-indigo-300",    // HP
  "fill-sky-300",       // Not Specified (was cyan)
  "fill-rose-300",      // Dell (was pink)
  "fill-violet-300",    // <-- Changed Cisco to Violet
];

const palettes = {
  status: statusColorPalette,
  oem: oemColorPalette,
};

// Map Tailwind fill class names to hex codes for inline styles
const colorHexMap: Record<string, string> = {
  "fill-orange-300": "#FDBA74", 
  "fill-teal-300": "#99F6E4",    
  "fill-rose-300": "#FDA4AF",    
  "fill-amber-300": "#FCD34D",   
  "fill-sky-300": "#7DD3FC",     
  "fill-violet-300": "#C4B5FD", 
  "fill-indigo-300": "#A5B4FC",  
  "fill-cyan-300": "#67E8F9",    
  "fill-pink-300": "#F9A8D4",    
  "fill-lime-300": "#BEF264",    
  "fill-green-200": "#BBF7D0", // For largest slice override
  "fill-violet-400": "#A78BFA", // For largest slice override (previous attempt)
  // Add primary-500 if it's used by largest slice logic
  "fill-primary-500": "#0052FF", // Assuming this is your primary-500 hex
};

export type CircleChartProps = {
  title: string;
  palette: keyof typeof palettes; // Use palette key instead of color prop
  categories: string[];
  chartData: ChartData[];
};

const formatTotal = (total: number) => {
  return total >= 1000 ? `${(total / 1000).toFixed(1)}K` : total;
};

export const CircleChartCard = React.forwardRef<
  HTMLDivElement,
  Omit<CardProps, "children"> & CircleChartProps
>(({className, title, categories, palette, chartData, ...props}, ref) => {

  const baseColors = palettes[palette];

  // Find index of the largest slice
  const largestIndex = chartData.reduce(
    (maxIndex, item, index, arr) => 
      (item.value as number) > (arr[maxIndex].value as number) ? index : maxIndex,
    0
  );

  // Create dynamic colors for this render, applying pastel green back to largest slice
  const dynamicColors = baseColors.map((color, index) => 
    index === largestIndex ? "fill-green-200" : color // <-- Use lighter green-200 for largest
  );

  return (
    <Card
      ref={ref}
      className={cn("border border-default-200 dark:border-default-100 shadow-none", className)}
      {...props}
    >
      {/* Header - Revert padding */}
      <div className="flex items-center justify-between gap-x-2 p-4 pb-2">
        <dt>
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
            listboxProps={{
              itemClasses: {
                title: "text-tiny",
              },
            }}
            placeholder="Last 7 Days"
            size="sm"
          >
            <SelectItem key="last-7-days">Last 7 Days</SelectItem>
            <SelectItem key="last-30-days">Last 30 Days</SelectItem>
            <SelectItem key="last-90-days">Last 90 Days</SelectItem>
          </Select>
        </div>
      </div>

      {/* Tabs Section - Revert padding/margin */}
      <div className="px-4 pb-2 mb-1">
        <Tabs 
          aria-label="Chart Data Type" 
          size="sm" 
          variant="solid"
          defaultSelectedKey="client-request" 
          classNames={{
             base: "w-full justify-start", 
             tabList: "p-0.5 gap-1 bg-default-100 rounded-medium",
             tab: "h-7 px-3", 
             tabContent: "text-xs font-medium",
             cursor: "rounded-medium"
          }}
        >
          <Tab key="client-request" title="Client Request" />
          <Tab key="field-engineering" title="Field Engineering" />
          <Tab key="parts" title="Parts" />
          <Tab key="remote-support" title="Remote Support" />
        </Tabs>
      </div>

      {/* Chart and Legend Container - Revert padding */}
      <div className="flex flex-col items-center p-4 pt-0">
        {/* Chart */}
        <ResponsiveContainer
          className="[&_.recharts-surface]:outline-none"
          height={200} // Keep height
          width="100%"
        >
          <PieChart accessibilityLayer margin={{top: 5, right: 5, left: 5, bottom: 5}}> {/* Added slight margin */}
            <Tooltip
              content={({label, payload}: {label?: any, payload?: any[]}) => {
                if (!payload || payload.length === 0) return null;
                const dataPoint = payload[0].payload;
                const name = dataPoint.name;
                const value = dataPoint.value;
                const colorIndex = chartData.findIndex(item => item.name === name);
                const colorClass = dynamicColors[colorIndex % dynamicColors.length];
                const hexColor = colorHexMap[colorClass] || "#888888"; 

                return (
                  <div className="flex items-center gap-x-2 rounded-medium bg-content1 px-3 py-1.5 text-sm shadow-medium border border-transparent dark:border-default-100">
                     <span 
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: hexColor }}
                     /> 
                     {/* Category name (dark) + Colon */}
                     <span className="font-medium text-default-700 capitalize">{name}:</span> 
                     {/* Value (grey) */}
                     <span className="font-medium text-default-500">
                       {formatTotal(value as number)}
                     </span>
                   </div>
                )
              }}
              cursor={false}
            />
            <Pie
              animationDuration={800} // Slightly faster
              animationEasing="ease-out"
              data={chartData}
              dataKey="value"
              innerRadius="60%" // <-- Decreased from 70%
              nameKey="name"
              strokeWidth={0}
              outerRadius="90%"
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  className={dynamicColors[index % dynamicColors.length]} // Use dynamic colors
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Legend - Revert mt */}
        <div className="flex w-full flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
          {categories.map((category, index) => {
            const colorClass = dynamicColors[index % dynamicColors.length];
            // Get hex code from map
            const hexColor = colorHexMap[colorClass] || "#888888"; // Fallback to grey
            
            console.log(`Legend: ${category}, Color Class: ${colorClass}, Hex: ${hexColor}`); // Keep log for now

            return (
              <div key={index} className="flex items-center gap-1.5">
                {/* Color Dot Span - Use inline style */}
                <span
                  className="h-3 w-3 rounded-full" 
                  style={{ backgroundColor: hexColor }}
                />
                {/* Text Span */}
                <span className="capitalize text-xs text-default-600">{category}</span> 
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  );
});

CircleChartCard.displayName = "CircleChartCard"; 