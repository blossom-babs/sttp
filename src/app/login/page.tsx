"use client";

import { useState } from "react";
import { createBrowserClient } from "@/lib/supabase-browser";

type Mode = "sign_in" | "sign_up";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("sign_in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmSent, setConfirmSent] = useState(false);

  const supabase = createBrowserClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "sign_up") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      setLoading(false);
      if (error) {
        setError(error.message);
      } else {
        setConfirmSent(true);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setLoading(false);
      if (error) {
        setError(error.message);
      } else {
        window.location.href = "/";
      }
    }
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  if (confirmSent) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center bg-[#fafafa] px-5">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mb-1">
            Straight to the Point
          </h1>
          <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
            <p className="text-sm text-emerald-800">
              Check your email to confirm your account, then come back and sign in.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-[#fafafa] px-5">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mb-1">
          Straight to the Point
        </h1>
        <p className="text-sm text-zinc-500 mb-8">
          {mode === "sign_in" ? "Sign in to your account" : "Create an account"}
        </p>

        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 cursor-pointer"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-zinc-200" />
          <span className="text-xs text-zinc-400">or</span>
          <div className="flex-1 h-px bg-zinc-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            minLength={6}
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:opacity-50 cursor-pointer"
          >
            {loading
              ? "Loading..."
              : mode === "sign_in"
                ? "Sign in"
                : "Sign up"}
          </button>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </form>

        <p className="mt-6 text-center text-xs text-zinc-500">
          {mode === "sign_in" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                onClick={() => { setMode("sign_up"); setError(""); }}
                className="font-medium text-zinc-800 hover:underline cursor-pointer"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => { setMode("sign_in"); setError(""); }}
                className="font-medium text-zinc-800 hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
