import { motion, scale } from 'framer-motion';

const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.98
    },
    anmate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: [0.6, -0.5, 0.01, 0.99]
        }
    },
    exit: {
        opacity: 0,
        y: -20,
        scale: 0.98,
        transition: {
            duration: 0.3
        }
    }
};

const AnimatePage = ({ children, className=" "}) => {
    return (
        <motion.div
        className={className}
        variants={pageVariants}
        initial='initial'
        animate='animate'
        exit='exit'
        >
            {children}
        </motion.div>
    );
};

export default AnimatePage;