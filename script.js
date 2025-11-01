// Example: data with { date: "YYYY-MM-DD", count: n }
const start_date = new Date("2025-01-01");
const data = [];
for (let i = 0; i < 365; i++) {
  let d = new Date(start_date);
  d.setDate(d.getDate() + i);
  // Example: mock data; replace with your data source
  let count = Math.floor(Math.random() * 12); // 0–11
  data.push({date: d.toISOString().slice(0,10), count});
}

// Map date to weekday/column for correct placement
function getWeek(dateStr) {
  const start = new Date(start_date);
  const date = new Date(dateStr);
  const diff = Math.floor((date - start) / (1000 * 60 * 60 * 24));
  return Math.floor(diff / 7);
}
function getDay(dateStr) {
  return (new Date(dateStr).getDay() + 6) % 7; // Monday start
}

// Color mapping — adjust as needed
function getLevel(count) {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

const cols = 53;
const rows = 7;
const grid = Array.from({length: rows}, () => Array(cols).fill(null));
data.forEach(obj => {
  const week = getWeek(obj.date);
  const day = getDay(obj.date);
  if (week >= 0 && week < cols && day >= 0 && day < rows)
    grid[day][week] = obj;
});

const heatmap = document.getElementById("heatmap");
heatmap.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

for (let week = 0; week < cols; week++) {
  for (let day = 0; day < rows; day++) {
    const obj = grid[day][week];
    const div = document.createElement("div");
    div.className = "cell";
    if (obj) {
      div.classList.add(`level-${getLevel(obj.count)}`);
      div.title = `${obj.count} tasks on ${obj.date}`;
    } else {
      div.classList.add("level-0");
    }
    heatmap.appendChild(div);
  }
}