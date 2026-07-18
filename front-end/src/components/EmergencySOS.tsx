import React, { useState, useEffect } from 'react';
import { ShieldAlert, Heart, Copy, Check, Wind, ArrowLeft, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EmergencySOSProps {
  onClose: () => void;
  todayTasks: { id: string; title: string; isCompleted: boolean }[];
  onToggleComplete: (id: string) => void;
}

const EMERGENCY_TEMPLATES = [
  {
    label: "Ask partner for help (Dinner & Bedtime)",
    text: "Hey! I'm feeling a bit overwhelmed tonight 🥺 Could you please take care of making dinner and putting the kids to bed? It would help me so much to catch a breath. Thanks for being there, I love you! ❤️"
  },
  {
    label: "Fatigue Alert (Order food option)",
    text: "S.O.S. intense fatigue tonight! 🏳️ Could we order pizza or sushi? I don't have the energy to cook. Thanks for your help! 😘"
  },
  {
    label: "S.O.S. Bath & Homework",
    text: "Hey! Really packed day on my end. Could you handle homework and the kids' shower when you get home please? I'm taking 15 minutes to settle down quietly. Thank you so much! 🥰"
  }
];

export default function EmergencySOS({ onClose, todayTasks, onToggleComplete }: EmergencySOSProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedSingleTask, setSelectedSingleTask] = useState<string | null>(null);
  const [customPriorityText, setCustomPriorityText] = useState('');
  
  // Local automatic breathing pacer for SOS screen
  const [breathingStatus, setBreathingStatus] = useState<'Inhale...' | 'Hold...' | 'Exhale...' | 'Wait...'>('Inhale...');
  const [timerCount, setTimerCount] = useState(4);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerCount(prev => {
        if (prev <= 1) {
          setBreathingStatus(curr => {
            switch (curr) {
              case 'Inhale...': return 'Hold...';
              case 'Hold...': return 'Exhale...';
              case 'Exhale...': return 'Wait...';
              case 'Wait...': return 'Inhale...';
              default: return 'Inhale...';
            }
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const getBreathingColor = () => {
    switch (breathingStatus) {
      case 'Inhale...': return 'bg-emerald-500 text-white';
      case 'Hold...': return 'bg-amber-500 text-white';
      case 'Exhale...': return 'bg-purple-500 text-white';
      case 'Wait...': return 'bg-stone-500 text-white';
    }
  };

  const getBreathingScale = () => {
    return breathingStatus === 'Inhale...' || breathingStatus === 'Hold...' ? 1.4 : 1.0;
  };

  return (
    <div className="bg-[#FFFBF0] flex flex-col justify-between animate-fade-in w-full max-w-4xl mx-auto" id="emergency-sos-layer">
      {/* HEADER SECTION */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between border-b-2 border-stone-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-500 text-white border-2 border-[#4B4453] border-b-4 border-r-4 rounded-2xl">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-black uppercase tracking-wider text-[#4B4453] font-display">S.O.S. Overwhelm</h1>
            <p className="text-[11px] text-stone-500 font-bold">Stop everything, breathe, simplify.</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-stone-50 text-[#4B4453] border-2 border-[#4B4453] border-b-4 border-r-4 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-all"
        >
          <ArrowLeft className="w-4 h-4 stroke-[3px]" /> Back to breathing
        </button>
      </div>

      {/* CORE ARENA */}
      <div className="max-w-4xl mx-auto w-full my-6 flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        
        {/* LEFT COLUMN: GUIDED CALMING & COPING */}
        <div className="bg-white rounded-[32px] p-6 border-2 border-stone-200 border-b-4 border-r-4 shadow-xs flex flex-col justify-between items-center md:items-start text-center md:text-left space-y-6">
          <div className="space-y-2 w-full">
            <span className="text-[10px] font-black tracking-widest text-rose-500 uppercase bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md inline-block">Step 1: Calm down</span>
            <h2 className="text-lg font-black uppercase tracking-wider text-[#4B4453] mt-2 font-display">Take a breath</h2>
            <p className="text-stone-500 text-xs font-bold leading-relaxed max-w-sm mx-auto md:mx-0">
              Follow the pace of the circle with your eyes. Relax your shoulders. Everything will be okay.
            </p>
          </div>

          {/* Large breath pacer ring */}
          <div className="relative w-40 h-40 flex items-center justify-center my-1">
            <motion.div
              animate={{
                scale: getBreathingScale(),
                opacity: [0.15, 0.45, 0.15]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 rounded-full bg-emerald-200"
            />
            <motion.div
              animate={{
                scale: getBreathingScale()
              }}
              transition={{
                duration: 4,
                ease: "easeInOut"
              }}
              className={`w-24 h-24 rounded-full flex flex-col items-center justify-center text-white font-black border-2 border-[#4B4453] text-xs shadow-xl transition-all duration-1000 ${getBreathingColor()}`}
            >
              <Wind className="w-6 h-6 mb-1 stroke-[3px]" />
              <span className="text-sm">{timerCount}s</span>
            </motion.div>
          </div>

          <div className="space-y-1 text-center w-full">
            <p className="text-sm font-black uppercase tracking-wider text-[#4B4453]">{breathingStatus}</p>
            <p className="text-[10px] text-stone-400 font-bold">Quick grounding technique 🧘‍♀️</p>
          </div>

          {/* Comforting Rules */}
          <div className="bg-[#FFF4E0] border-2 border-[#4B4453] border-b-4 border-r-4 rounded-[24px] p-4.5 w-full text-left space-y-2.5 text-xs">
            <h4 className="font-black text-[#4B4453] flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Sparkles className="w-4 h-4 text-rose-500 fill-rose-500" /> Golden anti-guilt rules:
            </h4>
            <ul className="space-y-1.5 text-[#4B4453] font-bold">
              <li className="flex items-start gap-1"><span>•</span> <span>Leftovers or buttered pasta for dinner is perfectly fine.</span></li>
              <li className="flex items-start gap-1"><span>•</span> <span>The dishes and laundry can wait until tomorrow noon.</span></li>
              <li className="flex items-start gap-1"><span>•</span> <span>Your kids just want a calm mom, not a perfect one.</span></li>
              <li className="flex items-start gap-1"><span>•</span> <span>Asking for help isn't weakness, it's self-love.</span></li>
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: RUTHLESS SIMPLIFICATION & SMS DELEGATION */}
        <div className="space-y-6 flex flex-col justify-between">
          
          {/* STEP 2: THE ONE SINGLE TASK - HYPERFOCUS */}
          <div className="bg-white rounded-[32px] p-6 border-2 border-stone-200 border-b-4 border-r-4 shadow-xs space-y-4">
            <div>
              <span className="text-[10px] font-black tracking-widest text-[#4B4453] uppercase bg-[#FFD966]/50 border border-[#FFD966] px-2.5 py-1 rounded-md inline-block">Step 2: The absolute essential</span>
              <h3 className="text-sm font-black uppercase tracking-wider text-[#4B4453] mt-2.5">What is THE one important task tonight?</h3>
            </div>

            {selectedSingleTask ? (
              <div className="bg-[#FFD966] border-2 border-[#4B4453] border-b-4 border-r-4 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🎯</span>
                  <span className="text-xs font-black text-[#4B4453] uppercase tracking-wider">{selectedSingleTask}</span>
                </div>
                <button
                  onClick={() => setSelectedSingleTask(null)}
                  className="text-[10px] font-black uppercase tracking-wider text-rose-600 hover:text-rose-700 bg-white border border-[#4B4453] px-2.5 py-1 rounded-lg cursor-pointer"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {todayTasks.filter(t => !t.isCompleted).length > 0 ? (
                  <div className="max-h-28 overflow-y-auto no-scrollbar space-y-1.5 bg-stone-50 p-2 rounded-xl border border-stone-100">
                    {todayTasks.filter(t => !t.isCompleted).slice(0, 3).map((task) => (
                      <button
                        key={task.id}
                        onClick={() => setSelectedSingleTask(task.title)}
                        className="w-full text-left p-2 rounded-xl bg-white hover:bg-amber-50 border-2 border-stone-100 hover:border-[#FFD966] text-[#4B4453] text-xs font-bold transition-all cursor-pointer truncate flex items-center gap-1.5"
                      >
                        <span className="text-amber-500 text-sm">★</span> {task.title}
                      </button>
                    ))}
                  </div>
                ) : null}

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Write your one task here..."
                    value={customPriorityText}
                    onChange={(e) => setCustomPriorityText(e.target.value)}
                    className="flex-1 bg-stone-50 border-2 border-stone-200 rounded-xl text-xs px-3.5 py-2.5 text-[#4B4453] font-bold focus:outline-hidden focus:ring-2 focus:ring-[#FFD966] focus:border-transparent"
                  />
                  <button
                    onClick={() => {
                      if (customPriorityText.trim()) {
                        setSelectedSingleTask(customPriorityText.trim());
                        setCustomPriorityText('');
                      }
                    }}
                    className="px-4 bg-[#FF6B6B] hover:bg-[#ff5555] text-white border-2 border-[#4B4453] border-b-4 border-r-4 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* STEP 3: DELEGATE / ASK FOR HELP IN 1 TAP */}
          <div className="bg-white rounded-[32px] p-6 border-2 border-stone-200 border-b-4 border-r-4 shadow-xs space-y-4">
            <div>
              <span className="text-[10px] font-black tracking-widest text-[#4B4453] uppercase bg-[#E0F2F1] border border-[#E0F2F1] px-2.5 py-1 rounded-md inline-block">Step 3: Delegate</span>
              <h3 className="text-sm font-black uppercase tracking-wider text-[#4B4453] mt-2.5">Ask for help in 1 Click (Copy)</h3>
              <p className="text-[10px] text-stone-500 font-bold mt-1">Copy a message written with love and send it to your partner.</p>
            </div>

            <div className="space-y-3 max-h-56 overflow-y-auto no-scrollbar">
              {EMERGENCY_TEMPLATES.map((tpl, idx) => {
                const isCopied = copiedIndex === idx;
                return (
                  <div key={idx} className="bg-stone-50 rounded-2xl p-3 border-2 border-stone-100 hover:border-stone-200 space-y-2 text-left">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">{tpl.label}</span>
                      <button
                        onClick={() => handleCopy(tpl.text, idx)}
                        className={`text-[9.5px] px-2.5 py-1 rounded-lg font-black uppercase tracking-wider cursor-pointer transition-all flex items-center gap-1 border-2 ${
                          isCopied
                            ? 'bg-[#E0F2F1] text-teal-950 border-[#4B4453]'
                            : 'bg-white hover:bg-stone-50 text-[#4B4453] border-[#4B4453]'
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 stroke-[3px]" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 stroke-[3px]" /> Copy
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-[10.5px] text-[#4B4453] font-bold italic leading-relaxed">
                      "{tpl.text}"
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* FOOTER COMFORTING MESSAGE */}
      <div className="max-w-4xl mx-auto w-full text-center text-[11px] text-[#4B4453] font-black uppercase tracking-wider pt-4 border-t-2 border-stone-200 mt-auto flex items-center justify-center gap-1.5">
        <Heart className="w-4.5 h-4.5 text-rose-500 fill-rose-500 animate-pulse" />
        You are a wonderful mom. It's normal to feel overwhelmed. Take care of yourself first!
      </div>
    </div>
  );
}
