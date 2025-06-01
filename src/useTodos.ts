import { useState } from "react";
import type { Todo } from "./types";
import "./index.css";

interface useTodosReturn {
  todos: Todo[];
  add: (text: string) => void;
  toggle: (id: number) => void;
  remove: (id: number) => void;
  clearCompleted: () => void;
}

function useTodos(initialTodosCallback?: () => Todo[]): useTodosReturn {
  const [todos, setTodos] = useState<Todo[]>(initialTodosCallback ?? []);

  const add = (text: string) => {
    const newTodo = { id: Date.now(), text, completed: false };

    setTodos([...todos, newTodo]);
  };

  const toggle = (id: number) => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );

    setTodos(newTodos);
  };

  const remove = (id: number) => {
    const newTodos = todos.filter((todo) => todo.id !== id);

    setTodos(newTodos);
  };

  const clearCompleted = () => {
    const newTodos = todos.filter((todo) => !todo.completed);

    setTodos(newTodos);
  };

  return { todos, add, toggle, remove, clearCompleted };
}

export default useTodos;
