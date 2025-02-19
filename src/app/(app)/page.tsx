'use client'
import React from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function Home() {
  return (
    // Hero Section
    <div className="h-[40rem] w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-6xl mx-auto p-6 text-center">
        <h1 className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
          Welcome to FlowPost
        </h1>
        <p className="text-neutral-400 max-w-lg mx-auto mt-4 text-lg">
          Effortless Broadcast Emails – Send Once, Reach Many!
        </p>
        
        <p className="text-neutral-500 max-w-lg mx-auto mt-2 text-base">
          Stop wasting time sending the same email over and over. <br />
          Automate your communication with Flow Post!
        </p>
      </div>
      <BackgroundBeams />

    </div>
  );
}
