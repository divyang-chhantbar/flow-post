"use client";

import React, { JSX } from "react";
import { Timeline } from "@/components/ui/timeline";
import { Folder, Users, Edit, Send } from "lucide-react";

// Define the structure for each step
interface TimelineEntry {
  icon: JSX.Element;
  title: string;
  content: React.ReactNode;
}

// Steps data
const steps: TimelineEntry[] = [
  {
    icon: <Folder className="h-6 w-6 text-white" />,
    title: "Create a Category",
    content: "Organize your contacts into structured groups to simplify email management. This helps you keep everything in order when sending targeted emails.",
  },
  {
    icon: <Users className="h-6 w-6 text-white" />,
    title: "Add Recipients",
    content: "Easily add email addresses under each category. This ensures that every broadcast message reaches the right set of people without hassle.",
  },
  {
    icon: <Edit className="h-6 w-6 text-white" />,
    title: "Compose Email",
    content: "Craft a personalized message, choose categories, and format your email to suit your audience. Engage your recipients with ease.",
  },
  {
    icon: <Send className="h-6 w-6 text-white" />,
    title: "Send Broadcast",
    content: "Hit send and instantly deliver your message to all recipients in the selected categories. Quick, reliable, and effective communication.",
  },
];


export default function HowItWorks() {
  return (
    <div className="w-full bg-neutral-950 text-white font-sans md:px-10">
      {/* Title Section */}
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10 text-center">
        <h2 className="text-xl md:text-6xl font-bold mb-4 text-white">
          How FlowPost Works
        </h2>
        <p className="text-neutral-300 text-sm md:text-base max-w-xl mx-auto">
          A simple 4-step process to send bulk emails effortlessly.
        </p>
      </div>

      {/* Timeline Section */}
      <div className="relative max-w-5xl mx-auto pb-20">
        <div className="bg-black border-none shadow-none text-white">
          <Timeline data={steps} />
        </div>
      </div>
    </div>
  );
}
