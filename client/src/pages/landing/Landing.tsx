import {
  ArrowRight,
  CirclePlus,
  EllipsisVertical,
  MessageCircleHeart,
  Phone,
  SendHorizontal,
  Users,
  Video,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Landing = () => {
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

      {/* ============ Main Section =============== */}
      <section className="flex-1 flex flex-col lg:flex-row items-center gap-12">
        <div className="w-full lg:w-1/2 flex flex-col gap-8">
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight text-[#0d1b13]">
              Seamless connection for
              <span className="text-primary"> modern teams.</span>
            </h1>
            <p className="text-lg lg:text-xl text-secondary max-w-lg leading-relaxed">
              Experience the next generation of messaging. Secure,
              lightning-fast, and built for the way you work.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/")}
              className="bg-primary text-white h-14 px-8 rounded-xl text-lg font-bold primary-glow transition-all hover:-translate-y-1 cursor-pointer"
            >
              Start Chatting
            </button>
            <a
              className="flex items-center gap-2 font-bold text-sm underline-offset-4"
              href="https://github.com/saifiimuhammad/KarloBaat-chatapp"
              target="_blank"
            >
              Learn More
              <ArrowRight size={18} />
            </a>
          </div>
          <div className="flex gap-10 pt-4">
            <div>
              <p className="text-2xl font-bold">12k+</p>
              <p className="text-sm text-secondary">Active Users</p>
            </div>
            <div>
              <p className="text-2xl font-bold">99.9%</p>
              <p className="text-sm text-secondary">Uptime</p>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 h-full flex items-center justify-center relative">
          <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full"></div>
          <div className="relative w-full aspect-4/3 max-w-160 bg-white rounded-2xl shadow-2xl flex overflow-hidden border border-[#e7f3ec]">
            <aside className="w-64 border-r border-[#e7f3ec] flex flex-col bg-[#fcfdfc]">
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div
                    className="size-10 rounded-full bg-cover bg-center ring-2 ring-primary ring-offset-2"
                    data-alt="Close-up portrait of Alex Rivera"
                    style={{
                      backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDIBeOCyu-eDZDlgfQr7fO4dCyq7w-Anw09J5CQBVyyiHeGdw7HV6mGbNsTi9M0KXa-ptsHtmslCq9cWi91sIg3digY_xihLD9JmMkU4GQqCQmHcx3lOHJrpghbogtwXOBXqrVoB0SH2IDtIHSPsvXkriSXu5OHg09qfsl-PE-KOIuMtFHwVt3KrDhJ4KCAA1xa2E8EcGolHTpkOl_P84QAP2bZvDH82rSCMLSXNNF-od0I4numsfiZkTA4lZ0ClQYWjeNZT_InH9E")`,
                    }}
                  ></div>
                  <div>
                    <p className="text-sm font-bold">Alex Rivera</p>
                    <p className="text-[10px] text-primary flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
                      Online
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar px-3 space-y-1">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 border border-primary/20">
                  <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <Users size={20} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-bold truncate">Product Team</p>
                    <p className="text-[10px] text-secondary truncate">
                      Sarah: Let's finalize the...
                    </p>
                  </div>
                  <span className="size-2 bg-primary rounded-full"></span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div
                    className="size-10 rounded-full bg-cover bg-center"
                    data-alt="Portrait of Sarah Jenkins"
                    style={{
                      backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDYtxkJALsXmkbUbeJ8bQMJkrkn_BqhyWNmVU0CsOrM1ct55DfrtWKeK8YIcFUqtmldTAF4FFZhUzfOhRfFUaQvBPbXJ46AHvPLDB87fvNfTdkt-KQ7rd9V5nYJQYs77J70_QBdzQwONL9s-J0ROj39gbZ4jdz5Tg8tvNRYzvc-LQoIaLmW_Suw95fSKt1dKJTwy3YsRduZ_EgRunjhH2X3AOB7SKMaullyGw6e4FtypKJa2DReY3EUouZVJuQflHEFfGk5AzCl5Cc")`,
                    }}
                  ></div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-bold truncate">Sarah Jenkins</p>
                    <p className="text-[10px] text-secondary truncate">
                      The report is ready!
                    </p>
                  </div>
                  <p className="text-[10px] text-gray-400">10:24</p>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div
                    className="size-10 rounded-full bg-cover bg-center"
                    data-alt="Portrait of Mark Wilson"
                    style={{
                      backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDA1BeZ9dCASA9KKT9zTdgiiQdlymGLQgtn2Pf61ueFoZu18NfVfNmmTa8GKey_j4qtq6Mb-5harBCDJ4P2tVGegkQCAmpiY0SwsusvJCWc7lVBkqmCVYrVHOhE1VZw4m5FSlXD0bT70jvyR1eTm69r_zYWeaeOKBTdBP3n2IAn7LeUw0m7D1hHoj4foGTBRkSZKULk9wOj4k2APHhkygiFlGYFNPYx3EOV30J8UMjs5pqmuMLAhuD5KkBu44OUZT2PhS5xG2dNPew")`,
                    }}
                  ></div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-bold truncate">Mark Wilson</p>
                    <p className="text-[10px] text-secondary truncate">
                      See you tomorrow.
                    </p>
                  </div>
                  <p className="text-[10px] text-gray-400">09:15</p>
                </div>
              </div>
            </aside>
            <section className="flex-1 flex flex-col bg-white">
              <div className="px-6 py-4 border-b border-[#e7f3ec] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold">Product Team</h3>
                  <p className="text-[10px] text-gray-400">
                    12 members, 4 online
                  </p>
                </div>
                <div className="flex gap-4 text-gray-400">
                  <span className="text-sm cursor-pointer hover:text-primary">
                    <Phone size={12} />
                  </span>
                  <span className="text-sm cursor-pointer hover:text-primary">
                    <Video size={14} />
                  </span>
                  <span className="text-sm cursor-pointer hover:text-primary">
                    <EllipsisVertical size={12} />
                  </span>
                </div>
              </div>
              <div className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar">
                <div className="flex items-end gap-2">
                  <div
                    className="size-6 rounded-full bg-cover bg-center"
                    data-alt="Small avatar of Sarah Jenkins"
                    style={{
                      backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBfbADTwsvRJybhvuKUXqxuR237d1XPgdsUE58i_q05XIazlE-Y-bIBz_S89lOrWVk94FUpoyU4A7wHMTJ7-MtQ_2HgwYrau8-60pwsbYn2ehX6NammfMaj_CsBDpw4N0FtDYZtHjMZAG6qPtXCz3Wv36h6M_dPj9hZ9jmLsHSm2BBnguRvGt9jNZYUvj0nsIuTTj1pCEYPB5WY-v4LVYaI9KmQk9ooMhK4L00FREvSDhvfoj6idE5-MYuXCms6HH0Rs_FikF8Bfqo")`,
                    }}
                  ></div>
                  <div className="bg-gray-100 rounded-2xl rounded-bl-none p-3 max-w-[80%]">
                    <p className="text-xs">
                      Hey team, did we finalize the design for the new landing
                      page?
                    </p>
                  </div>
                </div>
                <div className="flex items-end gap-2 justify-end">
                  <div className="bg-primary text-[#0d1b13] rounded-2xl rounded-br-none p-3 max-w-[80%] shadow-sm">
                    <p className="text-xs font-medium">
                      Yes, Alex is working on the final touches. It should be
                      ready in an hour!
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="size-6 rounded-full bg-cover bg-center"
                    data-alt="Small avatar of Mark Wilson"
                    style={{
                      backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDfFWL3aM6TUPK6IyJ8xL1q3Y0bag6yh43CJEjny6jsOOkllcnnz5U6MpOj3H8kK1EqUg3VjfUg2fezV-o1y_35yJshM68KO7GlQrOMVuKNu7Kbnl8ec3TN0JmgwEm_sHgzW2wuoPtUHWWko7Pqlf05579Uh5f1W48ki4STnKt6J7mvYaQ6o7sBD7i3YTrLg63hOwEZk4Qfnj4cfsr0o2uOKYRcUN3NHjR5NoK0UvIrDcAUGAzcB6BC0ovz2Dw5fX-KK1lNCrbU3I8")`,
                    }}
                  ></div>
                  <div className="bg-gray-100 rounded-full px-4 py-2 flex items-center gap-1">
                    <span className="size-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="size-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="size-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
              <div className="p-6 pt-0">
                <div className="bg-gray-50 rounded-xl border border-[#e7f3ec] p-2 flex items-center gap-2">
                  <button className="size-8 flex items-center justify-center text-gray-400 hover:text-primary">
                    <CirclePlus size={20} />
                  </button>
                  <input
                    className="flex-1 bg-transparent border-none text-xs focus:ring-0"
                    placeholder="Type a message..."
                    type="text"
                  />
                  <button className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                    <SendHorizontal size={14} strokeWidth={2.2} />
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      {/* ============ Footer ============== */}

      <footer className="py-6 flex items-center justify-between border-t border-zinc-200">
        <p className="text-xs text-secondary">
          © 2024 ChatApp Inc. All rights reserved.
        </p>
        <div className="flex gap-6">
          <a
            className="text-xs font-semibold text-text-light hover:text-primary transition-colors"
            href="#"
          >
            Privacy
          </a>
          <a
            className="text-xs font-semibold text-text-light hover:text-primary transition-colors"
            href="#"
          >
            Terms
          </a>
        </div>
      </footer>
    </main>
  );
};
export default Landing;
