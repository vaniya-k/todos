import { useState, useRef, useEffect } from "react";
import { LOCAL_STORAGE_KEY } from "./constants";
import { Filter } from "./types";
import type { FilterValue } from "./types";
import useTodos from "./useTodos";
import "./index.css";

function App() {
  const textInputRef = useRef<HTMLInputElement>(null);
  const [filter, setFilter] = useState<FilterValue>(Filter.All);

  const getInitialTodos = () => {
    const todos = localStorage.getItem(LOCAL_STORAGE_KEY);

    return todos ? JSON.parse(todos) : [];
  };

  const { todos, add, remove, toggle, clearCompleted } =
    useTodos(getInitialTodos);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const handleAdd = () => {
    const text = textInputRef.current?.value.trim() ?? "";

    if (text) {
      add(text);

      if (textInputRef.current) {
        textInputRef.current.value = "";
      }
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === Filter.Active) return !todo.completed;

    if (filter === Filter.Completed) return todo.completed;

    return true;
  });

  return (
    <div className="container">
      <h1>Todos</h1>

      <div className="new-item-wrapper">
        <input
          ref={textInputRef}
          autoFocus
          type="text"
          className="new-item"
          placeholder="Add a new task..."
          onKeyPress={(e) => e.key === "Enter" && handleAdd()}
        />
        <button className="add-button" onClick={handleAdd}>
          Add
        </button>
      </div>

      <div className="actions">
        <div className="filters">
          <button
            className={`filter-button ${
              filter === Filter.All ? "selected" : ""
            }`}
            onClick={() => setFilter(Filter.All)}
          >
            All
          </button>
          <button
            className={`filter-button ${
              filter === Filter.Active ? "selected" : ""
            }`}
            onClick={() => setFilter(Filter.Active)}
          >
            Active
          </button>
          <button
            className={`filter-button ${
              filter === Filter.Completed ? "selected" : ""
            }`}
            onClick={() => setFilter(Filter.Completed)}
          >
            Completed
          </button>
        </div>
        <button className="clear-completed-button" onClick={clearCompleted}>
          Clear completed
        </button>
      </div>

      <ul className="list">
        {filteredTodos.map((todo) => (
          <li
            key={todo.id}
            className={`item ${todo.completed ? "completed" : ""}`}
          >
            <input
              type="checkbox"
              id={`item-${todo.id}`}
              className="checkbox"
              checked={todo.completed}
              onChange={() => toggle(todo.id)}
            />
            <label className="text" htmlFor={`item-${todo.id}`}>
              {todo.text}
            </label>
            <button className="remove-button" onClick={() => remove(todo.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
