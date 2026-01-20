import { House } from "lucide-react";
import { type FC } from "react";
import { Link } from "react-router-dom";

const NotFound: FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 text-text">
      <div className="text-center max-w-md">
        {/* 404 Heading */}
        <h1 className="text-9xl font-extrabold">404</h1>

        {/* Subheading */}
        <h2 className="text-3xl font-bold mb-4">
          Oops! This page seems to have wandered off.
        </h2>

        {/* Description */}
        <p className="text-text-light mb-6">
          The link might be broken, or the page has been moved to a quiet corner
          of the internet. Don't worry, we'll get you back home in no time.
        </p>

        <Link
          to="/"
          className="bg-primary hover:bg-[#4b6332] text-white font-medium px-5 py-4 rounded-xl cursor-pointer inline-flex items-center justify-center gap-2 transition-colors"
        >
          <House size={20} /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
