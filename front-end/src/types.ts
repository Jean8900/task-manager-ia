export type CategoryType = 'kids' | 'home' | 'meals' | 'personal' | 'urgent';

export interface Child {
  id: string;
  name: string;
  avatarColor: string; // Tailwind class
  icon: string; // Emoji
}

export interface Task {
  id: string;
  title: string;
  category: CategoryType;
  childId?: string; // Optional assignment to a child
  isCompleted: boolean;
  isPriority: boolean; // Today's essential (max 3)
  createdAt: string;
  dueDate?: string;
  quickNote?: string;
}

export interface Meal {
  day: string; // 'Monday', 'Tuesday', 'Wednesday', etc.
  lunch: string;
  dinner: string;
  lunchIngredientsAdded?: boolean;
  dinnerIngredientsAdded?: boolean;
}

export interface GroceryItem {
  id: string;
  name: string;
  category: string; // 'Fresh', 'Groceries', 'Home', etc.
  isBought: boolean;
  quantity?: string;
}

export interface PredefinedIdea {
  title: string;
  category: CategoryType;
  childRequired?: boolean;
}

export interface DinnerSuggestion {
  name: string;
  ingredients: string[];
}
