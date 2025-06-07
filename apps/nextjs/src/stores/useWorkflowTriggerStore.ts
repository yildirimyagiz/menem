import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { TriggerEvent } from '~/utils/types';

interface WorkflowTrigger {
    id: string;
    workflowId: string;
    userId: string;
    event: TriggerEvent;
    condition?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}

interface WorkflowTriggerStore {
    trigger: WorkflowTrigger | null;
    triggers: WorkflowTrigger[];
    isLoading: boolean;

    setTrigger: (trigger: WorkflowTrigger) => void;
    updateTrigger: (trigger: Partial<WorkflowTrigger>) => void;
    clearTrigger: () => void;
    setTriggers: (triggers: WorkflowTrigger[]) => void;
    addTrigger: (trigger: WorkflowTrigger) => void;
    removeTrigger: (triggerId: string) => void;

    getTriggersByWorkflow: (workflowId: string) => WorkflowTrigger[];
    getTriggersByEvent: (event: TriggerEvent) => WorkflowTrigger[];
    getTriggersByUser: (userId: string) => WorkflowTrigger[];
    evaluateTriggerCondition: (triggerId: string, context: Record<string, unknown>) => boolean;
}

export const useWorkflowTriggerStore = create<WorkflowTriggerStore>()(
    devtools((set, get) => ({
        trigger: null,
        triggers: [],
        isLoading: false,

        setTrigger: (trigger) => set({ trigger }),
        updateTrigger: (triggerUpdate) => set((state) => ({
            trigger: state.trigger ? { ...state.trigger, ...triggerUpdate } : null,
            triggers: state.triggers.map(t =>
                t.id === state.trigger?.id ? { ...t, ...triggerUpdate } : t
            )
        })),
        clearTrigger: () => set({ trigger: null }),

        setTriggers: (triggers) => set({ triggers }),
        addTrigger: (trigger) => set((state) => ({
            triggers: [...state.triggers, trigger]
        })),
        removeTrigger: (triggerId) => set((state) => ({
            triggers: state.triggers.filter(t => t.id !== triggerId)
        })),

        getTriggersByWorkflow: (workflowId) => {
            const { triggers } = get();
            return triggers.filter(t => t.workflowId === workflowId);
        },

        getTriggersByEvent: (event) => {
            const { triggers } = get();
            return triggers.filter(t => t.event === event);
        },

        getTriggersByUser: (userId) => {
            const { triggers } = get();
            return triggers.filter(t => t.userId === userId);
        },

        evaluateTriggerCondition: (triggerId, _context) => {
            const { triggers } = get();
            const trigger = triggers.find(t => t.id === triggerId);
            if (!trigger?.condition) return true;

            // Implement your condition evaluation logic here
            // This is a placeholder that always returns true
            return true;
        }
    }))
); 