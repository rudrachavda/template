import { Variants } from "motion/react";

export const container: Variants = {
    visible: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export const item: Variants = {
    hidden: {
        opacity: 0,
        y: 12,
        filter: "blur(12px)",
    },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            type: "spring",
            damping: 25,
            stiffness: 200,
        },
        transitionEnd: {
            filter: "none", // Cleans up the CSS filter after animation for better performance
        },
    },
};
