import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { TaskLabel, TaskPriority, TaskStatus, TaskCategory } from '~/utils/types';

interface Task {
    id: string;
    cuid: string;
    title: string;
    slug: string;
    taskLabel: TaskLabel;
    priority: TaskPriority;
    taskStatus: TaskStatus;
    taskCategory: TaskCategory;
    propertyId: string;
    rentalPropertyId?: string;
    assignedToId: string;
    helpId?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

interface TaskStore {
    task: Task | null;
    tasks: Task[];
    isLoading: boolean;
    filters: {
        status?: TaskStatus;
        priority?: TaskPriority;
        category?: TaskCategory;
        label?: TaskLabel;
    };

    setTask: (task: Task) => void;
    updateTask: (task: Partial<Task>) => void;
    clearTask: () => void;
    setTasks: (tasks: Task[]) => void;
    addTask: (task: Task) => void;
    removeTask: (taskId: string) => void;
    setFilters: (filters: Partial<TaskStore['filters']>) => void;

    getFilteredTasks: () => Task[];
    getTasksByStatus: (status: TaskStatus) => Task[];
    getTasksByPriority: (priority: TaskPriority) => Task[];
    getTasksByCategory: (category: TaskCategory) => Task[];
    getTasksByProperty: (propertyId: string) => Task[];
    getTasksByAssignee: (assignedToId: string) => Task[];
    getOverdueTasks: () => Task[];
    getUpcomingTasks: () => Task[];
}

export const useTaskStore = create<TaskStore>()(
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
                if (filters.status && task.taskStatus !== filters.status) return false;
                if (filters.priority && task.priority !== filters.priority) return false;
                if (filters.category && task.taskCategory !== filters.category) return false;
                if (filters.label && task.taskLabel !== filters.label) return false;
                return true;
            });
        },

        getTasksByStatus: (status) => {
            const { tasks } = get();
            return tasks.filter(t => t.taskStatus === status);
        },

        getTasksByPriority: (priority) => {
            const { tasks } = get();
            return tasks.filter(t => t.priority === priority);
        },

        getTasksByCategory: (category) => {
            const { tasks } = get();
            return tasks.filter(t => t.taskCategory === category);
        },

        getTasksByProperty: (propertyId) => {
            const { tasks } = get();
            return tasks.filter(t => t.propertyId === propertyId);
        },

        getTasksByAssignee: (assignedToId) => {
            const { tasks } = get();
            return tasks.filter(t => t.assignedToId === assignedToId);
        },

        getOverdueTasks: () => {
            const { tasks } = get();
            const now = new Date();
            return tasks.filter(t =>
                t.taskStatus !== 'Completed' &&
                new Date(t.updatedAt) < now
            );
        },

        getUpcomingTasks: () => {
            const { tasks } = get();
            const now = new Date();
            return tasks.filter(t =>
                t.taskStatus === 'New' &&
                new Date(t.createdAt) > now
            );
        }
    }))
); 