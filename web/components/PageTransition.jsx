import { AnimatePresence, motion } from "framer-motion";
import PropTypes from "prop-types";

const pageVariants = {
  initial: {
    opacity: 0,
    x: 10,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 2,
      ease: [0.33, 1, 0.68, 1],
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    x: -20,
    scale: 0.98,
    transition: {
      duration: 0.5,
      ease: [0.32, 0, 0.67, 0],
    },
  },
};

const PageTransition = ({ children, location }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location || "default"}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

PageTransition.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.string,
};

export default PageTransition;