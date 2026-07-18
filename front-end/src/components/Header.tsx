import React, { useState } from 'react';
import { Child } from '../types';
import { Plus, X, User, Heart, Sparkles, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  childrenList: Child[];
  activeChildId: string | null;
  onSelectChild: (id: string | null) => void;
  onAddChild: (name: string, icon: string, color: string) => void;
  onDeleteChild: (id: string) => void;
  totalTasksCount: number;
  completedTasksCount: number;
}

const PRESET_COLORS = [
  'bg-pink-100 text-pink-700 border-pink-300 ring-pink-400',
  'bg-sky-100 text-sky-700 border-sky-300 ring-sky-400',
  'bg-emerald-100 text-emerald-700 border-emerald-300 ring-emerald-400',
  'bg-amber-100 text-amber-700 border-amber-300 ring-amber-400',
  'bg-indigo-100 text-indigo-700 border-indigo-300 ring-indigo-400',
  'bg-rose-100 text-rose-700 border-rose-300 ring-rose-400'
];

const PRESET_EMOJIS = ['👶', '🧒', '👧', '👦', '🍼', '🧸', '🎒', '🎨', '⚽', '🦄'];

export default function Header({
  childrenList,
  activeChildId,
  onSelectChild,
  onAddChild,
  onDeleteChild,
  totalTasksCount,
  completedTasksCount,
}: HeaderProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🧒');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName.trim()) return;
    onAddChild(newChildName.trim(), selectedEmoji, selectedColor);
    setNewChildName('');
    setSelectedEmoji('🧒');
    setSelectedColor(PRESET_COLORS[0]);
    setShowAddModal(false);
  };

  // Encouraging quote based on progress
  const getEncouragement = () => {
    if (totalTasksCount === 0) return "Time to take a little breather! ☕";
    const ratio = completedTasksCount / totalTasksCount;
    if (ratio === 1) return "Incredible! You handled everything today. Treat yourself to a real break! 🎉";
    if (ratio >= 0.7) return "Almost done! You're crushing it. ❤️";
    if (ratio >= 0.4) return "You're making great progress! One step at a time. ✨";
    if (ratio > 0) return "Here we go! Every little task done is a victory. 💪";
    return "One thing at a time. Breathe, you're a super mom! 🌸";
  };

  const progressPercentage = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  return (
    <header className="mb-6 space-y-5" id="app-header">
      {/* Top greeting banner - Vibrant Gold styled card */}
      <div className="bg-[#FFD966] rounded-[32px] p-6 shadow-md border-b-4 border-r-4 border-[#e0bf59] text-[#4B4453] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-inner shrink-0 text-3xl">
            ☀️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black font-display tracking-tight text-[#4B4453]">
                Have a sweet day, Mom!
              </h1>
            </div>
            <p className="text-stone-800 text-sm font-semibold mt-1 flex items-center gap-1 opacity-90">
              <Heart className="w-4 h-4 text-rose-600 fill-rose-500" /> {getEncouragement()}
            </p>
          </div>
        </div>

        {/* Mental Load Meter Card inside header with white/80 bg for premium contrast */}
        <div className="w-full md:w-64 bg-white/70 backdrop-blur-xs border border-white/50 rounded-2xl p-3 shadow-sm flex items-center gap-3">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-inner shrink-0">
            {/* Simple progress circle */}
            <svg className="w-10 h-10 transform -rotate-90">
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="#fef3c7"
                strokeWidth="3.5"
                fill="transparent"
              />
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="#d97706"
                strokeWidth="3.5"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 16}`}
                strokeDashoffset={`${2 * Math.PI * 16 * (1 - progressPercentage / 100)}`}
                className="transition-all duration-500 ease-out"
              />
            </svg>
            <span className="absolute text-xs font-black text-amber-900">{progressPercentage}%</span>
          </div>
          <div className="min-w-0">
            <div className="text-xs font-black text-[#4B4453] uppercase tracking-wider truncate">Today's Load</div>
            <div className="text-stone-700 text-xs font-semibold">
              {completedTasksCount} / {totalTasksCount} done
            </div>
          </div>
        </div>
      </div>

      {/* Children Quick Filter Area - UX Critical: Filter in 1-Click with Vibrant style */}
      <div className="bg-white rounded-[24px] p-4 shadow-sm border-b-2 border-r-2 border-stone-200">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-black uppercase tracking-wider text-[#4B4453] flex items-center gap-1.5">
            <User className="w-4 h-4 text-[#4B4453]" /> Filter by Child
          </span>
          <button
            onClick={() => setShowAddModal(true)}
            className="text-xs font-black text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all flex items-center gap-1 py-1.5 px-3 rounded-xl border border-rose-200"
            id="add-child-btn"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3px]" /> Add a child
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {/* Default "All" option */}
          <button
            onClick={() => onSelectChild(null)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 cursor-pointer border ${
              activeChildId === null
                ? 'bg-[#4B4453] text-white border-[#4B4453] shadow-md'
                : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border-stone-200'
            }`}
          >
            🏡 Whole family
          </button>

          {/* Render Kids */}
          {childrenList.map((child) => {
            const isActive = activeChildId === child.id;
            const colorParts = child.avatarColor.split(' ');
            const bgClass = colorParts[0];
            const textClass = colorParts[1];
            const ringClass = colorParts[3] || 'ring-stone-400';

            return (
              <div key={child.id} className="relative group shrink-0 flex items-center">
                <button
                  onClick={() => onSelectChild(isActive ? null : child.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
                    isActive
                      ? `${child.avatarColor} border-b-2 border-r-2 shadow-xs font-black`
                      : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border-stone-200'
                  }`}
                >
                  <span className="text-sm">{child.icon}</span>
                  <span>{child.name}</span>
                </button>
                
                {/* Visual delete button on hover or long-press */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete ${child.name}? Their associated tasks will lose this label.`)) {
                      onDeleteChild(child.id);
                    }
                  }}
                  className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-50 hover:text-red-600 rounded-full text-stone-400"
                  title={`Delete ${child.name}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Child Modal Dialog */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl border border-stone-100"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold font-display text-stone-800 flex items-center gap-1.5">
                  <Sparkles className="w-5 h-5 text-amber-500" /> Add a Child
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-400 mb-1.5">
                    Child's first name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Leo, Sarah, Emma..."
                    value={newChildName}
                    onChange={(e) => setNewChildName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 font-medium placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                    maxLength={15}
                  />
                </div>

                {/* Emoji selection */}
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-400 mb-1.5">
                    Choose an avatar emoji
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {PRESET_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setSelectedEmoji(emoji)}
                        className={`text-2xl p-2 rounded-xl transition-all cursor-pointer ${
                          selectedEmoji === emoji
                            ? 'bg-amber-100 ring-2 ring-amber-400 scale-110'
                            : 'hover:bg-stone-50'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color selection */}
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-400 mb-1.5">
                    Identification color
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_COLORS.map((color) => {
                      const bgOnly = color.split(' ')[0];
                      const borderOnly = color.split(' ')[2];
                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          className={`h-8 rounded-xl border ${borderOnly} ${bgOnly} cursor-pointer transition-all ${
                            selectedColor === color ? 'ring-2 ring-stone-700 scale-105 font-bold' : 'hover:scale-102'
                          }`}
                        >
                          Aa
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-stone-800 hover:bg-stone-900 text-white font-semibold rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer mt-2"
                >
                  Add to organizer
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
