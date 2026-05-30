import { fetchAgents } from '@/actions/agentsActions';
import AgentsPageClient from '@/components/Agents/AgentsPageClient';

const AgentsPage = async () => {
    const initialAgents = await fetchAgents();

    return <AgentsPageClient initialAgents={initialAgents} />;
};

export default AgentsPage;