"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Database,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Table,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { isSuperAdmin } from "@/lib/admin-permissions";

interface ColumnAudit {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue: string | null;
  exists: boolean;
  expectedType?: string;
  typeMatch: boolean;
}

interface IndexAudit {
  name: string;
  columns: string[];
  unique: boolean;
  exists: boolean;
}

interface TableAudit {
  tableName: string;
  exists: boolean;
  columns: ColumnAudit[];
  indexes: IndexAudit[];
  missingColumns: string[];
  extraColumns: string[];
  missingIndexes: string[];
}

interface AuditSummary {
  totalTables: number;
  existingTables: number;
  missingTables: number;
  totalColumns: number;
  missingColumns: number;
  extraColumns: number;
  typeMismatches: number;
  missingIndexes: number;
}

export default function DatabaseAuditPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [auditResults, setAuditResults] = useState<TableAudit[]>([]);
  const [summary, setSummary] = useState<AuditSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Check for dev bypass first (development only)
    const devBypass = typeof window !== "undefined" && 
      (process.env.NODE_ENV === "development" || window.location.hostname === "localhost") &&
      sessionStorage.getItem("dev_admin_bypass") === "true";

    // Don't redirect while session is loading
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      const userRole = (session?.user as any)?.role;
      const userEmail = session?.user?.email;
      
      if (userRole !== "admin") {
        router.push("/client/dashboard");
        return;
      } else if (!isSuperAdmin(userEmail) && !devBypass) {
        // Not SuperAdmin - redirect to dashboard
        router.push("/admin");
        return;
      }
    }

    if (devBypass) {
      // Dev bypass active, allow access
      return;
    }

    // Don't redirect while session is loading
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
      router.push("/client/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    // Check for dev bypass
    const devBypass = typeof window !== "undefined" && 
      (process.env.NODE_ENV === "development" || window.location.hostname === "localhost") &&
      sessionStorage.getItem("dev_admin_bypass") === "true";

    if ((status === "authenticated" && (session?.user as any)?.role === "admin") || devBypass) {
      runAudit();
    }
  }, [status, session]);

  const runAudit = async () => {
    try {
      setLoading(true);
      // Check for dev bypass and add header
      const devBypass = typeof window !== "undefined" && 
        (process.env.NODE_ENV === "development" || window.location.hostname === "localhost") &&
        sessionStorage.getItem("dev_admin_bypass") === "true";
      
      const headers: HeadersInit = {};
      if (devBypass) {
        headers["x-dev-bypass"] = "true";
      }
      
      const response = await fetch("/api/admin/db-audit", { headers });
      if (response.ok) {
        const data = await response.json();
        setAuditResults(data.audit || []);
        setSummary(data.summary || null);
      } else {
        const error = await response.json();
        alert(`Audit failed: ${error.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error running audit:", error);
      alert("Failed to run database audit");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await runAudit();
  };

  const toggleTable = (tableName: string) => {
    const newExpanded = new Set(expandedTables);
    if (newExpanded.has(tableName)) {
      newExpanded.delete(tableName);
    } else {
      newExpanded.add(tableName);
    }
    setExpandedTables(newExpanded);
  };

  // Check for dev bypass
  const devBypass = typeof window !== "undefined" && 
    (process.env.NODE_ENV === "development" || window.location.hostname === "localhost") &&
    sessionStorage.getItem("dev_admin_bypass") === "true";

  // Show loading state while session is loading or audit is running
  if ((status === "loading" || (loading && status !== "authenticated")) && !devBypass) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Don't render if not authenticated or not admin (redirect will happen) - unless dev bypass
  if (!devBypass && (status === "unauthenticated" || (status === "authenticated" && (session?.user as any)?.role !== "admin"))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Redirecting...</div>
      </div>
    );
  }

  const expectedTables = [
    "Account", "Session", "VerificationToken", "User", "Booking", "NewEnquiry",
    "FormSubmission", "EmailInbox", "EmailThread", "Email", "Note", "Task",
    "EmailTemplate", "HireItem", "Cart", "CartItem", "HireOrder", "HireOrderItem",
    "DJ", "Musician", "VenueAsset", "FreelanceCrew", "BookingStaffAssignment",
    "AuditLog", "CommsLog"
  ];

  const expectedTableSet = new Set(expectedTables);
  const isExpectedTable = (tableName: string) => expectedTableSet.has(tableName);

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Database Audit</h1>
              <p className="text-gray-400">Compare Prisma schema with Supabase database structure</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                variant="outline"
                className="border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                Refresh Audit
              </Button>
              <Link href="/admin">
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {/* Summary Cards */}
          {summary && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-gray-800 border-champagne-gold/30">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-400 mb-1">Total Tables</p>
                  <p className="text-2xl font-bold text-white">{summary.totalTables}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {summary.existingTables} exist, {summary.missingTables} missing
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-blue-500/30">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-400 mb-1">Total Columns</p>
                  <p className="text-2xl font-bold text-blue-400">{summary.totalColumns}</p>
                  {summary.missingColumns > 0 && (
                    <p className="text-xs text-yellow-400 mt-1">
                      {summary.missingColumns} missing
                    </p>
                  )}
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-purple-500/30">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-400 mb-1">Type Mismatches</p>
                  <p className="text-2xl font-bold text-purple-400">{summary.typeMismatches}</p>
                  {summary.typeMismatches > 0 && (
                    <p className="text-xs text-yellow-400 mt-1">Review required</p>
                  )}
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-green-500/30">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-400 mb-1">Indexes</p>
                  <p className="text-2xl font-bold text-green-400">
                    {summary.missingIndexes === 0 ? "✓" : summary.missingIndexes}
                  </p>
                  {summary.missingIndexes > 0 && (
                    <p className="text-xs text-yellow-400 mt-1">Missing indexes</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>

        {/* Audit Results */}
        <div className="space-y-4">
          {auditResults.length === 0 ? (
            <Card className="bg-gray-800 border-champagne-gold/30">
              <CardContent className="p-12 text-center">
                <Database className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400 text-lg">No database tables found</p>
              </CardContent>
            </Card>
          ) : (
            auditResults.map((result, index) => {
              const isExpanded = expandedTables.has(result.tableName);
              const isExpected = isExpectedTable(result.tableName);
              const hasIssues = !result.exists || 
                result.missingColumns.length > 0 || 
                result.extraColumns.length > 0 ||
                result.missingIndexes.length > 0;

              return (
                <motion.div
                  key={result.tableName}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={`bg-gray-800 border ${
                      !result.exists
                        ? "border-red-500/50"
                        : hasIssues
                        ? "border-yellow-500/50"
                        : "border-green-500/50"
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleTable(result.tableName)}
                            className="text-gray-400 hover:text-white"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-5 h-5" />
                            ) : (
                              <ChevronRight className="w-5 h-5" />
                            )}
                          </button>
                          <Table className="w-5 h-5 text-champagne-gold" />
                          <div>
                            <CardTitle className="text-xl">{result.tableName}</CardTitle>
                            {!isExpected && (
                              <p className="text-xs text-yellow-400 mt-1">
                                ⚠️ Extra table (not in Prisma schema)
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!result.exists && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-red-900/30 border border-red-500/50 rounded-full">
                              <XCircle className="w-4 h-4 text-red-400" />
                              <span className="text-sm text-red-400">Missing</span>
                            </div>
                          )}
                          {result.exists && !hasIssues && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-900/30 border border-green-500/50 rounded-full">
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                              <span className="text-sm text-green-400">OK</span>
                            </div>
                          )}
                          {result.exists && hasIssues && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-yellow-900/30 border border-yellow-500/50 rounded-full">
                              <AlertCircle className="w-4 h-4 text-yellow-400" />
                              <span className="text-sm text-yellow-400">Issues</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    {isExpanded && result.exists && (
                      <CardContent className="space-y-4">
                        {/* Columns */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-300 mb-2">
                            Columns ({result.columns.length})
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {result.columns.map((col) => (
                              <div
                                key={col.name}
                                className={`p-2 rounded text-sm ${
                                  col.exists
                                    ? "bg-green-900/20 text-green-400"
                                    : "bg-red-900/20 text-red-400"
                                }`}
                              >
                                <div className="font-mono text-xs">{col.name}</div>
                                <div className="text-xs text-gray-400">
                                  {col.type} {col.nullable ? "(nullable)" : "(required)"}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Missing Columns */}
                        {result.missingColumns.length > 0 && (
                          <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
                            <h4 className="text-sm font-semibold text-red-400 mb-2">
                              Missing Columns
                            </h4>
                            <ul className="list-disc list-inside text-sm text-red-300">
                              {result.missingColumns.map((col) => (
                                <li key={col}>{col}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Extra Columns */}
                        {result.extraColumns.length > 0 && (
                          <div className="p-4 bg-yellow-900/20 border border-yellow-500/50 rounded-lg">
                            <h4 className="text-sm font-semibold text-yellow-400 mb-2">
                              Extra Columns (not in schema)
                            </h4>
                            <ul className="list-disc list-inside text-sm text-yellow-300">
                              {result.extraColumns.map((col) => (
                                <li key={col}>{col}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Indexes */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-300 mb-2">
                            Indexes ({result.indexes.length})
                          </h4>
                          <div className="space-y-1">
                            {result.indexes.map((idx) => (
                              <div
                                key={idx.name}
                                className="p-2 bg-gray-700/50 rounded text-sm"
                              >
                                <div className="font-mono text-xs">
                                  {idx.name} {idx.unique && "(unique)"}
                                </div>
                                <div className="text-xs text-gray-400">
                                  Columns: {idx.columns.join(", ")}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Missing Indexes */}
                        {result.missingIndexes.length > 0 && (
                          <div className="p-4 bg-yellow-900/20 border border-yellow-500/50 rounded-lg">
                            <h4 className="text-sm font-semibold text-yellow-400 mb-2">
                              Missing Indexes
                            </h4>
                            <ul className="list-disc list-inside text-sm text-yellow-300">
                              {result.missingIndexes.map((idx) => (
                                <li key={idx}>{idx}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
