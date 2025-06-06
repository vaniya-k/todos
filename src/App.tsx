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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const text = textInputRef.current?.value.trim() ?? "";

    if (text) {
      add(text);

      if (textInputRef.current) {
        textInputRef.current.value = "";
      }
    }
  };

  const handleListClick = (e: React.MouseEvent<HTMLUListElement>) => {
    const target = e.target as HTMLElement;
    const id = target.id;

    if (id && id.startsWith("checkbox-")) {
      const todoId = Number.parseInt(id.replace("checkbox-", ""));
      toggle(todoId);
    }

    if (id && id.startsWith("remove-")) {
      const todoId = Number.parseInt(id.replace("remove-", ""));
      remove(todoId);
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

      <form className="new-item-form" onSubmit={handleSubmit}>
        <input
          ref={textInputRef}
          autoFocus
          type="text"
          className="new-item"
          placeholder="Add a new todo..."
        />
        <button type="submit" className="add-button">
          Add
        </button>
      </form>

      <div className="actions">
        <div className="filters" role="group" aria-label="Filter todos">
          {Object.values(Filter).map((filterValue) => (
            <button
              key={filterValue}
              className={`filter-button ${
                filter === filterValue ? "selected" : ""
              }`}
              onClick={() => setFilter(filterValue)}
              aria-pressed={filter === filterValue}
            >
              {`${filterValue[0].toUpperCase() + filterValue.slice(1)}`}
            </button>
          ))}
        </div>
        <button className="clear-completed-button" onClick={clearCompleted}>
          Clear completed
        </button>
      </div>

      <ul className="list" aria-label="Todos list" onClick={handleListClick}>
        {filteredTodos.map((todo) => (
          <li
            key={todo.id}
            className={`item ${todo.completed ? "completed" : ""}`}
          >
            <input
              type="checkbox"
              id={`checkbox-${todo.id}`}
              className="checkbox"
              checked={todo.completed}
              readOnly
              aria-label={`"${todo.text}" is ${
                todo.completed ? "completed" : "active"
              }`}
            />
            <label className="text" htmlFor={`checkbox-${todo.id}`}>
              {todo.text}
            </label>
            <button
              id={`remove-${todo.id}`}
              className="remove-button"
              aria-label={`Remove "${todo.text}"`}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
