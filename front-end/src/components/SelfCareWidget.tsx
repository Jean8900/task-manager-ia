import React, { useState, useEffect, useRef } from 'react';
import { Smile, Heart, Sparkles, Wind, RefreshCw, CheckCircle2, Circle, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import EmergencySOS from './EmergencySOS';

const MATERNAL_AFFIRMATIONS = [
  "Tu fais de ton mieux, et c'est amplement suffisant. ✨",
  "Le repos n'est pas une récompense, c'est une nécessité absolue. 🌸",
  "Tes enfants t'aiment pour ta présence, pas pour une maison parfaite. ❤️",
  "Il est normal d'être fatiguée. Sois douce envers toi-même.",
  "Dire non aux autres, c'est parfois dire oui à sa propre santé.",
  "Tu es le pilier, mais tu as aussi le droit de t'appuyer sur les autres. 💪",
  "Une maman reposée est le plus beau des cadeaux pour sa famille. 🧘‍♀️",
  "Une chose après l'autre. Respire, tu gères déjà énormément !"
];

const SELF_CARE_TARGETS = [
  { id: 'tea', text: 'Boire une boisson chaude avant qu\'elle ne refroidisse ☕' },
  { id: 'music', text: 'Écouter ma chanson préférée en fermant les yeux 🎵' },
  { id: 'stretch', text: 'Faire 3 étirements simples des épaules et du cou 🧘‍♀️' },
  { id: 'no_task', text: 'Reporter une tâche non-urgente à demain sans culpabilité 😌' },
  { id: 'laugh', text: 'Partager un fou rire ou un câlin de 20 secondes ❤️' }
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
  const [breathPhase, setBreathPhase] = useState<'inspire' | 'bloque-plein' | 'expire' | 'bloque-vide'>('inspire');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const breathIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    localStorage.setItem('maman_selfcare_completed', JSON.stringify(completedTargets));
  }, [completedTargets]);

  // Handle breathing logic cycle (4-4-4-4 Box Breathing)
  useEffect(() => {
    if (isBreathing) {
      setSecondsLeft(4);
      setBreathPhase('inspire');

      breathIntervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            // Cycle phases
            setBreathPhase((currentPhase) => {
              switch (currentPhase) {
                case 'inspire': return 'bloque-plein';
                case 'bloque-plein': return 'expire';
                case 'expire': return 'bloque-vide';
                case 'bloque-vide': return 'inspire';
                default: return 'inspire';
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
      case 'inspire': return { title: 'Inspire...', color: 'text-emerald-700', scale: 1.4 };
      case 'bloque-plein': return { title: 'Bloque plein...', color: 'text-amber-700', scale: 1.4 };
      case 'expire': return { title: 'Expire doucement...', color: 'text-purple-700', scale: 1.0 };
      case 'bloque-vide': return { title: 'Bloque vide...', color: 'text-stone-600', scale: 1.0 };
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
          <span>Souffle & Objectifs</span>
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
          <span>S.O.S. Débordement</span>
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
                <h2 className="text-base font-black uppercase tracking-wider text-[#4B4453] font-display">Mon Moment de Souffle</h2>
                <p className="text-[11px] text-stone-500 font-bold">Prends 1 minute pour relâcher la pression physique.</p>
              </div>
            </div>

            {/* Breathing Animation Arena */}
            <div className="bg-[#E0F2F1]/60 rounded-[28px] p-5 flex flex-col items-center justify-center min-h-[230px] text-center border-2 border-[#4B4453] border-b-4 border-r-4 relative overflow-hidden">
              {!isBreathing ? (
                <div className="space-y-4 px-3">
                  <p className="text-[#4B4453] text-xs font-bold leading-relaxed">
                    La technique du <strong>Carré Respiratoire</strong> permet d'apaiser ton esprit et ton corps en moins d'une minute.
                  </p>
                  <button
                    onClick={() => setIsBreathing(true)}
                    className="px-5 py-3 bg-[#FF6B6B] hover:bg-[#ff5555] text-white border-2 border-[#4B4453] border-b-4 border-r-4 font-black uppercase tracking-wider rounded-2xl text-xs shadow-xs transition-all cursor-pointer flex items-center gap-2 mx-auto"
                    id="start-breathing-btn"
                  >
                    <Wind className="w-4.5 h-4.5 stroke-[2.5px]" /> Commencer la respiration
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
                      Phase : {breathPhase.replace('-', ' ')}
                    </p>
                  </div>

                  <button
                    onClick={() => setIsBreathing(false)}
                    className="text-[9.5px] text-[#4B4453] bg-white border-2 border-[#4B4453] px-3.5 py-1.5 rounded-xl font-black uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Arrêter
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
                  <RefreshCw className="w-3 h-3 stroke-[2.5px]" /> Un autre mot doux
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
                  <h2 className="text-base font-black uppercase tracking-wider text-[#4B4453] font-display">Mes Objectifs Douceur</h2>
                  <p className="text-[11px] text-stone-500 font-bold">Pour ne pas t'oublier dans la logistique du foyer.</p>
                </div>
              </div>

              <p className="text-stone-500 text-xs font-bold leading-relaxed">
                Pas de ménage ni de devoirs ici. Coche uniquement ce qui t'a fait du bien aujourd'hui :
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
                <Sparkles className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0" /> Prendre soin de toi est ta tâche la plus importante ! 🧡
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
