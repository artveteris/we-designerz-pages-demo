const canvas = document.querySelector('#game');
const context = canvas.getContext('2d');
const spark = new Image();

spark.src = './assets/spark.png';

let score = 0;
let secondsLeft = 20;
let startedAt = null;
let target = { x: 360, y: 220, radius: 42 };

function moveTarget() {
  const margin = 58;
  target.x = margin + Math.random() * (canvas.width - margin * 2);
  target.y = margin + Math.random() * (canvas.height - margin * 2);
}

function draw(timestamp) {
  if (startedAt === null) startedAt = timestamp;
  secondsLeft = Math.max(0, 20 - Math.floor((timestamp - startedAt) / 1000));

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#1b1238';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = '#f7f3ff';
  context.font = '700 24px system-ui';
  context.fillText(`Очки: ${score}`, 24, 40);
  context.textAlign = 'right';
  context.fillText(`Время: ${secondsLeft}`, canvas.width - 24, 40);
  context.textAlign = 'left';

  if (spark.complete) {
    context.drawImage(
      spark,
      target.x - target.radius,
      target.y - target.radius,
      target.radius * 2,
      target.radius * 2,
    );
  }

  if (secondsLeft > 0) {
    requestAnimationFrame(draw);
  } else {
    context.fillStyle = 'rgba(16, 11, 36, 0.86)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#ffffff';
    context.textAlign = 'center';
    context.font = '800 42px system-ui';
    context.fillText(`Готово: ${score}`, canvas.width / 2, canvas.height / 2);
    context.font = '20px system-ui';
    context.fillText('Обнови страницу, чтобы сыграть ещё раз', canvas.width / 2, canvas.height / 2 + 44);
  }
}

function hit(event) {
  if (secondsLeft === 0) return;
  const rect = canvas.getBoundingClientRect();
  const pointX = (event.clientX - rect.left) * (canvas.width / rect.width);
  const pointY = (event.clientY - rect.top) * (canvas.height / rect.height);
  const distance = Math.hypot(pointX - target.x, pointY - target.y);

  if (distance <= target.radius) {
    score += 1;
    moveTarget();
  }
}

canvas.addEventListener('pointerdown', hit);
spark.addEventListener('load', () => requestAnimationFrame(draw), { once: true });
