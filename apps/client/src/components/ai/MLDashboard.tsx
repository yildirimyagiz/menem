import React, { useEffect, useState } from "react";
import {
  Activity,
  BarChart3,
  Brain,
  Building2,
  Camera,
  Globe,
  Settings,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@reservatior/ui/tabs";

import type {
  BatchAnalysisResponse,
  MLAnalysisResponse,
} from "~/services/mlService";
import { mlApi, useMLHealthCheck } from "~/services/mlService";
import InsightsTab from "./InsightsTab";
import MLAnalysisUploader from "./MLAnalysisUploader";
import PropertyAnalysisCard from "./PropertyAnalysisCard";

interface MLDashboardProps {
  className?: string;
}

const MLDashboard: React.FC<MLDashboardProps> = ({ className = "" }) => {
  const [activeTab, setActiveTab] = useState("analysis");
  const [recentAnalyses, setRecentAnalyses] = useState<MLAnalysisResponse[]>(
    [],
  );
  const [mlStats, setMlStats] = useState({
    totalAnalyses: 0,
    averageConfidence: 0,
    topPropertyType: "",
    averagePrice: 0,
  });

  const {
    status,
    loading: healthLoading,
    error: healthError,
    checkHealth,
  } = useMLHealthCheck();

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  useEffect(() => {
    // Calculate ML stats from recent analyses
    if (recentAnalyses.length > 0) {
      const totalAnalyses = recentAnalyses.length;
      const averageConfidence =
        recentAnalyses.reduce(
          (sum, analysis) => sum + analysis.analysis.confidence_level,
          0,
        ) / totalAnalyses;

      const propertyTypes = recentAnalyses.map((a) => a.analysis.property_type);
      const topPropertyType =
        propertyTypes
          .sort(
            (a, b) =>
              propertyTypes.filter((v) => v === a).length -
              propertyTypes.filter((v) => v === b).length,
          )
          .pop() || "";

      const averagePrice =
        recentAnalyses.reduce(
          (sum, analysis) => sum + analysis.analysis.estimated_price,
          0,
        ) / totalAnalyses;

      setMlStats({
        totalAnalyses,
        averageConfidence,
        topPropertyType,
        averagePrice,
      });
    }
  }, [recentAnalyses]);

  const handleAnalysisComplete = (analysis: MLAnalysisResponse) => {
    setRecentAnalyses((prev) => [analysis, ...prev.slice(0, 9)]); // Keep last 10
  };

  const handleBatchAnalysisComplete = (analysis: BatchAnalysisResponse) => {
    setRecentAnalyses((prev) => [
      ...analysis.results,
      ...prev.slice(0, 10 - analysis.results.length),
    ]);
  };

  const sampleData = {
    propertyTypeData: [
      { name: "Apartments", value: 45 },
      { name: "Houses", value: 30 },
      { name: "Villas", value: 15 },
      { name: "Condos", value: 10 },
    ],
    occupancyTrendData: [
      { month: "Jan", occupancy: 85 },
      { month: "Feb", occupancy: 78 },
      { month: "Mar", occupancy: 92 },
      { month: "Apr", occupancy: 88 },
      { month: "May", occupancy: 95 },
      { month: "Jun", occupancy: 91 },
    ],
    locationDistributionData: [
      { location: "Downtown", count: 25 },
      { location: "Suburbs", count: 18 },
      { location: "Beach Area", count: 12 },
      { location: "Mountain View", count: 8 },
    ],
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center text-3xl font-bold">
            <Brain className="mr-3 h-8 w-8 text-blue-600" />
            AI Property Analysis
          </h1>
          <p className="mt-2 text-muted-foreground">
            Advanced machine learning analysis for property insights and
            valuation
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={status?.model_loaded ? "default" : "secondary"}>
            {status?.model_loaded ? "ML Ready" : "ML Loading"}
          </Badge>
          <Badge variant={status?.labels_loaded ? "default" : "secondary"}>
            {status?.labels_loaded ? "Labels Ready" : "Labels Loading"}
          </Badge>
        </div>
      </div>

      {/* ML Health Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5" />
            ML System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex items-center space-x-3">
              <div
                className={`h-3 w-3 rounded-full ${status?.model_loaded ? "bg-green-500" : "bg-red-500"}`}
              />
              <div>
                <p className="font-medium">Model Status</p>
                <p className="text-sm text-muted-foreground">
                  {status?.model_loaded ? "Loaded" : "Not Loaded"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div
                className={`h-3 w-3 rounded-full ${status?.labels_loaded ? "bg-green-500" : "bg-red-500"}`}
              />
              <div>
                <p className="font-medium">Labels Status</p>
                <p className="text-sm text-muted-foreground">
                  {status?.labels_loaded ? "Loaded" : "Not Loaded"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div
                className={`h-3 w-3 rounded-full ${!healthError ? "bg-green-500" : "bg-red-500"}`}
              />
              <div>
                <p className="font-medium">API Status</p>
                <p className="text-sm text-muted-foreground">
                  {!healthError ? "Connected" : "Disconnected"}
                </p>
              </div>
            </div>
          </div>
          {healthError && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950/20">
              <p className="text-sm text-red-600 dark:text-red-400">
                Error: {healthError}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ML Statistics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{mlStats.totalAnalyses}</p>
                <p className="text-sm text-muted-foreground">Total Analyses</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {(mlStats.averageConfidence * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground">Avg Confidence</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{mlStats.topPropertyType}</p>
                <p className="text-sm text-muted-foreground">
                  Top Property Type
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">
                  ${(mlStats.averagePrice / 1000).toFixed(0)}k
                </p>
                <p className="text-sm text-muted-foreground">Avg Price</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analysis" className="flex items-center space-x-2">
            <Camera className="h-4 w-4" />
            <span>Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Insights</span>
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Recent</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-6">
          <MLAnalysisUploader
            onAnalysisComplete={handleAnalysisComplete}
            onBatchAnalysisComplete={handleBatchAnalysisComplete}
          />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <InsightsTab
            propertyTypeData={sampleData.propertyTypeData}
            occupancyTrendData={sampleData.occupancyTrendData}
            locationDistributionData={sampleData.locationDistributionData}
          />
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recent Analyses</h3>
            {recentAnalyses.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Camera className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <p className="text-muted-foreground">
                    No recent analyses. Upload some photos to get started!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {recentAnalyses.map((analysis, index) => (
                  <PropertyAnalysisCard
                    key={index}
                    analysis={analysis.analysis}
                    recognition={analysis.recognition}
                    onViewDetails={() => {
                      console.log("View details for:", analysis.filename);
                    }}
                    onSaveAnalysis={() => {
                      console.log("Save analysis for:", analysis.filename);
                    }}
                    onUpdateProperty={(propertyData) => {
                      console.log("Update property with:", propertyData);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ML Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto Tagging</p>
                    <p className="text-sm text-muted-foreground">
                      Automatically tag properties based on analysis
                    </p>
                  </div>
                  <Badge variant="outline">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Quality Threshold</p>
                    <p className="text-sm text-muted-foreground">
                      Minimum confidence for analysis results
                    </p>
                  </div>
                  <Badge variant="outline">75%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Location Analysis</p>
                    <p className="text-sm text-muted-foreground">
                      Include location-based insights
                    </p>
                  </div>
                  <Badge variant="outline">Enabled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MLDashboard;
