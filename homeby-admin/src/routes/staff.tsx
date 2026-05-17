import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/staff')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Staff & Roles</h1>
        <button className="bg-accent text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-blue-700 transition-colors">
          Add Staff Member
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm">
        <div className="p-0">
          <table className="w-full text-left border-collapse text-table">
            <thead>
              <tr className="border-b border-border text-muted">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border hover:bg-page transition-colors h-row">
                <td className="px-4 py-3">
                  <div className="font-medium text-text">Arash Behnia</div>
                  <div className="text-muted text-meta">arash@homeby.com.au</div>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded bg-blue-50 text-accent text-xs font-medium">Superadmin</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-accent hover:underline text-sm font-medium">Manage</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
