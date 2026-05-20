import React from 'react'

const mock = [
  { id: 1, name: 'Samira Khan', role: 'Frontend Engineer', date: '2026-05-18', duration: '45m', score: 86, status: 'Hired' },
  { id: 2, name: 'Jordan Lee', role: 'Data Scientist', date: '2026-05-17', duration: '50m', score: 74, status: 'Follow-up' },
  { id: 3, name: 'Alex Park', role: 'Backend Engineer', date: '2026-05-15', duration: '40m', score: 92, status: 'Hired' },
  { id: 4, name: 'Priya Singh', role: 'ML Engineer', date: '2026-05-14', duration: '60m', score: 68, status: 'Rejected' }
]

function StatusPill({ status }) {
  const map = {
    Hired: 'bg-green-100 text-green-800 dark:bg-green-900/30',
    'Follow-up': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30',
    Rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30'
  }
  return <span className={`px-2 py-1 rounded-full text-xs ${map[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>
}

export default function RecentInterviewsTable({ items = mock }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium">Recent Interviews</h3>
        <div className="text-sm text-gray-500">Showing latest 10</div>
      </div>
      <div className="overflow-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-gray-500 dark:text-gray-300">
              <th className="py-2 pr-4">Candidate</th>
              <th className="py-2 pr-4">Role</th>
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Duration</th>
              <th className="py-2 pr-4">Score</th>
              <th className="py-2 pr-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {items.map((it) => (
              <tr key={it.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <td className="py-3 pr-4">
                  <div className="font-medium">{it.name}</div>
                </td>
                <td className="py-3 pr-4 text-gray-500 dark:text-gray-300">{it.role}</td>
                <td className="py-3 pr-4 text-gray-500 dark:text-gray-300">{it.date}</td>
                <td className="py-3 pr-4 text-gray-500 dark:text-gray-300">{it.duration}</td>
                <td className="py-3 pr-4">
                  <div className="font-mono text-sm">{it.score}%</div>
                </td>
                <td className="py-3 pr-4">
                  <StatusPill status={it.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
