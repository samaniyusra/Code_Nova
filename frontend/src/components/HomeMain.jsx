import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

const IntroSection = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gray-950">
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-5xl md:text-6xl font-extrabold text-white mb-6"
      >
        Welcome to DSA Visualizer
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="text-gray-300 text-lg md:text-xl max-w-3xl mb-10"
      >
        Explore data structures and algorithms with real-time visualizations. 
        Understand stacks, queues, trees, and graphs dynamically while having fun!
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["Interactive", "3D Effects", "Step-by-Step Animations"].map((title, i) => (
          <Tilt
            key={i}
            glareEnable={true}
            glareMaxOpacity={0.3}
            scale={1.05}
            transitionSpeed={400}
            className="bg-gray-800 rounded-xl shadow-lg p-6 cursor-pointer"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="text-center text-white font-semibold text-lg"
            >
              {title}
            </motion.div>
          </Tilt>
        ))}
      </div>
    </section>
  );
};

export default IntroSection;