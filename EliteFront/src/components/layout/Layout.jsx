/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";

export const Section = ({ children, id, className = "", containerClassName = "" }) => {
  return (
    <section id={id} className={`py-20 md:py-24 px-6 ${className}`}>
      <div className={`max-w-7xl mx-auto ${containerClassName}`}>
        {children}
      </div>
    </section>
  );
};

export const SectionHeader = ({ title, subtitle, centered = false }) => {
  return (
    <div className={`mb-12 md:mb-16 ${centered ? "text-center" : ""}`}>
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-display font-bold text-brand-dark mb-4"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-brand-dark/60 max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};
