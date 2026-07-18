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
    label: "Demande d'aide au conjoint (Dîner & Couchage)",
    text: "Coucou ! Je me sens un peu débordée ce soir 🥺 Est-ce que tu pourrais s'il te plaît t'occuper de préparer le dîner et de coucher les enfants ? Ça m'aiderait énormément à souffler un peu. Merci d'être là, je t'aime ! ❤️"
  },
  {
    label: "Alerte Fatigue (Option commander à manger)",
    text: "S.O.S. fatigue intense ce soir ! 🏳️ Est-ce qu'on peut s'organiser pour commander des pizzas ou des sushis ? Je n'ai plus l'énergie de faire à manger. Merci pour ton aide ! 😘"
  },
  {
    label: "S.O.S. Bain & Devoirs",
    text: "Coucou ! Journée très dense de mon côté. Est-ce que tu pourras gérer les devoirs et la douche des petits en rentrant s'il te plaît ? Je prends 15 minutes pour me poser dans le calme. Merci infiniment ! 🥰"
  }
];

export default function EmergencySOS({ onClose, todayTasks, onToggleComplete }: EmergencySOSProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedSingleTask, setSelectedSingleTask] = useState<string | null>(null);
  const [customPriorityText, setCustomPriorityText] = useState('');
  
  // Local automatic breathing pacer for SOS screen
  const [breathingStatus, setBreathingStatus] = useState<'Inspiration...' | 'Rétention...' | 'Expiration...' | 'Attente...'>('Inspiration...');
  const [timerCount, setTimerCount] = useState(4);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerCount(prev => {
        if (prev <= 1) {
          setBreathingStatus(curr => {
            switch (curr) {
              case 'Inspiration...': return 'Rétention...';
              case 'Rétention...': return 'Expiration...';
              case 'Expiration...': return 'Attente...';
              case 'Attente...': return 'Inspiration...';
              default: return 'Inspiration...';
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
      case 'Inspiration...': return 'bg-emerald-500 text-white';
      case 'Rétention...': return 'bg-amber-500 text-white';
      case 'Expiration...': return 'bg-purple-500 text-white';
      case 'Attente...': return 'bg-stone-500 text-white';
    }
  };

  const getBreathingScale = () => {
    return breathingStatus === 'Inspiration...' || breathingStatus === 'Rétention...' ? 1.4 : 1.0;
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
            <h1 className="text-lg font-black uppercase tracking-wider text-[#4B4453] font-display">S.O.S. Débordement</h1>
            <p className="text-[11px] text-stone-500 font-bold">On arrête tout, on respire, on simplifie.</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-stone-50 text-[#4B4453] border-2 border-[#4B4453] border-b-4 border-r-4 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-all"
        >
          <ArrowLeft className="w-4 h-4 stroke-[3px]" /> Retour au souffle
        </button>
      </div>

      {/* CORE ARENA */}
      <div className="max-w-4xl mx-auto w-full my-6 flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        
        {/* LEFT COLUMN: GUIDED CALMING & COPING */}
        <div className="bg-white rounded-[32px] p-6 border-2 border-stone-200 border-b-4 border-r-4 shadow-xs flex flex-col justify-between items-center md:items-start text-center md:text-left space-y-6">
          <div className="space-y-2 w-full">
            <span className="text-[10px] font-black tracking-widest text-rose-500 uppercase bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md inline-block">Étape 1 : S'apaiser</span>
            <h2 className="text-lg font-black uppercase tracking-wider text-[#4B4453] mt-2 font-display">Prends une respiration</h2>
            <p className="text-stone-500 text-xs font-bold leading-relaxed max-w-sm mx-auto md:mx-0">
              Suis le rythme du cercle des yeux. Relâche tes épaules. Tout va bien se passer.
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
            <p className="text-[10px] text-stone-400 font-bold">Technique d'ancrage express 🧘‍♀️</p>
          </div>

          {/* Comforting Rules */}
          <div className="bg-[#FFF4E0] border-2 border-[#4B4453] border-b-4 border-r-4 rounded-[24px] p-4.5 w-full text-left space-y-2.5 text-xs">
            <h4 className="font-black text-[#4B4453] flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Sparkles className="w-4 h-4 text-rose-500 fill-rose-500" /> Règles d'Or anti-culpabilité :
            </h4>
            <ul className="space-y-1.5 text-[#4B4453] font-bold">
              <li className="flex items-start gap-1"><span>•</span> <span>Un dîner de restes ou des pâtes au beurre, c'est parfait.</span></li>
              <li className="flex items-start gap-1"><span>•</span> <span>La vaisselle et le linge sale attendront bien demain midi.</span></li>
              <li className="flex items-start gap-1"><span>•</span> <span>Tes enfants veulent juste une maman calme, pas parfaite.</span></li>
              <li className="flex items-start gap-1"><span>•</span> <span>Demander de l'aide n'est pas une faiblesse, c'est de l'amour propre.</span></li>
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: RUTHLESS SIMPLIFICATION & SMS DELEGATION */}
        <div className="space-y-6 flex flex-col justify-between">
          
          {/* STEP 2: THE ONE SINGLE TASK - HYPERFOCUS */}
          <div className="bg-white rounded-[32px] p-6 border-2 border-stone-200 border-b-4 border-r-4 shadow-xs space-y-4">
            <div>
              <span className="text-[10px] font-black tracking-widest text-[#4B4453] uppercase bg-[#FFD966]/50 border border-[#FFD966] px-2.5 py-1 rounded-md inline-block">Étape 2 : L'essentiel absolu</span>
              <h3 className="text-sm font-black uppercase tracking-wider text-[#4B4453] mt-2.5">Quelle est LA seule tâche importante ce soir ?</h3>
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
                  Changer
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
                    placeholder="Écris ton unique tâche ici..."
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
                    Valider
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* STEP 3: DELEGATE / ASK FOR HELP IN 1 TAP */}
          <div className="bg-white rounded-[32px] p-6 border-2 border-stone-200 border-b-4 border-r-4 shadow-xs space-y-4">
            <div>
              <span className="text-[10px] font-black tracking-widest text-[#4B4453] uppercase bg-[#E0F2F1] border border-[#E0F2F1] px-2.5 py-1 rounded-md inline-block">Étape 3 : Déléguer</span>
              <h3 className="text-sm font-black uppercase tracking-wider text-[#4B4453] mt-2.5">Demander de l'aide en 1 Clic (Copier)</h3>
              <p className="text-[10px] text-stone-500 font-bold mt-1">Copie un message rédigé avec amour et envoie-le à ton conjoint.</p>
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
                            <Check className="w-3 h-3 stroke-[3px]" /> Copié !
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 stroke-[3px]" /> Copier
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
        Tu es une maman merveilleuse. C'est normal de saturer. Prends soin de toi en premier !
      </div>
    </div>
  );
}
