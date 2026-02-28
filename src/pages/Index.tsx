import { motion } from "framer-motion";

const CloudDecoration = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 200 100" className={className} fill="hsl(200, 50%, 98%)">
    <ellipse cx="70" cy="60" rx="50" ry="30" />
    <ellipse cx="110" cy="50" rx="40" ry="28" />
    <ellipse cx="140" cy="60" rx="35" ry="25" />
    <ellipse cx="90" cy="45" rx="45" ry="32" />
  </svg>
);

const features = [
  {
    icon: "🎓",
    title: "Verified Students",
    description: "Safe, student-only environment with school email verification",
  },
  {
    icon: "🤝",
    title: "Random Matching",
    description: "Get paired with a study buddy who shares your focus style",
  },
  {
    icon: "⏱️",
    title: "Timed Sessions",
    description: "Structured 30–60 minute sessions to keep you on track",
  },
  {
    icon: "🎙️",
    title: "Voice Only",
    description: "Light social presence without the pressure of video",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Floating clouds */}
      <CloudDecoration className="absolute top-10 left-[5%] w-48 opacity-40 float-animation" />
      <CloudDecoration className="absolute top-32 right-[8%] w-36 opacity-30 float-animation-delayed" />
      <CloudDecoration className="absolute bottom-20 left-[15%] w-40 opacity-25 float-animation" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5">
        <div className="flex items-center gap-2">
          <span className="text-2xl">☁️</span>
          <span className="text-xl font-bold text-foreground">StudyMate</span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/study"
            className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Start Studying
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-16 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold mb-6">
            Study together. Focus better. ✨
          </span>
        </motion.div>

        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-foreground leading-tight max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Your cozy
          <br />
          <span className="text-slate-soft">study corner</span>
          <br />
          in the cloud
        </motion.h1>

        <motion.p
          className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          Get matched with a verified study buddy. Focus together in timed
          sessions with voice chat and cute avatars.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <a
            href="/study"
            className="px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-base hover:opacity-90 transition-opacity cloud-shadow"
          >
            Find a Study Buddy
          </a>
          <a
            href="#features"
            className="px-8 py-3.5 rounded-full bg-card text-foreground font-semibold text-base border border-border hover:bg-secondary transition-colors"
          >
            How it works
          </a>
        </motion.div>

        {/* Cute illustration area */}
        <motion.div
          className="mt-16 relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="w-80 md:w-[500px] h-48 md:h-64 rounded-3xl bg-card cloud-shadow flex items-center justify-center border border-border">
            <div className="flex items-center gap-8 md:gap-16">
              {/* Avatar 1 */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-accent flex items-center justify-center text-3xl md:text-5xl breathing">
                  🐱
                </div>
                <span className="text-xs md:text-sm font-semibold text-muted-foreground">studying...</span>
              </div>
              {/* Connection indicator */}
              <div className="flex flex-col items-center gap-1">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-sky-deep pulse-soft" />
                  <div className="w-2 h-2 rounded-full bg-sky-deep pulse-soft" style={{ animationDelay: "0.3s" }} />
                  <div className="w-2 h-2 rounded-full bg-sky-deep pulse-soft" style={{ animationDelay: "0.6s" }} />
                </div>
                <span className="text-[10px] text-muted-foreground font-medium">connected</span>
              </div>
              {/* Avatar 2 */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-accent flex items-center justify-center text-3xl md:text-5xl breathing" style={{ animationDelay: "1.5s" }}>
                  🐻
                </div>
                <span className="text-xs md:text-sm font-semibold text-muted-foreground">studying...</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 px-6 md:px-12 pb-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-12">
            Why StudyMate? ☁️
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="p-6 rounded-2xl bg-card border border-border cloud-shadow hover:scale-[1.02] transition-transform"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="text-3xl mb-3 block">{f.icon}</span>
                <h3 className="text-lg font-bold text-foreground mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-sm text-muted-foreground">
        <p>☁️ StudyMate — Study together. Focus better.</p>
      </footer>
    </div>
  );
};

export default Index;
