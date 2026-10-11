import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { parseContributionCalendar } from '../../../src/lib/contributions/parse.ts'

const profileUrl = 'https://github.com/marek3289'

function cell(date: string, count: number, level = count === 0 ? 0 : 1): string {
  const id = `day-${date}`
  const label = count === 0 ? 'No contributions on January 1st.' : `${count.toLocaleString('en-US')} contribution${count === 1 ? '' : 's'} on January 1st.`
  return `<tool-tip for="${id}">${label}</tool-tip><td data-level="${level}" id="${id}" data-date="${date}"></td>`
}

function html(days: string[], total = '2'): string {
  return `<h2>${total} contributions in the last year</h2>${days.join('')}<td class="other"></td>`
}

describe('parseContributionCalendar', () => {
  it('reads the total, counts, and levels regardless of attribute order', () => {
    const parsed = parseContributionCalendar(html([cell('2026-01-01', 1, 1), cell('2026-01-02', 1200, 4)], '1,201'), profileUrl)

    assert.deepEqual(parsed, {
      total: 1201,
      totalLabel: '1,201',
      profileUrl,
      summary: '1,201 contributions in the last year',
      from: '2026-01-01',
      to: '2026-01-02',
      contributions: [
        { date: '2026-01-01', count: 1, level: 1 },
        { date: '2026-01-02', count: 1200, level: 4 },
      ],
    })
  })

  it('treats an empty day as zero contributions', () => {
    const parsed = parseContributionCalendar(html([cell('2026-01-01', 0)], '0'), profileUrl)
    assert.equal(parsed.contributions[0]?.count, 0)
    assert.equal(parsed.contributions[0]?.level, 0)
  })

  it('rejects html without a yearly total', () => {
    assert.throws(() => parseContributionCalendar('<td data-date="2026-01-01"></td>', profileUrl), /contribution total/)
  })

  it('rejects a total with no contribution cells', () => {
    assert.throws(() => parseContributionCalendar(html([]), profileUrl), /contribution calendar/)
  })

  it('rejects a cell with no tooltip', () => {
    const broken = `${html([])}<td data-date="2026-01-01" id="day-2026-01-01" data-level="1"></td>`
    assert.throws(() => parseContributionCalendar(broken, profileUrl), /2026-01-01 is missing an id or tooltip/)
  })

  it('rejects a cell with an unexpected level', () => {
    assert.throws(() => parseContributionCalendar(html([cell('2026-01-01', 1, 9)]), profileUrl), /level for 2026-01-01 is 9, expected 0–4/)
  })

  it('rejects a tooltip that does not contain a count', () => {
    const broken = html([]) + '<tool-tip for="day">busy</tool-tip><td data-date="2026-01-01" id="day" data-level="1"></td>'
    assert.throws(() => parseContributionCalendar(broken, profileUrl), /Unrecognised contribution tooltip: busy/)
  })

  it('rejects a duplicated date', () => {
    assert.throws(
      () => parseContributionCalendar(html([cell('2026-01-02', 1), cell('2026-01-01', 1), cell('2026-01-01', 2)]), profileUrl),
      /Duplicate contribution date: 2026-01-01/,
    )
  })

  it('rejects a gap and names the missing day', () => {
    assert.throws(() => parseContributionCalendar(html([cell('2026-01-31', 1), cell('2026-02-02', 1)]), profileUrl), /Missing contribution day: 2026-02-01/)
  })
})
