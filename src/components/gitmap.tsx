import { useState, useCallback, useRef } from 'react'
import { format, addDays, startOfWeek as startOfWeekFns, endOfWeek, eachWeekOfInterval, getMonth, getDate, parse, startOfDay, endOfDay } from 'date-fns'
import { cn } from 'cn'

import type { ContributionDay } from '@/lib/contributions/types'

type WeekColumn = { days: (ContributionDay | null)[]; weekStart: Date }
type MonthLabel = { month: string; xOffset: number }

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAY_LABELS = [{ label: 'Mon', row: 1 }, { label: 'Wed', row: 3 }, { label: 'Fri', row: 5 }]
const DAY_LABEL_WIDTH = 28
const MONTH_LABEL_HEIGHT = 18

interface GitmapProps {
  contributions: ContributionDay[]
  from: Date
  to: Date
  cellSize?: number
  cellGap?: number
  showMonths?: boolean
  showDays?: boolean
  showCounts?: boolean
  className?: string
}

export function Gitmap({
  contributions,
  from,
  to,
  cellSize = 10,
  cellGap = 3,
  showMonths = true,
  showDays = true,
  showCounts = false,
  className,
}: GitmapProps) {
  const cellTotal = cellSize + cellGap
  const weeks = generateWeeks(from, to, contributions)
  const monthLabels = getMonthLabels(weeks, cellSize, cellGap)

  const gridHeight = 7 * cellSize + 6 * cellGap
  const gridWidth = weeks.length * cellSize + (weeks.length - 1) * cellGap

  const tooltipRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const [tooltipData, setTooltipData] = useState<{ date: string; count: number } | null>(null)
  const lastCellData = useRef<{ date: string; count: number } | null>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    const date = target.dataset.date
    const count = target.dataset.count

    if (tooltipRef.current) {
      tooltipRef.current.style.left = `${e.clientX}px`
      tooltipRef.current.style.top = `${e.clientY}px`

      if (date && count !== undefined) {
        target.removeAttribute('title')
        const newData = { date, count: parseInt(count, 10) }
        lastCellData.current = newData
        setTooltipData(newData)
      }

      if (gridRef.current) {
        const rect = gridRef.current.getBoundingClientRect()
        const isInGrid = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom

        if (isInGrid && lastCellData.current) {
          tooltipRef.current.style.opacity = '1'
        } else if (!isInGrid) {
          tooltipRef.current.style.opacity = '0'
        }
      }
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (tooltipRef.current) {
      tooltipRef.current.style.opacity = '0'
    }

    lastCellData.current = null
  }, [])

  return (
    <div
      className={cn('relative cursor-default select-none', className)}
      style={{
        paddingLeft: showDays ? DAY_LABEL_WIDTH : 0,
        paddingTop: showMonths ? MONTH_LABEL_HEIGHT : 0,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {showMonths && (
        <div className='absolute top-0' style={{ left: showDays ? DAY_LABEL_WIDTH : 0, height: MONTH_LABEL_HEIGHT }}>
          {monthLabels.map(({ month, xOffset }, i) => (
            <span
              key={`${month}-${i}`}
              className='absolute top-0 whitespace-nowrap font-mono text-meta text-muted-foreground'
              style={{ left: xOffset, lineHeight: `${MONTH_LABEL_HEIGHT}px` }}
            >
              {month}
            </span>
          ))}
        </div>
      )}

      {showDays && (
        <div className='absolute left-0' style={{ top: showMonths ? MONTH_LABEL_HEIGHT : 0, width: DAY_LABEL_WIDTH }}>
          {DAY_LABELS.map(({ label, row }) => (
            <span
              key={label}
              className='absolute text-[11px] text-muted-foreground leading-none right-2'
              style={{ top: row * cellTotal + cellSize / 2, transform: 'translateY(-50%)' }}
            >
              {label}
            </span>
          ))}
        </div>
      )}

      <div
        ref={gridRef}
        className='grid'
        style={{
          gridTemplateRows: `repeat(7, ${cellSize}px)`,
          gridTemplateColumns: `repeat(${weeks.length}, ${cellSize}px)`,
          gap: cellGap,
          width: gridWidth,
          height: gridHeight,
        }}
      >
        {weeks.map((week, col) =>
          week.days.map((day, row) =>
            day === null ? (
              <div key={`${col}-${row}`} style={{ gridRow: row + 1, gridColumn: col + 1 }} />
            ) : (
              <div
                key={`${col}-${row}`}
                className={cn('rounded-[2px]', showCounts && 'flex items-center justify-center')}
                style={{
                  gridRow: row + 1,
                  gridColumn: col + 1,
                  backgroundColor: `var(--contrib-${day.level})`,
                  width: cellSize,
                  height: cellSize,
                }}
                data-date={day.date}
                data-count={day.count}
                title={contributionLabel(day.date, day.count)}
              >
                {showCounts && day.count > 0 && (
                  <span
                    className={cn(
                      'font-mono leading-none pointer-events-none',
                      day.level <= 1 && 'text-foreground/80',
                      (day.level === 2 || day.level === 3) && 'text-muted dark:text-foreground/80',
                      day.level === 4 && 'text-background',
                    )}
                    style={{ fontSize: `${Math.max(8 - String(day.count).length, 4)}px` }}
                  >
                    {day.count}
                  </span>
                )}
              </div>
            ),
          ),
        )}
      </div>

      <div
        ref={tooltipRef}
        className='pointer-events-none fixed z-50 opacity-0'
        style={{
          transform: 'translate(-50%, -100%) translateY(-8px)',
        }}
      >
        <div className='relative rounded-sm bg-foreground px-2 py-1 text-[10px] text-background whitespace-nowrap'>
          {tooltipData && <span className='font-medium'>{contributionLabel(tooltipData.date, tooltipData.count)}</span>}
          <div className='absolute left-1/2 -translate-x-1/2 size-2 rotate-45 rounded-[1px] bg-foreground' style={{ bottom: -3.5 }} />
        </div>
      </div>
    </div>
  )
}

function generateWeeks(from: Date, to: Date, contributions: ContributionDay[]): WeekColumn[] {
  const map = new Map(contributions.map((c) => [c.date, c]))

  const rangeStart = startOfDay(from)
  const rangeEnd = endOfDay(to)
  const gridStart = startOfWeekFns(rangeStart, { weekStartsOn: 0 })
  const gridEnd = endOfWeek(rangeEnd, { weekStartsOn: 0 })

  return eachWeekOfInterval({ start: gridStart, end: gridEnd }, { weekStartsOn: 0 }).map((weekStart) => ({
    weekStart,
    days: Array.from({ length: 7 }, (_, d) => {
      const day = addDays(weekStart, d)
      const key = format(day, 'yyyy-MM-dd')

      return day >= rangeStart && day <= rangeEnd ? (map.get(key) ?? { date: key, count: 0, level: 0 }) : null
    }),
  }))
}

function getMonthLabels(weeks: WeekColumn[], cellSize: number, cellGap: number): MonthLabel[] {
  const labels: MonthLabel[] = []
  const cellTotal = cellSize + cellGap

  weeks.forEach((week, i) => {
    const firstOfMonth = week.days.find((d) => d && getDate(parse(d.date, 'yyyy-MM-dd', new Date())) === 1)

    if (firstOfMonth) {
      const date = parse(firstOfMonth.date, 'yyyy-MM-dd', new Date())
      const xOffset = i * cellTotal

      if (!labels.length || xOffset - labels[labels.length - 1].xOffset >= 28) labels.push({ month: MONTHS[getMonth(date)], xOffset })
    }
  })

  return labels
}

function contributionLabel(date: string, count: number): string {
  const when = format(parse(date, 'yyyy-MM-dd', new Date()), 'MMM d, yyyy')
  if (count === 0) return `No contributions on ${when}`

  const noun = count === 1 ? 'contribution' : 'contributions'

  return `${count} ${noun} on ${when}`
}
