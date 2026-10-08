import type { ReactNode } from "react";
import type { Route } from "../types.ts";
import { StatsBar } from "./StatsBar.tsx";

export function PageFrame({
  route,
  wpm,
  accuracy,
  children,
}: {
  route: Route;
  wpm: number | null;
  accuracy: number | null;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-5 py-8 sm:px-8 sm:py-14">
      <StatsBar route={route} wpm={wpm} accuracy={accuracy} />
      <main className="mx-auto mt-16 w-full max-w-[40rem] flex-1 sm:mt-20">{children}</main>
    </div>
  );
}
