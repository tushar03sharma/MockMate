// storing interview history in localStorage
// no backend needed this way, keeps it simple

const STORAGE_KEY = 'mockmate_history'

export function loadHistory() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (e) {
    // shouldnt happen but just in case
    console.error('error loading history:', e)
    return []
  }
}

export function saveAttempt(record) {
  const history = loadHistory()
  const newEntry = {
    ...record,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  history.unshift(newEntry) // add to beginning so newest shows first
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  return newEntry
}

export function deleteAttempt(id) {
  const updated = loadHistory().filter((item) => item.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

// calculate some stats for the dashboard cards
export function computeStats() {
  const history = loadHistory()
  if (history.length === 0) return { total: 0, avgScore: 0, bestScore: 0 }

  const scores = history.map((r) => r.score)
  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  const best = Math.max(...scores)

  return {
    total: history.length,
    avgScore: avg,
    bestScore: best,
  }
}
