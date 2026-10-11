import type { ReactNode } from 'react'
import { Toast as ToastPrimitive } from '@base-ui/react/toast'
import { cn } from 'cn'

import { Button } from '@/components/ui/button'
import { XIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from 'lucide-react'

const toast = ToastPrimitive.createToastManager()

function ToastProvider({ ...props }: ToastPrimitive.Provider.Props) {
  return <ToastPrimitive.Provider {...props} />
}

function ToastPortal({ ...props }: ToastPrimitive.Portal.Props) {
  return <ToastPrimitive.Portal data-slot='toast-portal' {...props} />
}

function ToastViewport({ className, ...props }: ToastPrimitive.Viewport.Props) {
  return (
    <ToastPrimitive.Viewport
      data-slot='toast-viewport'
      className={cn('pointer-events-none fixed bottom-6 left-1/2 z-20 -translate-x-1/2 outline-none', className)}
      {...props}
    />
  )
}

function Toast({ className, ...props }: ToastPrimitive.Root.Props) {
  return (
    <ToastPrimitive.Root
      data-slot='toast'
      className={`${cn(
        'pointer-events-none flex items-center gap-2 rounded-full bg-foreground px-3.5 py-2 font-mono whitespace-nowrap text-background opacity-100 transition-[opacity,transform] duration-200 ease-[ease]',
        'data-starting-style:translate-y-2 data-starting-style:opacity-0',
        'data-ending-style:translate-y-2 data-ending-style:opacity-0',
        'data-limited:hidden',
        className,
      )} text-meta`}
      {...props}
    />
  )
}

function ToastContent({ className, ...props }: ToastPrimitive.Content.Props) {
  return <ToastPrimitive.Content data-slot='toast-content' className={cn('flex items-center gap-2', className)} {...props} />
}

function ToastTitle({ className, ...props }: ToastPrimitive.Title.Props) {
  return <ToastPrimitive.Title data-slot='toast-title' className={`${cn('font-mono font-normal text-background', className)} text-meta`} {...props} />
}

function ToastDescription({ className, ...props }: ToastPrimitive.Description.Props) {
  return <ToastPrimitive.Description data-slot='toast-description' className={cn('text-sm text-muted-foreground', className)} {...props} />
}

function ToastAction({ className, render = <Button variant='outline' size='sm' />, ...props }: ToastPrimitive.Action.Props) {
  return <ToastPrimitive.Action data-slot='toast-action' render={render} className={cn('shrink-0', className)} {...props} />
}

function ToastClose({ className, children, render = <Button variant='ghost' size='icon-sm' />, ...props }: ToastPrimitive.Close.Props) {
  return (
    <ToastPrimitive.Close
      data-slot='toast-close'
      aria-label='Close toast'
      render={render}
      className={cn("relative shrink-0 text-muted-foreground after:absolute after:-inset-2 after:content-[''] hover:text-foreground", className)}
      {...props}
    >
      {children ?? <XIcon aria-hidden='true' />}
    </ToastPrimitive.Close>
  )
}

function ToastIcon({ type }: { type: string | undefined }) {
  let icon: ReactNode = null

  if (type === 'success') {
    icon = (
      <svg width='12' height='12' viewBox='0 0 12 12' fill='none' aria-hidden='true'>
        <path d='M2.5 6.2l2.2 2.2 4.8-4.9' stroke='currentColor' strokeWidth='1.4' strokeLinecap='round' strokeLinejoin='round' />
      </svg>
    )
  }

  if (type === 'info') {
    icon = <InfoIcon aria-hidden='true' />
  }

  if (type === 'warning') {
    icon = <TriangleAlertIcon aria-hidden='true' />
  }

  if (type === 'error') {
    icon = <OctagonXIcon className='text-destructive' aria-hidden='true' />
  }

  if (type === 'loading') {
    icon = <Loader2Icon className='animate-spin' aria-hidden='true' />
  }

  if (!icon) {
    return null
  }

  return (
    <span data-slot='toast-icon' className="shrink-0 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3">
      {icon}
    </span>
  )
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager()

  return toasts.map((toastItem) => (
    <Toast key={toastItem.id} toast={toastItem}>
      <ToastContent>
        <ToastIcon type={toastItem.type} />
        <ToastTitle />
      </ToastContent>
    </Toast>
  ))
}

function Toaster({ children, toastManager = toast, ...props }: ToastPrimitive.Provider.Props) {
  return (
    <ToastProvider toastManager={toastManager} {...props}>
      {children}
      <ToastPortal>
        <ToastViewport>
          <ToastList />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  )
}

const createToastManager = ToastPrimitive.createToastManager
const useToastManager = ToastPrimitive.useToastManager

export {
  Toaster,
  Toast,
  ToastAction,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  createToastManager,
  toast,
  useToastManager,
}
