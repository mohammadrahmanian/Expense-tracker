import { type FC } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  BarChart3,
  PieChart,
  TrendingUp,
  Shield,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7 },
  },
};

const mainFeatures = [
  {
    icon: Wallet,
    title: "Track Everything",
    desc: "Record all your income and expenses with detailed categorization and recurring transaction support.",
  },
  {
    icon: BarChart3,
    title: "Visual Analytics",
    desc: "Beautiful charts and graphs to understand your spending patterns and financial trends over time.",
  },
  {
    icon: PieChart,
    title: "Budget Planning",
    desc: "Set spending goals, track your progress, and get insights on how to improve your savings rate.",
  },
];

const additionalFeatures = [
  {
    icon: TrendingUp,
    title: "Smart Categorization",
    desc: "Organize your transactions with customizable categories, each with its own color and budget allocation.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    desc: "Your financial data is protected with industry-standard security. Each user's data is completely isolated.",
  },
];

type FeatureCardProps = {
  icon: FC<{ className?: string }>;
  title: string;
  desc: string;
  horizontal?: boolean;
};

const FeatureCard: FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  desc,
  horizontal,
}) => (
  <motion.div
    variants={fadeUp}
    whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
    className={`crystal-card rounded-2xl p-8 ${horizontal ? "flex items-start gap-5" : ""}`}
  >
    <div
      className={`w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center ${horizontal ? "shrink-0 mt-0.5" : "mb-5"}`}
    >
      <Icon className="w-5 h-5 text-emerald-600" />
    </div>
    <div>
      <h3
        className="text-lg font-semibold text-gray-900 mb-2"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        {title}
      </h3>
      <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
    </div>
  </motion.div>
);

export const FeatureCards: FC = () => (
  <motion.div
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: "-80px" }}
    variants={{ show: { transition: { staggerChildren: 0.1 } } }}
  >
    <div className="grid md:grid-cols-3 gap-5 mb-5">
      {mainFeatures.map(({ icon, title, desc }) => (
        <FeatureCard key={title} icon={icon} title={title} desc={desc} />
      ))}
    </div>

    <div className="grid md:grid-cols-2 gap-5 mb-28">
      {additionalFeatures.map(({ icon, title, desc }) => (
        <FeatureCard
          key={title}
          icon={icon}
          title={title}
          desc={desc}
          horizontal
        />
      ))}
    </div>
  </motion.div>
);
