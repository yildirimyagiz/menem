"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
    Activity,
    AlertCircle,
    BarChart3,
    CheckCircle,
    Plus,
    Settings,
    Shield,
    Users
} from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Avatar, AvatarFallback, AvatarImage } from "@reservatior/ui/avatar";
import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@reservatior/ui/card";
import { Input } from "@reservatior/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@reservatior/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@reservatior/ui/tabs";

import { toast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

import { AccountDataTable } from "./components/DataTable";

// Define SanitizedAccount type matching backend
export interface SanitizedAccount {
  id: string;
  userId: string;
  type: "OAUTH" | "EMAIL" | "OIDC" | "CREDENTIALS" | "GOOGLE" | "FACEBOOK";
  provider: string;
  providerAccountId: string;
  refresh_token?: string | null;
  access_token?: string | null;
  expires_at?: number | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  user: {
    id: string;
    name: string | null;
    email: string;
    phoneNumber: string | null;
    isActive: boolean;
    createdAt: string | Date;
    updatedAt: string | Date;
    deletedAt: string | Date | null;
    emailVerified: string | Date | null;
    image: string | null;
    role: string;
  } | null;
}

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  account?: SanitizedAccount | null;
  onSubmit: (account: Partial<SanitizedAccount>) => Promise<void>;
}

