import React from "react";
import AppLayout from "../components/layout/AppLayout";
import { MessageCircle } from "lucide-react";

const Home: React.FC = () => {
  return (
    <div className="flex h-full w-full items-center justify-center bg-white">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100">
          <MessageCircle className="h-7 w-7 text-zinc-600" />
        </div>

        <h1 className="text-xl font-semibold text-text">No chat selected</h1>

        <p className="text-sm text-gray-500">
          Choose a friend from the sidebar to start chatting instantly.
        </p>
      </div>
    </div>
  );
};

export default AppLayout()(Home);
