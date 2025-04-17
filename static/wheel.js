function initWheel(items) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const center = size / 2;
    const sections = items.length;
    const anglePer = 2 * Math.PI / sections;
    let angle = 0;
  
    function drawWheel() {
      for (let i = 0; i < sections; i++) {
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, center, angle + i*anglePer, angle + (i+1)*anglePer);
        ctx.fillStyle = `hsl(${360*i/sections}, 70%, 70%)`;
        ctx.fill();
        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(angle + (i+0.5)*anglePer);
        ctx.fillStyle = "#000";
        ctx.fillText(items[i], size*0.4, 0);
        ctx.restore();
      }
    }
  
    document.getElementById('spin').onclick = () => {
      let duration = 5000; // 5 секунд
      let start = null;
      function animate(ts) {
        if (!start) start = ts;
        let progress = ts - start;
        let frac = Math.min(progress / duration, 1);
        angle = frac * 10 * Math.PI;  // 5 оборотов
        ctx.clearRect(0, 0, size, size);
        drawWheel();
        if (frac < 1) {
          requestAnimationFrame(animate);
        } else {
          const winnerIndex = Math.floor((sections - (angle % (2*Math.PI)) / anglePer) % sections);
          onFinish(winnerIndex);
        }
      }
      requestAnimationFrame(animate);
    };
  
    // первый отрис
    drawWheel();
  }