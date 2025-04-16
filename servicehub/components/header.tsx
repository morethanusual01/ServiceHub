'use client';

import { Button } from '@heroui/button';
import { Avatar, Badge, Tooltip } from '@heroui/react';
import { BellIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';

export function Header() {
  const router = useRouter();

  return (
    <div className="h-[57px] border-b border-divider flex items-center justify-end px-4">
      <div className="flex items-center gap-2">
        <Tooltip 
          content="Help" 
          size="sm" 
          delay={0}
          closeDelay={0}
          disableAnimation
        >
          <Button
            isIconOnly
            variant="light"
            className="text-default-600 hover:text-default-700"
          >
            <QuestionMarkCircleIcon className="w-6 h-6" />
          </Button>
        </Tooltip>
        <Tooltip 
          content="Notifications" 
          size="sm"
          delay={0}
          closeDelay={0}
          disableAnimation
        >
          <Button
            isIconOnly
            variant="light"
            className="text-default-600 hover:text-default-700"
          >
            <Badge
              color="danger"
              size="sm"
              placement="top-right"
              content=""
            >
              <BellIcon className="w-6 h-6" />
            </Badge>
          </Button>
        </Tooltip>
      </div>
      <div className="ml-2.5 mr-3 h-6 w-[1px] bg-divider"></div>
      <Avatar
        as="button"
        onClick={() => router.push('/settings')}
        className="transition-opacity hover:opacity-80 cursor-pointer"
        size="sm"
        name="MC"
        color="default"
      />
    </div>
  );
} 