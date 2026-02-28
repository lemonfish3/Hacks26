import { motion } from "framer-motion";
import { cloudyColors } from "@/lib/theme";

const steps = [
  {
    number: "01",
    icon: "🎓",
    title: "Verify your .edu",
    description: "Students only. Sign up with your university email to keep the space safe and focused.",
  },
  {
    number: "02",
    icon: "🐾",
    title: "Build your avatar",
    description: "Pick an animal companion, customize colors, and give yourself a name. No real photos needed.",
  },
  {
    number: "03",
    icon: "🚪",
    title: "Join or host a room",
    description: "Browse public rooms by subject, or create your own private space. Set a timer and dive in.",
  },
];

export const HowItWorks = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="py-24 md:py-28 px-6 md:px-12 max-w-5xl mx-auto">
      {/* Section Label */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="uppercase tracking-widest text-xs font-bold mb-4"
        style={{ color: cloudyColors.dusk }}
      >
        How Cloudy Works
      </motion.div>

      {/* Section Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-black mb-16 leading-tight max-w-2xl"
        style={{ color: cloudyColors.deep }}
      >
        From login to locked in — under 2 minutes
      </motion.h2>

      {/* Steps Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        className="grid md:grid-cols-3 gap-6"
      >
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            className="p-8 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            style={{
              background: "white",
              borderColor: cloudyColors.border,
            }}
          >
            <div
              className="uppercase tracking-wider text-xs font-bold mb-4"
              style={{ color: cloudyColors.dusk }}
            >
              Step {step.number}
            </div>

            <span className="text-4xl block mb-4">{step.icon}</span>

            <h3 className="text-xl font-bold mb-3" style={{ color: cloudyColors.deep }}>
              {step.title}
            </h3>

            <p className="text-sm leading-relaxed" style={{ color: cloudyColors.textSoft }}>
              {step.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
