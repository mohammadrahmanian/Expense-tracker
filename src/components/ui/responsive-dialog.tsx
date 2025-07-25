import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const ResponsiveDialog = DialogPrimitive.Root;
const ResponsiveDialogTrigger = DialogPrimitive.Trigger;
const ResponsiveDialogPortal = DialogPrimitive.Portal;
const ResponsiveDialogClose = DialogPrimitive.Close;

const ResponsiveDialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
ResponsiveDialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const ResponsiveDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <ResponsiveDialogPortal>
    <ResponsiveDialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        // Base styles
        "fixed z-50 grid w-full gap-4 border bg-background p-6 shadow-lg duration-200",
        // Desktop: centered modal
        "sm:left-[50%] sm:top-[50%] sm:max-w-lg sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-lg",
        // Desktop animations
        "sm:data-[state=open]:animate-in sm:data-[state=closed]:animate-out sm:data-[state=closed]:fade-out-0 sm:data-[state=open]:fade-in-0",
        "sm:data-[state=closed]:zoom-out-95 sm:data-[state=open]:zoom-in-95",
        "sm:data-[state=closed]:slide-out-to-left-1/2 sm:data-[state=closed]:slide-out-to-top-[48%]",
        "sm:data-[state=open]:slide-in-from-left-1/2 sm:data-[state=open]:slide-in-from-top-[48%]",
        // Mobile: bottom sheet
        "bottom-0 left-0 right-0 rounded-t-[10px] mobile-safe-bottom",
        // Mobile animations
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:animate-slide-out-to-bottom data-[state=open]:animate-slide-in-from-bottom",
        // Mobile specific max height and scrolling
        "max-h-[85vh] overflow-y-auto",
        className,
      )}
      {...props}
    >
      {/* Mobile drag indicator */}
      <div className="mx-auto w-12 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 mb-2 sm:hidden" />
      
      {children}
      
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </ResponsiveDialogPortal>
));
ResponsiveDialogContent.displayName = DialogPrimitive.Content.displayName;

const ResponsiveDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left pb-2",
      className,
    )}
    {...props}
  />
);
ResponsiveDialogHeader.displayName = "ResponsiveDialogHeader";

const ResponsiveDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4 gap-2 sm:gap-0",
      className,
    )}
    {...props}
  />
);
ResponsiveDialogFooter.displayName = "ResponsiveDialogFooter";

const ResponsiveDialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
ResponsiveDialogTitle.displayName = DialogPrimitive.Title.displayName;

const ResponsiveDialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
ResponsiveDialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  ResponsiveDialog,
  ResponsiveDialogPortal,
  ResponsiveDialogOverlay,
  ResponsiveDialogClose,
  ResponsiveDialogTrigger,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogFooter,
  ResponsiveDialogTitle,
  ResponsiveDialogDescription,
};