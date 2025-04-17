document.addEventListener("DOMContentLoaded", function() {
  var canvas = document.getElementById("wheel");
  var ctx = canvas.getContext("2d");
  var size = canvas.width;
  var center = size / 2;
  var spinBtn = document.getElementById("spin");
  var participants = [];

  // Функция рисования колеса
  function drawWheel(rotation) {
    rotation = rotation || 0;
    var n = participants.length;
    var arc = (2 * Math.PI) / n;
    ctx.clearRect(0, 0, size, size);

    for (var i = 0; i < n; i++) {
      var start = rotation + i * arc;
      var end   = start + arc;
      // сегмент
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, center, start, end);
      ctx.fillStyle = "hsl(" + (i * 360 / n) + ",70%,60%)";
      ctx.fill();
      // подпись
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(start + arc / 2);
      ctx.fillStyle    = "#fff";
      ctx.textAlign    = "right";
      ctx.textBaseline = "middle";
      ctx.font         = "18px sans-serif";
      ctx.fillText(participants[i], size * 0.48, 0);
      ctx.restore();
    }
  }

  // Загрузка участников из JSON
  fetch("participants.json")
    .then(function(res) {
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    })
    .then(function(list) {
      if (!Array.isArray(list)) throw new Error("Неверный формат JSON");
      participants = list.filter(function(x) { return typeof x === "string"; });
      if (participants.length === 0) {
        spinBtn.textContent = "Нет участников";
        spinBtn.disabled = true;
      } else {
        drawWheel(0);
        spinBtn.disabled = false;
        spinBtn.textContent = "Крутить 🎉";
      }
    })
    .catch(function(err) {
      console.error("Ошибка загрузки участников:", err);
      spinBtn.textContent = "Ошибка загрузки";
      spinBtn.disabled = true;
    });

  // Обработка клика «Крутить»
  spinBtn.addEventListener("click", function() {
    if (participants.length === 0) return;
    spinBtn.disabled = true;
    spinBtn.textContent = "Кручусь…";

    var n        = participants.length;
    var arc      = (2 * Math.PI) / n;
    var idx      = Math.floor(Math.random() * n);
    var target   = 5 * 2 * Math.PI + (n - idx) * arc + arc / 2;
    var duration = 5000;
    var startTime = performance.now();

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function animate(time) {
      var t   = Math.min((time - startTime) / duration, 1);
      var rot = easeOutCubic(t) * target;
      drawWheel(rot);

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        var winner = participants[idx];
        // Фейерверк
        confetti({ particleCount: 200, spread: 60, origin: { y: 0.3 } });
        setTimeout(function() {
          alert("🏆 Победитель: " + winner + "!");
          spinBtn.disabled = false;
          spinBtn.textContent = "Крутить 🎉";
        }, 500);
      }
    }

    requestAnimationFrame(animate);
  });
});
