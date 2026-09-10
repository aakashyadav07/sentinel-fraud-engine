"use client";

import React, { useState } from "react";
import { 
  Gamepad2, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  ArrowRight, 
  RotateCcw, 
  Flame, 
  Trophy,
  ShieldCheck,
  UserCheck
} from "lucide-react";

interface ScenarioStep {
  sender: string;
  avatar: string;
  message: string;
  options: {
    text: string;
    isSafe: boolean;
    explanation: string;
    points: number;
  }[];
}

interface SimulatorCase {
  id: string;
  title: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  steps: ScenarioStep[];
}

const SIMULATOR_CASES: SimulatorCase[] = [
  {
    id: "digital-arrest",
    title: "Case 01: The 'Digital Arrest' & Narcotics Courier",
    category: "Authority Impersonation",
    difficulty: "Advanced",
    steps: [
      {
        sender: "Inspector Vikram (CBI Cyber Crime Cell)",
        avatar: "👮‍♂️",
        message: "This is Inspector Vikram from CBI Mumbai. A FedEx courier parcel registered under your Aadhaar number containing 140 grams of narcotics and 4 fake passports was seized at Mumbai airport. A non-bailable arrest warrant has been issued against you.",
        options: [
          {
            text: "Panic and ask: 'How can I prove I am innocent and avoid arrest?'",
            isSafe: false,
            explanation: "Scammers exploit panic and fear to establish psychological control and isolate you.",
            points: -10,
          },
          {
            text: "State calmly: 'CBI does not conduct video calls or arrest warrants via WhatsApp. I am contacting Mumbai Police directly.'",
            isSafe: true,
            explanation: "Legitimate police and judicial authorities NEVER conduct 'Digital Arrest' or interrogate citizens over Skype/WhatsApp calls.",
            points: 25,
          }
        ]
      },
      {
        sender: "Inspector Vikram (CBI Cyber Crime Cell)",
        avatar: "👮‍♂️",
        message: "You are placed under 'Digital Arrest'. You must stay on this video call with your camera ON. To clear your name, transfer ₹75,000 to the RBI Secret Verification Fund account. The money will be 100% refunded after verification in 2 hours.",
        options: [
          {
            text: "Transfer the ₹75,000 immediately to clear your name and get the refund.",
            isSafe: false,
            explanation: "Critical Trap! The 'RBI Verification Account' is a disposable mule bank account. Once money is transferred, it is immediately withdrawn.",
            points: -30,
          },
          {
            text: "Immediately disconnect the call, block the number, and dial National Helpline 1930.",
            isSafe: true,
            explanation: "Excellent defensive action! Government agencies never have 'secret verification accounts'. Reporting to 1930 freezes suspect mule accounts.",
            points: 30,
          }
        ]
      }
    ]
  },
  {
    id: "task-scam",
    title: "Case 02: YouTube Like & Earn Part-Time Job Trap",
    category: "Micro-Task & Advance Fee",
    difficulty: "Intermediate",
    steps: [
      {
        sender: "HR Elena (Global Digital Media Ltd)",
        avatar: "👩‍💼",
        message: "Congratulations! Your profile was selected for our Part-time Task Program. Like 3 YouTube videos and we will pay ₹150 instantly to your UPI ID. No experience required!",
        options: [
          {
            text: "Send screenshot of 3 liked videos and provide UPI ID to collect the ₹150.",
            isSafe: false,
            explanation: "This is the 'Bait & Hook' phase. Scammers pay small initial amounts to build false trust before introducing large deposit demands.",
            points: -5,
          },
          {
            text: "Decline and block: Legitimate global companies do not hire unknown contacts on WhatsApp to like videos for cash.",
            isSafe: true,
            explanation: "Spotting the unrealistic effort-to-reward ratio early prevents falling into multi-stage deposit traps.",
            points: 20,
          }
        ]
      },
      {
        sender: "VIP Mentor @crypto_merchant_guru",
        avatar: "📈",
        message: "Great job! You earned ₹150. Now to unlock Tier-2 High Payout Tasks (₹10,000/day), you must complete a Merchant Match Order by depositing ₹3,000 into our merchant wallet.",
        options: [
          {
            text: "Deposit ₹3,000 expecting the ₹10,000 payout since the first ₹150 was paid.",
            isSafe: false,
            explanation: "Advance-Fee Trap! Once you pay ₹3,000, they will freeze your fake portal balance and demand ₹20,000 for 'VIP tax clearance'.",
            points: -25,
          },
          {
            text: "Recognize the Advance-Fee pattern: Stop all payments, take screenshots for evidence, and report on cybercrime.gov.in.",
            isSafe: true,
            explanation: "Perfect! Never pay money to receive salary or unlock earnings. That is the hallmark of task fraud.",
            points: 30,
          }
        ]
      }
    ]
  }
];

