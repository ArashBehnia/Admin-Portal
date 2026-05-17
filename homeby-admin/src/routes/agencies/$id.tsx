import { createFileRoute } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/agencies/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams() as { id: string }

  return (
    <div className="space-y-6">
      <Link to="/agencies" className="inline-flex items-center gap-2 text-muted hover:text-text text-sm font-medium transition-colors">
        <ArrowLeft size={16} /> Back to Agencies
      </Link>
      
      <div className="bg-card border border-border rounded-lg shadow-sm p-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-text">Agency {id} (Demo)</h1>
            <span className="px-2 py-1 rounded bg-green-50 text-success text-xs font-bold">LIVE</span>
          </div>
          <div className="text-muted text-sm flex gap-4">
            <span>Tier: Enterprise</span>
            <span>Joined: Jan 2026</span>
          </div>
        </div>
        <button className="px-4 py-2 border border-border rounded-md text-sm font-medium text-text hover:bg-page transition-colors">
          Actions
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm">
        <div className="flex border-b border-border">
          <button className="px-6 py-3 text-accent border-b-2 border-accent font-medium">Profile</button>
          <button className="px-6 py-3 text-muted hover:text-text font-medium">Agents (12)</button>
          <button className="px-6 py-3 text-muted hover:text-text font-medium">Listings (142)</button>
          <button className="px-6 py-3 text-muted hover:text-text font-medium ml-auto">Audit Log</button>
        </div>
        <div className="p-6">
          <p className="text-muted">Agency details content goes here...</p>
        </div>
      </div>
    </div>
  )
}
