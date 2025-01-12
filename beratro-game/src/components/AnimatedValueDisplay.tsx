/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

const Container = motion.div;
const Value = motion.span;

interface AnimatedValueDisplayProps {
  value: number;
  prefix?: string;
  iconComponent?: React.ReactNode;
}

export const AnimatedValueDisplay: React.FC<AnimatedValueDisplayProps> = ({
  value,
  ...props
}: any) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, value, {
      type: "tween",
      duration: 0.1,
      ease: "easeOut",
    });

    return controls.stop;
  }, [value]);

  const vibrationIntensity = Math.min(Math.abs(value - count.get()) * 0.1, 1);

  return (
    <div {...props}>
      <Container
        style={{
          position: "relative",
        }}
        key={value}
        initial={{ x: 0, y: 0 }}
        animate={{
          x: [
            0,
            2 * vibrationIntensity,
            -2 * vibrationIntensity,
            2 * vibrationIntensity,
            -2 * vibrationIntensity,
            0,
            2 * vibrationIntensity,
            -2 * vibrationIntensity,
            0,
          ],
          y: [
            0,
            -2 * vibrationIntensity,
            2 * vibrationIntensity,
            -2 * vibrationIntensity,
            2 * vibrationIntensity,
            0,
            -2 * vibrationIntensity,
            2 * vibrationIntensity,
            0,
          ],
        }}
        transition={{
          duration: Math.min(0.4 * vibrationIntensity, 0.8),
          ease: "linear",
          times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1],
          repeat: 0,
        }}
      >
        <Value style={{ fontWeight: "bold" }}>{rounded}</Value>
      </Container>
    </div>
  );
};
