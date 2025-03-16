"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e : React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !password || !username) {
      setError("Invalid Input");
    }
    setLoading(true);
    try {
      const res = await axios.post("/api/sign-up", {
        email,
        password,
        username,
      });
      if (res.data.success) {
        router.push(`/verify/${username}`);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      console.error(err);
      setError("Error sending verification email");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-6"
      >
        <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Welcome to the FlowPost</h1>
        <div className="mb-4">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        </div>
        <div className="mb-4">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        </div>
        <div className="mb-6">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        </div>
        <div className="flex items-center justify-between">
        <button
          type="submit"
          className={cn(
          "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "cursor-not-allowed": loading,
          }
          )}
          disabled={loading}
        >
          Sign Up
        </button>
        </div>
        {error && <p className="text-red-500 text-xs italic mt-4">{error}</p>}
        <div className="mt-4 text-center">
        <Link href="/sign-in" className="text-blue-500 hover:text-blue-700">
          Already have an account? Sign in
        </Link>
        </div>
      </form>
      </div>
    </div>
    );
  }

