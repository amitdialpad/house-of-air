import { marked } from 'marked'

const modules = import.meta.glob('./projects/*.md', { query: '?raw', import: 'default', eager: true })

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) return { frontmatter: {}, body: raw }

  const fm = {}
  let currentKey = null

  for (const rawLine of match[1].split(/\r?\n/)) {
    if (!rawLine.trim()) continue

    if (rawLine.startsWith('  - ')) {
      const item = rawLine.slice(4).trim()
      if (item.startsWith('{') && item.endsWith('}')) {
        const obj = {}
        const inner = item.slice(1, -1)
        const pairs = inner.match(/(\w+)\s*:\s*(?:"([^"]*)"|'([^']*)'|([^,]+))/g) || []
        for (const p of pairs) {
          const m = p.match(/(\w+)\s*:\s*(?:"([^"]*)"|'([^']*)'|(.+))/)
          if (m) obj[m[1]] = (m[2] ?? m[3] ?? m[4] ?? '').trim()
        }
        fm[currentKey].push(obj)
      } else {
        fm[currentKey].push(item.replace(/^["']|["']$/g, ''))
      }
      continue
    }

    const colon = rawLine.indexOf(':')
    if (colon === -1) continue
    const key = rawLine.slice(0, colon).trim()
    const value = rawLine.slice(colon + 1).trim()
    currentKey = key

    if (!value) {
      fm[key] = []
    } else if (value.startsWith('[') && value.endsWith(']')) {
      fm[key] = value.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean)
    } else {
      fm[key] = value.replace(/^["']|["']$/g, '')
    }
  }

  return { frontmatter: fm, body: match[2] }
}

const statusOrder = { live: 1, building: 2, paused: 3, archived: 4, idea: 5 }

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

function resolveAsset(path) {
  if (!path) return path
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) return path
  return BASE + path
}

export const projects = Object.entries(modules)
  .map(([path, raw]) => {
    const { frontmatter, body } = parseFrontmatter(raw)
    return {
      ...frontmatter,
      screenshot: resolveAsset(frontmatter.screenshot),
      bodyHtml: marked.parse(body),
      path
    }
  })
  .sort((a, b) => {
    const so = (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99)
    if (so !== 0) return so
    return (b.shippedAt || '').localeCompare(a.shippedAt || '')
  })

export function getProject(slug) {
  return projects.find(p => p.slug === slug)
}

export const STATUSES = {
  live:     { label: 'Live',     color: 'oklch(77% 0.17 145)' },
  building: { label: 'Building', color: 'oklch(77% 0.16 83)' },
  paused:   { label: 'Paused',   color: 'oklch(76% 0.14 202)' },
  archived: { label: 'Archived', color: 'oklch(65% 0.035 164)' },
  idea:     { label: 'Idea',     color: 'oklch(72% 0.13 318)' }
}
