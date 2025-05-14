"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Mail, Users, CreditCard, Clock, Shield, Zap } from "lucide-react"

const FeatureIcon = ({ Icon }: { Icon: React.ElementType }) => (
  <div className="inline-flex items-center justify-center p-2 bg-indigo-100 rounded-lg dark:bg-indigo-900">
    <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />
  </div>
)


const TestimonialCard = ({ name, role, company, quote, feature }: TestimonialProps) => (
  <motion.div
    className="bg-slate-900 dark:bg-gray-800 rounded-xl shadow-xl p-8 relative overflow-hidden w-full h-full min-h-[240px]"
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className="flex flex-col justify-between h-full">
  <div>
    <FeatureIcon Icon={feature.icon} />
    <div className="mt-4">
      <p className="text-white dark:text-gray-300 text-lg mb-6 line-clamp-4 min-h-[96px]">
        &ldquo;{quote}&rdquo;
      </p>
    </div>
  </div>

  <div className="flex items-center mt-auto">
    <div className="flex-shrink-0 mr-4">
      <img
        className="h-12 w-12 rounded-full"
        src={`https://ui-avatars.com/api/?name=${name}&background=random`}
        alt={name}
      />
    </div>
    <div>
      <p className="text-md font-semibold text-white">{name}</p>
      <p className="text-sm text-white dark:text-gray-400">
        {role}, {company}
      </p>
    </div>
  </div>
</div>
  </motion.div>
)

const testimonials: TestimonialProps[] = [
  {
    name: "Nisarg Borsaniya",
    role: "Marketing Director",
    company: "TechNova",
    quote: "Flow-Post's category system revolutionized our email campaigns. We've seen a 40% increase in engagement!",
    feature: { name: "Smart Categories", icon: Mail },
  },
  {
    name: "Preet Faldu",
    role: "HR Manager",
    company: "GlobalCorp",
    quote: "The role-based access is a game-changer. It's like having a personal email assistant for each team member.",
    feature: { name: "Role-Based Access", icon: Users },
  },
  {
    name: "MeetrajSinh Jadeja",
    role: "Sales Director",
    company: "SalesPro",
    quote:
      "Upgrading to admin tier was the best decision. Our sales team now sends personalized bulk emails in minutes, not hours.",
    feature: { name: "Premium Features", icon: CreditCard },
  },
  {
    name: "Heet Dave",
    role: "CEO",
    company: "StartUp Rocket",
    quote: "Flow-Post grew with us from day one. The free tier was perfect to start, and scaling up was seamless.",
    feature: { name: "Scalability", icon: Zap },
  },
  {
    name: "Abhi Patel",
    role: "IT Manager",
    company: "SecureTech",
    quote: "The 2FA and advanced security features give us peace of mind when sending sensitive information.",
    feature: { name: "Advanced Security", icon: Shield },
  },
  {
    name: "Ansh Agola",
    role: "Operations Manager",
    company: "FastTrack Logistics",
    quote: "We've cut our email prep time by 75%. Flow-Post's efficiency is unmatched in the industry.",
    feature: { name: "Time-Saving", icon: Clock },
  },
]

export default function FlowPostTestimonials() {
  return (
    <div className="max-h-full w-full bg-neutral-950 dark:bg-gray-900 py-20 px-6 sm:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
        <h2 className="text-4xl font-extrabold text-white dark:text-white sm:text-5xl">
  {`Loved by teams everywhere`.split(" ").map((word, index) => (
    <span key={index} className="inline-block mr-2 transition duration-300 hover:text-indigo-500">
      {word}
    </span>
  ))}
</h2>
          <p className="mt-6 text-xl text-gray-500 dark:text-gray-300">
            See how FlowPost is transforming email communication for businesses of all sizes.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </div>
  )
}

interface TestimonialProps {
  name: string
  role: string
  company: string
  quote: string
  feature: {
    name: string
    icon: React.ElementType
  }
}
