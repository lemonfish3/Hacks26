import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cloudyColors } from "@/lib/theme";

interface HeroSectionProps {
  onExploreClick?: () => void;
}

const CloudShape = ({ delay, size, position }: { delay: number; size: string; position: string }) => {
  return (
    <motion.div
      animate={{
        x: [0, 20, 0],
        y: [0, -15, 0],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`absolute ${position} pointer-events-none`}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        filter: "blur(60px)",
        opacity: 0.6,
      }}
    />
  );
};

export const HeroSection = ({ onExploreClick }: HeroSectionProps) => {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-12 py-20 overflow-hidden"
      style={{ backgroundColor: cloudyColors.cloud }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `linear-gradient(180deg, ${cloudyColors.sky} 0%, ${cloudyColors.mist} 40%, ${cloudyColors.cloud} 100%)`,
        }}
      />

      {/* Animated cloud shapes */}
      <CloudShape delay={0} size="400px" position="top-5 -left-5" />
      <CloudShape delay={2} size="300px" position="top-15 right-5" />
      <CloudShape delay={4} size="500px" position="bottom-20 left-20" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl">
        {/* Tag */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full backdrop-blur-md border"
          style={{
            background: "rgba(255, 255, 255, 0.8)",
            borderColor: cloudyColors.border,
          }}
        >
          <span className="text-lg">☁️</span>
          <span className="text-sm font-medium" style={{ color: cloudyColors.dusk }}>
            For college students, by college students
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black mb-6 leading-tight"
          style={{ color: cloudyColors.deep }}
        >
          Find your study{" "}
          <span style={{ color: cloudyColors.dusk }}>space in the cloud</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl font-light mb-12 leading-relaxed"
          style={{ color: cloudyColors.textSoft, maxWidth: "480px", margin: "0 auto 48px" }}
        >
          Low-pressure, flexible study rooms with students who share your focus. Private or public — you choose.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex gap-4 justify-center flex-wrap"
        >
          <button
            onClick={onExploreClick}
            className="px-9 py-4 rounded-full font-semibold text-white transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
            style={{
              background: cloudyColors.deep,
              boxShadow: `0 8px 30px rgba(26, 43, 60, 0.25)`,
            }}
          >
            Explore Rooms
          </button>
          <Link
            to="/signup"
            className="inline-block px-9 py-4 rounded-full font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 border cursor-pointer"
            style={{
              background: "rgba(255, 255, 255, 0.8)",
              color: cloudyColors.deep,
              borderColor: cloudyColors.border,
              backdropFilter: "blur(10px)",
            }}
          >
            Create Account →
          </Link>
        </motion.div>

        {/* Floating avatars */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-24 left-8 hidden md:block"
        >
          <div
            className="w-20 h-20 rounded-full border-4 flex items-center justify-center text-3xl shadow-lg"
            style={{
              background: "white",
              borderColor: cloudyColors.sky,
              boxShadow: `0 8px 24px rgba(123, 184, 212, 0.3)`,
            }}
          >
            🐱
          </div>
          <div className="text-xs font-medium text-center mt-1.5" style={{ color: cloudyColors.textSoft }}>
            Studying CS ✓
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute bottom-32 right-8 hidden md:block"
        >
          <div
            className="w-20 h-20 rounded-full border-4 flex items-center justify-center text-3xl shadow-lg"
            style={{
              background: "white",
              borderColor: cloudyColors.sky,
              boxShadow: `0 8px 24px rgba(123, 184, 212, 0.3)`,
            }}
          >
            🦊
          </div>
          <div className="text-xs font-medium text-center mt-1.5" style={{ color: cloudyColors.textSoft }}>
            Bio midterms
          </div>
        </motion.div>
      </div>
    </section>
  );
};
