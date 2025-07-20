import { useEffect, useRef } from "react";

const CanvasLines = () => {
  const canvasRef = useRef(null);

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

    let offset = 0;
    let animationFrameId;

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const spacing = 40;
      offset += 0.3;

      // Fundo
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, width, height);

      // Horizontais – gray
      ctx.strokeStyle = "rgba(156, 163, 175, 0.5)";
      for (let y = -spacing; y < height + spacing; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y + (offset % spacing));
        ctx.lineTo(width, y + (offset % spacing));
        ctx.stroke();
      }

      // Verticais – purple-800
      ctx.strokeStyle = "#5B21B6";
      for (let x = -spacing; x < width + spacing; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x + (offset % spacing), 0);
        ctx.lineTo(x + (offset % spacing), height);
        ctx.stroke();
      }

      // Diagonais / – blue-700
      ctx.strokeStyle = "#1D4ED8";
      for (let x = -width; x < width * 2; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x + (offset % spacing), 0);
        ctx.lineTo(x - height + (offset % spacing), height);
        ctx.stroke();
      }

      // Diagonais \ – gray novamente (mais leve)
      ctx.strokeStyle = "rgba(156, 163, 175, 0.25)";
      for (let x = -width; x < width * 2; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x - (offset % spacing), 0);
        ctx.lineTo(x + height - (offset % spacing), height);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black z-[-2]" >
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full z-[-1] pointer-events-none"
        style={{
          background: "#0a0a0a",
          width: "100vw",
          height: "100vh"
        }}
      />
    </div>

  );
};

export default CanvasLines;
