import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute left-1/2 -z-10 -translate-x-1/2 transform"
        aria-hidden="true"
      >
        <svg width="1360" height="578" viewBox="0 0 1360 578" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="hero-gradient">
              <stop stopColor="#ffffff" offset="0%" />
              <stop stopColor="#3b82f6" offset="70%" />
              <stop stopColor="#14b8a6" offset="100%" />
            </linearGradient>
          </defs>
          <g fill="url(#hero-gradient)" fillRule="evenodd">
            <circle cx="1232" cy="128" r="128" />
            <circle cx="155" cy="443" r="64" />
            <circle cx="170" cy="20" r="148" />
          </g>
        </svg>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pb-16 pt-28 md:pb-24 md:pt-40">
          <div className="text-center">
            <div className="mb-5 inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-1 text-sm font-medium text-blue-700">
              Secure Markdown Notes in the Cloud
            </div>

            <h1 className="mb-6 text-5xl font-extrabold tracking-tight md:text-6xl">
              Write Notes.
              <br />
              Save Fast.
              <br />
              <span className="bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
                Export in Markdown.
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-3xl text-lg text-gray-600 md:text-xl">
              A clean and secure notes platform built for students, developers, and creators. Create
              notes, edit instantly, store safely, and download your files as markdown anytime.
            </p>

            <div className="mx-auto flex max-w-md flex-col justify-center gap-4 sm:flex-row">
              <Link href="/auth">
                <Button className="w-full sm:w-auto">Get Started</Button>
              </Link>

              <Link href="/dashboard">
                <Button variant="outline" className="w-full sm:w-auto">
                  Open Dashboard
                </Button>
              </Link>
            </div>

            <div className="mt-10 rounded-2xl border border-blue-100 bg-white/80 px-6 py-4 shadow-lg backdrop-blur">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-gray-500">
                Made By
              </p>
              <p className="mt-2 text-2xl font-extrabold md:text-3xl">
                <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  Dwarakesh Venkatesh
                </span>
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Internship Submission • Full Stack Web Developer Project
              </p>
            </div>

            <div className="mt-12 grid gap-4 text-left sm:grid-cols-3">
              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <h3 className="mb-2 font-semibold">Secure Login</h3>
                <p className="text-sm text-gray-600">
                  Personal accounts with protected access to your private notes.
                </p>
              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <h3 className="mb-2 font-semibold">Markdown Ready</h3>
                <p className="text-sm text-gray-600">
                  Write notes in markdown format and keep your workflow portable.
                </p>
              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <h3 className="mb-2 font-semibold">Cloud Saved</h3>
                <p className="text-sm text-gray-600">
                  Access your saved notes anytime with fast synced storage.
                </p>
              </div>
            </div>

            <div className="mt-10 text-sm text-gray-500">
              Built with Next.js, MongoDB, NextAuth, Tailwind CSS
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
