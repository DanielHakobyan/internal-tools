"use client";

import { useState } from "react";
import { UserButton, useUser, SignInButton } from "@clerk/nextjs";
import { SAMPLE_TRANSCRIPT } from "@/lib/constants";
import { MeetingExtraction } from "@/lib/types";
import { countWords } from "@/lib/utils";
import { toast } from "sonner";
import { FileText, Settings, History, Loader2, Sparkles, Upload } from "lucide-react";
import Dashboard from "@/components/Dashboard";
import Link from "next/link";

export default function Home() {
  const { isSignedIn, user } = useUser();
  const [transcript, setTranscript] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [result, setResult] = useState<MeetingExtraction | null>(null);

  const handleExtract = async () => {
    if (!transcript.trim()) {
      toast.error("Please enter a transcript");
      return;
    }

    setIsExtracting(true);
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Extraction failed");
      }

      setResult(data.data);
      if (data.mock) {
        toast.info("Generated using mock data (Groq API key missing)");
      } else {
        toast.success("Action items extracted successfully!");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === "text/plain") {
      const text = await file.text();
      setTranscript(text);
      toast.success("Text file loaded");
    } else if (file.type === "application/pdf") {
      toast.info("PDF parsing would happen here. (Using text fallback for now)");
      // PDF parsing would ideally happen server-side via an API route
      // For this demo, we'll just set some text if it's a pdf
    } else {
      toast.error("Unsupported file type. Please upload .txt or .pdf");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <Sparkles className="h-6 w-6 text-primary" />
            <span>Actionizer AI</span>
          </div>
          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <>
                <Link
                  href="/history"
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <History className="h-5 w-5" />
                </Link>
                <Link
                  href="/settings"
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Settings className="h-5 w-5" />
                </Link>
                <div className="pl-2 border-l border-border h-8 flex items-center">
                  <UserButton />
                </div>
              </>
            ) : (
              <SignInButton mode="modal">
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col px-4 py-8 max-w-7xl mx-auto w-full gap-8">
        {!result ? (
          <div className="flex flex-col items-center max-w-3xl mx-auto w-full gap-8 py-12">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/70">
                Turn any meeting transcript into assigned, tracked action items in seconds.
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Paste your meeting notes or upload a transcript. AI will extract tasks, assign
                owners, and sync them directly to your team's tools.
              </p>
            </div>

            <div className="w-full bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col focus-within:ring-1 focus-within:ring-primary transition-all">
              <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
                <div className="flex gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors bg-background px-3 py-1.5 rounded-md border border-border">
                    <Upload className="h-4 w-4" />
                    Upload File
                    <input
                      type="file"
                      accept=".txt,.pdf"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                  <button
                    onClick={() => setTranscript(SAMPLE_TRANSCRIPT)}
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors bg-background px-3 py-1.5 rounded-md border border-border"
                  >
                    <FileText className="h-4 w-4" />
                    Load Sample
                  </button>
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  {countWords(transcript)} words
                </div>
              </div>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Paste your meeting transcript here..."
                className="w-full h-80 p-4 bg-transparent resize-none outline-none text-foreground placeholder:text-muted-foreground"
              />
              <div className="p-3 bg-muted/30 border-t border-border flex justify-between items-center">
                <button
                  onClick={() => setTranscript("")}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear text
                </button>
                <button
                  onClick={handleExtract}
                  disabled={isExtracting || !transcript.trim()}
                  className="bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
                >
                  {isExtracting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Extracting Action Items...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Extract Action Items
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <Dashboard
            data={result}
            onReset={() => {
              setResult(null);
              setTranscript("");
            }}
          />
        )}
      </main>
    </div>
  );
}
