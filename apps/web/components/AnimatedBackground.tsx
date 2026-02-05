"use client";

import { useEffect, useRef } from "react";

const CODE_RUNES = [
  "λ",
  "∂",
  "∑",
  "∏",
  "∫",
  "∞",
  "≈",
  "≠",
  "≤",
  "≥",
  "⊕",
  "⊗",
  "⊂",
  "⊃",
  "∈",
  "∉",
  "∀",
  "∃",
  "∅",
  "∇",
  "α",
  "β",
  "γ",
  "δ",
  "ε",
  "θ",
  "π",
  "σ",
  "φ",
  "ω",
  "0",
  "1",
  "{",
  "}",
  "[",
  "]",
  "<",
  ">",
  "/",
  "\\",
  "fn",
  "=>",
  "if",
  "for",
  "let",
  "var",
  "int",
  "def",
  "++",
  "--",
  "==",
  "!=",
  "&&",
  "||",
  "::",
  "->",
  "</>",
];

interface Rune {
  x: number;
  y: number;
  char: string;
  speed: number;
  opacity: number;
  size: number;
  hue: number;
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runesRef = useRef<Rune[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize runes
    const initRunes = () => {
      const runeCount = Math.floor((canvas.width * canvas.height) / 15000);
      runesRef.current = [];

      for (let i = 0; i < runeCount; i++) {
        runesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          char: CODE_RUNES[
            Math.floor(Math.random() * CODE_RUNES.length)
          ] as string,
          speed: 0.2 + Math.random() * 0.5,
          opacity: 0.03 + Math.random() * 0.08,
          size: 10 + Math.random() * 14,
          hue: 190 + Math.random() * 30, // Neon blue range (cyan to blue)
        });
      }
    };

    initRunes();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      runesRef.current.forEach((rune) => {
        // Update position
        rune.y += rune.speed;
        rune.x += Math.sin(rune.y * 0.01) * 0.3;

        // Reset if off screen
        if (rune.y > canvas.height + 20) {
          rune.y = -20;
          rune.x = Math.random() * canvas.width;
          rune.char = CODE_RUNES[
            Math.floor(Math.random() * CODE_RUNES.length)
          ] as string;
        }

        // Pulsing glow effect
        const pulse = Math.sin(Date.now() * 0.001 + rune.x * 0.01) * 0.02;
        const currentOpacity = rune.opacity + pulse;

        // Draw glow - neon blue
        ctx.shadowBlur = 20;
        ctx.shadowColor = `hsla(${rune.hue}, 100%, 60%, ${currentOpacity * 3})`;

        // Draw rune - bright neon blue
        ctx.font = `${rune.size}px MonaspaceKrypton, monospace`;
        ctx.fillStyle = `hsla(${rune.hue}, 100%, 70%, ${currentOpacity * 1.5})`;
        ctx.fillText(rune.char, rune.x, rune.y);

        // Reset shadow
        ctx.shadowBlur = 0;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: "transparent" }}
    />
  );
}
