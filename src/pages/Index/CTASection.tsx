import { type FC } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7 },
  },
};

export const CTASection: FC = () => (
  <motion.div
    className="text-center pb-16"
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: "-60px" }}
    variants={{ show: { transition: { staggerChildren: 0.12 } } }}
  >
    <motion.div variants={fadeUp} className="flex justify-center mb-14">
      <div className="w-16 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
    </motion.div>

    <motion.h2
      variants={fadeUp}
      className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      Start your financial journey
    </motion.h2>

    <motion.p
      variants={fadeUp}
      className="text-gray-400 mb-10 max-w-md mx-auto font-light"
    >
      Join thousands of users who have already taken control of their finances.
    </motion.p>

    <motion.div variants={fadeUp}>
      <Link to="/register">
        <Button
          size="lg"
          className="px-12 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-full shadow-lg shadow-emerald-200 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-200"
        >
          Begin Now &rarr;
        </Button>
      </Link>
    </motion.div>
  </motion.div>
);
