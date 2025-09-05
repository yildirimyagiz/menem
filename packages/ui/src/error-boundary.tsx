import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";

import { EmptyState } from "./empty-state";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6">
          <EmptyState
            icon={<div className="h-12 w-12 rounded-full bg-red-500" />}
            title="Something went wrong"
            description={
              this.state.error?.message ?? "An unexpected error occurred"
            }
          />
        </div>
      );
    }

    return this.props.children;
  }
}
