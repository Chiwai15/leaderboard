export function createNodeNetwork(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d")!;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);
  
    canvas.style.width = "100%";
    canvas.style.height = "100%";
  
    const noteCount = 60;
    const notes: {
      x: number;
      y: number;
      radius: number;
      alpha: number;
      angle: number;
      speed: number;
      orbit: number;
      baseX: number;
      baseY: number;
    }[] = [];
  
    for (let i = 0; i < noteCount; i++) {
      const baseX = Math.random() * width;
      const baseY = Math.random() * height;
      notes.push({
        baseX,
        baseY,
        x: baseX,
        y: baseY,
        radius: Math.random() * 1.2 + 1,
        alpha: Math.random() * 0.4 + 0.4,
        angle: Math.random() * Math.PI * 2,
        speed: (Math.random() - 0.5) * 0.01,
        orbit: Math.random() * 30 + 10,
      });
    }
  
    function draw() {
      ctx.clearRect(0, 0, width, height);
  
      // First, update positions
      for (const n of notes) {
        n.angle += n.speed;
        n.x = n.baseX + Math.cos(n.angle) * n.orbit;
        n.y = n.baseY + Math.sin(n.angle) * n.orbit;
      }
  
      // Occasionally draw connections (sparse)
      for (let i = 0; i < notes.length; i++) {
        for (let j = i + 1; j < notes.length; j++) {
          const a = notes[i];
          const b = notes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
  
          if (dist < 40 && Math.random() < 0.05) { // ~5% chance
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(255, 255, 255, 0.15)`; // Brighter line
            ctx.lineWidth = 1.6;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.15)';
            ctx.shadowBlur = 4;
            ctx.stroke();
            ctx.restore();
            
          }
        }
      }
  
      // Draw notes
      for (const n of notes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${n.alpha})`;
        ctx.shadowColor = "white";
        ctx.shadowBlur = 6;
        ctx.fill();
      }
  
      requestAnimationFrame(draw);
    }
  
    draw();
  
    window.addEventListener("resize", () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
  
      for (const n of notes) {
        n.baseX = Math.random() * width;
        n.baseY = Math.random() * height;
      }
    });
  }
  