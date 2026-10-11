import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

// The SSG bundle rewrites import.meta.url into dist/, so caches stay next to the project root.
export function createFileCache<T>(name: string, load: () => Promise<T>, config?: { root?: string }) {
  const cachePath = join(config?.root ?? join(process.cwd(), '.cache'), `${name}.json`)

  function read(): T {
    try {
      return JSON.parse(readFileSync(cachePath, 'utf8')) as T
    } catch (error) {
      throw new Error(`${name} cache is missing. Restart the dev server so it can be fetched.`, { cause: error })
    }
  }

  async function write(value: T): Promise<void> {
    mkdirSync(dirname(cachePath), { recursive: true })
    const tempPath = `${cachePath}.tmp`
    writeFileSync(tempPath, JSON.stringify(value))
    renameSync(tempPath, cachePath)
  }

  async function warm(options?: { refresh?: boolean }): Promise<void> {
    const cached = existsSync(cachePath)

    const refresh = load()
      .then(write)
      .catch((error: unknown) => {
        if (!cached) throw error
        const detail = error instanceof Error ? error.message : String(error)
        console.warn(`${name} refresh failed, using the saved cache: ${detail}`)
      })

    if (options?.refresh || !cached) await refresh
  }

  return { read, warm }
}
