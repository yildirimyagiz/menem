import type { FC } from "react";
import { useState } from "react";

import { Button } from "@reservatior/ui/button";
import { Card } from "@reservatior/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@reservatior/ui/tabs";

interface ReportViewerProps {
  report: {
    id: string;
    type: string;
    format: string;
    content: {
      summary?: string;
      data?: any;
      charts?: any[];
      tables?: any[];
    };
  };
  onClose: () => void;
  onDownload: () => void;
}

const ReportViewer: FC<ReportViewerProps> = ({
  report,
  onClose,
  onDownload,
}) => {
  const [activeTab, setActiveTab] = useState("summary");

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{report.type} Report</h2>
          <p className="text-sm text-gray-500">
            Generated in {report.format} format
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onDownload}>
            Download
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="tables">Tables</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="mt-4">
          {report.content.summary ? (
            <div className="prose max-w-none">{report.content.summary}</div>
          ) : (
            <div className="text-center text-gray-500">
              No summary available
            </div>
          )}
        </TabsContent>

        <TabsContent value="data" className="mt-4">
          {report.content.data ? (
            <pre className="overflow-auto rounded-lg bg-gray-50 p-4">
              {JSON.stringify(report.content.data, null, 2)}
            </pre>
          ) : (
            <div className="text-center text-gray-500">No data available</div>
          )}
        </TabsContent>

        <TabsContent value="charts" className="mt-4">
          {report.content.charts && report.content.charts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {report.content.charts.map((chart, index) => (
                <div key={index} className="rounded-lg border p-4">
                  {/* Chart component would go here */}
                  <div className="aspect-video bg-gray-100" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">No charts available</div>
          )}
        </TabsContent>

        <TabsContent value="tables" className="mt-4">
          {report.content.tables && report.content.tables.length > 0 ? (
            <div className="space-y-4">
              {report.content.tables.map((table, index) => (
                <div key={index} className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        {table.headers.map((header: string, i: number) => (
                          <th key={i} className="px-4 py-2 text-left">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {table.rows.map((row: any[], i: number) => (
                        <tr key={i} className="border-b">
                          {row.map((cell, j) => (
                            <td key={j} className="px-4 py-2">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">No tables available</div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ReportViewer;
