import "@testing-library/jest-dom";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import { LOCAL_STORAGE_KEY } from "./src/constants";

afterEach(() => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  cleanup();
});
