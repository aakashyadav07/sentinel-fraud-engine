"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Download, 
  Monitor, 
  Smartphone, 
  Chrome, 
  Terminal, 
  CheckCircle2, 
  Copy, 
  Check, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

interface AppDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppDownloadModal: React.FC<AppDownloadModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);
  const [activeTab, setActiveTab] = useState<"desktop" | "pwa" | "extension" | "cli">("pwa");

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert(
        "To install Sentinel as an app on your computer or phone:\n\n" +
        "• In Google Chrome / Brave / Edge: Click the 'Install App' icon (⊕) on the right side of your address bar or go to Menu (⋮) > 'Install Sentinel App' / 'Add to Desktop'.\n" +
        "• On Android: Tap Chrome menu (⋮) > 'Add to Home screen' or 'Install App'.\n" +
        "• On iPhone / iPad (Safari): Tap Share button (⎙) > 'Add to Home Screen'."
      );
    }
  };

  const handleDownloadDesktopScript = () => {
    const scriptContent = `@echo off
title Sentinel Threat Engine Launcher
echo ===================================================
echo     SENTINEL FRAUD & SCAM INTELLIGENCE LAUNCHER
echo ===================================================
echo Starting Backend API and Web UI...
start cmd /k "py -m uvicorn main:app --app-dir backend --port 8000"
timeout /t 2 /nobreak >nul
start cmd /k "npm --prefix frontend run dev"
timeout /t 3 /nobreak >nul
start http://localhost:3000
echo Sentinel is running! Close this window when finished.
pause
`;
    const blob = new Blob([scriptContent], { type: "application/x-bat" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Launch-Sentinel-App.bat";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadExtensionZip = () => {
    const manifestJson = {
      manifest_version: 3,
      name: "Sentinel Threat Scanner Extension",
      version: "1.0.0",
      description: "Real-time scam & phishing URL detector by Sentinel",
      action: {
        default_popup: "popup.html",
        default_title: "Sentinel Scanner"
      },
      permissions: ["activeTab", "storage"]
    };
    const popupHtml = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { width: 320px; font-family: sans-serif; background: #080c14; color: #fff; padding: 15px; margin: 0; }
    h3 { margin-top: 0; color: #06b6d4; font-size: 16px; }
    p { font-size: 12px; color: #94a3b8; }
    .btn { display: block; width: 100%; text-align: center; background: #0891b2; color: white; padding: 10px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 13px; box-sizing: border-box; }
  </style>
</head>
<body>
  <h3>🛡️ Sentinel Threat Scanner</h3>
  <p>Scan any current website or WhatsApp Web message for fraud & advance-fee indicators.</p>
  <a href="http://localhost:3000" target="_blank" class="btn">Open Full Intelligence Studio</a>
</body>
</html>`;
    const blob = new Blob([popupHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sentinel-extension-popup.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyCliCode = () => {
    navigator.clipboard.writeText("curl -s http://localhost:8000/api/submissions -F raw_text=\"Check this offer\"");
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="cyber-card w-full max-w-2xl bg-slate-900 border-white/15 p-6 relative shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>Download & Install Sentinel App</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Multi-Platform
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Run Sentinel as a standalone desktop app, install on mobile, or launch via 1-click script.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
          <button
            onClick={() => setActiveTab("pwa")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "pwa"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Standalone Web App (PWA)</span>
          </button>

          <button
            onClick={() => setActiveTab("desktop")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "desktop"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Download className="w-4 h-4" />
            <span>1-Click Desktop Launcher (.bat)</span>
          </button>

          <button
            onClick={() => setActiveTab("extension")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "extension"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Chrome className="w-4 h-4" />
            <span>Browser Extension Tool</span>
          </button>

          <button
            onClick={() => setActiveTab("cli")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "cli"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>API & CLI Access</span>
          </button>
        </div>

        {/* Tab 1: PWA */}
        {activeTab === "pwa" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-bold text-white">
                    Direct Desktop & Mobile Web App Installation
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Installs Sentinel as a standalone, native-like desktop window (Windows, macOS, Linux, Android, iOS) with zero separate software requirements.
                </p>
              </div>

              <button
                onClick={handleInstallPWA}
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/25 transition-all whitespace-nowrap shrink-0 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>{isInstalled ? "App Installed" : "Install App on Device"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="p-3.5 rounded-lg bg-slate-800/40 border border-white/5 space-y-1.5">
                <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5" />
                  <span>On Desktop (Chrome / Edge / Brave):</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Look for the <strong>&ldquo;Install&rdquo;</strong> button (⊕) on the right side of the address bar, or click browser menu (⋮) &gt; &ldquo;Install Sentinel App&rdquo;.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-800/40 border border-white/5 space-y-1.5">
                <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>On Mobile (Android / iOS):</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  On Android tap Chrome menu (⋮) &gt; &ldquo;Add to Home Screen&rdquo;. On iPhone tap Safari Share (⎙) &gt; &ldquo;Add to Home Screen&rdquo;.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Desktop Launcher */}
        {activeTab === "desktop" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-sm font-bold text-white">
                  Windows 1-Click Launcher Script (`Launch-Sentinel-App.bat`)
                </span>
                <p className="text-xs text-slate-400">
                  Download a simple launcher batch file that starts both the FastAPI detection backend and Next.js UI automatically on double-click.
                </p>
              </div>

              <button
                onClick={handleDownloadDesktopScript}
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-slate-800 hover:bg-slate-700 border border-cyan-500/30 transition-all whitespace-nowrap shrink-0 flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Download .bat Launcher</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Browser Extension */}
        {activeTab === "extension" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-sm font-bold text-white">
                  Sentinel Chrome / Edge Extension Companion
                </span>
                <p className="text-xs text-slate-400">
                  Integrate instant scam detection into your browser toolbar for checking suspicious websites and chat links on the fly.
                </p>
              </div>

              <button
                onClick={handleDownloadExtensionZip}
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-slate-800 hover:bg-slate-700 border border-cyan-500/30 transition-all whitespace-nowrap shrink-0 flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Download Extension Popup</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: CLI & API */}
        {activeTab === "cli" && (
          <div className="space-y-3">
            <p className="text-xs text-slate-300">
              Integrate Sentinel with your custom security orchestration tools, automated Telegram bots, or SOC pipelines via curl or HTTP:
            </p>
            <div className="p-3 bg-slate-950 rounded-lg border border-white/10 font-mono text-xs text-cyan-300 flex items-center justify-between gap-2 overflow-x-auto">
              <code>curl -X POST http://localhost:8000/api/submissions -F raw_text=&quot;Invest ₹500 get ₹5000&quot;</code>
              <button
                onClick={copyCliCode}
                className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-white transition-colors shrink-0"
              >
                {copiedCli ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Interactive Swagger API documentation available at: <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer" className="text-cyan-400 underline">http://localhost:8000/docs</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
