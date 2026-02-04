import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  isDone: boolean;
  dueDate?: string; 
}

interface TodoState {
  todos: Todo[];
  addTodo: (title: string, description?: string, dueDate?: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
}
export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      todos: [],

      addTodo: (title, description, dueDate) => set((state) => ({
        todos: [
          {
            id: uuidv4(),
            title,
            description: description || '',
            isDone: false,
            dueDate: dueDate || 'Today',
          },
          ...state.todos,
        ],
      })),

      toggleTodo: (id) => set((state) => ({
        todos: state.todos.map((todo) =>
          todo.id === id ? { ...todo, isDone: !todo.isDone } : todo
        ),
      })),

      deleteTodo: (id) => set((state) => ({
        todos: state.todos.filter((todo) => todo.id !== id),
      })),
    }),
    {
      name: 'todo-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);