import React from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-neutral-950 relative flex flex-col items-center justify-center antialiased px-4 py-10">
      <div className="max-w-5xl mx-auto text-center">
        {/* Animated Heading */}
        <motion.h1
          className="relative z-10 text-4xl sm:text-6xl md:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 font-sans font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to FlowPost
        </motion.h1>

        <motion.p
          className="text-neutral-400 max-w-xl mx-auto mt-4 text-lg sm:text-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Effortless Broadcast Emails – Send Once, Reach Many!
        </motion.p>

        <motion.p
          className="text-neutral-500 max-w-md mx-auto mt-2 text-base sm:text-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Stop wasting time sending the same email over and over. <br />
          Automate your communication with Flow Post!
        </motion.p>
      </div>
      <BackgroundBeams />
    </div>
  );
}
