import React, { useCallback, useState } from "react";
import {
  AlertCircle,
  Camera,
  CheckCircle,
  Image,
  Loader2,
  Upload,
  X,
} from "lucide-react";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";
import { Progress } from "@reservatior/ui/progress";

import type {
  BatchAnalysisResponse,
  MLAnalysisResponse,
} from "~/services/mlService";
import {
  useBatchPropertyAnalysis,
  usePropertyAnalysis,
} from "~/services/mlService";
import PropertyAnalysisCard from "./PropertyAnalysisCard";

interface MLAnalysisUploaderProps {
  onAnalysisComplete?: (analysis: MLAnalysisResponse) => void;
  onBatchAnalysisComplete?: (analysis: BatchAnalysisResponse) => void;
  location?: any;
  className?: string;
}

const MLAnalysisUploader: React.FC<MLAnalysisUploaderProps> = ({
  onAnalysisComplete,
  onBatchAnalysisComplete,
  location,
  className = "",
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<MLAnalysisResponse[]>(
    [],
  );

  const {
    analyzeProperty,
    loading: singleLoading,
    error: singleError,
  } = usePropertyAnalysis();
  const {
    analyzeBatch,
    loading: batchLoading,
    error: batchError,
  } = useBatchPropertyAnalysis();

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles((prev) => [...prev, ...fileArray]);
    }
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files?.[0]) {
        handleFileSelect(e.dataTransfer.files);
      }
    },
    [handleFileSelect],
  );

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const analyzeSingleFile = async (file: File) => {
    try {
      const result = await analyzeProperty(file, location);
      setAnalysisResults((prev) => [...prev, result]);
      onAnalysisComplete?.(result);
      return result;
    } catch (error) {
      console.error("Analysis failed:", error);
    }
  };

  const analyzeAllFiles = async () => {
    if (selectedFiles.length === 0) return;

    try {
      if (selectedFiles.length === 1) {
        const file = selectedFiles[0];
        if (file) {
          await analyzeSingleFile(file);
        }
      } else {
        const result = await analyzeBatch(selectedFiles, location);
        setAnalysisResults((prev) => [...prev, ...result.results]);
        onBatchAnalysisComplete?.(result);
      }
    } catch (error) {
      console.error("Batch analysis failed:", error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const isImageFile = (file: File) => {
    return file.type.startsWith("image/");
  };

  const validFiles = selectedFiles.filter(isImageFile);
  const invalidFiles = selectedFiles.filter((file) => !isImageFile(file));

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Camera className="mr-2 h-5 w-5" />
            Property Photo Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
              dragActive
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                : "border-gray-300 dark:border-gray-600"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold">
              Upload Property Photos
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Drag and drop images here, or click to select files
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button asChild>
                <span>Select Files</span>
              </Button>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Selected Files ({validFiles.length})</span>
              <Button
                onClick={analyzeAllFiles}
                disabled={
                  validFiles.length === 0 || singleLoading || batchLoading
                }
                className="flex items-center"
              >
                {singleLoading || batchLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Image className="mr-2 h-4 w-4" />
                )}
                Analyze {validFiles.length > 1 ? "All" : "Photo"}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {validFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800"
                >
                  <div className="flex items-center space-x-3">
                    <Image className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {invalidFiles.length > 0 && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950/20">
                  <div className="mb-2 flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="font-medium text-red-700 dark:text-red-300">
                      Invalid Files ({invalidFiles.length})
                    </span>
                  </div>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Only image files are supported for analysis.
                  </p>
                  {invalidFiles.map((file, index) => (
                    <div
                      key={index}
                      className="mt-2 flex items-center justify-between"
                    >
                      <span className="text-sm">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(selectedFiles.indexOf(file))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {(singleError || batchError) && (
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">{singleError || batchError}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {analysisResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="flex items-center text-lg font-semibold">
            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
            Analysis Results ({analysisResults.length})
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {analysisResults.map((result, index) => (
              <PropertyAnalysisCard
                key={index}
                analysis={result.analysis}
                recognition={result.recognition}
                onViewDetails={() => {
                  // Handle view details
                  console.log("View details for:", result.filename);
                }}
                onSaveAnalysis={() => {
                  // Handle save analysis
                  console.log("Save analysis for:", result.filename);
                }}
                onUpdateProperty={(propertyData) => {
                  // Handle update property
                  console.log("Update property with:", propertyData);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MLAnalysisUploader;
