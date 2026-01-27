"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Report to error tracking service
    if (typeof window !== "undefined") {
      // You can add error reporting here (Sentry, LogRocket, etc.)
      try {
        const errorData = {
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
          url: window.location.href,
        };
        
        // Log to console in development
        if (process.env.NODE_ENV === "development") {
          console.error("Error details:", errorData);
        }
        
        // TODO: Send to error tracking service
        // fetch('/api/errors', { method: 'POST', body: JSON.stringify(errorData) });
      } catch (reportError) {
        console.error("Failed to report error:", reportError);
      }
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full bg-gray-800 border-red-500/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-red-500" />
                <CardTitle className="text-2xl text-white">Something went wrong</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                An unexpected error occurred. This has been logged and we'll look into it.
              </p>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="bg-gray-900 p-4 rounded border border-gray-700">
                  <p className="text-red-400 font-mono text-sm mb-2">
                    {this.state.error.toString()}
                  </p>
                  {this.state.error.stack && (
                    <pre className="text-xs text-gray-400 overflow-auto max-h-48">
                      {this.state.error.stack}
                    </pre>
                  )}
                  {this.state.errorInfo?.componentStack && (
                    <details className="mt-4">
                      <summary className="text-gray-400 text-sm cursor-pointer mb-2">
                        Component Stack
                      </summary>
                      <pre className="text-xs text-gray-500 overflow-auto max-h-32">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={this.handleReset}
                  variant="outline"
                  className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Link href="/" className="flex-1">
                  <Button
                    variant="default"
                    className="w-full bg-champagne-gold text-black hover:bg-gold-light"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
