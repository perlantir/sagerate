"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

export function FormStepWrapper({ children }: { children: ReactNode }) {
  return (
    <motion.div
      key="form-step"
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -18 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="grid gap-5"
    >
      {children}
    </motion.div>
  );
}
