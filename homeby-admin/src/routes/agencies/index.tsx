import { createFileRoute, Link } from '@tanstack/react-router'



const RouteComponent = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Agencies</h1>
        <button className="bg-accent text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-blue-700 transition-colors">
          Add Agency
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm">
        <div className="p-4 border-b border-border flex justify-between items-center bg-page/50">
          <input type="text" placeholder="Search agencies..." className="border border-border rounded-md px-3 py-1.5 text-sm w-64" />
          <div className="flex gap-2">
            <span className="px-3 py-1.5 bg-white border border-border rounded-full text-xs font-medium text-text">All Tiers</span>
            <span className="px-3 py-1.5 bg-white border border-border rounded-full text-xs font-medium text-text">Active</span>
          </div>
        </div>
        <div className="p-0">
          <table className="w-full text-left border-collapse text-table">
            <thead>
              <tr className="border-b border-border text-muted">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Tier</th>
                <th className="px-4 py-3 font-medium">Listings</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border hover:bg-page transition-colors h-row cursor-pointer">
                <td className="px-4 py-3 font-medium text-text">
                  <Link to="/agencies/$id" params={{ id: '1' }} className="hover:text-accent">LJ Hooker</Link>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded bg-green-50 text-success text-xs font-medium">Active</span>
                </td>
                <td className="px-4 py-3 text-muted">Enterprise</td>
                <td className="px-4 py-3 text-muted">142</td>
              </tr>
              <tr className="hover:bg-page transition-colors h-row cursor-pointer">
                <td className="px-4 py-3 font-medium text-text">
                  <Link to="/agencies/$id" params={{ id: '2' }} className="hover:text-accent">McGrath</Link>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded bg-amber-50 text-warning text-xs font-medium">Pending</span>
                </td>
                <td className="px-4 py-3 text-muted">Pro</td>
                <td className="px-4 py-3 text-muted">8</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/agencies/')({
  component: RouteComponent,
})
