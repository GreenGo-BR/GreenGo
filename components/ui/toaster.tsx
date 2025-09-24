"use client";

import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider swipeDirection="right">
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        image,
        ...props
      }) {
        return (
          <Toast
            key={id}
            {...props}
            className={cn(
              "group relative flex w-full max-w-md items-center gap-3 rounded-xl border bg-white p-4 shadow-md transition-all dark:border-neutral-800 dark:bg-neutral-900",
              "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:fade-in-80",
              "data-[state=open]:slide-in-from-bottom-2 sm:data-[state=open]:slide-in-from-right-2",
              "data-[state=closed]:slide-out-to-bottom-2 sm:data-[state=closed]:slide-out-to-right-2"
            )}
          >
            {/* Icon */}
            <div className="shrink-0 flex items-center justify-center">
              <Bell className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2 text-sm flex-1">
              {title && (
                <ToastTitle className="font-medium leading-none">
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription className="text-neutral-600 dark:text-neutral-300 text-sm">
                  {description}
                </ToastDescription>
              )}

              {/* Image from Firebase payload */}
              {image && (
                <img
                  src={image}
                  alt="Notification"
                  className="mt-1 max-h-40 w-full rounded-lg object-cover"
                />
              )}
            </div>

            {action}

            <ToastClose className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200">
              ✕
            </ToastClose>
          </Toast>
        );
      })}
      <ToastViewport className="fixed bottom-4 right-4 z-[100] flex flex-col gap-3 outline-none" />
    </ToastProvider>
  );
}
