import React, { useState } from 'react';
import { Meal, GroceryItem, DinnerSuggestion } from '../types';
import {
  Utensils,
  ShoppingCart,
  Plus,
  CheckCircle2,
  Circle,
  Sparkles,
  Trash2,
  Calendar,
  Check,
  Star,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MealPlannerProps {
  meals: Meal[];
  groceries: GroceryItem[];
  onUpdateMeal: (day: string, type: 'lunch' | 'dinner', value: string) => void;
  onAddGroceryItem: (name: string, category: string) => void;
  onToggleGroceryBought: (id: string) => void;
  onDeleteGroceryItem: (id: string) => void;
  onClearBoughtGroceries: () => void;
}

const DINNER_SUGGESTIONS: DinnerSuggestion[] = [
  { name: 'Pasta Carbonara 🍝', ingredients: ['Pasta', 'Bacon bits', 'Crème fraîche', 'Parmesan'] },
  { name: 'Zucchini Gratin 🍲', ingredients: ['Zucchini', 'Potatoes', 'Milk', 'Grated cheese'] },
  { name: 'Quick Croque-Monsieur 🥪', ingredients: ['Sandwich bread', 'Ham', 'Melting cheese', 'Butter'] },
  { name: 'Roast Chicken & Fries 🍗', ingredients: ['Whole chicken', 'Fries potatoes', 'Garlic', 'Herbes de Provence'] },
  { name: 'Chicken Fajitas 🌮', ingredients: ['Wheat tortillas', 'Chicken breasts', 'Bell peppers', 'Mexican spices', 'Avocado'] },
  { name: 'Savory Crêpes 🥞', ingredients: ['Flour', 'Eggs', 'Milk', 'Ham', 'Cheese', 'Mushrooms'] },
  { name: 'Homemade Vegetable Soup 🥕', ingredients: ['Carrots', 'Leeks', 'Potatoes', 'Stock cube'] },
  { name: 'Salmon & Fried Rice 🐟', ingredients: ['Salmon fillets', 'Basmati rice', 'Soy sauce', 'Zucchini'] }
];

const PRESET_GROCERIES = [
  { name: 'Milk 🥛', category: 'Fresh' },
  { name: 'Butter 🧈', category: 'Fresh' },
  { name: 'Eggs 🥚', category: 'Fresh' },
  { name: 'Sandwich bread 🍞', category: 'Groceries' },
  { name: 'Fresh fruit 🍎', category: 'Fruits/Vegetables' },
  { name: 'Diapers / Wipes 🍼', category: 'Baby/Hygiene' },
  { name: 'Toilet paper 🧻', category: 'Home' }
];

const GROCERY_CATEGORIES = ['Fresh', 'Groceries', 'Fruits/Vegetables', 'Baby/Hygiene', 'Home', 'Other'];

export default function MealPlanner({
  meals,
  groceries,
  onUpdateMeal,
  onAddGroceryItem,
  onToggleGroceryBought,
  onDeleteGroceryItem,
  onClearBoughtGroceries,
}: MealPlannerProps) {
  const [activeDay, setActiveDay] = useState('Monday');
  const [newGroceryName, setNewGroceryName] = useState('');
  const [selectedGroceryCat, setSelectedGroceryCat] = useState('Fresh');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestedMealIngredients, setSuggestedMealIngredients] = useState<{ meal: string; ingredients: string[] } | null>(null);

  const handleUpdateMealInput = (day: string, type: 'lunch' | 'dinner', value: string) => {
    onUpdateMeal(day, type, value);
  };

  const handleAddGrocerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroceryName.trim()) return;
    onAddGroceryItem(newGroceryName.trim(), selectedGroceryCat);
    setNewGroceryName('');
  };

  // 1-Click Select Suggested Meal - UX Critical: Automatically suggests ingredients to shopping list
  const handleSelectSuggestedMeal = (suggestion: DinnerSuggestion) => {
    onUpdateMeal(activeDay, 'dinner', suggestion.name);
    setShowSuggestions(false);
    
    // Propose adding ingredients
    setSuggestedMealIngredients({
      meal: suggestion.name,
      ingredients: [...suggestion.ingredients]
    });
  };

  const handleAddSuggestedIngredients = () => {
    if (suggestedMealIngredients) {
      suggestedMealIngredients.ingredients.forEach(ing => {
        // Find category automatically based on ingredient name or put as 'Other'
        let cat = 'Groceries';
        if (['Crème fraîche', 'Bacon bits', 'Parmesan', 'Grated cheese', 'Milk', 'Melting cheese', 'Butter', 'Ham', 'Cheese', 'Eggs', 'Salmon fillets'].includes(ing)) {
          cat = 'Fresh';
        } else if (['Zucchini', 'Potatoes', 'Bell peppers', 'Avocado', 'Carrots', 'Leeks', 'Fries potatoes'].includes(ing)) {
          cat = 'Fruits/Vegetables';
        }
        onAddGroceryItem(ing, cat);
      });
      setSuggestedMealIngredients(null);
    }
  };

  // Group groceries by category for clean visual structure
  const groupedGroceries = GROCERY_CATEGORIES.reduce((acc, cat) => {
    const items = groceries.filter(item => item.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {} as Record<string, GroceryItem[]>);

  const activeDayMeal = meals.find(m => m.day === activeDay) || { day: activeDay, lunch: '', dinner: '' };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="meal-planner-module">
      {/* LEFT COLUMN: MEAL PLANNER (7/12) */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white rounded-[32px] p-6 border-2 border-stone-200 border-b-4 border-r-4 shadow-xs">
          <div className="flex items-center gap-3 mb-5 border-b border-stone-100 pb-4">
            <div className="p-2.5 bg-[#FFD966] text-[#4B4453] rounded-2xl border-2 border-[#4B4453] border-b-4 border-r-4 shrink-0">
              <Utensils className="w-5.5 h-5.5 stroke-[2.5px]" />
            </div>
            <div>
              <h2 className="text-base font-black uppercase tracking-wider text-[#4B4453] font-display">Weekly Menu</h2>
              <p className="text-[11px] text-stone-500 font-bold">Lightens the "What's for dinner?" mental load</p>
            </div>
          </div>

          {/* Day selection tabs */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-3">
            {meals.map(m => (
              <button
                key={m.day}
                onClick={() => {
                  setActiveDay(m.day);
                  setSuggestedMealIngredients(null); // Clear suggestions prompt
                }}
                className={`px-3.5 py-2 rounded-2xl text-xs font-black uppercase tracking-wider cursor-pointer shrink-0 transition-all border-2 ${
                  activeDay === m.day
                    ? 'bg-[#FFD966] text-[#4B4453] border-[#4B4453] border-b-4 border-r-4 font-black shadow-xs'
                    : 'bg-stone-50 text-stone-600 border-stone-200/60 hover:bg-stone-100 hover:border-stone-300'
                }`}
              >
                {m.day}
                <span className="block text-[8px] font-black uppercase tracking-wider mt-0.5 opacity-80">
                  {m.dinner ? '✅ Planned' : '🍽️ Free'}
                </span>
              </button>
            ))}
          </div>

          {/* Active day detail planner */}
          <div className="mt-2 bg-stone-50/70 border-2 border-stone-100 rounded-[28px] p-5 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#4B4453] flex items-center gap-1.5 mb-2">
              <Calendar className="w-4 h-4 text-rose-500" /> {activeDay}'s Plan
            </h3>

            {/* Lunch Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-[#4B4453] flex items-center gap-1.5">
                ☀️ Midday (Lunch)
              </label>
              <input
                type="text"
                placeholder="Ex: Leftovers, Picnic, School canteen, Rice salad..."
                value={activeDayMeal.lunch}
                onChange={(e) => handleUpdateMealInput(activeDay, 'lunch', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-stone-200 rounded-2xl text-xs font-bold text-[#4B4453] placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#FFD966] focus:border-transparent transition-all"
              />
            </div>

            {/* Dinner Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-black uppercase tracking-wider text-[#4B4453] flex items-center gap-1.5">
                  🌙 Evening (Dinner)
                </label>
                <button
                  type="button"
                  onClick={() => setShowSuggestions(!showSuggestions)}
                  className="text-[10px] font-black uppercase tracking-wider text-[#4B4453] bg-amber-100 hover:bg-amber-200 border-2 border-[#4B4453] px-2.5 py-1 rounded-xl transition-all flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" /> {showSuggestions ? "Hide" : "Quick ideas!"}
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Ex: Zucchini gratin, Pasta bolognese..."
                  value={activeDayMeal.dinner}
                  onChange={(e) => handleUpdateMealInput(activeDay, 'dinner', e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-stone-200 rounded-2xl text-xs font-bold text-[#4B4453] placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#FFD966] focus:border-transparent transition-all"
                />
              </div>

              {/* Collapsible Dinner Ideas Presets - UX Critical: Click to choose */}
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-white border-2 border-[#4B4453] border-b-4 border-r-4 rounded-[22px] mt-2 p-3"
                  >
                    <p className="text-[10px] text-[#4B4453] font-black uppercase tracking-wider mb-2 px-1">Quick dinners kids love:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto no-scrollbar">
                      {DINNER_SUGGESTIONS.map((suggestion) => (
                        <button
                          key={suggestion.name}
                          type="button"
                          onClick={() => handleSelectSuggestedMeal(suggestion)}
                          className="text-left p-2.5 rounded-xl text-xs font-bold text-[#4B4453] bg-stone-50 hover:bg-amber-50 hover:text-amber-900 border-2 border-stone-100 hover:border-[#FFD966] transition-colors cursor-pointer flex items-center justify-between"
                        >
                          <span className="truncate">{suggestion.name}</span>
                          <span className="text-[9px] font-black uppercase tracking-wider bg-[#FFD966]/40 px-1.5 py-0.5 rounded-md border border-[#FFD966] shrink-0 font-medium">+</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Automatic Ingredients syncing proposal */}
          <AnimatePresence>
            {suggestedMealIngredients && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="mt-4 p-4.5 bg-[#FFF4E0] border-2 border-[#4B4453] border-b-4 border-r-4 rounded-[24px] text-xs flex flex-col md:flex-row items-center justify-between gap-3"
              >
                <div>
                  <span className="font-black text-amber-950 flex items-center gap-1 uppercase tracking-wider text-[11px]">🪄 Grocery sync: </span>
                  <span className="text-[#4B4453] font-bold text-xs">Add the ingredients for {suggestedMealIngredients.meal} to the list?</span>
                  <p className="text-[10px] text-[#4B4453]/80 font-semibold mt-1">({suggestedMealIngredients.ingredients.join(', ')})</p>
                </div>
                <div className="flex gap-2 shrink-0 w-full md:w-auto justify-end">
                  <button
                    onClick={() => setSuggestedMealIngredients(null)}
                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 border-2 border-stone-300 rounded-xl text-stone-600 font-black text-[10px] uppercase tracking-wider cursor-pointer"
                  >
                    No thanks
                  </button>
                  <button
                    onClick={handleAddSuggestedIngredients}
                    className="px-4 py-2 bg-[#FF6B6B] hover:bg-[#ff5555] text-white border-2 border-[#4B4453] border-b-4 border-r-4 rounded-xl font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3px]" /> Yes, add it!
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT COLUMN: GROCERIES TRACKER (5/12) */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white rounded-[32px] p-6 border-2 border-stone-200 border-b-4 border-r-4 shadow-xs flex flex-col h-full min-h-[400px]">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#E0F2F1] text-[#4B4453] border-2 border-[#4B4453] border-b-4 border-r-4 rounded-2xl">
                <ShoppingCart className="w-5.5 h-5.5 stroke-[2.5px]" />
              </div>
              <div>
                <h2 className="text-base font-black uppercase tracking-wider text-[#4B4453] font-display">Grocery List</h2>
                <p className="text-[11px] text-stone-500 font-bold">{groceries.length} items to buy</p>
              </div>
            </div>

            {groceries.some(g => g.isBought) && (
              <button
                onClick={onClearBoughtGroceries}
                className="text-[10px] text-stone-400 hover:text-red-500 hover:bg-red-50 px-2.5 py-1.5 rounded-xl font-black uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer border-2 border-transparent hover:border-red-100"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>

          {/* Form to manual add */}
          <form onSubmit={handleAddGrocerySubmit} className="flex gap-1.5 mb-4">
            <input
              type="text"
              required
              placeholder="Add: butter, apples..."
              value={newGroceryName}
              onChange={(e) => setNewGroceryName(e.target.value)}
              className="flex-1 px-3 py-2.5 bg-stone-50 border-2 border-stone-200 rounded-xl text-xs text-[#4B4453] font-bold placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#FFD966] focus:border-transparent transition-all"
            />
            <select
              value={selectedGroceryCat}
              onChange={(e) => setSelectedGroceryCat(e.target.value)}
              className="bg-stone-50 border-2 border-stone-200 rounded-xl text-xs px-2 text-[#4B4453] font-bold focus:outline-hidden"
            >
              {GROCERY_CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button
              type="submit"
              className="p-3 bg-[#FF6B6B] hover:bg-[#ff5555] text-white border-2 border-[#4B4453] border-b-4 border-r-4 rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3px]" />
            </button>
          </form>

          {/* Presets/Frictionless Shopping additions - 1 Click adds */}
          <div className="mb-4 bg-stone-50/50 p-3 rounded-2xl border border-stone-100">
            <p className="text-[10px] text-[#4B4453] font-black uppercase tracking-wider mb-2 px-0.5">1-click essentials:</p>
            <div className="flex flex-wrap gap-1">
              {PRESET_GROCERIES.map((preset) => {
                const alreadyAdded = groceries.some(g => g.name.toLowerCase().includes(preset.name.split(' ')[0].toLowerCase()) && !g.isBought);
                return (
                  <button
                    key={preset.name}
                    type="button"
                    disabled={alreadyAdded}
                    onClick={() => onAddGroceryItem(preset.name, preset.category)}
                    className={`text-[10px] px-2.5 py-1.5 rounded-xl border-2 font-black uppercase tracking-wider transition-all flex items-center gap-1 ${
                      alreadyAdded
                        ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                        : 'bg-white text-stone-700 hover:bg-rose-50 border-stone-200/60 hover:border-rose-300 cursor-pointer'
                    }`}
                  >
                    <span>{preset.name}</span>
                    {!alreadyAdded && <Plus className="w-2.5 h-2.5 stroke-[2px]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grocery items checklist */}
          <div className="flex-1 overflow-y-auto max-h-72 space-y-4 pr-1.5 no-scrollbar">
            {groceries.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-stone-200 rounded-[24px] bg-stone-50/30">
                <ShoppingCart className="w-8 h-8 text-stone-300 mx-auto mb-2 stroke-[1.5px]" />
                <p className="text-[#4B4453] text-xs font-black uppercase tracking-wider">The fridge is full!</p>
                <p className="text-[10px] text-stone-400 font-semibold mt-1">Add items or pick a dinner idea.</p>
              </div>
            ) : (
              Object.entries(groupedGroceries).map(([category, items]) => (
                <div key={category} className="space-y-1.5">
                  <div className="text-[9.5px] font-black uppercase text-[#4B4453] tracking-widest mb-1.5 px-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B6B]"></span>
                    {category}
                  </div>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all ${
                          item.isBought
                            ? 'bg-stone-50/50 border-stone-100/50 opacity-55'
                            : 'bg-white border-stone-100/80 hover:border-stone-200'
                        }`}
                      >
                        <button
                          onClick={() => onToggleGroceryBought(item.id)}
                          className="flex items-center gap-2.5 text-left flex-1 min-w-0"
                        >
                          {item.isBought ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50 shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-stone-300 shrink-0 hover:text-stone-500 transition-colors stroke-[2px]" />
                          )}
                          <span
                            className={`text-xs font-bold truncate ${
                              item.isBought ? 'line-through text-stone-400 font-normal' : 'text-[#4B4453]'
                            }`}
                          >
                            {item.name}
                          </span>
                        </button>
                        <button
                          onClick={() => onDeleteGroceryItem(item.id)}
                          className="p-1 text-stone-400 hover:text-red-500 rounded-lg hover:bg-stone-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
