import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/email-templates/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Email Templates</h1>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm">
        <div className="p-0">
          <table className="w-full text-left border-collapse text-table">
            <thead>
              <tr className="border-b border-border text-muted">
                <th className="px-4 py-3 font-medium">Template Name</th>
                <th className="px-4 py-3 font-medium">Subject</th>
                <th className="px-4 py-3 font-medium">Category</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border hover:bg-page transition-colors h-row cursor-pointer">
                <td className="px-4 py-3 font-medium text-text">
                  <Link to="/email-templates/$id" params={{ id: 'welcome-agency' }} className="hover:text-accent">Welcome Agency</Link>
                </td>
                <td className="px-4 py-3 text-muted">Welcome to HomeBy Admin!</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded bg-blue-50 text-accent text-xs font-medium">Onboarding</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
