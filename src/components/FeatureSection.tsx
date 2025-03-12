import { HoverEffect } from "./ui/card-hover-effect";
import { Mail, Radio, Folder, KeyRound, ShieldCheck, BarChart } from "lucide-react";

export default function FeaturesSection() {
  return (
    <div className="h-[40rem] w-full bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="text-center">
          <h2 className="text-base text-violet-500 font-semibold tracking-wide uppercase">
            FEATURES
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
            Enhance Your Emailing Journey
          </p>
        </div>

        <div className="mt-10">
          <HoverEffect items={features} />
        </div>
      </div>
    </div>
  );
}

export const features = [
  {
    title: "Automated Broadcasts",
    description:
      "Send emails to entire categories at once. No need to type the same message repeatedly.",
    icon: <Radio size={32} className="text-violet-400" />,
  },
  {
    title: "Gmail SMTP Integration",
    description:
      "Send emails directly from your own Gmail account for better deliverability.",
    icon: <Mail size={32} className="text-blue-400" />,
  },
  {
    title: "Category-Based Recipients",
    description:
      "Easily manage and send emails to different recipient groups without manual effort.",
    icon: <Folder size={32} className="text-yellow-400" />,
  },
  {
    title: "Role-Based Access",
    description:
      "Limit email sending for free users, unlock unlimited emails with premium plans.",
    icon: <KeyRound size={32} className="text-green-400" />,
  },
  {
    title: "Secure Authentication",
    description:
      "Multi-factor authentication ensures your account remains secure at all times.",
    icon: <ShieldCheck size={32} className="text-red-400" />,
  },
  {
    title: "Detailed Analytics",
    description:
      "Track open rates, delivery status, and email performance from an intuitive dashboard.",
    icon: <BarChart size={32} className="text-orange-400" />,
  },
];
