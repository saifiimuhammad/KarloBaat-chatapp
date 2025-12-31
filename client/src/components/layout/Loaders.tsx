import { type FC } from "react";

const LayoutLoader: FC = () => {
  return (
    <div className="grid h-[calc(100vh-4rem)] grid-cols-12">
      {/* Left Sidebar */}
      <div className="hidden sm:block sm:col-span-4 md:col-span-3 h-full">
        <div className="h-full w-full animate-pulse bg-accent" />
      </div>

      {/* Main Content */}
      <div className="col-span-12 sm:col-span-8 md:col-span-5 lg:col-span-6 h-full p-4 space-y-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index + 34}
            className="h-20 w-full animate-pulse rounded-md bg-accent"
          />
        ))}
      </div>

      {/* Right Sidebar */}
      <div className="hidden md:block md:col-span-4 lg:col-span-3 h-full p-8 bg-black/85">
        <div className="h-full w-full animate-pulse rounded-md bg-accent" />
      </div>
    </div>
  );
};

const TypingLoader: FC = () => {
  return (
    <div className="flex items-center justify-center gap-2 p-2">
      {[0.1, 0.2, 0.3, 0.4].map((delay, i) => (
        <span
          key={delay}
          className="h-4 w-4 rounded-full bg-primary animate-bounce"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
    </div>
  );
};

export { LayoutLoader, TypingLoader };
