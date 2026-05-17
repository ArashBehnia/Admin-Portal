import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/integrations')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Integrations & Feed Operations</h1>
      </div>
      
      <div className="bg-card border border-border rounded-lg shadow-sm">
        <div className="flex border-b border-border">
          <button className="px-6 py-3 text-accent border-b-2 border-accent font-medium">Inbound Feeds</button>
          <button className="px-6 py-3 text-muted hover:text-text font-medium">Distribution</button>
        </div>
        <div className="p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-muted text-sm">
                <th className="pb-3 font-medium">Agency Name</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Last Sync</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border hover:bg-page transition-colors h-row">
                <td className="py-3 text-text">Century 21</td>
                <td className="py-3">
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-success">
                    <span className="w-1.5 h-1.5 rounded-full bg-success"></span> Healthy
                  </span>
                </td>
                <td className="py-3 text-muted text-sm">2 mins ago</td>
                <td className="py-3 text-right">
                  <button className="text-accent hover:underline text-sm font-medium">View Detail</button>
                </td>
              </tr>
              <tr className="border-b border-border hover:bg-page transition-colors h-row border-l-2 border-l-danger">
                <td className="py-3 text-text pl-3">Ray White</td>
                <td className="py-3">
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-danger">
                    <span className="w-1.5 h-1.5 rounded-full bg-danger"></span> Failing
                  </span>
                </td>
                <td className="py-3 text-muted text-sm">2 days ago</td>
                <td className="py-3 text-right">
                  <button className="text-accent hover:underline text-sm font-medium">View Detail</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
