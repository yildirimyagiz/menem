import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { WorkFlowStatus } from '~/utils/types';

interface Workflow {
    id: string;
    name: string;
    description?: string;
    status: WorkFlowStatus;
    metadata?: Record<string, unknown>;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

interface WorkflowStore {
    workflow: Workflow | null;
    workflows: Workflow[];
    isLoading: boolean;

    setWorkflow: (workflow: Workflow) => void;
    updateWorkflow: (workflow: Partial<Workflow>) => void;
    clearWorkflow: () => void;
    setWorkflows: (workflows: Workflow[]) => void;
    addWorkflow: (workflow: Workflow) => void;
    removeWorkflow: (workflowId: string) => void;

    getWorkflowsByStatus: (status: WorkFlowStatus) => Workflow[];
    getWorkflowsByUser: (userId: string) => Workflow[];
    getActiveWorkflows: () => Workflow[];
    searchWorkflows: (query: string) => Workflow[];
}

export const useWorkflowStore = create<WorkflowStore>()(
    devtools((set, get) => ({
        workflow: null,
        workflows: [],
        isLoading: false,

        setWorkflow: (workflow) => set({ workflow }),
        updateWorkflow: (workflowUpdate) => set((state) => ({
            workflow: state.workflow ? { ...state.workflow, ...workflowUpdate } : null,
            workflows: state.workflows.map(w =>
                w.id === state.workflow?.id ? { ...w, ...workflowUpdate } : w
            )
        })),
        clearWorkflow: () => set({ workflow: null }),

        setWorkflows: (workflows) => set({ workflows }),
        addWorkflow: (workflow) => set((state) => ({
            workflows: [...state.workflows, workflow]
        })),
        removeWorkflow: (workflowId) => set((state) => ({
            workflows: state.workflows.filter(w => w.id !== workflowId)
        })),

        getWorkflowsByStatus: (status) => {
            const { workflows } = get();
            return workflows.filter(w => w.status === status);
        },

        getWorkflowsByUser: (userId) => {
            const { workflows } = get();
            return workflows.filter(w => w.userId === userId);
        },

        getActiveWorkflows: () => {
            const { workflows } = get();
            return workflows.filter(w => !w.deletedAt);
        },

        searchWorkflows: (query) => {
            const { workflows } = get();
            const searchTerm = query.toLowerCase();
            return workflows.filter(w =>
                w.name.toLowerCase().includes(searchTerm) ||
                w.description?.toLowerCase().includes(searchTerm)
            );
        }
    }))
); 