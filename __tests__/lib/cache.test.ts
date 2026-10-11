import assert from 'node:assert/strict'
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, it, mock } from 'node:test'
import { createFileCache } from '../../src/lib/cache.ts'

const name = 'sample'

describe('createFileCache', () => {
  let directory = ''

  afterEach(() => {
    if (directory) rmSync(directory, { recursive: true, force: true })
  })

  function root(): string {
    directory = mkdtempSync(join(tmpdir(), 'cache-'))
    return directory
  }

  function file(directory: string): string {
    return join(directory, `${name}.json`)
  }

  it('writes a value atomically and reads it back', async () => {
    const directory = root()
    const saved = { value: 3 }
    const cache = createFileCache(name, async () => saved, { root: directory })

    await cache.warm({ refresh: true })

    assert.equal(existsSync(`${file(directory)}.tmp`), false)
    assert.deepEqual(cache.read(), saved)
  })

  it('keeps the saved value when a blocking refresh fails', async () => {
    const directory = root()
    const saved = { value: 3 }
    writeFileSync(file(directory), JSON.stringify(saved))
    const warn = mock.method(console, 'warn', () => {})
    const cache = createFileCache(
      name,
      async () => {
        throw new Error('offline')
      },
      { root: directory },
    )

    try {
      await cache.warm({ refresh: true })
    } finally {
      warn.mock.restore()
    }

    assert.equal(warn.mock.calls[0]?.arguments[0], 'sample refresh failed, using the saved cache: offline')
    assert.equal(existsSync(`${file(directory)}.tmp`), false)
    assert.deepEqual(cache.read(), saved)
  })

  it('refreshes in the background when a value is already cached', async () => {
    const directory = root()
    const saved = { value: 3 }
    const updated = { value: 4 }
    writeFileSync(file(directory), JSON.stringify(saved))
    let resolveLoad: (value: { value: number }) => void = () => {}
    const cache = createFileCache(
      name,
      () =>
        new Promise((resolve) => {
          resolveLoad = resolve
        }),
      { root: directory },
    )

    await cache.warm()
    assert.deepEqual(cache.read(), saved)

    resolveLoad(updated)
    await new Promise((resolve) => setImmediate(resolve))

    assert.equal(existsSync(`${file(directory)}.tmp`), false)
    assert.deepEqual(cache.read(), updated)
  })

  it('throws when the first fetch fails and nothing is cached', async () => {
    const cache = createFileCache(
      name,
      async () => {
        throw new Error('offline')
      },
      { root: root() },
    )

    await assert.rejects(() => cache.warm(), /offline/)
  })

  it('throws when the cache file is missing or unreadable', () => {
    const directory = root()
    const cache = createFileCache(name, async () => ({ value: 1 }), { root: directory })
    assert.throws(
      () => cache.read(),
      (error: unknown) => {
        assert.ok(error instanceof Error)
        assert.match(error.message, /sample cache is missing/)
        assert.ok(error.cause)
        return true
      },
    )

    writeFileSync(file(directory), '{')
    assert.throws(() => cache.read(), /sample cache is missing/)
  })
})
