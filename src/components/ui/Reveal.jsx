"use client";
import { Children } from "react";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

/** Single fade-and-rise on scroll. Use sparingly: headings and one block per section. */
export function Reveal({ children, delay = 0, y = 18, className, as = "div" }) {
  const Tag = motion[as] || motion.div;
  return (
    <Tag className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7, ease, delay }}>
      {children}
    </Tag>
  );
}

/** Staggered reveal for product grids. Wrap each direct child; renders as <ul>/<li>. */
export function StaggerGrid({ children, className, itemClassName }) {
  return (
    <motion.ul
      className={className}
      initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
    >
      {Children.map(children, (child) => (
        <motion.li className={itemClassName} variants={{ hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }}>
          {child}
        </motion.li>
      ))}
    </motion.ul>
  );
}
