/** @jsxImportSource react */

import ConfettiReact from "react-confetti";
import { qwikify$ } from "@builder.io/qwik-react";
import { useEffect, useState } from "react";

const useBodyClientSize = (): { height: number; width: number } => {
  const [size, setSize] = useState({ height: 0, width: 0 });
  useEffect(() => {
    const updateSize = (): void => {
      const { clientHeight: height, clientWidth: width } = document.body;
      setSize({ height, width });
    };
    updateSize();
    addEventListener("resize", updateSize);
    return () => {
      removeEventListener("resize", updateSize);
    };
  }, []);
  return size;
};

const ReactConfettiAnimation = ({ onFinish }: { onFinish: () => void }) => {
  const { height, width } = useBodyClientSize();
  return (
    <ConfettiReact
      recycle={false}
      onConfettiComplete={onFinish}
      style={{ position: "fixed" }}
      width={width}
      height={height}
      gravity={0.5}
      initialVelocityY={20}
    />
  );
};

export const Confetti = qwikify$(ReactConfettiAnimation);
