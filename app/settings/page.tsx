"use client";

import { useState } from "react";
import { ArrowLeft, Key, Database, RefreshCw, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    // Simulate testing connection to Supabase / APIs
    await new Promise((r) => setTimeout(r, 1500));
    setIsTesting(false);
    setTestResult("All connections successful (Mock Data Mode)");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center px-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your API keys and integration preferences. In this demo, integrations are running in mock mode.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <Database className="h-5 w-5 text-primary" />
              Database Status
            </h2>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
              <div className="space-y-1">
                <p className="font-medium">Supabase Connection</p>
                <p className="text-sm text-muted-foreground">Local storage fallback active</p>
              </div>
              <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full text-sm font-medium">
                <CheckCircle2 className="h-4 w-4" />
                Active
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={handleTestConnection}
                disabled={isTesting}
                className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {isTesting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Test Connections
              </button>
              {testResult && (
                <p className="mt-3 text-sm text-emerald-500 font-medium animate-in fade-in">{testResult}</p>
              )}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <Key className="h-5 w-5 text-primary" />
              Integration Keys
            </h2>
            <div className="space-y-4 text-sm">
              <div className="grid gap-2">
                <label className="font-medium">Slack Webhook URL</label>
                <input
                  type="password"
                  value="xxxxxxxxxxxxxxxxxxxx"
                  disabled
                  className="w-full bg-muted/50 border border-border rounded-md px-3 py-2 text-muted-foreground opacity-70"
                />
              </div>
              <div className="grid gap-2">
                <label className="font-medium">Notion Integration Token</label>
                <input
                  type="password"
                  value="xxxxxxxxxxxxxxxxxxxx"
                  disabled
                  className="w-full bg-muted/50 border border-border rounded-md px-3 py-2 text-muted-foreground opacity-70"
                />
              </div>
              <div className="grid gap-2">
                <label className="font-medium">Jira API Token</label>
                <input
                  type="password"
                  value="xxxxxxxxxxxxxxxxxxxx"
                  disabled
                  className="w-full bg-muted/50 border border-border rounded-md px-3 py-2 text-muted-foreground opacity-70"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                * Note: API keys are hidden in demo mode. Add keys to .env.local to enable real integrations.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
