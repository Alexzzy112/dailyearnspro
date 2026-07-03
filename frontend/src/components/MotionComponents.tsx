'use client';
import { motion, AnimatePresence } from 'framer-motion';

export const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const fadeInUp = (delay: number = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay } },
});

export const staggerContainer = {
  initial: {},
  animate: { transition: { staggerChildren: 0.08 } },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

export const slideInRight = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

export const slideInLeft = {
  initial: { opacity: 0, x: -40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

export const MotionDiv = motion.div;
export const MotionSection = motion.section;
export const MotionSpan = motion.span;
export const MotionButton = motion.button;
export const MotionImg = motion.img;
export const MotionTbody = motion.tbody;
export const MotionTr = motion.tr;
export const MotionForm = motion.form;
export { AnimatePresence };
