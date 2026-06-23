import { fetchAgents } from '@/actions/agentsActions';
import AgentsPageClient from '@/components/Agents/AgentsPageClient';

const AgentsPage = async () => {
    const { agents, total } = await fetchAgents();

    return <AgentsPageClient initialAgents={agents} initialTotal={total} />;
};

export default AgentsPage;
