import type { Agent } from '@reservatior/validators';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AgentStore {
    agent: Agent | null;
    agents: Agent[];
    isLoading: boolean;
    filters: {
        agencyId?: string;
        locationId?: string;
        language?: string;
    };

    setAgent: (agent: Agent) => void;
    updateAgent: (agent: Partial<Agent>) => void;
    clearAgent: () => void;
    setAgents: (agents: Agent[]) => void;
    addAgent: (agent: Agent) => void;
    removeAgent: (agentId: string) => void;
    setFilters: (filters: Partial<AgentStore['filters']>) => void;

    // Specialized queries
    getFilteredAgents: () => Agent[];
    getAgentsByAgency: (agencyId: string) => Agent[];
    getAgentsByLocation: (locationId: string) => Agent[];
    getAgentsByLanguage: (language: string) => Agent[];
    getActiveAgents: () => Agent[];
}

export const useAgentStore = create<AgentStore>()(
    devtools((set, get) => ({
        agent: null,
        agents: [],
        isLoading: false,
        filters: {},

        setAgent: (agent) => set({ agent }),
        updateAgent: (agentUpdate) => set((state) => ({
            agent: state.agent ? { ...state.agent, ...agentUpdate } : null,
            agents: state.agents.map(a =>
                a.id === state.agent?.id ? { ...a, ...agentUpdate } : a
            )
        })),
        clearAgent: () => set({ agent: null }),

        setAgents: (agents) => set({ agents }),
        addAgent: (agent) => set((state) => ({
            agents: [...state.agents, agent]
        })),
        removeAgent: (agentId) => set((state) => ({
            agents: state.agents.filter(a => a.id !== agentId)
        })),

        setFilters: (newFilters) => set((state) => ({
            filters: { ...state.filters, ...newFilters }
        })),

        getFilteredAgents: () => {
            const { agents, filters } = get();
            return agents.filter(agent => {
                if (filters.agencyId && agent.agencyId !== filters.agencyId) return false;
                if (filters.locationId && agent.Location?.id !== filters.locationId) return false;
                if (filters.language && !(agent.language ?? []).includes(filters.language)) return false;
                return true;
            });
        },

        getAgentsByAgency: (agencyId) => {
            const { agents } = get();
            return agents.filter(a => a.agencyId === agencyId);
        },

        getAgentsByLocation: (locationId) => {
            const { agents } = get();
            return agents.filter(a => a.locationId === locationId);
        },

        getAgentsByLanguage: (language) => {
            const { agents } = get();
            return agents.filter(a => (a.language ?? []).includes(language));
        },

        getActiveAgents: () => {
            const { agents } = get();
            return agents.filter(a => !a.deletedAt);
        },
    }))
); 