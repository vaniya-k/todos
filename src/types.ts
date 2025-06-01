export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export const Filter = {
  All: "all",
  Active: "active",
  Completed: "completed",
} as const;

export type FilterValue = (typeof Filter)[keyof typeof Filter];
