import { api } from "~/trpc/react";

export interface AdminDashboardStats {
  totalUsers: number;
  activeProperties: number;
  revenue: number;
  systemHealth: number;
  pendingTasks: number;
  totalTenants: number;
  monthlyCashflow: number;
  occupancyRate: number;
}

export interface RecentActivity {
  id: string;
  type: string;
  message: string;
  time: string;
  icon: string;
  color: string;
  bgColor: string;
  status: 'success' | 'warning' | 'error';
}

export interface SystemStatus {
  database: 'online' | 'offline';
  apiServices: 'online' | 'offline';
  storage: number; // percentage used
}

export const useAdminDashboard = () => {
  // Get dashboard statistics
  const dashboardStats = api.dashboard.getSummaryStatistics.useQuery();
  
  // Get analytics data
  const analyticsData = api.analytics.all.useQuery({
    page: 1,
    pageSize: 10,
    sortBy: 'timestamp',
    sortOrder: 'desc'
  });

  // Get upcoming events
  const upcomingEvents = api.dashboard.getUpcomingEvents.useQuery({
    limit: 5
  });

  // Get user statistics
  const userStats = api.user.all.useQuery({
    page: 1,
    pageSize: 1000 // Get all users for counting
  });

  // Get property statistics
  const propertyStats = api.property.all.useQuery({
    page: 1,
    pageSize: 1000 // Get all properties for counting
  });

  // Get payment statistics
  const paymentStats = api.payment.all.useQuery({
    page: 1,
    pageSize: 1000 // Get all payments for calculating revenue
  });

  // Transform data for dashboard
  const transformedStats: AdminDashboardStats = {
    totalUsers: userStats.data?.total || 0,
    activeProperties: propertyStats.data?.total || 0,
    revenue: paymentStats.data?.payments?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0,
    systemHealth: 98.5, // Mock data for now
    pendingTasks: dashboardStats.data?.pendingTasks || 0,
    totalTenants: dashboardStats.data?.totalTenants || 0,
    monthlyCashflow: dashboardStats.data?.monthlyCashflow || 0,
    occupancyRate: dashboardStats.data?.occupancyRate || 0,
  };

  // Transform recent activities from analytics
  const recentActivities: RecentActivity[] = analyticsData.data?.analytics?.slice(0, 4).map((analytic, index) => ({
    id: analytic.id,
    type: analytic.type || 'activity',
    message: `${analytic.type} - ${analytic.entityType || 'item'}`,
    time: `${index + 1} minutes ago`,
    icon: getIconForType(analytic.type),
    color: getColorForType(analytic.type),
    bgColor: getBgColorForType(analytic.type),
    status: 'success' as const,
  })) || [];

  const systemStatus: SystemStatus = {
    database: 'online',
    apiServices: 'online',
    storage: 75, // Mock data
  };

  return {
    stats: transformedStats,
    recentActivities,
    upcomingEvents: upcomingEvents.data || [],
    systemStatus,
    isLoading: dashboardStats.isLoading || analyticsData.isLoading || upcomingEvents.isLoading || 
               userStats.isLoading || propertyStats.isLoading || paymentStats.isLoading,
  };
};

// Helper functions for icons and colors
function getIconForType(type: string | undefined): string {
  switch (type) {
    case 'USER_CREATED':
      return 'Users';
    case 'PROPERTY_CREATED':
      return 'Building2';
    case 'PAYMENT_RECEIVED':
      return 'CreditCard';
    case 'TASK_CREATED':
      return 'CheckSquare';
    default:
      return 'Activity';
  }
}

function getColorForType(type: string | undefined): string {
  switch (type) {
    case 'USER_CREATED':
      return 'text-blue-500';
    case 'PROPERTY_CREATED':
      return 'text-green-500';
    case 'PAYMENT_RECEIVED':
      return 'text-purple-500';
    case 'TASK_CREATED':
      return 'text-orange-500';
    default:
      return 'text-gray-500';
  }
}

function getBgColorForType(type: string | undefined): string {
  switch (type) {
    case 'USER_CREATED':
      return 'bg-blue-100';
    case 'PROPERTY_CREATED':
      return 'bg-green-100';
    case 'PAYMENT_RECEIVED':
      return 'bg-purple-100';
    case 'TASK_CREATED':
      return 'bg-orange-100';
    default:
      return 'bg-gray-100';
  }
}

// Admin section management functions
export const useAdminSections = () => {
  // Get users
  const users = api.user.all.useQuery({
    page: 1,
    pageSize: 50
  });

  // Get properties
  const properties = api.property.all.useQuery({
    page: 1,
    pageSize: 50
  });

  // Get agents
  const agents = api.agent.all.useQuery({
    page: 1,
    pageSize: 50
  });

  // Get agencies
  const agencies = api.agency.all.useQuery({
    page: 1,
    pageSize: 50
  });

  // Get tenants
  const tenants = api.tenant.all.useQuery({
    page: 1,
    pageSize: 50
  });

  // Get payments
  const payments = api.payment.all.useQuery({
    page: 1,
    pageSize: 50
  });

  // Get tasks
  const tasks = api.task.all.useQuery({
    page: 1,
    pageSize: 50
  });

  // Get facilities
  const facilities = api.facility.all.useQuery({
    page: 1,
    pageSize: 50
  });

  // Get providers
  const providers = api.provider.all.useQuery({
    page: 1,
    pageSize: 50
  });

  // Get subscriptions
  const subscriptions = api.subscription.all.useQuery({
    page: 1,
    pageSize: 50
  });

  return {
    users: users.data?.users || [],
    properties: properties.data?.properties || [],
    agents: agents.data?.agents || [],
    agencies: agencies.data?.agencies || [],
    tenants: tenants.data?.tenants || [],
    payments: payments.data?.payments || [],
    tasks: tasks.data?.tasks || [],
    facilities: facilities.data?.facilities || [],
    providers: providers.data?.providers || [],
    subscriptions: subscriptions.data?.subscriptions || [],
    isLoading: users.isLoading || properties.isLoading || agents.isLoading || agencies.isLoading || 
               tenants.isLoading || payments.isLoading || tasks.isLoading || facilities.isLoading || 
               providers.isLoading || subscriptions.isLoading,
  };
};

// Quick actions
export const useAdminQuickActions = () => {
  const createUser = api.user.create.useMutation();
  const createProperty = api.property.create.useMutation();
  const createTask = api.task.create.useMutation();

  return {
    createUser,
    createProperty,
    createTask,
  };
}; 