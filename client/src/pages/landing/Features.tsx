import { MessageCircleHeart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Features = () => {
  const navigate = useNavigate();

  return (
    <main className="flex flex-col font-landing h-screen max-w-360 mx-auto px-6 lg:px-20">
      {/* ============= Navbar ================ */}
      <header className="flex items-center justify-between py-6">
        <div className="flex items-center gap-2">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <MessageCircleHeart />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">Karlobaat</h2>
        </div>
        <nav className="hidden md:flex items-center gap-10">
          <Link
            className="text-sm font-semibold hover:text-primary transition-colors cursor-pointer"
            to="/features"
          >
            Features
          </Link>
          <a
            className="text-sm font-semibold hover:text-primary transition-colors cursor-pointer"
            href="#"
          >
            Security
          </a>
          <a
            className="text-sm font-semibold hover:text-primary transition-colors cursor-pointer"
            href="#"
          >
            Pricing
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="text-sm font-bold px-4 py-2 cursor-pointer"
          >
            Log In
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-bold primary-glow transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            Start Chatting
          </button>
        </div>
      </header>

      <section className="flex-1">
        <div className="mx-auto max-w-[1200px] px-6 py-16 lg:px-10 lg:py-24">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 inline-flex items-center rounded-full bg-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#0d1b13] dark:text-primary">
              Core Platform
            </div>
            <h1 className="max-w-[800px] text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Experience the Future of Communication
            </h1>
            <p className="mt-6 max-w-[640px] text-lg text-[#4c9a6c] dark:text-[#a0c4ae]">
              Everything you need to stay connected with your team in one place.
              Engineered for speed, privacy, and seamless collaboration.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-[1200px] px-6 pb-24 lg:px-10">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="feature-card flex flex-col gap-4 rounded-xl border border-[#cfe7d9] dark:border-[#1a3024] bg-white dark:bg-[#152a1e] p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-2xl">sync</span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold">Real-time Sync</h3>
                <p className="text-sm leading-relaxed text-[#4c9a6c] dark:text-[#a0c4ae]">
                  Messages delivered instantly across all your devices without
                  delay. Stay in the loop everywhere.
                </p>
              </div>
            </div>

            <div className="feature-card flex flex-col gap-4 rounded-xl border border-[#cfe7d9] dark:border-[#1a3024] bg-white dark:bg-[#152a1e] p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-2xl">
                  folder_shared
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold">Secure File Sharing</h3>
                <p className="text-sm leading-relaxed text-[#4c9a6c] dark:text-[#a0c4ae]">
                  Drag and drop files up to 2GB with end-to-end encryption.
                  Share documents and assets securely.
                </p>
              </div>
            </div>

            <div className="feature-card flex flex-col gap-4 rounded-xl border border-[#cfe7d9] dark:border-[#1a3024] bg-white dark:bg-[#152a1e] p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-2xl">
                  videocam
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold">Voice &amp; Video</h3>
                <p className="text-sm leading-relaxed text-[#4c9a6c] dark:text-[#a0c4ae]">
                  High-definition calls with crystal clear audio for remote
                  collaboration. Connect face-to-face instantly.
                </p>
              </div>
            </div>

            <div className="feature-card flex flex-col gap-4 rounded-xl border border-[#cfe7d9] dark:border-[#1a3024] bg-white dark:bg-[#152a1e] p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-2xl">
                  search_insights
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold">Advanced Search</h3>
                <p className="text-sm leading-relaxed text-[#4c9a6c] dark:text-[#a0c4ae]">
                  Find any message, link, or file from months ago in seconds.
                  Your entire history is at your fingertips.
                </p>
              </div>
            </div>

            <div className="feature-card flex flex-col gap-4 rounded-xl border border-[#cfe7d9] dark:border-[#1a3024] bg-white dark:bg-[#152a1e] p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-2xl">
                  security
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold">Encrypted Privacy</h3>
                <p className="text-sm leading-relaxed text-[#4c9a6c] dark:text-[#a0c4ae]">
                  Enterprise-grade security protocols ensuring your data remains
                  private and protected at all times.
                </p>
              </div>
            </div>

            <div className="feature-card flex flex-col gap-4 rounded-xl border border-[#cfe7d9] dark:border-[#1a3024] bg-white dark:bg-[#152a1e] p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-2xl">hub</span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold">App Integrations</h3>
                <p className="text-sm leading-relaxed text-[#4c9a6c] dark:text-[#a0c4ae]">
                  Connect with the tools you already use like Slack, GitHub, and
                  Jira to streamline your workflow.
                </p>
              </div>
            </div>

            <div className="feature-card flex flex-col gap-4 rounded-xl border border-[#cfe7d9] dark:border-[#1a3024] bg-white dark:bg-[#152a1e] p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-2xl">
                  auto_awesome
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold">AI Summaries</h3>
                <p className="text-sm leading-relaxed text-[#4c9a6c] dark:text-[#a0c4ae]">
                  Get instant summaries of long conversations so you never miss
                  a beat when returning to work.
                </p>
              </div>
            </div>

            <div className="feature-card flex flex-col gap-4 rounded-xl border border-[#cfe7d9] dark:border-[#1a3024] bg-white dark:bg-[#152a1e] p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-2xl">
                  devices
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold">Desktop &amp; Mobile</h3>
                <p className="text-sm leading-relaxed text-[#4c9a6c] dark:text-[#a0c4ae]">
                  Fully native apps for Mac, Windows, iOS, and Android for the
                  best possible experience.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[1200px] px-6 py-12 lg:px-10">
          <div className="rounded-2xl bg-primary/5 dark:bg-primary/10 p-10 lg:p-16 border border-primary/20">
            <div className="flex flex-col items-center justify-center text-center gap-8">
              <div className="flex flex-col gap-4">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Ready to transform your workflow?
                </h2>
                <p className="mx-auto max-w-[600px] text-base text-[#4c9a6c] dark:text-[#a0c4ae]">
                  Join thousands of users communicating better every day. Set up
                  your team in less than 5 minutes.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button className="flex h-14 min-w-[200px] items-center justify-center rounded-xl bg-primary px-8 text-base font-bold text-[#0d1b13] shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                  Start Chatting Now
                </button>
                <button className="flex h-14 min-w-[200px] items-center justify-center rounded-xl border border-[#cfe7d9] dark:border-[#1a3024] bg-white dark:bg-transparent px-8 text-base font-bold hover:bg-background-light dark:hover:bg-white/5 transition-all">
                  Watch Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="border-t border-[#e7f3ec] dark:border-[#1a3024] py-12">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
                <span className="material-symbols-outlined text-xs text-[#0d1b13]">
                  chat
                </span>
              </div>
              <span className="text-sm font-bold">ChatApp</span>
            </div>
            <p className="text-xs text-[#4c9a6c] dark:text-[#a0c4ae]">
              © 2024 ChatApp Inc. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                className="text-xs font-medium hover:text-primary transition-colors"
                href="#"
              >
                Privacy Policy
              </a>
              <a
                className="text-xs font-medium hover:text-primary transition-colors"
                href="#"
              >
                Terms of Service
              </a>
              <a
                className="text-xs font-medium hover:text-primary transition-colors"
                href="#"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};
export default Features;
