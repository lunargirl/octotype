import { useEffect, useState } from "react";
import { Home } from "./pages/Home.tsx";
import { Stats } from "./pages/Stats.tsx";
import { Vocabulary } from "./pages/Vocabulary.tsx";
import type { Route } from "./types.ts";

function readRoute(): Route {
  const hash = window.location.hash.replace(/^#/, "") || "/";
  if (hash === "/vocabulary" || hash.startsWith("/vocabulary/")) return "vocabulary";
  if (hash === "/stats" || hash.startsWith("/stats/")) return "stats";
  return "home";
}

export default function App() {
  const [route, setRoute] = useState<Route>(readRoute);

  useEffect(() => {
    const onChange = () => setRoute(readRoute());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  if (route === "vocabulary") return <Vocabulary />;
  if (route === "stats") return <Stats />;
  return <Home />;
}
