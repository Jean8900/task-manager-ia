import React, { useState, useEffect } from 'react';
import { Child, Task, Meal, GroceryItem, CategoryType } from './types';
import Header from './components/Header';
import TaskList from './components/TaskList';
import MealPlanner from './components/MealPlanner';
import SelfCareWidget from './components/SelfCareWidget';
import AISupportWidget from './components/AISupportWidget';
import {
  ListTodo,
  Utensils,
  Smile,
  Heart,
  Sparkles,
  ArrowLeft,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Seeding default children if empty
const DEFAULT_CHILDREN: Child[] = [
  { id: 'leo', name: 'Léo', avatarColor: 'bg-sky-100 text-sky-700 border-sky-300 ring-sky-400', icon: '👦' },
  { id: 'sarah', name: 'Sarah', avatarColor: 'bg-pink-100 text-pink-700 border-pink-300 ring-pink-400', icon: '👧' }
];

// Seeding default tasks if empty
const DEFAULT_TASKS: Task[] = [
  { id: 'task-1', title: 'Remplir l\'autorisation de sortie scolaire de Sarah 🎒', category: 'kids', childId: 'sarah', isCompleted: false, isPriority: true, createdAt: new Date().toISOString() },
  { id: 'task-2', title: 'Prendre rendez-vous pédiatre (rappel vaccin Léo) 🏥', category: 'urgent', childId: 'leo', isCompleted: false, isPriority: true, createdAt: new Date().toISOString() },
  { id: 'task-3', title: 'Lancer une machine de blanc (vêtements sport) 🧺', category: 'home', isCompleted: false, isPriority: false, createdAt: new Date().toISOString() },
  { id: 'task-4', title: 'Préparer le goûter d\'anniversaire de Léo 🎂', category: 'kids', childId: 'leo', isCompleted: false, isPriority: false, createdAt: new Date().toISOString() },
  { id: 'task-5', title: 'Boire un thé bien chaud (rien que pour moi !) ☕', category: 'personal', isCompleted: false, isPriority: false, createdAt: new Date().toISOString() }
];

// Seeding default meals skeleton
const DAYS_OF_WEEK = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const DEFAULT_MEALS: Meal[] = DAYS_OF_WEEK.map(day => ({
  day,
  lunch: '',
  dinner: day === 'Mardi' ? 'Pâtes Carbonara 🍝' : '' // Cute showcase
}));

// Seeding default groceries
const DEFAULT_GROCERIES: GroceryItem[] = [
  { id: 'grocery-1', name: 'Lait demi-écrémé 🥛', category: 'Frais', isBought: false },
  { id: 'grocery-2', name: 'Bananes bio 🍌', category: 'Fruits/Légumes', isBought: false },
  { id: 'grocery-3', name: 'Beurre doux 🧈', category: 'Frais', isBought: true }
];

export default function App() {
  // --- STATE INITIALIZATION WITH LOCALSTORAGE SYNC ---
  const [childrenList, setChildrenList] = useState<Child[]>(() => {
    const saved = localStorage.getItem('maman_children');
    return saved ? JSON.parse(saved) : DEFAULT_CHILDREN;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('maman_tasks');
    return saved ? JSON.parse(saved) : DEFAULT_TASKS;
  });

  const [meals, setMeals] = useState<Meal[]>(() => {
    const saved = localStorage.getItem('maman_meals');
    return saved ? JSON.parse(saved) : DEFAULT_MEALS;
  });

  const [groceries, setGroceries] = useState<GroceryItem[]>(() => {
    const saved = localStorage.getItem('maman_groceries');
    return saved ? JSON.parse(saved) : DEFAULT_GROCERIES;
  });

  // UX Filters
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tasks' | 'meals' | 'selfcare'>('tasks');
  const [showAISupport, setShowAISupport] = useState(false);

  // --- SAVE STATE EFFECTS ---
  useEffect(() => {
    localStorage.setItem('maman_children', JSON.stringify(childrenList));
  }, [childrenList]);

  useEffect(() => {
    localStorage.setItem('maman_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('maman_meals', JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem('maman_groceries', JSON.stringify(groceries));
  }, [groceries]);

  // --- COMPONENT ACTION HANDLERS ---
  
  // Tasks handlers
  const handleAddTask = (title: string, category: CategoryType, childId?: string, isPriority = false) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      category,
      childId,
      isCompleted: false,
      isPriority,
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const handleToggleCompleteTask = (id: string) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
    ));
  };

  const handleTogglePriorityTask = (id: string) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, isPriority: !task.isPriority } : task
    ));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  // Kids handlers
  const handleAddChild = (name: string, icon: string, color: string) => {
    const newChild: Child = {
      id: `child-${Date.now()}`,
      name,
      icon,
      avatarColor: color
    };
    setChildrenList(prev => [...prev, newChild]);
  };

  const handleDeleteChild = (id: string) => {
    // Delete child
    setChildrenList(prev => prev.filter(c => c.id !== id));
    // Clear associations in tasks but retain the actual tasks
    setTasks(prev => prev.map(task =>
      task.childId === id ? { ...task, childId: undefined } : task
    ));
    // Reset filter if active
    if (activeChildId === id) {
      setActiveChildId(null);
    }
  };

  // Meals handlers
  const handleUpdateMeal = (day: string, type: 'lunch' | 'dinner', value: string) => {
    setMeals(prev => prev.map(meal =>
      meal.day === day ? { ...meal, [type]: value } : meal
    ));
  };

  // Groceries handlers
  const handleAddGrocery = (name: string, category: string) => {
    // Avoid double inserts for identical products
    const exists = groceries.some(g => g.name.toLowerCase() === name.toLowerCase() && !g.isBought);
    if (exists) return;

    const newItem: GroceryItem = {
      id: `grocery-${Date.now()}`,
      name,
      category,
      isBought: false
    };
    setGroceries(prev => [newItem, ...prev]);
  };

  const handleToggleGroceryBought = (id: string) => {
    setGroceries(prev => prev.map(g =>
      g.id === id ? { ...g, isBought: !g.isBought } : g
    ));
  };

  const handleDeleteGrocery = (id: string) => {
    setGroceries(prev => prev.filter(g => g.id !== id));
  };

  const handleClearBoughtGroceries = () => {
    setGroceries(prev => prev.filter(g => !g.isBought));
  };

  // Statistics for load meter in header
  const totalTasksCount = tasks.filter(t => activeChildId === null ? true : t.childId === activeChildId).length;
  const completedTasksCount = tasks.filter(t => (activeChildId === null ? true : t.childId === activeChildId) && t.isCompleted).length;

  return (
    <div className="min-h-screen bg-[#FFFBF0] text-[#2D2D2D] pb-24 md:pb-12 flex flex-col items-center px-4" id="maman-tasks-root">
      {/* Dynamic AI Support Overlay Screen */}
      <AnimatePresence>
        {showAISupport && (
          <div className="fixed inset-0 bg-[#FFFBF0] z-50 flex flex-col overflow-y-auto p-4 md:p-8 border-t-[8px] border-rose-400" id="ai-support-layer">
            <div className="max-w-4xl mx-auto w-full flex items-center justify-between border-b-2 border-stone-200 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-400 text-white border-2 border-[#4B4453] border-b-4 border-r-4 rounded-2xl">
                  <Sparkles className="w-6 h-6 fill-white" />
                </div>
                <div>
                  <h1 className="text-lg font-black uppercase tracking-wider text-[#4B4453] font-display">Soutien IA 🧠</h1>
                  <p className="text-[11px] text-stone-500 font-bold">Ton allié bienveillant, disponible à tout moment.</p>
                </div>
              </div>

              <button
                onClick={() => setShowAISupport(false)}
                className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-stone-50 text-[#4B4453] border-2 border-[#4B4453] border-b-4 border-r-4 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-all"
              >
                <ArrowLeft className="w-4 h-4 stroke-[3px]" /> Retour au calme
              </button>
            </div>

            <AISupportWidget />
          </div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-4xl flex flex-col pt-4 md:pt-8">
        
        {/* APP HEADER */}
        <Header
          childrenList={childrenList}
          activeChildId={activeChildId}
          onSelectChild={setActiveChildId}
          onAddChild={handleAddChild}
          onDeleteChild={handleDeleteChild}
          totalTasksCount={totalTasksCount}
          completedTasksCount={completedTasksCount}
        />

        {/* NAVIGATION TABS - UX Critical: Exactly 1 click to reach any page */}
        <div className="flex gap-2 p-1.5 bg-white border-2 border-[#4B4453] border-b-4 border-r-4 rounded-[24px] mb-6 max-w-4xl w-full mx-auto">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex-1 py-3 px-2 text-xs font-black uppercase tracking-wider rounded-2xl flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer transition-all border-2 ${
              activeTab === 'tasks'
                ? 'bg-[#FFD966] text-[#4B4453] border-[#4B4453] shadow-[2px_2px_0px_#4B4453]'
                : 'text-stone-500 hover:text-[#4B4453] border-transparent hover:bg-stone-50'
            }`}
          >
            <ListTodo className="w-4.5 h-4.5 text-rose-500 shrink-0 stroke-[2.5px]" />
            <span className="truncate">Mes Tâches</span>
          </button>

          <button
            onClick={() => setActiveTab('meals')}
            className={`flex-1 py-3 px-2 text-xs font-black uppercase tracking-wider rounded-2xl flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer transition-all border-2 ${
              activeTab === 'meals'
                ? 'bg-[#FFD966] text-[#4B4453] border-[#4B4453] shadow-[2px_2px_0px_#4B4453]'
                : 'text-stone-500 hover:text-[#4B4453] border-transparent hover:bg-stone-50'
            }`}
          >
            <Utensils className="w-4.5 h-4.5 text-amber-500 shrink-0 stroke-[2.5px]" />
            <span className="truncate">Repas & Courses</span>
          </button>

          <button
            onClick={() => setActiveTab('selfcare')}
            className={`flex-auto py-3 px-4 text-xs font-black uppercase tracking-wider rounded-2xl flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer transition-all border-2 ${
              activeTab === 'selfcare'
                ? 'bg-[#FFD966] text-[#4B4453] border-[#4B4453] shadow-[2px_2px_0px_#4B4453]'
                : 'text-stone-500 hover:text-[#4B4453] border-transparent hover:bg-stone-50'
            }`}
          >
            <Smile className="w-4.5 h-4.5 text-purple-500 shrink-0 stroke-[2.5px]" />
            <span className="truncate">Mon Souffle 🌸</span>
          </button>
        </div>

        {/* ACTIVE SCREEN RENDERER */}
        <main className="flex-1">
          {activeTab === 'tasks' && (
            <TaskList
              tasks={tasks}
              childrenList={childrenList}
              activeChildId={activeChildId}
              onAddTask={handleAddTask}
              onToggleComplete={handleToggleCompleteTask}
              onTogglePriority={handleTogglePriorityTask}
              onDeleteTask={handleDeleteTask}
            />
          )}

          {activeTab === 'meals' && (
            <MealPlanner
              meals={meals}
              groceries={groceries}
              onUpdateMeal={handleUpdateMeal}
              onAddGroceryItem={handleAddGrocery}
              onToggleGroceryBought={handleToggleGroceryBought}
              onDeleteGroceryItem={handleDeleteGrocery}
              onClearBoughtGroceries={handleClearBoughtGroceries}
            />
          )}

          {activeTab === 'selfcare' && (
            <SelfCareWidget
              todayTasks={tasks.filter(t => activeChildId === null ? true : t.childId === activeChildId)}
              onToggleComplete={handleToggleCompleteTask}
            />
          )}
        </main>
      </div>

      {/* STICKY SOUTIEN IA FLOATING BUTTON - Click 1: Immediate comfort */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowAISupport(true)}
          className="bg-[#FF6B6B] hover:bg-[#ff5555] active:scale-95 text-white p-4.5 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center gap-2 border-2 border-[#4B4453] border-b-4 border-r-4 font-black uppercase tracking-wider text-xs"
          title="Soutien IA - Ton allié bienveillant"
          id="sticky-ai-support-btn"
        >
          <Sparkles className="w-5.5 h-5.5 animate-pulse shrink-0 fill-white stroke-[2.5px]" />
          <span>Soutien IA 🧠</span>
        </button>
      </div>

      {/* COMFORT FOOTER DETAILS */}
      <footer className="mt-12 py-6 border-t-2 border-stone-200 text-center text-xs text-[#4B4453] w-full max-w-4xl font-black uppercase tracking-wider text-[10px]">
        <p className="flex items-center justify-center gap-1.5">
          Conçu avec <Heart className="w-4.5 h-4.5 text-rose-500 fill-rose-500" /> pour toutes les super-mamans.
        </p>
        <p className="text-[9px] text-stone-400 font-bold tracking-normal mt-2 lowercase normal-case">
          Toutes les données sont stockées sur ton navigateur. Pas de compte, pas de publicité, accès instantané.
        </p>
      </footer>
    </div>
  );
}
