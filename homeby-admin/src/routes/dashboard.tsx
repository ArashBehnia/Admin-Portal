import { createFileRoute } from '@tanstack/react-router'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
})

const data = [
  { name: 'Mon', active: 400 },
  { name: 'Tue', active: 300 },
  { name: 'Wed', active: 500 },
  { name: 'Thu', active: 200 },
  { name: 'Fri', active: 600 },
  { name: 'Sat', active: 700 },
  { name: 'Sun', active: 450 },
]

function RouteComponent() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text">Dashboard</h1>
      
      <div className="grid grid-cols-4 gap-4">
        {[
          { title: 'Agencies', val: '1,234' },
          { title: 'Applications', val: '45' },
          { title: 'Feed Failures', val: '0', ok: true },
          { title: 'MRR', val: '$45,000' }
        ].map(kpi => (
          <div key={kpi.title} className={`bg-card p-4 rounded-lg border ${kpi.ok ? 'border-success' : 'border-border'} shadow-sm`}>
            <div className="text-muted text-sm mb-1">{kpi.title}</div>
            <div className="text-2xl font-bold text-text">{kpi.val}</div>
          </div>
        ))}
      </div>

      <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
        <h2 className="text-lg font-medium text-text mb-4">User Activity (7d)</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E6EA" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#5A6068', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#5A6068', fontSize: 12}} />
              <Tooltip cursor={{fill: '#F7F8FA'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Bar dataKey="active" fill="#2563EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
