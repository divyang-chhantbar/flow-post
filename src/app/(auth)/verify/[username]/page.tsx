"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams(); // Unwrap params properly

  const [username, setUsername] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params && "username" in params) {
      setUsername(params.username as string);
    }
  }, [params]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const verificationCode = formData.get("code");

    if (!username) {
      setError("Username is missing.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/verify-code", {
        username,
        code: verificationCode,
      });

      if (response.data.success) {
        router.push("/sign-in");
      }
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : "Verification failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full mx-auto p-8 shadow-input bg-white dark:bg-black">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Verify Your Account
        </h2>
        <p className="text-neutral-600 text-sm mt-2 dark:text-neutral-300">
          Please enter the verification code sent to your email
        </p>

        <form className="my-8" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700 dark:text-white">Verification Code</label>
          <input
            name="code"
            placeholder="Enter 6-digit code"
            type="text"
            required
            pattern="\d{6}"
            title="Please enter a 6-digit code"
            maxLength={6}
            className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />

          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

          <button type="submit" className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-md" disabled={loading}>
            {loading ? "Verifying..." : "Verify Account →"}
          </button>
        </form>
      </div>
    </div>
  );
}
