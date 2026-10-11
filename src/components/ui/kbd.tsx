import type { ComponentProps } from 'react'
import { cn } from 'cn'

function Kbd({ className, ...props }: ComponentProps<'kbd'>) {
  return (
    <kbd
      data-slot='kbd'
      className={`${cn(
        'pointer-events-none inline-flex w-fit items-center justify-center rounded-key border border-kbd-border bg-transparent px-[5px] py-px font-mono font-medium text-foreground select-none',
        className,
      )} text-kbd`}
      {...props}
    />
  )
}

function KbdGroup({ className, ...props }: ComponentProps<'div'>) {
  return <kbd data-slot='kbd-group' className={cn('inline-flex items-center gap-1', className)} {...props} />
}

export { Kbd, KbdGroup }
