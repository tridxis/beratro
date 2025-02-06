import { useMotionValue, useTransform, animate } from "framer-motion";
import React, { useEffect } from "react";

const useAnimatedCounter = (value: number) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) =>
    Math.round(latest).toLocaleString()
  );

  useEffect(() => {
    const controls = animate(count, value, {
      type: "tween",
      duration: 0.1,
      ease: "easeOut",
    });

    return controls.stop;
  }, [value]);

  return rounded;
};

export default useAnimatedCounter;
