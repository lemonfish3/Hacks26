import { motion } from "framer-motion";
import { cloudyColors } from "@/lib/theme";

const roomTypes = [
  {
    type: "Private",
    badge: "🔒 Private Room",
    title: "Your own quiet corner",
    description: "Invite specific friends or study partners. Control who's in your space, set your own rules.",
    features: [
      "Invite-only access",
      "Shared task list with your crew",
      "Custom room name & vibe",
      "Voice + text chat",
    ],
    emoji: "🔒",
    gradient: `linear-gradient(135deg, ${cloudyColors.deep}, #2d4a63)`,
  },
  {
    type: "Public",
    badge: "🌐 Public Room",
    title: "Study with strangers",
    description: "Join rooms filtered by subject or university. Meet new study buddies. Low pressure, high vibe.",
    features: [
      "Filter by subject & uni",
      "Anonymous avatars only",
      "Pomodoro timer sync",
      "Share resources in chat",
    ],
    emoji: "🌐",
    gradient: `linear-gradient(135deg, ${cloudyColors.dusk}, #5a9ab8)`,
  },
];

export const RoomTypes = () => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section
      className="py-24 md:py-28 px-6 md:px-12"
      style={{ backgroundColor: cloudyColors.mist }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="uppercase tracking-widest text-xs font-bold mb-4"
          style={{ color: cloudyColors.dusk }}
        >
          Choose Your Space
        </motion.div>

        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-black mb-12 leading-tight max-w-2xl"
          style={{ color: cloudyColors.deep }}
        >
          Private focus or<br />public energy
        </motion.h2>

        {/* Room Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {roomTypes.map((room, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              className="rounded-3xl p-11 text-white relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{ background: room.gradient }}
            >
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-sm font-semibold"
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(10px)",
                }}
              >
                {room.badge}
              </div>

              {/* Title */}
              <h3 className="text-3xl font-black mb-3">{room.title}</h3>

              {/* Description */}
              <p className="text-sm leading-relaxed mb-7 opacity-90">{room.description}</p>

              {/* Features */}
              <div className="space-y-2 mb-8">
                {room.features.map((feature, f) => (
                  <div key={f} className="flex items-center gap-2 text-sm font-medium opacity-90">
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: "rgba(255, 255, 255, 0.6)" }}
                    />
                    {feature}
                  </div>
                ))}
              </div>

              {/* Deco emoji */}
              <div
                className="absolute -right-7 -bottom-7 text-9xl opacity-8 pointer-events-none"
                style={{ color: "white" }}
              >
                {room.emoji}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
