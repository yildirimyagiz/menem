"use client";

import type { FC } from "react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  DollarSign,
  FileText,
  Home,
  Settings,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

import type { ReportType } from "@reservatior/validators";
import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Card } from "@reservatior/ui/card";
import { Input } from "@reservatior/ui/input";
import { Label } from "@reservatior/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reservatior/ui/select";
import { Textarea } from "@reservatior/ui/textarea";

export interface ReportConfig {
  title: string;
  reportType: ReportType;
  startDate: Date;
  endDate: Date;
  description: string;
  filters: {
    agencyId?: string;
    facilityId?: string;
    propertyId?: string;
    tenantId?: string;
    agentId?: string;
  };
}

interface EnhancedReportGeneratorProps {
  onGenerate: (config: ReportConfig) => void;
  isLoading?: boolean;
}

const reportTypes = [
  {
    type: "FINANCIAL" as ReportType,
    title: "Financial Report",
    description: "Revenue, expenses, and financial performance",
    icon: DollarSign,
    color: "from-green-500 to-emerald-500",
    features: [
      "Revenue tracking",
      "Expense analysis",
      "Profit margins",
      "Cash flow",
    ],
  },
  {
    type: "PERFORMANCE" as ReportType,
    title: "Performance Report",
    description: "Operational metrics and efficiency analysis",
    icon: TrendingUp,
    color: "from-blue-500 to-cyan-500",
    features: [
      "Occupancy rates",
      "Booking trends",
      "Customer satisfaction",
      "Efficiency metrics",
    ],
  },
  {
    type: "REVENUE" as ReportType,
    title: "Revenue Report",
    description: "Detailed revenue analysis and forecasting",
    icon: BarChart3,
    color: "from-purple-500 to-pink-500",
    features: [
      "Revenue streams",
      "Growth analysis",
      "Forecasting",
      "Market trends",
    ],
  },
  {
    type: "OCCUPANCY" as ReportType,
    title: "Occupancy Report",
    description: "Property occupancy and utilization metrics",
    icon: Home,
    color: "from-orange-500 to-red-500",
    features: [
      "Occupancy rates",
      "Utilization metrics",
      "Availability trends",
      "Capacity planning",
    ],
  },
  {
    type: "MARKET_ANALYSIS" as ReportType,
    title: "Market Analysis",
    description: "Market trends and competitive analysis",
    icon: Target,
    color: "from-indigo-500 to-purple-500",
    features: [
      "Market trends",
      "Competitive analysis",
      "Pricing insights",
      "Demand forecasting",
    ],
  },
  {
    type: "COMPLIANCE" as ReportType,
    title: "Compliance Report",
    description: "Regulatory compliance and audit reports",
    icon: Settings,
    color: "from-gray-500 to-slate-500",
    features: [
      "Regulatory compliance",
      "Audit trails",
      "Risk assessment",
      "Policy adherence",
    ],
  },
];

