"use client"
import Link from 'next/link'

export default function CallToAction() {
  return (
    <section className="w-full bg-neutral-950 dark:bg-indigo-700 py-20 px-6 sm:px-10 lg:px-16 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-white">
          Get Started with <span className="text-yellow-300">Flow-Post</span> Today!
        </h2>
        <p className="mt-4 text-lg text-indigo-200">
          Join thousands of teams streamlining their email workflow effortlessly.
        </p>
        <button className="mt-6 px-6 py-3 bg-white hover:bg-yellow-300 text-indigo-700 font-semibold rounded-lg transition-all duration-300 shadow-lg">
          <Link href="/sign-up">
            Let&apos;s Start Posting !
          </Link>
        </button>
      </div>
    </section>
  )
}
