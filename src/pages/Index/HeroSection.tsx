import { type FC } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Hexagon } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7 },
  },
};

export const HeroSection: FC = () => (
  <motion.div
    className="text-center mb-28 pt-12"
    variants={container}
    initial="hidden"
    animate="show"
  >
    <motion.div variants={fadeUp} className="flex justify-center mb-8">
      <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
        <Hexagon className="w-7 h-7 text-white" strokeWidth={2.5} />
      </div>
    </motion.div>

    <motion.h1
      variants={fadeUp}
      className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      Expensio
    </motion.h1>

    <motion.p
      variants={fadeUp}
      className="text-lg md:text-xl text-gray-400 mb-14 max-w-md mx-auto font-light leading-relaxed"
    >
      Take control. Track smart. Save more.
    </motion.p>

    <motion.div variants={fadeUp} className="flex justify-center items-center gap-6">
      <Link to="/register">
        <Button
          size="lg"
          className="px-10 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-full shadow-lg shadow-emerald-200 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-200"
        >
          Get Started
        </Button>
      </Link>
      <Link
        to="/login"
        className="text-gray-400 hover:text-emerald-600 font-medium transition-colors duration-300"
      >
        Sign In &rarr;
      </Link>
    </motion.div>
  </motion.div>
);
