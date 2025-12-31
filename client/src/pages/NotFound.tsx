import { type FC } from "react";
import { AlertTriangle as AlertTriangleIcon } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound: FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-2 text-text">
      <div className="flex flex-col items-center gap-6 text-center">
        <AlertTriangleIcon
          className="w-40 h-40 text-primary"
          strokeWidth={1.5}
        />

        <h1 className="text-7xl font-bold">404</h1>

        <h2 className="text-3xl font-semibold text-text-light">
          Page Not Found
        </h2>

        <Link
          to="/"
          className="mt-4 text-lg font-medium text-primary hover:underline"
        >
          Go back to home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
