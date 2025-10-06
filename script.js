// -------- Tabs ----------
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");
tabs.forEach(t => {
  t.addEventListener("click", () => {
    tabs.forEach(x => x.classList.remove("active"));
    panels.forEach(p => p.classList.remove("active"));
    t.classList.add("active");
    document.getElementById(t.dataset.tab).classList.add("active");
  });
});

// -------- Motivation ----------
const quotes = [
  "Small progress is still progress.",
  "You don’t have to be extreme, just consistent.",
  "Recovery is part of training too.",
  "Discipline outlasts motivation.",
  "Stack wins after work hours."
];
document.getElementById("motivate").onclick = () => {
  const q = quotes[(Math.random() * quotes.length) | 0];
  document.getElementById("quote").innerText = q;
};

// -------- Plan (localStorage: plan) ----------
const planEls = {
  work: document.getElementById("workBlock"),
  train: document.getElementById("trainBlock"),
  rec: document.getElementById("recoveryBlock"),
  saved: document.getElementById("planSaved"),
  saveBtn: document.getElementById("savePlan")
};

function loadPlan() {
  const plan = JSON.parse(localStorage.getItem("plan") || "{}");
  planEls.work.value = plan.work || "";
  planEls.train.value = plan.train || "";
  planEls.rec.value = plan.rec || "";
}
planEls.saveBtn?.addEventListener("click", () => {
  const plan = {
    work: planEls.work.value.trim(),
    train: planEls.train.value.trim(),
    rec: planEls.rec.value.trim(),
    date: new Date().toISOString().slice(0,10)
  };
  localStorage.setItem("plan", JSON.stringify(plan));
  planEls.saved.textContent = "Saved for " + plan.date;
  setTimeout(() => (planEls.saved.textContent = ""), 2000);
});
loadPlan();

// -------- Tasks (localStorage: tasks) ----------
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");

function getTasks() { return JSON.parse(localStorage.getItem("tasks") || "[]"); }
function setTasks(arr) { localStorage.setItem("tasks", JSON.stringify(arr)); }

function renderTasks() {
  const tasks = getTasks();
  taskList.innerHTML = "";
  tasks.forEach((t, i) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${t.done ? "✅" : "⬜️"} ${t.text}</span>
                    <span>
                      <button data-i="${i}" data-a="toggle">Done</button>
                      <button data-i="${i}" data-a="remove" class="danger">Delete</button>
                    </span>`;
    taskList.appendChild(li);
  });
}
addTaskBtn?.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (!text) return;
  const tasks = getTasks();
  tasks.unshift({ text, done: false, ts: Date.now() });
  setTasks(tasks);
  taskInput.value = "";
  renderTasks();
});
taskList?.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const i = +btn.dataset.i;
  const act = btn.dataset.a;
  const tasks = getTasks();
  if (act === "toggle") tasks[i].done = !tasks[i].done;
  if (act === "remove") tasks.splice(i, 1);
  setTasks(tasks);
  renderTasks();
});
renderTasks();

// -------- Journal (localStorage: journal) ----------
const mood = document.getElementById("mood");
const moodValue = document.getElementById("moodValue");
const journalText = document.getElementById("journalText");
const saveJournal = document.getElementById("saveJournal");
const clearJournal = document.getElementById("clearJournal");
const journalList = document.getElementById("journalList");

mood?.addEventListener("input", () => (moodValue.textContent = `${mood.value}/10`));

function getJournal() { return JSON.parse(localStorage.getItem("journal") || "[]"); }
function setJournal(arr) { localStorage.setItem("journal", JSON.stringify(arr)); }

function renderJournal() {
  const data = getJournal();
  journalList.innerHTML = "";
  data.forEach((e, i) => {
    const div = document.createElement("div");
    const dt = new Date(e.ts).toLocaleString();
    div.className = "entry";
    div.innerHTML = `
      <div>
        <div class="meta">${dt} — Mood ${e.mood}/10</div>
        <div>${e.text.replace(/</g,"&lt;")}</div>
      </div>
      <button data-i="${i}" class="danger">Delete</button>`;
    journalList.appendChild(div);
  });
}
saveJournal?.addEventListener("click", () => {
  const text = journalText.value.trim();
  if (!text) return;
  const data = getJournal();
  data.unshift({ mood: +mood.value, text, ts: Date.now() });
  setJournal(data);
  journalText.value = "";
  renderJournal();
});
clearJournal?.addEventListener("click", () => {
  if (confirm("Delete ALL journal entries?")) {
    localStorage.removeItem("journal");
    renderJournal();
  }
});
journalList?.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const data = getJournal();
  data.splice(+btn.dataset.i, 1);
  setJournal(data);
  renderJournal();
});
renderJournal();
