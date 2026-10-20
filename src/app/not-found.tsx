import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <h2 className="text-3xl font-bold mb-2">404 - Page Not Found</h2>
      <p className="text-slate-400 mb-6">The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold transition-all"
      >
        Return Home
      </Link>
    </div>
  );
}
