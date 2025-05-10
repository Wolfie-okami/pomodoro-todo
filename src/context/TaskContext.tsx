import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Types
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  completedAt: string | null;
  pomodorosCompleted: number;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (text: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  reorderTasks: (sourceIndex: number, destinationIndex: number) => void;
  incrementPomodoroCount: (id: string) => void;
}

interface TaskState {
  tasks: Task[];
}

type TaskAction = 
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: { id: string } }
  | { type: 'COMPLETE_TASK'; payload: { id: string } }
  | { type: 'REORDER_TASKS'; payload: { sourceIndex: number; destinationIndex: number } }
  | { type: 'INCREMENT_POMODORO'; payload: { id: string } }
  | { type: 'SET_TASKS'; payload: Task[] };

// Context
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Reducer
function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [action.payload, ...state.tasks]
      };
    
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload.id 
            ? { ...task, ...action.payload.updates } 
            : task
        )
      };
    
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload.id)
      };
    
    case 'COMPLETE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload.id 
            ? { 
                ...task, 
                completed: true, 
                completedAt: new Date().toISOString() 
              } 
            : task
        )
      };
    
    case 'REORDER_TASKS': {
      const { sourceIndex, destinationIndex } = action.payload;
      const result = Array.from(state.tasks);
      const [removed] = result.splice(sourceIndex, 1);
      result.splice(destinationIndex, 0, removed);
      
      return {
        ...state,
        tasks: result
      };
    }
    
    case 'INCREMENT_POMODORO':
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload.id 
            ? { 
                ...task, 
                pomodorosCompleted: task.pomodorosCompleted + 1
              } 
            : task
        )
      };
    
    case 'SET_TASKS':
      return {
        ...state,
        tasks: action.payload
      };
    
    default:
      return state;
  }
}

// Provider
export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [savedTasks, setSavedTasks] = useLocalStorage<Task[]>('pomodoro-tasks', []);
  
  const [state, dispatch] = useReducer(taskReducer, {
    tasks: savedTasks || []
  });
  
  // Save tasks to localStorage whenever they change
  useEffect(() => {
    setSavedTasks(state.tasks);
  }, [state.tasks, setSavedTasks]);
  
  // Actions
  const addTask = (text: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
      pomodorosCompleted: 0
    };
    
    dispatch({ type: 'ADD_TASK', payload: newTask });
  };
  
  const updateTask = (id: string, updates: Partial<Task>) => {
    dispatch({ type: 'UPDATE_TASK', payload: { id, updates } });
  };
  
  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: { id } });
  };
  
  const completeTask = (id: string) => {
    dispatch({ type: 'COMPLETE_TASK', payload: { id } });
  };
  
  const reorderTasks = (sourceIndex: number, destinationIndex: number) => {
    dispatch({ 
      type: 'REORDER_TASKS', 
      payload: { sourceIndex, destinationIndex } 
    });
  };
  
  const incrementPomodoroCount = (id: string) => {
    dispatch({ type: 'INCREMENT_POMODORO', payload: { id } });
  };
  
  return (
    <TaskContext.Provider 
      value={{ 
        tasks: state.tasks, 
        addTask, 
        updateTask, 
        deleteTask, 
        completeTask, 
        reorderTasks,
        incrementPomodoroCount
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

// Hook
export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}