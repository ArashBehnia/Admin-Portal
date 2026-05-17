import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/applications')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Applications Queue</h1>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm">
        <div className="flex border-b border-border">
          <button className="px-6 py-3 text-accent border-b-2 border-accent font-medium flex items-center gap-2">
            Pending <span className="bg-warning text-white text-xs px-2 py-0.5 rounded-full">3</span>
          </button>
          <button className="px-6 py-3 text-muted hover:text-text font-medium">Approved</button>
          <button className="px-6 py-3 text-muted hover:text-text font-medium">Rejected</button>
          <button className="px-6 py-3 text-muted hover:text-text font-medium">All</button>
        </div>
        <div className="p-0">
          <table className="w-full text-left border-collapse text-table">
            <thead>
              <tr className="border-b border-border text-muted">
                <th className="px-4 py-3 font-medium">Applicant</th>
                <th className="px-4 py-3 font-medium">Agency</th>
                <th className="px-4 py-3 font-medium">Submitted</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border hover:bg-page transition-colors h-row cursor-pointer">
                <td className="px-4 py-3">
                  <div className="font-medium text-text">Sarah Smith</div>
                  <div className="text-muted text-meta">sarah@example.com</div>
                </td>
                <td className="px-4 py-3 text-text">Century 21</td>
                <td className="px-4 py-3 text-muted">1 hour ago</td>
                <td className="px-4 py-3 text-right">
                  <button className="text-accent hover:underline text-sm font-medium">Review</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
