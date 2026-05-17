import { createFileRoute } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/email-templates/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams() as { id: string }

  return (
    <div className="space-y-6">
      <Link to="/email-templates" className="inline-flex items-center gap-2 text-muted hover:text-text text-sm font-medium transition-colors">
        <ArrowLeft size={16} /> Back to Templates
      </Link>
      
      <div className="bg-card border border-border rounded-lg shadow-sm p-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text mb-1">Template: {id}</h1>
          <p className="text-muted text-sm">Edit the email template variables and body below.</p>
        </div>
        <button className="px-4 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
          Save Changes
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-text mb-1">Subject</label>
          <input type="text" defaultValue="Welcome to HomeBy Admin!" className="w-full border border-border rounded-md px-3 h-form" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-text mb-1">Body</label>
          <textarea defaultValue="Hello {{agency_name}},\n\nWelcome to HomeBy! Here are your temporary credentials:\n\nPassword: {{temp_password}}\n\nPlease login and change it." className="w-full border border-border rounded-md p-3 h-64 font-mono text-sm" />
        </div>
        <div>
          <p className="text-sm font-medium text-text mb-2">Available Variables:</p>
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-page border border-border rounded text-xs font-mono cursor-pointer hover:bg-gray-200">{"{{agency_name}}"}</span>
            <span className="px-2 py-1 bg-page border border-border rounded text-xs font-mono cursor-pointer hover:bg-gray-200">{"{{temp_password}}"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
