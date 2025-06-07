import { WorkFlowStatus } from '~/utils/types';
import { create } from 'zustand';
import type { TaskType } from '~/utils/types';
import { devtools } from 'zustand/middleware';



interface WorkflowTask {
    id: string;
    workflowId: string;
    name: string;
    type: TaskType;
    status: WorkFlowStatus;
    metadata?: Record<string, unknown>;
    assignedTo?: string;
    retryCount: number;
    startedAt?: Date;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

interface WorkflowTaskStore {
    task: WorkflowTask | null;
    tasks: WorkflowTask[];
    isLoading: boolean;
    filters: {
        status?: WorkFlowStatus;
        type?: TaskType;
        workflowId?: string;
        assignedTo?: string;
    };

    setTask: (task: WorkflowTask) => void;
    updateTask: (task: Partial<WorkflowTask>) => void;
    clearTask: () => void;
    setTasks: (tasks: WorkflowTask[]) => void;
    addTask: (task: WorkflowTask) => void;
    removeTask: (taskId: string) => void;
    setFilters: (filters: Partial<WorkflowTaskStore['filters']>) => void;

    getFilteredTasks: () => WorkflowTask[];
    getTasksByWorkflow: (workflowId: string) => WorkflowTask[];
    getTasksByAssignee: (userId: string) => WorkflowTask[];
    getPendingTasks: () => WorkflowTask[];
    getCompletedTasks: () => WorkflowTask[];
    getFailedTasks: () => WorkflowTask[];
    getTasksNeedingRetry: () => WorkflowTask[];
}

export const useWorkflowTaskStore = create<WorkflowTaskStore>()(
    devtools((set, get) => ({
        task: null,
        tasks: [],
        isLoading: false,
        filters: {},

        setTask: (task) => set({ task }),
        updateTask: (taskUpdate) => set((state) => ({
            task: state.task ? { ...state.task, ...taskUpdate } : null,
            tasks: state.tasks.map(t =>
                t.id === state.task?.id ? { ...t, ...taskUpdate } : t
            )
        })),
        clearTask: () => set({ task: null }),

        setTasks: (tasks) => set({ tasks }),
        addTask: (task) => set((state) => ({
            tasks: [...state.tasks, task]
        })),
        removeTask: (taskId) => set((state) => ({
            tasks: state.tasks.filter(t => t.id !== taskId)
        })),

        setFilters: (newFilters) => set((state) => ({
            filters: { ...state.filters, ...newFilters }
        })),

        getFilteredTasks: () => {
            const { tasks, filters } = get();
            return tasks.filter(task => {
                if (filters.status && task.status !== filters.status) return false;
                if (filters.type && task.type !== filters.type) return false;
                if (filters.workflowId && task.workflowId !== filters.workflowId) return false;
                if (filters.assignedTo && task.assignedTo !== filters.assignedTo) return false;
                return true;
            });
        },

        getTasksByWorkflow: (workflowId) => {
            const { tasks } = get();
            return tasks.filter(t => t.workflowId === workflowId);
        },

        getTasksByAssignee: (userId) => {
            const { tasks } = get();
            return tasks.filter(t => t.assignedTo === userId);
        },

        getPendingTasks: () => {
            const { tasks } = get();
            return tasks.filter(t => t.status === WorkFlowStatus.Waiting);
        },

        getCompletedTasks: () => {
            const { tasks } = get();
            return tasks.filter(t => t.status === WorkFlowStatus.Completed);
        },

        getFailedTasks: () => {
            const { tasks } = get();
            return tasks.filter(t => t.status === WorkFlowStatus.Failed);
        },


        getTasksNeedingRetry: () => {
            const { tasks } = get();
            return tasks.filter(t =>
                t.status === 'Failed' &&
                t.retryCount < 3
            );
        }
    }))
); 