import React, { useState } from 'react';
import { Task, CategoryType, Child } from '../types';
import {
  Plus,
  CheckCircle2,
  Circle,
  Star,
  Trash2,
  Calendar,
  Baby,
  Smile,
  Home,
  Utensils,
  AlertTriangle,
  Flame,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TaskListProps {
  tasks: Task[];
  childrenList: Child[];
  activeChildId: string | null;
  onAddTask: (title: string, category: CategoryType, childId?: string, isPriority?: boolean) => void;
  onToggleComplete: (id: string) => void;
  onTogglePriority: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

const CATEGORIES: { value: CategoryType; label: string; icon: React.ReactNode; color: string; bg: string }[] = [
  { value: 'urgent', label: 'Urgent / Admin', icon: <AlertTriangle className="w-4 h-4 text-rose-500" />, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-100' },
  { value: 'kids', label: 'Enfants / École', icon: <Baby className="w-4 h-4 text-sky-500" />, color: 'text-sky-600', bg: 'bg-sky-50 border-sky-100' },
  { value: 'home', label: 'Maison / Ménage', icon: <Home className="w-4 h-4 text-emerald-500" />, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
  { value: 'meals', label: 'Repas / Courses', icon: <Utensils className="w-4 h-4 text-amber-500" />, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
  { value: 'personal', label: 'Mon Souffle / Perso 🌸', icon: <Smile className="w-4 h-4 text-purple-500" />, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100' }
];

const QUICK_TEMPLATES: { title: string; category: CategoryType; icon: string }[] = [
  { title: 'Lancer une machine 🧺', category: 'home', icon: '🧺' },
  { title: 'Plier le linge 👕', category: 'home', icon: '👕' },
  { title: 'Vider le lave-vaisselle 🍽️', category: 'home', icon: '🍽️' },
  { title: 'Vérifier les sacs/devoirs 🎒', category: 'kids', icon: '🎒' },
  { title: 'Remplir le mot de liaison 📝', category: 'kids', icon: '📝' },
  { title: 'Prendre mon café chaud ! ☕', category: 'personal', icon: '☕' },
  { title: 'Prendre 5 minutes de pause 🧘‍♀️', category: 'personal', icon: '🧘‍♀️' },
  { title: 'Boire un grand verre d\'eau 💧', category: 'personal', icon: '💧' }
];

export default function TaskList({
  tasks,
  childrenList,
  activeChildId,
  onAddTask,
  onToggleComplete,
  onTogglePriority,
  onDeleteTask,
}: TaskListProps) {
  const [newTitle, setNewTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('home');
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [isPriority, setIsPriority] = useState(false);
  
  // Collapse state for each category to save screen space
  const [collapsedCategories, setCollapsedCategories] = useState<Record<CategoryType, boolean>>({
    urgent: false,
    kids: false,
    home: false,
    meals: false,
    personal: false,
  });

  const toggleCategoryCollapse = (category: CategoryType) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    
    onAddTask(
      newTitle.trim(),
      selectedCategory,
      selectedChildId || undefined,
      isPriority
    );
    
    // Reset state
    setNewTitle('');
    setIsPriority(false);
    setSelectedChildId('');
  };

  const handleQuickAdd = (template: { title: string; category: CategoryType }) => {
    onAddTask(template.title, template.category, activeChildId || undefined, false);
  };

  // Filter tasks based on active child selection
  const filteredTasks = tasks.filter(task => {
    if (activeChildId === null) return true;
    return task.childId === activeChildId;
  });

  // Today's essentials: priority tasks
  const priorityTasks = filteredTasks.filter(t => t.isPriority);
  const regularTasks = filteredTasks.filter(t => !t.isPriority);

  // Helper to count incomplete priorities
  const activePriorityCount = priorityTasks.filter(t => !t.isCompleted).length;

  return (
    <div className="space-y-6" id="tasks-module">
      
      {/* SECTION 1: TODAY'S ESSENTIALS (MAX 3) - UX Crucial to avoid cognitive overload */}
      <div className="bg-[#FFF4E0] border-2 border-amber-200 border-b-4 border-r-4 rounded-[32px] p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Star className="w-24 h-24 text-amber-500 fill-amber-500" />
        </div>

        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" />
            <h2 className="text-base font-black text-[#4B4453] uppercase tracking-wider font-display">
              L'essentiel d'aujourd'hui
            </h2>
          </div>
          <span className="text-xs bg-amber-200/80 text-amber-900 font-black px-2.5 py-1 rounded-full flex items-center gap-1 border border-amber-300">
            <Clock className="w-3 h-3 stroke-[2.5px]" /> Max 3 ({activePriorityCount}/3)
          </span>
        </div>

        <p className="text-[#4B4453] text-xs font-semibold mb-4 opacity-85">
          Ajoute au maximum 3 tâches indispensables pour aujourd'hui. Le reste peut attendre !
        </p>

        {priorityTasks.length === 0 ? (
          <div className="text-center py-6 border-2 border-dashed border-amber-300/60 rounded-2xl bg-white/70">
            <p className="text-amber-800 text-xs font-bold">Aucun essentiel sélectionné pour aujourd'hui.</p>
            <p className="text-[10px] text-amber-700/80 mt-1 font-semibold">Étoile une tâche ci-dessous pour la placer ici.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            <AnimatePresence initial={false}>
              {priorityTasks.map(task => {
                const child = childrenList.find(c => c.id === task.childId);
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`flex items-center justify-between p-3.5 bg-white border-2 rounded-2xl shadow-xs transition-all ${
                      task.isCompleted ? 'border-amber-200 bg-amber-50/20 opacity-70' : 'border-amber-300/80 hover:border-amber-400'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <button
                        onClick={() => onToggleComplete(task.id)}
                        className="text-amber-500 hover:text-amber-600 transition-colors cursor-pointer shrink-0 focus:outline-hidden"
                      >
                        {task.isCompleted ? (
                          <CheckCircle2 className="w-5.5 h-5.5 fill-amber-100" />
                        ) : (
                          <Circle className="w-5.5 h-5.5 text-amber-400 hover:scale-105 transition-transform stroke-[2px]" />
                        )}
                      </button>
                      
                      <div className="min-w-0">
                        <span
                          className={`text-sm font-bold block leading-tight ${
                            task.isCompleted ? 'line-through text-stone-400 font-normal' : 'text-[#4B4453]'
                          }`}
                        >
                          {task.title}
                        </span>
                        
                        {/* Tags block */}
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          {/* Category Tag */}
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200 uppercase tracking-wider">
                            {CATEGORIES.find(c => c.value === task.category)?.label.split(' ')[0]}
                          </span>

                          {/* Child Tag if exists */}
                          {child && (
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md border ${child.avatarColor.split(' ')[0]} ${child.avatarColor.split(' ')[1]}`}>
                              {child.icon} {child.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => onTogglePriority(task.id)}
                        className="p-1.5 text-amber-500 hover:text-amber-600 rounded-lg hover:bg-stone-50 transition-colors"
                        title="Retirer des essentiels"
                      >
                        <Star className="w-4.5 h-4.5 fill-amber-500 text-amber-500" />
                      </button>
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="p-1.5 text-stone-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {activePriorityCount >= 3 && (
          <div className="mt-3 text-[11px] text-amber-950 bg-amber-100 border border-amber-200 p-2.5 rounded-xl flex items-center gap-1.5 font-bold">
            <Flame className="w-4 h-4 text-amber-600 shrink-0" />
            Super maman, ton essentiel est déjà à 3 tâches ! Pense à te préserver. 🧡
          </div>
        )}
      </div>

      {/* SECTION 2: ONE-CLICK QUICK TEMPLATES (UX Critical: Faster Logging) */}
      <div>
        <h3 className="text-xs font-black uppercase tracking-wider text-[#4B4453] mb-2.5 px-1 flex items-center gap-1.5">
          <span>⚡</span> Ajout Express en 1 clic
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {QUICK_TEMPLATES.map((tpl) => (
            <button
              key={tpl.title}
              onClick={() => handleQuickAdd(tpl)}
              className="text-left p-3 bg-white hover:bg-amber-50/50 border-2 border-stone-100 border-b-4 border-r-4 border-stone-200 rounded-2xl text-xs font-bold text-[#4B4453] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="text-base">{tpl.icon}</span>
              <span className="truncate leading-tight">{tpl.title.replace(/[\uD800-\uDFFF].*$/, '')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 3: ADD TASK FORM */}
      <div className="bg-white rounded-[28px] p-5 border-2 border-stone-100 border-b-4 border-r-4 border-stone-200/80 shadow-xs">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Ex: Rendez-vous pédiatre à 16h..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1 px-4 py-3 bg-stone-50 border-2 border-stone-200 rounded-2xl text-sm text-[#4B4453] font-bold placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#FFD966] focus:border-transparent transition-all"
              id="new-task-input"
            />
            <button
              type="submit"
              className="p-3.5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl shadow-sm border-b-4 border-r-4 border-rose-700 hover:border-rose-800 transition-all cursor-pointer flex items-center justify-center shrink-0"
              id="add-task-submit"
            >
              <Plus className="w-5.5 h-5.5 stroke-[3px]" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1 text-xs">
            {/* Category Selector */}
            <div className="flex items-center gap-2">
              <span className="text-stone-400 font-black text-[10px] uppercase tracking-wider shrink-0">Dossier:</span>
              <div className="flex gap-1 overflow-x-auto no-scrollbar py-0.5 max-w-full">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-3 py-1.5 rounded-xl border-2 text-[11px] font-black uppercase tracking-wider cursor-pointer transition-all shrink-0 flex items-center gap-1 ${
                      selectedCategory === cat.value
                        ? 'bg-[#4B4453] text-white border-[#4B4453]'
                        : 'bg-stone-50 text-stone-600 border-stone-200/60 hover:bg-stone-100'
                    }`}
                  >
                    {cat.icon}
                    <span>{cat.label.replace(/\s🌸/, '')}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-stone-100 text-xs">
            {/* Child Assigner */}
            <div className="flex items-center gap-2">
              <span className="text-stone-400 font-black text-[10px] uppercase tracking-wider shrink-0">Pour:</span>
              <div className="flex gap-1 overflow-x-auto no-scrollbar py-0.5 max-w-full">
                <button
                  type="button"
                  onClick={() => setSelectedChildId('')}
                  className={`px-3 py-1.5 rounded-xl border-2 text-[11px] font-black uppercase tracking-wider cursor-pointer transition-all shrink-0 ${
                    selectedChildId === ''
                      ? 'bg-[#4B4453] text-white border-[#4B4453]'
                      : 'bg-stone-50 text-stone-600 border-stone-200/60 hover:bg-stone-100'
                  }`}
                >
                  🏠 Toute la famille
                </button>

                {childrenList.map((child) => (
                  <button
                    key={child.id}
                    type="button"
                    onClick={() => setSelectedChildId(child.id)}
                    className={`px-3 py-1.5 rounded-xl border-2 text-[11px] font-black uppercase tracking-wider cursor-pointer transition-all shrink-0 ${
                      selectedChildId === child.id
                        ? `${child.avatarColor} border-b-2 border-r-2 ring-1 ring-stone-300`
                        : 'bg-stone-50 text-stone-600 border-stone-200/60 hover:bg-stone-100'
                    }`}
                  >
                    <span>{child.icon} {child.name}</span>
                  </button>
                ))}
              </div>
            </div>

        {/* Today Priority Toggle */}
            <label className="flex items-center gap-1.5 cursor-pointer py-1.5 px-3 bg-amber-50 hover:bg-amber-100 rounded-xl transition-all border border-amber-200 shadow-xs shrink-0 self-start sm:self-auto">
              <input
                type="checkbox"
                checked={isPriority}
                onChange={(e) => setIsPriority(e.target.checked)}
                className="rounded-md border-amber-400 text-amber-500 focus:ring-amber-400 w-4 h-4"
              />
              <span className="text-xs font-black text-amber-800 flex items-center gap-0.5 uppercase tracking-wider">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Indispensable
              </span>
            </label>
          </div>
        </form>
      </div>

      {/* SECTION 4: COLLAPSIBLE CATEGORIZED LISTS */}
      <div className="space-y-4">
        {CATEGORIES.map((cat) => {
          // Filter regular tasks in this category
          const categoryTasks = regularTasks.filter(t => t.category === cat.value);
          const totalInCat = categoryTasks.length;
          const completedInCat = categoryTasks.filter(t => t.isCompleted).length;
          const isCollapsed = collapsedCategories[cat.value];

          return (
            <div
              key={cat.value}
              className={`border-2 border-stone-200 border-b-4 border-r-4 rounded-[28px] bg-white overflow-hidden transition-all ${
                totalInCat > 0 ? 'opacity-100' : 'opacity-90'
              }`}
            >
              {/* Category Header Bar */}
              <button
                onClick={() => toggleCategoryCollapse(cat.value)}
                className="w-full flex items-center justify-between p-4.5 hover:bg-stone-50/50 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2 rounded-xl border border-b-2 border-r-2 ${cat.bg} shrink-0`}>
                    {cat.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-black text-[#4B4453] uppercase tracking-wider font-display flex items-center gap-1.5">
                      {cat.label}
                    </h3>
                    <p className="text-[10px] text-stone-500 font-bold">
                      {totalInCat === 0
                        ? 'Aucune tâche active'
                        : `${completedInCat} de faites sur ${totalInCat}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {totalInCat > 0 && (
                    <div className="w-12 bg-stone-100 border border-stone-200 rounded-full h-2 overflow-hidden shrink-0">
                      <div
                        className="bg-[#4B4453] h-full transition-all duration-300"
                        style={{ width: `${(completedInCat / totalInCat) * 100}%` }}
                      ></div>
                    </div>
                  )}
                  <span className="text-[#4B4453] text-[10px] uppercase tracking-wider font-black px-2 py-1 bg-stone-100 border border-stone-200 rounded-lg">
                    {isCollapsed ? 'Afficher' : 'Réduire'}
                  </span>
                </div>
              </button>

              {/* Tasks in Category */}
              {!isCollapsed && (
                <div className="px-4 pb-4 pt-1 border-t-2 border-stone-100 space-y-2">
                  {categoryTasks.length === 0 ? (
                    <div className="text-center py-4 text-stone-400 text-xs font-semibold">
                      Aucune tâche dans cette catégorie. Utilise le formulaire ci-dessus pour en ajouter une !
                    </div>
                  ) : (
                    <AnimatePresence initial={false}>
                      {categoryTasks.map((task) => {
                        const child = childrenList.find(c => c.id === task.childId);
                        return (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 3 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all ${
                              task.isCompleted
                                ? 'bg-stone-50/50 border-stone-100 opacity-60'
                                : 'bg-white border-stone-100/80 hover:border-stone-200'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <button
                                onClick={() => onToggleComplete(task.id)}
                                className="text-stone-400 hover:text-stone-600 transition-colors cursor-pointer shrink-0"
                              >
                                {task.isCompleted ? (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                                ) : (
                                  <Circle className="w-5 h-5 text-stone-300 stroke-[2px]" />
                                )}
                              </button>

                              <div className="min-w-0 flex-1">
                                <span
                                  className={`text-xs font-bold block leading-tight ${
                                    task.isCompleted ? 'line-through text-stone-400 font-normal' : 'text-[#4B4453]'
                                  }`}
                                >
                                  {task.title}
                                </span>
                                {child && (
                                  <span className={`inline-block mt-1 text-[8.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md border border-b-2 border-r-2 ${child.avatarColor.split(' ')[0]} ${child.avatarColor.split(' ')[1]} ${child.avatarColor.split(' ')[2]}`}>
                                    {child.icon} {child.name}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => onTogglePriority(task.id)}
                                className="p-1.5 text-stone-300 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                                title="Ajouter aux essentiels"
                              >
                                <Star className="w-4 h-4 stroke-[2px]" />
                              </button>
                              <button
                                onClick={() => onDeleteTask(task.id)}
                                className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
