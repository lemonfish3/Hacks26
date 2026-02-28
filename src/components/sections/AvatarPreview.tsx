import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cloudyColors, avatarGradients } from "@/lib/theme";

const animals = ["🐱", "🦊", "🐨", "🐸", "🦋", "🐙", "🦁", "🐼", "🦄", "🐺"];
const colors = Object.values(avatarGradients);
const focusAreas = ["💻 CS / Tech", "🧬 Bio / Med", "📐 Math", "📚 Humanities", "🎨 Arts"];

export const AvatarPreview = () => {
  const [selectedEmoji, setSelectedEmoji] = useState(animals[0]);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedFocus, setSelectedFocus] = useState(focusAreas[0]);
  const [avatarName, setAvatarName] = useState("StudyMate42");

  return (
    <section
      className="py-24 md:py-28 px-6 md:px-12"
      style={{
        background: `linear-gradient(135deg, ${cloudyColors.blush} 0%, ${cloudyColors.lavender} 50%, ${cloudyColors.sky} 100%)`,
      }}
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
          Avatar Creation
        </motion.div>

        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-black mb-16 leading-tight max-w-2xl"
          style={{ color: cloudyColors.deep }}
        >
          Be an animal.<br />Study better.
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Avatar Preview Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl p-12 flex flex-col items-center shadow-lg"
          >
            {/* Big Avatar */}
            <motion.div
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-36 h-36 rounded-full flex items-center justify-center text-6xl mb-6 relative shadow-lg"
              style={{
                background: selectedColor,
              }}
            >
              <div
                className="absolute inset-0 rounded-full opacity-30 blur-lg"
                style={{
                  background: `radial-gradient(circle, ${selectedColor}, transparent)`,
                }}
              />
              <span className="relative z-10">{selectedEmoji}</span>
            </motion.div>

            {/* Name Input */}
            <input
              type="text"
              value={avatarName}
              onChange={(e) => setAvatarName(e.target.value)}
              className="text-2xl font-black text-center border-b-2 bg-transparent outline-none mb-1.5"
              style={{
                borderColor: cloudyColors.sky,
                color: cloudyColors.deep,
              }}
            />
            <div className="text-xs" style={{ color: cloudyColors.textSoft }}>
              Tap to rename
            </div>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Animal Selection */}
            <div>
              <label
                className="uppercase tracking-widest text-xs font-bold block mb-3"
                style={{ color: cloudyColors.textSoft }}
              >
                Choose your animal
              </label>
              <div className="grid grid-cols-5 gap-2">
                {animals.map((animal) => (
                  <button
                    key={animal}
                    onClick={() => setSelectedEmoji(animal)}
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl transition-all duration-200 border-2"
                    style={{
                      background: selectedEmoji === animal ? cloudyColors.sky : cloudyColors.mist,
                      borderColor: selectedEmoji === animal ? cloudyColors.deep : "transparent",
                      transform: selectedEmoji === animal ? "scale(1.1)" : "scale(1)",
                    }}
                  >
                    {animal}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label
                className="uppercase tracking-widest text-xs font-bold block mb-3"
                style={{ color: cloudyColors.textSoft }}
              >
                Avatar color
              </label>
              <div className="grid grid-cols-6 gap-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className="w-10 h-10 rounded-full transition-all duration-200 border-4"
                    style={{
                      background: color,
                      borderColor:
                        selectedColor === color ? cloudyColors.deep : "transparent",
                      transform: selectedColor === color ? "scale(1.15)" : "scale(1)",
                      boxShadow:
                        selectedColor === color
                          ? `0 0 0 2px white, 0 0 0 4px ${cloudyColors.deep}`
                          : "none",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Focus Area */}
            <div>
              <label
                className="uppercase tracking-widest text-xs font-bold block mb-3"
                style={{ color: cloudyColors.textSoft }}
              >
                Your focus area
              </label>
              <div className="flex flex-wrap gap-2">
                {focusAreas.map((area) => (
                  <button
                    key={area}
                    onClick={() => setSelectedFocus(area)}
                    className="px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 border"
                    style={{
                      background:
                        selectedFocus === area ? cloudyColors.deep : "white",
                      color:
                        selectedFocus === area ? "white" : cloudyColors.textSoft,
                      borderColor:
                        selectedFocus === area ? cloudyColors.deep : cloudyColors.border,
                    }}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <Link
              to="/signup"
              className="w-full py-4 rounded-2xl font-semibold text-white text-center transition-all duration-200 inline-block hover:shadow-lg hover:opacity-90 active:scale-95 cursor-pointer"
              style={{ 
                background: cloudyColors.deep,
                display: 'block',
              }}
            >
              Save & Enter Lobby →
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
