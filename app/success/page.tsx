import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Success() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 shadow-lg rounded-xl p-8 max-w-md w-full text-center">
        <h1 className="flex flex-col sm:flex-row items-center justify-center gap-2 text-lg sm:text-2xl font-semibold text-white mb-4">
          <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400" />
          Data Seeding Completed!
        </h1>
        <p className="text-gray-300 mb-6">
          2,000 influencers and 2 users have been successfully generated in the
          database.
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