function AccountModal({ isOpen, onClose, account, onSubmit }: AccountModalProps) {
  const t = useTranslations("Admin");
  const [form, setForm] = React.useState<Partial<SanitizedAccount>>(() => ({
    userId: account?.userId ?? "",
    type: account?.type ?? "OAUTH",
    provider: account?.provider ?? "",
    providerAccountId: account?.providerAccountId ?? "",
    isActive: account?.isActive ?? true,
  }));

  React.useEffect(() => {
    setForm({
      userId: account?.userId ?? "",
      type: account?.type ?? "OAUTH",
      provider: account?.provider ?? "",
      providerAccountId: account?.providerAccountId ?? "",
      isActive: account?.isActive ?? true,
    });
  }, [account]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm((prev: Partial<SanitizedAccount>) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="accounts-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="accounts-modal-content"
            initial={{ scale: 0.95, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 40 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="accounts-modal-header">
              <div className="accounts-modal-icon">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="accounts-modal-title">
              {t(account ? "editAccount" : "addAccount", { defaultValue: account ? "Edit Account" : "Add Account" })}
            </h2>
                <p className="accounts-modal-description">
                  {t("accountModalDescription", { defaultValue: "Manage account settings and permissions" })}
                </p>
              </div>
            </div>
            
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void onSubmit(form);
              }}
              className="accounts-form"
            >
              <div className="accounts-form-grid">
                <div className="accounts-form-field">
                  <label htmlFor="userId" className="accounts-form-label">
                {t("userId", { defaultValue: "User ID" })}
              </label>
              <Input
                id="userId"
                name="userId"
                value={form.userId}
                onChange={handleChange}
                required
                    className="accounts-form-input"
                autoFocus
              />
                </div>
                <div className="accounts-form-field">
                  <label htmlFor="type" className="accounts-form-label">
                {t("type", { defaultValue: "Type" })}
              </label>
              <Select
                value={form.type}
                onValueChange={(value) =>
                  setForm((prev: Partial<SanitizedAccount>) => ({ ...prev, type: value as SanitizedAccount['type'] }))
                }
                name="type"
              >
                    <SelectTrigger className="accounts-form-input">
                  <SelectValue placeholder={t("selectType", { defaultValue: "Select type" })} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OAUTH">{t("oauth", { defaultValue: "OAuth" })}</SelectItem>
                  <SelectItem value="EMAIL">{t("email", { defaultValue: "Email" })}</SelectItem>
                  <SelectItem value="OIDC">{t("oidc", { defaultValue: "OIDC" })}</SelectItem>
                  <SelectItem value="CREDENTIALS">{t("credentials", { defaultValue: "Credentials" })}</SelectItem>
                  <SelectItem value="GOOGLE">{t("google", { defaultValue: "Google" })}</SelectItem>
                  <SelectItem value="FACEBOOK">{t("facebook", { defaultValue: "Facebook" })}</SelectItem>
                </SelectContent>
              </Select>
                </div>
              </div>
              
              <div className="accounts-form-field">
                <label htmlFor="provider" className="accounts-form-label">
                {t("provider", { defaultValue: "Provider" })}
              </label>
              <Input
                id="provider"
                name="provider"
                value={form.provider}
                onChange={handleChange}
                required
                  className="accounts-form-input"
                />
              </div>
              
              <div className="accounts-form-field">
                <label htmlFor="providerAccountId" className="accounts-form-label">
                {t("providerAccountId", { defaultValue: "Provider Account ID" })}
              </label>
              <Input
                id="providerAccountId"
                name="providerAccountId"
                value={form.providerAccountId}
                onChange={handleChange}
                required
                  className="accounts-form-input"
              />
              </div>
              
              <div className="accounts-form-checkbox">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  id="isActive"
                />
                <label htmlFor="isActive" className="accounts-form-label">
                  {t("active", { defaultValue: "Active" })}
                </label>
                <Badge variant={form.isActive ? "default" : "secondary"} className="ml-auto">
                  {form.isActive ? t("statusActive", { defaultValue: "Active" }) : t("statusInactive", { defaultValue: "Inactive" })}
                </Badge>
              </div>
              
              <div className="accounts-form-actions">
                <Button type="button" variant="outline" onClick={onClose} className="border-gray-200 dark:border-gray-700">
                  {t("cancel", { defaultValue: "Cancel" })}
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  {t(account ? "update" : "create", { defaultValue: account ? "Update" : "Create" })}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function AdminAccountPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [_dateRange, _setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });
  const t = useTranslations("Admin");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<SanitizedAccount | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Bulk operations state
  const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);
  const [settings, setSettings] = useState({
    passwordStrength: 'strong',
    twoFactorAuth: true,
    sessionTimeout: 30,
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    language: 'tr',
    timezone: 'UTC+3',
    theme: 'auto',
    dataRetention: 90
  });
  
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Fetch accounts data
  const {
    data: accounts,
    isPending,
    refetch,
  } = api.account.all.useQuery();

  // tRPC mutation hooks
  const deleteAccount = api.account.delete.useMutation();
  const updateAccount = api.account.update.useMutation();
  const createAccount = api.account.create.useMutation();

  // Filter out nulls and convert date fields to strings for type compatibility
  const accountArray: SanitizedAccount[] = (accounts?.data?.data ?? [])
    .filter((a): a is NonNullable<typeof a> => a !== null)
    .map((a) => ({
      ...a,
      isActive: !!a.isActive,
      createdAt:
        a.createdAt instanceof Date ? a.createdAt.toISOString() : a.createdAt,
      updatedAt:
        a.updatedAt instanceof Date ? a.updatedAt.toISOString() : a.updatedAt,
      user: a.user
        ? {
            ...a.user,
            isActive: !!a.user.isActive,
            createdAt:
              a.user.createdAt instanceof Date
                ? a.user.createdAt.toISOString()
                : a.user.createdAt,
            updatedAt:
              a.user.updatedAt instanceof Date
                ? a.user.updatedAt.toISOString()
                : a.user.updatedAt,
            deletedAt:
              a.user.deletedAt instanceof Date
                ? a.user.deletedAt.toISOString()
                : a.user.deletedAt,
            emailVerified:
              a.user.emailVerified instanceof Date
                ? a.user.emailVerified.toISOString()
                : a.user.emailVerified,
          }
        : null,
    }));

  const handleAdd = () => {
    setIsModalOpen(true);
    setSelectedAccount(null);
  };

  const handleEdit = (id: string) => {
    const account = accountArray.find((a) => a && a.id === id) ?? null;
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAccount.mutateAsync(id);
      toast({
        title: t("success", { defaultValue: "Success" }),
        description: t("accountDeletedSuccessfully", { defaultValue: "Account deleted successfully" }),
      });
      await refetch();
    } catch {
      toast({
        title: t("error", { defaultValue: "Error" }),
        description: t("failedToDeleteAccount", { defaultValue: "Failed to delete account" }),
        variant: "destructive",
      });
    }
  };

  // Bulk operations functions
  const handleBulkSelect = (accountId: string, selected: boolean) => {
    setSelectedAccounts(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(accountId);
      } else {
        newSet.delete(accountId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedAccounts(new Set(filteredAccounts.map(acc => acc.id)));
    } else {
      setSelectedAccounts(new Set());
    }
  };

  const handleBulkDelete = async () => {
    if (selectedAccounts.size === 0) return;
    
    setIsBulkDeleting(true);
    try {
      await Promise.all(
        Array.from(selectedAccounts).map(id => deleteAccount.mutateAsync(id))
      );
      toast({
        title: t("success", { defaultValue: "Success" }),
        description: t("bulkDeleteSuccess", { defaultValue: `${selectedAccounts.size} accounts deleted successfully` }),
      });
      setSelectedAccounts(new Set());
      await refetch();
    } catch {
      toast({
        title: t("error", { defaultValue: "Error" }),
        description: t("bulkDeleteError", { defaultValue: "Failed to delete accounts" }),
        variant: "destructive",
      });
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleBulkActivate = async (activate: boolean) => {
    if (selectedAccounts.size === 0) return;
    
    setIsBulkUpdating(true);
    try {
      await Promise.all(
        Array.from(selectedAccounts).map(id => {
          const account = accountArray.find(acc => acc.id === id);
          if (account) {
            return updateAccount.mutateAsync({
              ...account,
              isActive: activate,
            });
          }
        })
      );
      toast({
        title: t("success", { defaultValue: "Success" }),
        description: t("bulkUpdateSuccess", { defaultValue: `${selectedAccounts.size} accounts updated successfully` }),
      });
      setSelectedAccounts(new Set());
      await refetch();
    } catch {
      toast({
        title: t("error", { defaultValue: "Error" }),
        description: t("bulkUpdateError", { defaultValue: "Failed to update accounts" }),
        variant: "destructive",
      });
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSettings(prev => ({ ...prev }));
      toast({
        title: t("success", { defaultValue: "Success" }),
        description: t("settingsSaved", { defaultValue: "Settings saved successfully" }),
      });
    } catch {
      toast({
        title: t("error", { defaultValue: "Error" }),
        description: t("settingsError", { defaultValue: "Failed to save settings" }),
        variant: "destructive",
      });
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleExport = () => {
    setIsExporting(true);
    try {
      const csvData = [
        ['ID', 'User ID', 'Type', 'Provider', 'Provider Account ID', 'Active', 'Created At', 'User Email', 'User Name'],
        ...filteredAccounts.map(acc => [
          acc.id,
          acc.userId,
          acc.type,
          acc.provider,
          acc.providerAccountId,
          acc.isActive ? 'Yes' : 'No',
          acc.createdAt,
          acc.user?.email ?? '',
          acc.user?.name ?? '',
        ])
      ];
      
      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `accounts-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: t("success", { defaultValue: "Success" }),
        description: t("exportSuccess", { defaultValue: "Accounts exported successfully" }),
      });
    } catch {
      toast({
        title: t("error", { defaultValue: "Error" }),
        description: t("exportError", { defaultValue: "Failed to export accounts" }),
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleSubmit = async (data: Partial<SanitizedAccount>) => {
    try {
      if (selectedAccount) {
        const updateInput: Partial<SanitizedAccount> = {
          id: selectedAccount.id,
          userId: selectedAccount.userId,
          type: selectedAccount.type,
          provider: selectedAccount.provider,
          providerAccountId: selectedAccount.providerAccountId,
          ...data,
        };
        if (typeof selectedAccount.isActive === "boolean") {
          updateInput.isActive = selectedAccount.isActive;
        } else {
          delete updateInput.isActive;
        }
        delete updateInput.user;
        await updateAccount.mutateAsync(updateInput as SanitizedAccount);
        toast({
          title: t("success", { defaultValue: "Success" }),
          description: t("accountUpdatedSuccessfully", { defaultValue: "Account updated successfully" }),
        });
      } else {
        if (!data.userId || !data.type || !data.provider || !data.providerAccountId) {
          toast({
            title: t("error", { defaultValue: "Error" }),
            description: t("missingRequiredFields", { defaultValue: "Please fill in all required fields." }),
            variant: "destructive",
          });
          return;
        }
        const createInput: Partial<SanitizedAccount> = {
          userId: data.userId,
          type: data.type,
          provider: data.provider,
          providerAccountId: data.providerAccountId,
          ...data,
        };
        if (typeof data.isActive === "boolean") {
          createInput.isActive = data.isActive;
        } else {
          delete createInput.isActive;
        }
        delete createInput.user;
        await createAccount.mutateAsync(createInput as SanitizedAccount);
        toast({
          title: t("success", { defaultValue: "Success" }),
          description: t("accountCreatedSuccessfully", { defaultValue: "Account created successfully" }),
        });
      }
      setIsModalOpen(false);
      setSelectedAccount(null);
      await refetch();
    } catch {
      toast({
        title: t("error", { defaultValue: "Error" }),
        description: t("failedToSaveAccount", { defaultValue: "Failed to save account" }),
      });
    }
  };

  // Filter and search accounts
  const filteredAccounts = accountArray.filter(account => {
    // Search query filter
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || (
      (account.user?.name?.toLowerCase().includes(searchLower) ??
      (account.user?.email?.toLowerCase().includes(searchLower) ??
      account.provider?.toLowerCase().includes(searchLower))) ||
      account.type?.toLowerCase().includes(searchLower) ||
      account.providerAccountId?.toLowerCase().includes(searchLower) ||
      false
    );

    // Status filter
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && account.isActive) ||
      (statusFilter === "inactive" && !account.isActive);

    // Type filter
    const matchesType = typeFilter === "all" || account.type === typeFilter;

    // Date range filter
    const accountDate = new Date(account.createdAt);
    const matchesDateRange = !_dateRange.from && !_dateRange.to ||
      (!_dateRange.from || accountDate >= _dateRange.from) &&
      (!_dateRange.to || accountDate <= _dateRange.to);

    return matchesSearch && matchesStatus && matchesType && matchesDateRange;
  });

  // Calculate statistics
  const totalAccounts = accountArray.length;
  const activeAccounts = accountArray.filter(acc => acc.isActive).length;
  const inactiveAccounts = totalAccounts - activeAccounts;
  const verifiedAccounts = accountArray.filter(acc => acc.user?.emailVerified).length;
  const filteredAccountsCount = filteredAccounts.length;

  if (isPending && !accountArray.length) {
    return (
      <div className="accounts-loading">
        <div className="text-center">
          <div className="accounts-loading-spinner"></div>
          <p className="accounts-loading-text">{t('loadingAccounts', { defaultValue: 'Loading accounts...' })}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <div className="accounts-header">
          <div className="accounts-header-content">
            <div className="accounts-header-icon">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div className="accounts-header-text">
              <h1 className="accounts-header-title">
                {t('manageAccounts', { defaultValue: 'Manage Accounts' })}
              </h1>
              <p className="accounts-header-description">
                {t('accountsDescription', { defaultValue: 'Manage user accounts and authentication settings' })}
              </p>
            </div>
          </div>
          <Button 
            onClick={handleAdd}
            className="accounts-add-button"
          >
          <Plus className="mr-2 h-4 w-4" />
          {t('addAccount', { defaultValue: 'Add Account' })}
        </Button>
      </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="stats-card group"
          >
            <div className="stats-card-content">
              <div className="stats-card-text">
                <p className="stats-card-label">{t('totalAccounts', { defaultValue: 'Total Accounts' })}</p>
                <p className="stats-card-value text-gray-900 dark:text-white">{totalAccounts}</p>
              </div>
              <div className="stats-card-icon bg-gradient-to-br from-blue-500 to-cyan-500">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="stats-card group"
          >
            <div className="stats-card-content">
              <div className="stats-card-text">
                <p className="stats-card-label">{t('activeAccounts', { defaultValue: 'Active Accounts' })}</p>
                <p className="stats-card-value text-green-600">{activeAccounts}</p>
              </div>
              <div className="stats-card-icon bg-gradient-to-br from-green-500 to-emerald-500">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="stats-card group"
          >
            <div className="stats-card-content">
              <div className="stats-card-text">
                <p className="stats-card-label">{t('verifiedAccounts', { defaultValue: 'Verified Accounts' })}</p>
                <p className="stats-card-value text-blue-600">{verifiedAccounts}</p>
              </div>
              <div className="stats-card-icon bg-gradient-to-br from-blue-500 to-indigo-500">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="stats-card group"
          >
            <div className="stats-card-content">
              <div className="stats-card-text">
                <p className="stats-card-label">{t('inactiveAccounts', { defaultValue: 'Inactive Accounts' })}</p>
                <p className="stats-card-value text-orange-600">{inactiveAccounts}</p>
              </div>
              <div className="stats-card-icon bg-gradient-to-br from-orange-500 to-red-500">
                <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="accounts-tabs">
        <TabsList className="accounts-tabs-list">
          <TabsTrigger value="overview" className="accounts-tabs-trigger">
            <BarChart3 className="mr-2 h-4 w-4" />
            {t('overview', { defaultValue: 'Overview' })}
          </TabsTrigger>
          <TabsTrigger value="accounts" className="accounts-tabs-trigger">
            <Users className="mr-2 h-4 w-4" />
            {t('accounts', { defaultValue: 'Accounts' })}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="accounts-tabs-trigger">
            <Activity className="mr-2 h-4 w-4" />
            {t('analytics', { defaultValue: 'Analytics' })}
          </TabsTrigger>
          <TabsTrigger value="settings" className="accounts-tabs-trigger">
            <Settings className="mr-2 h-4 w-4" />
            {t('settings', { defaultValue: 'Settings' })}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="accounts-tabs-content">
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            <Card className="accounts-card">
              <CardHeader className="accounts-card-header">
                <CardTitle className="accounts-card-title">
                  <Activity className="h-5 w-5 text-blue-600" />
                  {t('recentActivity', { defaultValue: 'Recent Activity' })}
                </CardTitle>
                <CardDescription className="accounts-card-description">
                  {t('recentActivityDescription', { defaultValue: 'Latest account activities and changes' })}
          </CardDescription>
        </CardHeader>
              <CardContent className="accounts-card-content">
                <div className="space-y-3 sm:space-y-4">
                  {accountArray.slice(0, 5).map((account, index) => (
                    <motion.div
                      key={account.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="activity-item"
                    >
                      <Avatar className="activity-avatar">
                        <AvatarImage src={account.user?.image ?? undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                          {account.user?.name?.charAt(0) ?? 'A'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="activity-content">
                        <p className="activity-name">
                          {(account.user?.name ?? account.user?.email) ?? t('unknownUser', { defaultValue: 'Unknown User' })}
                        </p>
                        <p className="activity-details">
                          {account.provider} • {account.type}
                        </p>
                      </div>
                      <Badge variant={account.isActive ? "default" : "secondary"} className="activity-badge">
                        {account.isActive ? t('active', { defaultValue: 'Active' }) : t('inactive', { defaultValue: 'Inactive' })}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="accounts-card">
              <CardHeader className="accounts-card-header">
                <CardTitle className="accounts-card-title">
                  <Shield className="h-5 w-5 text-green-600" />
                  {t('securityOverview', { defaultValue: 'Security Overview' })}
                </CardTitle>
                <CardDescription className="accounts-card-description">
                  {t('securityOverviewDescription', { defaultValue: 'Account security and verification status' })}
                </CardDescription>
              </CardHeader>
              <CardContent className="accounts-card-content">
                <div className="space-y-3 sm:space-y-4">
                  <div className="security-item security-item-green">
                    <div className="security-item-content">
                      <CheckCircle className="security-item-icon text-green-600" />
                      <span className="security-item-label text-green-700 dark:text-green-300">
                        {t('verifiedAccounts', { defaultValue: 'Verified Accounts' })}
                      </span>
                    </div>
                    <span className="security-item-value text-green-600">{verifiedAccounts}</span>
                  </div>
                  
                  <div className="security-item security-item-blue">
                    <div className="security-item-content">
                      <Shield className="security-item-icon text-blue-600" />
                      <span className="security-item-label text-blue-700 dark:text-blue-300">
                        {t('activeAccounts', { defaultValue: 'Active Accounts' })}
                      </span>
                    </div>
                    <span className="security-item-value text-blue-600">{activeAccounts}</span>
                  </div>
                  
                  <div className="security-item security-item-orange">
                    <div className="security-item-content">
                      <AlertCircle className="security-item-icon text-orange-600" />
                      <span className="security-item-label text-orange-700 dark:text-orange-300">
                        {t('inactiveAccounts', { defaultValue: 'Inactive Accounts' })}
                      </span>
                    </div>
                    <span className="security-item-value text-orange-600">{inactiveAccounts}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="accounts" className="accounts-tabs-content">
          <Card className="accounts-card">
            <CardHeader className="accounts-card-header">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="accounts-card-title">
                    <Users className="h-5 w-5 text-blue-600" />
                    {t('accounts', { defaultValue: 'Accounts' })}
                  </CardTitle>
                  <CardDescription className="accounts-card-description">
                    {t('showingAccounts', { count: filteredAccountsCount, defaultValue: `Showing ${filteredAccountsCount} accounts` })}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleExport}
                    disabled={isExporting}
                    variant="outline"
                    size="sm"
                  >
                    {isExporting ? t('exporting', { defaultValue: 'Exporting...' }) : t('export', { defaultValue: 'Export' })}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="accounts-card-content">
              {/* Enhanced Search and Filters */}
              <div className="mb-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    placeholder={t('searchAccounts', { defaultValue: 'Search accounts...' })}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="md:col-span-2"
                  />
                  <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('filterByStatus', { defaultValue: 'Filter by status' })} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('allStatuses', { defaultValue: 'All Statuses' })}</SelectItem>
                      <SelectItem value="active">{t('active', { defaultValue: 'Active' })}</SelectItem>
                      <SelectItem value="inactive">{t('inactive', { defaultValue: 'Inactive' })}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={(value: string) => setTypeFilter(value as "all" | "OAUTH" | "EMAIL" | "GOOGLE" | "FACEBOOK")}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('filterByType', { defaultValue: 'Filter by type' })} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('allTypes', { defaultValue: 'All Types' })}</SelectItem>
                      <SelectItem value="OAUTH">{t('oauth', { defaultValue: 'OAuth' })}</SelectItem>
                      <SelectItem value="EMAIL">{t('email', { defaultValue: 'Email' })}</SelectItem>
                      <SelectItem value="GOOGLE">{t('google', { defaultValue: 'Google' })}</SelectItem>
                      <SelectItem value="FACEBOOK">{t('facebook', { defaultValue: 'Facebook' })}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Bulk Operations */}
                {selectedAccounts.size > 0 && (
                  <div className="flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      {t('selectedAccounts', { count: selectedAccounts.size, defaultValue: `${selectedAccounts.size} accounts selected` })}
                    </span>
                    <div className="flex items-center gap-2 ml-auto">
                      <Button
                        onClick={() => handleBulkActivate(true)}
                        disabled={isBulkUpdating}
                        variant="outline"
                        size="sm"
                      >
                        {t('activate', { defaultValue: 'Activate' })}
                      </Button>
                      <Button
                        onClick={() => handleBulkActivate(false)}
                        disabled={isBulkUpdating}
                        variant="outline"
                        size="sm"
                      >
                        {t('deactivate', { defaultValue: 'Deactivate' })}
                      </Button>
                      <Button
                        onClick={handleBulkDelete}
                        disabled={isBulkDeleting}
                        variant="destructive"
                        size="sm"
                      >
                        {isBulkDeleting ? t('deleting', { defaultValue: 'Deleting...' }) : t('delete', { defaultValue: 'Delete' })}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
        <AccountDataTable
                data={filteredAccounts}
                isLoading={isPending}
          onEdit={handleEdit}
          onDelete={handleDelete}
                selectedAccounts={selectedAccounts}
                onBulkSelect={handleBulkSelect}
                onSelectAll={handleSelectAll}
        />
            </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="analytics" className="accounts-tabs-content">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Account Growth Analytics */}
            <Card className="accounts-card">
              <CardHeader className="accounts-card-header">
                <CardTitle className="accounts-card-title">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  {t('accountGrowth', { defaultValue: 'Account Growth' })}
                </CardTitle>
                <CardDescription className="accounts-card-description">
                  {t('accountGrowthDescription', { defaultValue: 'Account growth trends over the last 30 days' })}
                </CardDescription>
              </CardHeader>
              <CardContent className="accounts-card-content">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { date: '1 Jan', accounts: 120, growth: 15 },
                        { date: '8 Jan', accounts: 135, growth: 12 },
                        { date: '15 Jan', accounts: 148, growth: 18 },
                        { date: '22 Jan', accounts: 165, growth: 20 },
                        { date: '29 Jan', accounts: totalAccounts, growth: Math.floor(totalAccounts * 0.15) }
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="accounts" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Account Types Distribution */}
            <Card className="accounts-card">
              <CardHeader className="accounts-card-header">
                <CardTitle className="accounts-card-title">
                  <Users className="h-5 w-5 text-purple-600" />
                  {t('accountTypes', { defaultValue: 'Account Types' })}
                </CardTitle>
                <CardDescription className="accounts-card-description">
                  {t('accountTypesDescription', { defaultValue: 'Distribution of different account types' })}
                </CardDescription>
              </CardHeader>
              <CardContent className="accounts-card-content">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'OAuth', value: Math.floor(totalAccounts * 0.4), color: '#3b82f6' },
                          { name: 'Email', value: Math.floor(totalAccounts * 0.3), color: '#10b981' },
                          { name: 'Google', value: Math.floor(totalAccounts * 0.2), color: '#8b5cf6' },
                          { name: 'Facebook', value: Math.floor(totalAccounts * 0.1), color: '#6366f1' }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
                        {[
                          { name: 'OAuth', value: Math.floor(totalAccounts * 0.4), color: '#3b82f6' },
                          { name: 'Email', value: Math.floor(totalAccounts * 0.3), color: '#10b981' },
                          { name: 'Google', value: Math.floor(totalAccounts * 0.2), color: '#8b5cf6' },
                          { name: 'Facebook', value: Math.floor(totalAccounts * 0.1), color: '#6366f1' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Provider Distribution */}
            <Card className="accounts-card">
              <CardHeader className="accounts-card-header">
                <CardTitle className="accounts-card-title">
                  <Shield className="h-5 w-5 text-orange-600" />
                  {t('providerDistribution', { defaultValue: 'Provider Distribution' })}
                </CardTitle>
                <CardDescription className="accounts-card-description">
                  {t('providerDistributionDescription', { defaultValue: 'Authentication provider distribution' })}
                </CardDescription>
              </CardHeader>
              <CardContent className="accounts-card-content">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { provider: 'Google', count: Math.floor(totalAccounts * 0.45) },
                        { provider: 'Facebook', count: Math.floor(totalAccounts * 0.25) },
                        { provider: 'Email', count: Math.floor(totalAccounts * 0.2) },
                        { provider: 'Custom', count: Math.floor(totalAccounts * 0.1) }
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="provider" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#f97316" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Account Performance Metrics */}
            <Card className="accounts-card">
              <CardHeader className="accounts-card-header">
                <CardTitle className="accounts-card-title">
                  <Activity className="h-5 w-5 text-indigo-600" />
                  {t('accountAnalytics', { defaultValue: 'Account Analytics' })}
                </CardTitle>
                <CardDescription className="accounts-card-description">
                  {t('accountAnalyticsDescription', { defaultValue: 'Account performance and usage statistics' })}
                </CardDescription>
              </CardHeader>
              <CardContent className="accounts-card-content">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                      <p className="text-lg font-bold text-indigo-600">{Math.round((verifiedAccounts / totalAccounts) * 100)}%</p>
                      <p className="text-xs text-indigo-600">{t('verifiedRate', { defaultValue: 'Verified Rate' })}</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-lg font-bold text-green-600">{Math.round((activeAccounts / totalAccounts) * 100)}%</p>
                      <p className="text-xs text-green-600">{t('activeRate', { defaultValue: 'Active Rate' })}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{t('averageSessionTime', { defaultValue: 'Avg Session Time' })}</span>
                      <span className="text-sm font-medium">24m</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{t('loginFrequency', { defaultValue: 'Login Frequency' })}</span>
                      <span className="text-sm font-medium">2.3/day</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="accounts-tabs-content">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Security Settings */}
            <Card className="accounts-card">
              <CardHeader className="accounts-card-header">
                <CardTitle className="accounts-card-title">
                  <Shield className="h-5 w-5 text-red-600" />
                  {t('securitySettings', { defaultValue: 'Security Settings' })}
                </CardTitle>
                <CardDescription className="accounts-card-description">
                  {t('securitySettingsDescription', { defaultValue: 'Account security and authentication settings' })}
                </CardDescription>
              </CardHeader>
              <CardContent className="accounts-card-content">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">{t('passwordStrength', { defaultValue: 'Password Strength' })}</span>
                    </div>
                    <Select value={settings.passwordStrength} onValueChange={(value) => setSettings(prev => ({ ...prev, passwordStrength: value }))}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weak">Weak</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="strong">Strong</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">{t('twoFactorAuth', { defaultValue: 'Two-Factor Auth' })}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.twoFactorAuth}
                      onChange={(e) => setSettings(prev => ({ ...prev, twoFactorAuth: e.target.checked }))}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Activity className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium">{t('sessionTimeout', { defaultValue: 'Session Timeout' })}</span>
                    </div>
                    <Select value={settings.sessionTimeout.toString()} onValueChange={(value) => setSettings(prev => ({ ...prev, sessionTimeout: parseInt(value) }))}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 min</SelectItem>
                        <SelectItem value="30">30 min</SelectItem>
                        <SelectItem value="60">60 min</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="accounts-card">
              <CardHeader className="accounts-card-header">
                <CardTitle className="accounts-card-title">
                  <Activity className="h-5 w-5 text-blue-600" />
                  {t('notificationSettings', { defaultValue: 'Notification Settings' })}
                </CardTitle>
                <CardDescription className="accounts-card-description">
                  {t('notificationSettingsDescription', { defaultValue: 'Account notifications and alert settings' })}
                </CardDescription>
              </CardHeader>
              <CardContent className="accounts-card-content">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Activity className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">{t('emailNotifications', { defaultValue: 'Email Notifications' })}</span>
                    </div>
                    <Badge variant="default" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Activity className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">{t('pushNotifications', { defaultValue: 'Push Notifications' })}</span>
                    </div>
                    <Badge variant="secondary">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Activity className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">{t('smsNotifications', { defaultValue: 'SMS Notifications' })}</span>
                    </div>
                    <Badge variant="outline">Disabled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Preferences */}
            <Card className="accounts-card">
              <CardHeader className="accounts-card-header">
                <CardTitle className="accounts-card-title">
                  <Settings className="h-5 w-5 text-purple-600" />
                  {t('accountPreferences', { defaultValue: 'Account Preferences' })}
                </CardTitle>
                <CardDescription className="accounts-card-description">
                  {t('accountPreferencesDescription', { defaultValue: 'Personalization and display settings' })}
                </CardDescription>
              </CardHeader>
              <CardContent className="accounts-card-content">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Settings className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">{t('languagePreference', { defaultValue: 'Language' })}</span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Turkish</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Settings className="h-4 w-4 text-indigo-600" />
                      <span className="text-sm font-medium">{t('timezonePreference', { defaultValue: 'Timezone' })}</span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">UTC+3</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Settings className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium">{t('themePreference', { defaultValue: 'Theme' })}</span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Auto</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Data Settings */}
            <Card className="accounts-card">
              <CardHeader className="accounts-card-header">
                <CardTitle className="accounts-card-title">
                  <Shield className="h-5 w-5 text-green-600" />
                  {t('privacySettings', { defaultValue: 'Privacy & Data' })}
                </CardTitle>
                <CardDescription className="accounts-card-description">
                  {t('privacySettingsDescription', { defaultValue: 'Privacy and data management settings' })}
                </CardDescription>
              </CardHeader>
              <CardContent className="accounts-card-content">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">{t('dataRetention', { defaultValue: 'Data Retention' })}</span>
                    </div>
                    <Select value={settings.dataRetention.toString()} onValueChange={(value) => setSettings(prev => ({ ...prev, dataRetention: parseInt(value) }))}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Activity className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">{t('exportData', { defaultValue: 'Export Data' })}</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleExport}>Export</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium">{t('deleteAccount', { defaultValue: 'Delete Account' })}</span>
                    </div>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Settings Actions */}
            <Card className="accounts-card">
              <CardHeader className="accounts-card-header">
                <CardTitle className="accounts-card-title">
                  <Settings className="h-5 w-5 text-blue-600" />
                  {t('settingsActions', { defaultValue: 'Settings Actions' })}
                </CardTitle>
                <CardDescription className="accounts-card-description">
                  {t('settingsActionsDescription', { defaultValue: 'Save or reset your settings' })}
                </CardDescription>
              </CardHeader>
              <CardContent className="accounts-card-content">
                <div className="flex items-center gap-4">
                  <Button 
                    onClick={handleSaveSettings}
                    disabled={isSavingSettings}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isSavingSettings ? t('saving', { defaultValue: 'Saving...' }) : t('saveSettings', { defaultValue: 'Save Settings' })}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setSettings({
                      passwordStrength: 'strong',
                      twoFactorAuth: true,
                      sessionTimeout: 30,
                      emailNotifications: true,
                      pushNotifications: true,
                      smsNotifications: false,
                      language: 'tr',
                      timezone: 'UTC+3',
                      theme: 'auto',
                      dataRetention: 90
                    })}
                  >
                    {t('resetSettings', { defaultValue: 'Reset to Default' })}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <AccountModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAccount(null);
        }}
        account={selectedAccount}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
