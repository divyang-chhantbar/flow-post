import React from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="h-[40rem] w-full bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-6xl mx-auto p-6 text-center">
        {/* Animated Heading */}
        <motion.h1
          className="relative z-10 text-5xl md:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 font-sans font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to FlowPost
        </motion.h1>

        <motion.p
          className="text-neutral-400 max-w-l mx-auto mt-4 text-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Effortless Broadcast Emails – Send Once, Reach Many!
        </motion.p>

        <motion.p
          className="text-neutral-500 max-w-lg mx-auto mt-2 text-lg"
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
