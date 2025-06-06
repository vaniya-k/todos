import { describe, test, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

describe("Todos App", () => {
  test("should add a valid todo item", () => {
    render(<App />);
    const input = screen.getByPlaceholderText("Add a new todo...");
    const addButton = screen.getByText("Add");

    fireEvent.change(input, { target: { value: "New todo item" } });
    fireEvent.click(addButton);

    expect(screen.getByText("New todo item")).toBeDefined();
    expect(input).toHaveValue("");
  });

  test("shouldn't add an empty todo item", () => {
    render(<App />);
    const input = screen.getByPlaceholderText("Add a new todo...");
    const addButton = screen.getByText("Add");

    fireEvent.change(input, { target: { value: " " } });
    fireEvent.click(addButton);

    expect(screen.queryByText(" ")).toBeNull();
    expect(input).toHaveValue(" ");
  });

  test("should trim whitespaces when adding a todo item", () => {
    render(<App />);
    const input = screen.getByPlaceholderText("Add a new todo...");
    const addButton = screen.getByText("Add");

    fireEvent.change(input, { target: { value: "   Trim this    " } });
    fireEvent.click(addButton);

    expect(screen.getByText("Trim this")).toBeDefined();
    expect(input).toHaveValue("");
  });

  test("should remove a todo item", () => {
    render(<App />);
    const input = screen.getByPlaceholderText("Add a new todo...");
    const addButton = screen.getByText("Add");

    fireEvent.change(input, { target: { value: "Item to remove" } });
    fireEvent.click(addButton);

    const removeButton = screen.getByText("Remove");
    fireEvent.click(removeButton);

    expect(screen.queryByText("Item to remove")).toBeNull();
  });

  test("should filter todo items correctly", () => {
    render(<App />);
    const input = screen.getByPlaceholderText("Add a new todo...");
    const addButton = screen.getByText("Add");

    fireEvent.change(input, { target: { value: "Active task" } });
    fireEvent.click(addButton);
    fireEvent.change(input, { target: { value: "Completed task" } });
    fireEvent.click(addButton);

    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[1]);

    fireEvent.click(screen.getByText("Active"));
    expect(screen.getByText("Active task")).toBeDefined();
    expect(screen.queryByText("Completed task")).toBeNull();

    fireEvent.click(screen.getByText("Completed"));
    expect(screen.queryByText("Active task")).toBeNull();
    expect(screen.getByText("Completed task")).toBeDefined();

    fireEvent.click(screen.getByText("All"));
    expect(screen.getByText("Active task")).toBeDefined();
    expect(screen.getByText("Completed task")).toBeDefined();
  });

  test("should clear completed todos", () => {
    render(<App />);
    const input = screen.getByPlaceholderText("Add a new todo...");
    const addButton = screen.getByText("Add");

    fireEvent.change(input, { target: { value: "Active task" } });
    fireEvent.click(addButton);
    fireEvent.change(input, { target: { value: "Completed task" } });
    fireEvent.click(addButton);

    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[1]);

    fireEvent.click(screen.getByText("Clear completed"));

    expect(screen.getByText("Active task")).toBeDefined();
    expect(screen.queryByText("Completed task")).toBeNull();
  });

  test("should persist todos in localStorage", () => {
    const { unmount } = render(<App />);
    const input = screen.getByPlaceholderText("Add a new todo...");
    fireEvent.change(input, { target: { value: "Test Todo" } });
    fireEvent.click(screen.getByText("Add"));

    unmount();
    render(<App />);

    expect(screen.getByText("Test Todo")).toBeInTheDocument();
  });
});
