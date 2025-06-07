export const QUERY_KEYS = {
  tasks: {
    all: ['task.all'] as const,
    byId: (id: string) => ['task', id] as const,
  },
  users: {
    all: ['user.all'] as const
  },
  properties: {
    all: ['property.all'] as const
  }
} as const;
