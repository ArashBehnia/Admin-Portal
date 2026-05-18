import { createFileRoute } from "@tanstack/react-router";

const RouteComponent = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-text">
                    Agents Directory
                </h1>
            </div>

            <div className="bg-card border border-border rounded-lg shadow-sm">
                <div className="p-4 border-b border-border flex justify-between items-center bg-page/50">
                    <input
                        type="text"
                        placeholder="Search by name, email, or agency..."
                        className="border border-border rounded-md px-3 py-1.5 text-sm w-80"
                    />
                </div>
                <div className="p-0">
                    <table className="w-full text-left border-collapse text-table">
                        <thead>
                            <tr className="border-b border-border text-muted">
                                <th className="px-4 py-3 font-medium">Agent</th>
                                <th className="px-4 py-3 font-medium">
                                    Agency
                                </th>
                                <th className="px-4 py-3 font-medium">Role</th>
                                <th className="px-4 py-3 font-medium text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-border hover:bg-page transition-colors h-row">
                                <td className="px-4 py-3">
                                    <div className="font-medium text-text">
                                        John Doe
                                    </div>
                                    <div className="text-muted text-meta">
                                        john@example.com
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-text">
                                    LJ Hooker
                                </td>
                                <td className="px-4 py-3 text-muted">
                                    Principal
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button className="text-accent hover:underline text-sm font-medium">
                                        Manage
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export const Route = createFileRoute("/agents")({
    component: RouteComponent,
});