const EnhancedReportGenerator: FC<EnhancedReportGeneratorProps> = ({
  onGenerate,
  isLoading = false,
}) => {
  const [selectedType, setSelectedType] = useState<ReportType | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    agencyId: "",
    facilityId: "",
    propertyId: "",
    tenantId: "",
    agentId: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;

    const config: ReportConfig = {
      title:
        formData.title ||
        `${reportTypes.find((r) => r.type === selectedType)?.title} - ${new Date().toLocaleDateString()}`,
      reportType: selectedType,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      description: formData.description,
      filters: {
        agencyId: formData.agencyId || undefined,
        facilityId: formData.facilityId || undefined,
        propertyId: formData.propertyId || undefined,
        tenantId: formData.tenantId || undefined,
        agentId: formData.agentId || undefined,
      },
    };

    onGenerate(config);
  };

  const selectedReportType = reportTypes.find((r) => r.type === selectedType);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white shadow-2xl"
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10">
          <div className="flex items-center space-x-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <Sparkles className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Generate Report</h2>
              <p className="mt-2 text-blue-100">
                Create comprehensive reports with intelligent insights and
                analytics
              </p>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute right-4 top-4 h-20 w-20 rounded-full bg-white/10 backdrop-blur-sm" />
        <div className="absolute bottom-4 left-4 h-16 w-16 rounded-full bg-white/5 backdrop-blur-sm" />
      </motion.div>

      {/* Report Type Selection */}
      <Card className="overflow-hidden border-0 bg-white shadow-xl">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Choose Report Type
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Select the type of report you want to generate
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reportTypes.map((reportType, index) => (
              <motion.div
                key={reportType.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`cursor-pointer overflow-hidden border-2 transition-all duration-300 ${
                    selectedType === reportType.type
                      ? "border-blue-500 bg-blue-50 shadow-lg"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                  }`}
                  onClick={() => setSelectedType(reportType.type)}
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r ${reportType.color} text-white`}
                      >
                        <reportType.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {reportType.title}
                        </h4>
                        <p className="mt-1 text-sm text-gray-600">
                          {reportType.description}
                        </p>
                      </div>
                      {selectedType === reportType.type && (
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      )}
                    </div>

                    <div className="mt-4">
                      <div className="flex flex-wrap gap-1">
                        {reportType.features.map((feature, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="border-gray-200 text-xs"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>

      {/* Report Configuration */}
      <AnimatePresence>
        {selectedType && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden border-0 bg-white shadow-xl">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                <div className="flex items-center space-x-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm`}
                  >
                    {selectedReportType?.icon && (
                      <selectedReportType.icon className="h-6 w-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      Configure {selectedReportType?.title}
                    </h3>
                    <p className="mt-1 text-blue-100">
                      Set up your report parameters and filters
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-medium">
                        Report Title
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder={`${selectedReportType?.title} - ${new Date().toLocaleDateString()}`}
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="description"
                        className="text-sm font-medium"
                      >
                        Description
                      </Label>
                      <Input
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        placeholder="Brief description of the report"
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Date Range */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="startDate"
                        className="text-sm font-medium"
                      >
                        Start Date
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            startDate: e.target.value,
                          })
                        }
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate" className="text-sm font-medium">
                        End Date
                      </Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) =>
                          setFormData({ ...formData, endDate: e.target.value })
                        }
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Advanced Filters Toggle */}
                  <div className="flex items-center space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="border-gray-300 hover:bg-gray-50"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      {showAdvanced ? "Hide" : "Show"} Advanced Filters
                      <ChevronRight
                        className={`ml-2 h-4 w-4 transition-transform ${showAdvanced ? "rotate-90" : ""}`}
                      />
                    </Button>
                  </div>

                  {/* Advanced Filters */}
                  <AnimatePresence>
                    {showAdvanced && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-6 rounded-lg bg-gray-50 p-6"
                      >
                        <h4 className="font-semibold text-gray-900">
                          Advanced Filters
                        </h4>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                          <div className="space-y-2">
                            <Label
                              htmlFor="agencyId"
                              className="text-sm font-medium"
                            >
                              Agency ID
                            </Label>
                            <Input
                              id="agencyId"
                              value={formData.agencyId}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  agencyId: e.target.value,
                                })
                              }
                              placeholder="Filter by agency"
                              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="propertyId"
                              className="text-sm font-medium"
                            >
                              Property ID
                            </Label>
                            <Input
                              id="propertyId"
                              value={formData.propertyId}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  propertyId: e.target.value,
                                })
                              }
                              placeholder="Filter by property"
                              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="agentId"
                              className="text-sm font-medium"
                            >
                              Agent ID
                            </Label>
                            <Input
                              id="agentId"
                              value={formData.agentId}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  agentId: e.target.value,
                                })
                              }
                              placeholder="Filter by agent"
                              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Generate Button */}
                  <div className="flex justify-end space-x-3 border-t border-gray-200 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setSelectedType(null);
                        setFormData({
                          title: "",
                          description: "",
                          startDate: "",
                          endDate: "",
                          agencyId: "",
                          facilityId: "",
                          propertyId: "",
                          tenantId: "",
                          agentId: "",
                        });
                      }}
                      className="border-gray-300 hover:bg-gray-50"
                    >
                      Reset
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading || !selectedType}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 h-4 w-4" />
                          Generate Report
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedReportGenerator;
