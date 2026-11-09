const items = [
  { id: "bus",   label: "Bus or shared auto",  unit: "km",     factor: 0.10 },
  { id: "metro", label: "Metro or train",      unit: "km",     factor: 0.04 },
  { id: "bike",  label: "Motorbike or scooter",unit: "km",     factor: 0.07 },
  { id: "car",   label: "Car (petrol)",        unit: "km",     factor: 0.17 },
  { id: "veg",   label: "Vegetarian meals",    unit: "meals",  factor: 0.6 },
  { id: "chick", label: "Chicken or egg meals",unit: "meals",  factor: 1.5 },
  { id: "red",   label: "Red meat meals",      unit: "meals",  factor: 4.0 },
  { id: "ac",    label: "Air conditioner",     unit: "hours",  factor: 0.85 },
  { id: "fan",   label: "Fan or cooler",       unit: "hours",  factor: 0.05 },
  { id: "bottle",label: "Plastic bottles",     unit: "bottles",factor: 0.08 },
];
const TREE_KG_PER_DAY = 21 / 365;  
const $ = id => document.getElementById(id);
const qty = {};

// build the input fields
items.forEach(it => {
  qty[it.id] = 0;
  const row = document.createElement("div");
  row.className = "field";
  row.innerHTML = `<label for="${it.id}">${it.label}<small>per ${it.unit.replace(/s$/, "")}: ${it.factor} kg</small></label>
                   <input id="${it.id}" type="number" min="0" step="any" value="0" inputmode="decimal">`;
  $("fields").appendChild(row);
  row.querySelector("input").addEventListener("input", e => {
    qty[it.id] = Math.max(0, parseFloat(e.target.value) || 0);
    render();
  });
});

function render() {
  const lines = items.filter(it => qty[it.id] > 0)
                     .map(it => ({ it, kg: qty[it.id] * it.factor }));
  const total = lines.reduce((sum, l) => sum + l.kg, 0);

  $("lines").innerHTML = lines.length
    ? lines.map(l => `<li><span>${qty[l.it.id]} ${l.it.unit} ${l.it.label}</span><span>${l.kg.toFixed(2)}</span></li>`).join("")
    : `<li class="empty">Nothing yet. Fill in your day.</li>`;

  $("total").textContent = total.toFixed(1) + " kg CO₂";

  if (!total) { $("extra").textContent = ""; $("tip").textContent = ""; return; }

  const trees = Math.ceil(total / TREE_KG_PER_DAY);
  $("extra").textContent = `Repeat this daily for a year: ${(total * 365 / 1000).toFixed(1)} tonnes. A tree absorbs about 21 kg a year, so this day alone needs ${trees} trees working for a day.`;

  const big = lines.reduce((a, b) => (b.kg > a.kg ? b : a));
  $("tip").textContent = `BIGGEST LINE: ${big.it.label} (${Math.round(big.kg / total * 100)}%). Start there.`;
}

$("date").textContent = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
render();
