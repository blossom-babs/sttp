"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createBrowserClient } from "@/lib/supabase-browser";
import { Todo } from "@/lib/types";
import { TodoItem } from "@/components/TodoItem";
import { TodoDetail } from "@/components/TodoDetail";
import { PendingTodos } from "@/components/PendingTodos";

const supabase = createBrowserClient();

function getLocalDate(): string {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

function formatDisplayDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [showPending, setShowPending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const today = getLocalDate();

  const fetchTodayTodos = useCallback(async () => {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("date", today)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setTodos(data);
    }
    setLoading(false);
  }, [today]);

  useEffect(() => {
    fetchTodayTodos();
  }, [fetchTodayTodos]);

  useEffect(() => {
    if (!loading && !selectedTodo && !showPending) {
      inputRef.current?.focus();
    }
  }, [loading, selectedTodo, showPending]);

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    const title = input.trim();
    if (!title) return;

    setInput("");

    const { data, error } = await supabase
      .from("todos")
      .insert({ title, date: today })
      .select()
      .single();

    if (!error && data) {
      setTodos((prev) => [...prev, data]);
    }
  }

  async function toggleTodo(id: string, completed: boolean) {
    await supabase.from("todos").update({ completed }).eq("id", id);
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed } : t))
    );
    if (selectedTodo?.id === id) {
      setSelectedTodo((prev) => (prev ? { ...prev, completed } : null));
    }
  }

  async function updateDetails(id: string, details: string) {
    await supabase.from("todos").update({ details }).eq("id", id);
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, details } : t))
    );
    setSelectedTodo((prev) => (prev ? { ...prev, details } : null));
  }

  async function deleteTodo(id: string) {
    await supabase.from("todos").delete().eq("id", id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
    if (selectedTodo?.id === id) {
      setSelectedTodo(null);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (selectedTodo) {
    return (
      <TodoDetail
        todo={selectedTodo}
        onBack={() => setSelectedTodo(null)}
        onToggle={toggleTodo}
        onUpdateDetails={updateDetails}
        onDelete={deleteTodo}
      />
    );
  }

  if (showPending) {
    return (
      <PendingTodos
        today={today}
        onBack={() => setShowPending(false)}
        onSelect={setSelectedTodo}
        onToggle={toggleTodo}
      />
    );
  }

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="flex flex-col flex-1 items-center bg-[#fafafa]">
      <div className="w-full max-w-xl px-5 py-10 flex flex-col flex-1">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              Straight to the Point
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              {formatDisplayDate(today)}
            </p>
          </div>
          <button
            onClick={signOut}
            className="text-xs text-zinc-400 hover:text-zinc-600 transition cursor-pointer mt-1"
          >
            Sign out
          </button>
        </header>

        <form onSubmit={addTodo} className="mb-6">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What needs to get done?"
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
          />
        </form>

        <div className="flex flex-col flex-1">
          {loading ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" />
            </div>
          ) : todos.length === 0 ? (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm text-zinc-400">
                No todos yet. Start typing above.
              </p>
            </div>
          ) : (
            <ul className="space-y-1">
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onSelect={setSelectedTodo}
                />
              ))}
            </ul>
          )}
        </div>

        <footer className="mt-8 flex items-center justify-between border-t border-zinc-200 pt-4">
          <p className="text-xs text-zinc-400">
            {completedCount}/{todos.length} done
          </p>
          <button
            onClick={() => setShowPending(true)}
            className="text-xs font-medium text-zinc-500 hover:text-zinc-800 transition cursor-pointer"
          >
            Pending from past days
          </button>
        </footer>
      </div>
    </div>
  );
}
