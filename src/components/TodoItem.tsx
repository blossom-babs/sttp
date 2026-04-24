"use client";

import { Todo } from "@/lib/types";

interface Props {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onSelect: (todo: Todo) => void;
  showDate?: boolean;
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function TodoItem({ todo, onToggle, onSelect, showDate }: Props) {
  return (
    <li className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition hover:bg-zinc-100">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle(todo.id, !todo.completed);
        }}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition cursor-pointer ${
          todo.completed
            ? "border-emerald-500 bg-emerald-500"
            : "border-zinc-300 hover:border-zinc-400"
        }`}
        aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
      >
        {todo.completed && (
          <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
            <path
              d="M2.5 6L5 8.5L9.5 3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      <button
        onClick={() => onSelect(todo)}
        className="flex flex-1 items-baseline gap-2 text-left cursor-pointer min-w-0"
      >
        <span
          className={`text-sm truncate ${
            todo.completed
              ? "text-zinc-400 line-through"
              : "text-zinc-800"
          }`}
        >
          {todo.title}
        </span>
        {todo.details && (
          <span className="shrink-0 text-[10px] text-zinc-400">+note</span>
        )}
      </button>

      <span className="shrink-0 text-[11px] text-zinc-400 tabular-nums">
        {showDate
          ? new Date(todo.date + "T00:00:00").toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          : formatTime(todo.created_at)}
      </span>
    </li>
  );
}
