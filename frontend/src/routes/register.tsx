import { createFileRoute } from "@tanstack/react-router";
import Register from "../features/register";

export const Route = createFileRoute('/register')({
  component: Register,
});
