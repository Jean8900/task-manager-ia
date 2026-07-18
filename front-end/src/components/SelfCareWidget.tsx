import React, { useState, useEffect, useRef } from 'react';
import { Smile, Heart, Sparkles, Wind, RefreshCw, CheckCircle2, Circle, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import EmergencySOS from './EmergencySOS';

const MATERNAL_AFFIRMATIONS = [
  "You're doing your best, and that is more than enough. ✨",
  "Rest isn't a reward, it's an absolute necessity. 🌸",
  "Your kids love you for being present, not for a perfect house. ❤️",
  "It's okay to be tired. Be gentle with yourself.",
  "Saying no to others is sometimes saying yes to your own health.",
  "You're the pillar, but you also have the right to lean on others. 💪",
  "A rested mom is the best gift for her family. 🧘‍♀️",
  "One thing at a time. Breathe, you're already handling so much!"
];

const SELF_CARE_TARGETS = [
  { id: 'tea', text: 'Drink a hot beverage before it gets cold ☕' },
  { id: 'music', text: 'Listen to my favorite song with my eyes closed 🎵' },
  { id: 'stretch', text: 'Do 3 simple shoulder and neck stretches 🧘‍♀️' },
  { id: 'no_task', text: 'Postpone a non-urgent task to tomorrow without guilt 😌' },
  { id: 'laugh', text: 'Share a good laugh or a 20-second hug ❤️' }
];

interface SelfCareWidgetProps {
  todayTasks: { id: string; title: string; isCompleted: boolean }[];
  onToggleComplete: (id: string) => void;
}

export default function SelfCareWidget({ todayTasks, onToggleComplete }: SelfCareWidgetProps) {
  const [activeSubTab, setActiveSubTab] = useState<'breath' | 'sos'>('breath');
  const [affirmationIdx, setAffirmationIdx] = useState(0);
  const [completedTargets, setCompletedTargets] = useState<string[]>(() => {
    const saved = localStorage.getItem('maman_selfcare_completed');
    return saved ? JSON.parse(saved) : [];
  });

  // Breathing Guide state
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold-full' | 'exhale' | 'hold-empty'>('inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const breathIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    localStorage.setItem('maman_selfcare_completed', JSON.stringify(completedTargets));
  }, [completedTargets]);

  // Handle breathing logic cycle (4-4-4-4 Box Breathing)
  useEffect(() => {
    if (isBreathing) {
      setSecondsLeft(4);
      setBreathPhase('inhale');

      breathIntervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            // Cycle phases
            setBreathPhase((currentPhase) => {
              switch (currentPhase) {
                case 'inhale': return 'hold-full';
                case 'hold-full': return 'exhale';
                case 'exhale': return 'hold-empty';
                case 'hold-empty': return 'inhale';
                default: return 'inhale';
              }
            });
            return 4; // Reset to 4 seconds
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (breathIntervalRef.current) {
        clearInterval(breathIntervalRef.current);
      }
      setSecondsLeft(4);
    }

    return () => {
      if (breathIntervalRef.current) {
        clearInterval(breathIntervalRef.current);
      }
    };
  }, [isBreathing]);

  const toggleTarget = (id: string) => {
    setCompletedTargets(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const nextAffirmation = () => {
    setAffirmationIdx((prev) => (prev + 1) % MATERNAL_AFFIRMATIONS.length);
  };

  // Get localized phase instructions
  const getPhaseInstruction = () => {
    switch (breathPhase) {
      case 'inhale': return { title: 'Inhale...', color: 'text-emerald-700', scale: 1.4 };
      case 'hold-full': return { title: 'Hold...', color: 'text-amber-700', scale: 1.4 };
      case 'exhale': return { title: 'Exhale gently...', color: 'text-purple-700', scale: 1.0 };
      case 'hold-empty': return { title: 'Hold empty...', color: 'text-stone-600', scale: 1.0 };
    }
  };

  const phaseDetails = getPhaseInstruction();

  return (
    <div className="space-y-6 w-full max-w-full">
      {/* Sub-tab navigation selector */}
      <div className="flex gap-2 p-1 bg-stone-100 rounded-2xl max-w-md mx-auto border border-stone-200">
        <button
          onClick={() => setActiveSubTab('breath')}
          className={`flex-1 py-2 px-3 text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
            activeSubTab === 'breath'
              ? 'bg-white text-[#4B4453] border border-stone-200 shadow-xs'
              : 'text-stone-500 hover:text-[#4B4453]'
          }`}
        >
          <Wind className="w-4 h-4 text-emerald-600 stroke-[2.5px]" />
          <span>Breathing & Goals</span>
        </button>
        <button
          onClick={() => setActiveSubTab('sos')}
          className={`flex-1 py-2 px-3 text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
            activeSubTab === 'sos'
              ? 'bg-white text-[#4B4453] border border-stone-200 shadow-xs'
              : 'text-stone-500 hover:text-[#4B4453]'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-500 stroke-[2px]" />
          <span>S.O.S. Overwhelm</span>
        </button>
      </div>

      {activeSubTab === 'breath' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in w-full max-w-full" id="selfcare-module">
          
          {/* CARD 1: COMFORTING WORDS & BREATHING GUIDE */}
          <div className="bg-white rounded-[32px] p-6 border-2 border-stone-200 border-b-4 border-r-4 shadow-xs space-y-6 flex flex-col justify-between min-w-0">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
              <div className="p-2.5 bg-[#E0F2F1] text-[#4B4453] border-2 border-[#4B4453] border-b-4 border-r-4 rounded-2xl shrink-0">
                <Wind className="w-5.5 h-5.5 stroke-[2.5px]" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-black uppercase tracking-wider text-[#4B4453] font-display">My Breathing Moment</h2>
                <p className="text-[11px] text-stone-500 font-bold">Take 1 minute to release physical tension.</p>
              </div>
            </div>

            {/* Breathing Animation Arena */}
            <div className="bg-[#E0F2F1]/60 rounded-[28px] p-5 flex flex-col items-center justify-center min-h-[230px] text-center border-2 border-[#4B4453] border-b-4 border-r-4 relative overflow-hidden">
              {!isBreathing ? (
                <div className="space-y-4 px-3">
                  <p className="text-[#4B4453] text-xs font-bold leading-relaxed">
                    The <strong>Box Breathing</strong> technique helps calm your mind and body in under a minute.
                  </p>
                  <button
                    onClick={() => setIsBreathing(true)}
                    className="px-5 py-3 bg-[#FF6B6B] hover:bg-[#ff5555] text-white border-2 border-[#4B4453] border-b-4 border-r-4 font-black uppercase tracking-wider rounded-2xl text-xs shadow-xs transition-all cursor-pointer flex items-center gap-2 mx-auto"
                    id="start-breathing-btn"
                  >
                    <Wind className="w-4.5 h-4.5 stroke-[2.5px]" /> Start breathing
                  </button>
                </div>
              ) : (
                <div className="space-y-4 flex flex-col items-center w-full">
                  {/* Animated breathing circle */}
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    {/* Background pulse rings */}
                    <motion.div
                      animate={{
                        scale: phaseDetails.scale,
                        opacity: [0.2, 0.45, 0.2]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 rounded-full bg-emerald-200"
                    />
                    {/* Core interactive circle */}
                    <motion.div
                      animate={{
                        scale: phaseDetails.scale
                      }}
                      transition={{
                        duration: 4,
                        ease: "easeInOut"
                      }}
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-black border-2 border-[#4B4453] text-lg shadow-sm transition-colors duration-1000 ${
                        breathPhase === 'inspire' ? 'bg-emerald-500' :
                        breathPhase === 'bloque-plein' ? 'bg-amber-500' :
                        breathPhase === 'expire' ? 'bg-purple-500' : 'bg-stone-500'
                      }`}
                    >
                      {secondsLeft}s
                    </motion.div>
                  </div>

                  {/* Instructional message */}
                  <div className="h-10 flex flex-col items-center justify-center">
                    <p className={`text-sm font-black tracking-tight transition-all uppercase tracking-wider ${phaseDetails.color}`}>
                      {phaseDetails.title}
                    </p>
                    <p className="text-[9px] text-[#4B4453]/70 font-black uppercase tracking-widest mt-0.5">
                      Phase: {breathPhase.replace('-', ' ')}
                    </p>
                  </div>

                  <button
                    onClick={() => setIsBreathing(false)}
                    className="text-[9.5px] text-[#4B4453] bg-white border-2 border-[#4B4453] px-3.5 py-1.5 rounded-xl font-black uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Stop
                  </button>
                </div>
              )}
            </div>

            {/* Affirmation Card */}
            <div className="bg-[#FFF4E0] border-2 border-[#4B4453] border-b-4 border-r-4 rounded-[24px] p-4.5 flex items-start gap-3">
              <Smile className="w-5.5 h-5.5 text-[#FF6B6B] shrink-0 mt-0.5 stroke-[2.5px]" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-[#4B4453] leading-relaxed pr-1 italic">
                  "{MATERNAL_AFFIRMATIONS[affirmationIdx]}"
                </p>
                <button
                  onClick={nextAffirmation}
                  className="text-[10px] font-black uppercase tracking-wider text-rose-600 hover:text-rose-700 transition-colors mt-2.5 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3 stroke-[2.5px]" /> Another kind word
                </button>
              </div>
            </div>
          </div>

          {/* CARD 2: GENTLE TARGETS Checklist */}
          <div className="bg-white rounded-[32px] p-6 border-2 border-stone-200 border-b-4 border-r-4 shadow-xs space-y-5 flex flex-col justify-between min-w-0">
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                <div className="p-2.5 bg-[#FF6B6B] text-white border-2 border-[#4B4453] border-b-4 border-r-4 rounded-2xl shrink-0">
                  <Heart className="w-5.5 h-5.5 stroke-[2.5px]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-black uppercase tracking-wider text-[#4B4453] font-display">My Gentle Goals</h2>
                  <p className="text-[11px] text-stone-500 font-bold">So you don't forget yourself in the household logistics.</p>
                </div>
              </div>

              <p className="text-stone-500 text-xs font-bold leading-relaxed">
                No chores or homework here. Only check off what made you feel good today:
              </p>

              <div className="space-y-2.5">
                {SELF_CARE_TARGETS.map((target) => {
                  const isDone = completedTargets.includes(target.id);
                  return (
                    <button
                      key={target.id}
                      onClick={() => toggleTarget(target.id)}
                      className={`w-full flex items-start gap-3 p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                        isDone
                          ? 'bg-[#E0F2F1] border-[#4B4453] border-b-4 border-r-4 font-black'
                          : 'bg-stone-50/50 border-stone-100 hover:border-stone-200'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-[#4B4453] shrink-0 mt-0.5 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5 text-stone-300 shrink-0 mt-0.5 stroke-[2px]" />
                      )}
                      <span className={`text-xs font-bold leading-tight flex-1 min-w-0 ${isDone ? 'text-teal-950 font-black' : 'text-[#4B4453]'}`}>
                        {target.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {completedTargets.length > 0 && (
              <div className="bg-[#FFD966] border-2 border-[#4B4453] border-b-4 border-r-4 rounded-[20px] p-3 text-center text-[10px] text-[#4B4453] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 mt-4">
                <Sparkles className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0" /> Taking care of yourself is your most important task! 🧡
              </div>
            )}
          </div>
        </div>
      ) : (
        <EmergencySOS
          onClose={() => setActiveSubTab('breath')}
          todayTasks={todayTasks}
          onToggleComplete={onToggleComplete}
        />
      )}
    </div>
  );
}
