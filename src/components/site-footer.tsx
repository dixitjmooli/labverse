"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-16 border-t border-border/60 bg-gradient-to-b from-transparent to-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center gap-1 text-center sm:flex-row sm:gap-2"
        >
          <p className="text-sm text-muted-foreground">
            Made with
          </p>
          <motion.span
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center text-rose-500"
            aria-label="love"
          >
            <Heart className="h-4 w-4 fill-rose-500" />
          </motion.span>
          <p className="text-sm font-medium text-foreground">
            by{" "}
            <span className="bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500 bg-clip-text font-semibold text-transparent">
              Dixit Jain Sir
            </span>
          </p>
        </motion.div>
        <p className="mt-2 text-center text-xs text-muted-foreground/70">
          LabVerse — Interactive Science Experiments for Classes 9–12
        </p>
      </div>
    </footer>
  );
}
