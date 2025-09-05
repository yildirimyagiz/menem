import { Suspense } from "react";

import { Button } from "@reservatior/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@reservatior/ui/dialog";

import ComplianceRecordForm from "./components/ComplianceRecordForm";
import ComplianceRecordList from "./components/ComplianceRecordList";

export default function CompliancePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Compliance Records</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Record</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Compliance Record</DialogTitle>
            </DialogHeader>
            <ComplianceRecordForm />
          </DialogContent>
        </Dialog>
      </div>

      <Suspense fallback={<div>Loading compliance records...</div>}>
        <ComplianceRecordList />
      </Suspense>
    </div>
  );
}
