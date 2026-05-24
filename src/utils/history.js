// ─── localStorage key ─────────────────────────────────────────────────────────
const STORAGE_KEY = 'mockmate_history'

/**
 * Load all history records from localStorage.
 * @returns {AttemptRecord[]}
 */
export function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/**
 * Persist a new attempt record (prepended so newest is first).
 * @param {Omit<AttemptRecord, 'id' | 'createdAt'>} record
 * @returns {AttemptRecord} the saved record with id + createdAt
 */
export function saveAttempt(record) {
  const all = loadHistory()
  const entry = {
    ...record,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  all.unshift(entry)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  return entry
}

/**
 * Delete an attempt by id.
 * @param {string} id
 */
export function deleteAttempt(id) {
  const all = loadHistory().filter((r) => r.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}

/**
 * Compute summary stats from history.
 * @returns {{ total: number, avgScore: number, bestScore: number }}
 */
export function computeStats() {
  const all = loadHistory()
  if (all.length === 0) return { total: 0, avgScore: 0, bestScore: 0 }
  const scores = all.map((r) => r.score)
  return {
    total: all.length,
    avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    bestScore: Math.max(...scores),
  }
}
