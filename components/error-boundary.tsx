"use client";

import { Component } from "react";
import { Card, CardContent } from "@/components/ui/card";

type ErrorBoundaryProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <Card className="m-4 border-destructive/40">
          <CardContent className="p-5">
            <p className="text-sm font-bold text-destructive">Something went wrong</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {this.state.error?.message ?? "An unexpected error occurred."}
            </p>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
