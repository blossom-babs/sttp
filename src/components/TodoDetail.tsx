"use client";

import { useState } from "react";
import { Todo } from "@/lib/types";

interface Props {
  todo: Todo;
  onBack: () => void;
  onToggle: (id: string, completed: boolean) => void;
  onUpdateDetails: (id: string, details: string) => void;
  onDelete: (id: string) => void;
}

export function TodoDetail({
  todo,
  onBack,
  onToggle,
  onUpdateDetails,
  onDelete,
}: Props) {
  const [details, setDetails] = useState(todo.details ?? "");
  const [saving, setSaving] = useState(false);

  const dirty = details !== (todo.details ?? "");

  async function save() {
    setSaving(true);
    await onUpdateDetails(todo.id, details);
    setSaving(false);
  }

  const time = new Date(todo.created_at).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const date = new Date(todo.date + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex flex-col flex-1 items-center bg-[#fafafa]">
      <div className="w-full max-w-xl px-5 py-10 flex flex-col flex-1">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-800 transition cursor-pointer self-start"
        >
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </button>

        <div className="flex items-start gap-3 mb-6">
          <button
            onClick={() => onToggle(todo.id, !todo.completed)}
            className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition cursor-pointer ${
              todo.completed
                ? "border-emerald-500 bg-emerald-500"
                : "border-zinc-300 hover:border-zinc-400"
            }`}
          >
            {todo.completed && (
              <svg
                className="h-3 w-3 text-white"
                viewBox="0 0 12 12"
                fill="none"
              >
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
          <div>
            <h2
              className={`text-lg font-semibold ${
                todo.completed
                  ? "text-zinc-400 line-through"
                  : "text-zinc-900"
              }`}
            >
              {todo.title}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              {date} at {time}
            </p>
          </div>
        </div>

        <label className="text-xs font-medium text-zinc-500 mb-1.5">
          Details
        </label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Add notes, links, details..."
          rows={8}
          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800 placeholder-zinc-400 shadow-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 resize-none"
        />

        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={save}
            disabled={!dirty || saving}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={() => {
              if (confirm("Delete this todo?")) onDelete(todo.id);
            }}
            className="rounded-lg px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50 cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