export const ScamSimulator: React.FC = () => {
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [score, setScore] = useState(100);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);

  const activeCase = SIMULATOR_CASES[selectedCaseIndex];
  const currentStep = activeCase.steps[currentStepIndex];

  const handleChoose = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    const chosen = currentStep.options[idx];
    setScore((prev) => Math.max(0, prev + chosen.points));
  };

  const handleNextStep = () => {
    if (currentStepIndex + 1 < activeCase.steps.length) {
      setCurrentStepIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setSelectedOption(null);
    setCompleted(false);
    setScore(100);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="cyber-card p-6 border-white/10 bg-slate-900/60 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Interactive Scam Defense Simulator
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Walk through real-world social engineering attack scenarios, test your psychological vigilance, and master cyber defense reflexes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-white/10 text-xs font-mono">
            <span className="text-slate-400">Vigilance Score: </span>
            <span className={`font-bold ${score >= 100 ? "text-emerald-400" : score >= 70 ? "text-amber-400" : "text-rose-400"}`}>
              {score} pts
            </span>
          </div>
        </div>
      </div>

      {/* Case Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {SIMULATOR_CASES.map((c, i) => (
          <button
            key={c.id}
            onClick={() => {
              setSelectedCaseIndex(i);
              handleReset();
            }}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              selectedCaseIndex === i
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10"
                : "bg-slate-900 text-slate-400 hover:text-white border border-white/5"
            }`}
          >
            <span>{c.title}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
              {c.difficulty}
            </span>
          </button>
        ))}
      </div>

      {/* Simulator Playfield */}
      <div className="cyber-card p-6 border-white/10 max-w-3xl mx-auto space-y-6">
        {completed ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Scenario Simulation Completed!
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Final Vigilance Rating: <strong className="text-cyan-300 font-mono">{score} / 150</strong>
              </p>
            </div>
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs inline-flex items-center gap-2 transition-all shadow-md shadow-cyan-600/20"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Replay Scenario</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Progress indicator */}
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/10 pb-3">
              <span className="font-semibold text-cyan-300">
                Step {currentStepIndex + 1} of {activeCase.steps.length}
              </span>
              <span className="font-mono text-[11px] text-slate-400">
                Category: {activeCase.category}
              </span>
            </div>

            {/* Chat Bubble Simulation */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentStep.avatar}</span>
                <span className="text-xs font-bold text-slate-200">
                  {currentStep.sender}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans pl-8">
                &ldquo;{currentStep.message}&rdquo;
              </p>
            </div>

            {/* Response Options */}
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
                What is your defensive response?
              </span>

              <div className="space-y-2.5">
                {currentStep.options.map((opt, idx) => {
                  const isChosen = selectedOption === idx;
                  let btnStyle = "bg-slate-900 border-white/10 text-slate-200 hover:bg-slate-800 hover:border-slate-700";

                  if (selectedOption !== null) {
                    if (opt.isSafe) {
                      btnStyle = "bg-emerald-950/50 border-emerald-500/50 text-emerald-200";
                    } else if (isChosen) {
                      btnStyle = "bg-rose-950/50 border-rose-500/50 text-rose-200";
                    } else {
                      btnStyle = "opacity-50 bg-slate-950 border-white/5 text-slate-500";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={selectedOption !== null}
                      onClick={() => handleChoose(idx)}
                      className={`w-full text-left p-3.5 rounded-lg border text-xs sm:text-sm transition-all flex items-start gap-3 ${btnStyle}`}
                    >
                      <span className="font-mono text-xs font-bold shrink-0 mt-0.5 px-2 py-0.5 rounded bg-slate-800 border border-white/5">
                        Option {idx + 1}
                      </span>
                      <span className="leading-relaxed font-medium">
                        {opt.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Forensic Explanation Feedback */}
            {selectedOption !== null && (
              <div className={`p-4 rounded-lg border text-xs space-y-2 animate-in fade-in ${
                currentStep.options[selectedOption].isSafe
                  ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
                  : "bg-rose-950/40 border-rose-500/40 text-rose-200"
              }`}>
                <div className="flex items-center gap-2 font-bold text-xs">
                  {currentStep.options[selectedOption].isSafe ? (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Correct Defensive Reflex (+{currentStep.options[selectedOption].points} pts)</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>Vulnerability Warning ({currentStep.options[selectedOption].points} pts)</span>
                    </>
                  )}
                </div>
                <p className="text-xs leading-relaxed text-slate-300">
                  {currentStep.options[selectedOption].explanation}
                </p>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNextStep}
                    className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <span>Next Stage</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
