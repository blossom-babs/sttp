"use client";

import { useEffect, useState, useCallback } from "react";
import { createBrowserClient } from "@/lib/supabase-browser";
import { Todo } from "@/lib/types";
import { TodoItem } from "@/components/TodoItem";

const supabase = createBrowserClient();

interface Props {
  today: string;
  onBack: () => void;
  onSelect: (todo: Todo) => void;
  onToggle: (id: string, completed: boolean) => void;
}

export function PendingTodos({ today, onBack, onSelect, onToggle }: Props) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = useCallback(async () => {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("completed", false)
      .lt("date", today)
      .order("date", { ascending: false })
      .order("created_at", { ascending: true });

    if (!error && data) {
      setTodos(data);
    }
    setLoading(false);
  }, [today]);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  function handleToggle(id: string, completed: boolean) {
    onToggle(id, completed);
    if (completed) {
      setTodos((prev) => prev.filter((t) => t.id !== id));
    }
  }

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
          Back to today
        </button>

        <h2 className="text-lg font-semibold text-zinc-900 mb-1">
          Pending from past days
        </h2>
        <p className="text-xs text-zinc-400 mb-6">
          Incomplete todos from before today
        </p>

        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" />
          </div>
        ) : todos.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-zinc-400">All caught up!</p>
          </div>
        ) : (
          <ul className="space-y-1">
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onSelect={onSelect}
                showDate
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
