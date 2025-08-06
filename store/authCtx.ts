import { create } from 'zustand';

type Task = {
  id: string;
  name: string;
  dateTime: Date; 
  completed: boolean;
  favorite: boolean;
};

type TaskList = {
  id: string;
  name: string;
  tasks: Task[];
};

type AuthState = {
  userId: string | null;
  setUserId: (id: string | null) => void;

  taskLists: TaskList[];
  setTaskLists: (lists: TaskList[]) => void;
  addTaskList: (list: TaskList) => void;
  removeTaskList: (id: string) => void;
  updateTaskListName: (id: string, newName: string) => void;

  updateTask: (listId: string, taskId: string, updatedTask: Partial<Task>) => void;
  deleteTask: (listId: string, taskId: string) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  setUserId: (id) => set({ userId: id }),

  taskLists: [],
  setTaskLists: (lists) => set({ taskLists: lists }),
  addTaskList: (list) =>
    set((state) => ({
      taskLists: [...state.taskLists, list],
    })),
  removeTaskList: (id) =>
    set((state) => ({
      taskLists: state.taskLists.filter((list) => list.id !== id),
    })),
  updateTaskListName: (id, newName) =>
    set((state) => ({
      taskLists: state.taskLists.map((list) =>
        list.id === id ? { ...list, name: newName } : list
      ),
    })),
  updateTask: (listId, taskId, updatedTask) =>
    set((state) => ({
      taskLists: state.taskLists.map((list) =>
        list.id === listId
          ? {
              ...list,
              tasks: list.tasks.map((task) =>
                task.id === taskId ? { ...task, ...updatedTask } : task
              ),
            }
          : list
      ),
    })),
  deleteTask: (listId, taskId) =>
    set((state) => ({
      taskLists: state.taskLists.map((list) =>
        list.id === listId
          ? {
              ...list,
              tasks: list.tasks.filter((task) => task.id !== taskId),
            }
          : list
      ),
    })),
}));
