import type { Route } from "./+types/home";
import Dashboard from "~/Dashboard/Dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <main style={{ width: "100vw", height: "100vh" }}>
      <Dashboard />
    </main>
  );
}
