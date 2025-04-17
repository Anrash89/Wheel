document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('wheel');
  const ctx = canvas.getContext('2d');
  const size = canvas.width;
  const center = size / 2;
  const spinBtn = document.getElementById('spin');
  let participants = [];

  // Рисуем колесо под заданным углом
  function drawWheel(rotation = 0) {
    const n = participants.length;
    const arc = 2 * Math.PI / n;
    ctx.clearRect(0, 0, size, size);

    participants.forEach((name, i) => {
      const start = rotation + i * arc;
      const end = start + arc;
      // сегмент
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, center, start, end);
      ctx.fillStyle = `hsl(${(i * 360 / n)}, 70%, 60%)`;
      ctx.fill();
      // метка
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(start + arc / 2);
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.font = '18px sans-serif';
      ctx.fillText(name, size * 0.48, 0);
      ctx.restore();
    });
  }

  // Загрузить участников
  fetch('./participants.json')
    .then(res => {
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    })
    .then(list => {
      participants = Array.isArray(list) ? list.filter(x => typeof x === 'string') : [];
      if (participants.length === 0) {
        spinBtn.textContent = 'Нет участников';
        return;
      }
      drawWheel(0);
      spinBtn.disabled = false;
      spinBtn.textContent = 'Крутить 🎉';
    })
    .catch(err => {
      console.error('Ошибка загрузки участников:', err);
      spinBtn.textContent = 'Ошибка загрузки';
    });

  // Анимация вращения
  spinBtn.addEventListener('click', () => {
    if (participants.length === 0) return;
    spinBtn.disabled = true;
    spinBtn.textContent = 'Кручусь…';

    const n = participants.length;
    const arc = 2 * Math.PI / n;
    const idx = Math.floor(Math.random() * n);
    const target = 5 * 2 * Math.PI + (n - idx) * arc + arc / 2;
    const duration = 5000;
    const startTime = performance.now();

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function frame(now) {
      const t = Math.min((now - startTime) / duration, 1);
      const rot = easeOutCubic(t) * target;
      drawWheel(rot);

      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        // Победитель и фейерверк
        const winner = participants[idx];
        confetti({ particleCount: 200, spread: 60, origin: { y: 0.3 } });
        setTimeout(() => alert(`🏆 Победитель: ${winner}`), 500);
        spinBtn.disabled = false;
        spinBtn.textContent = 'Крутить 🎉';
      }
    }

    requestAnimationFrame(frame);
  });
});
