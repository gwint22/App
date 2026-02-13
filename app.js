const STORAGE_KEY = 'lifetime-state-v1';

const ACTION_LIBRARY = {
  hygiene: {
    label: 'Morning hygiene routine',
    xp: 20,
    growth: { hygiene: 3, discipline: 1 }
  },
  gym: {
    label: 'Gym session 45+ min',
    xp: 45,
    growth: { strength: 4, stamina: 2, discipline: 2 }
  },
  steps: {
    label: '10,000 steps milestone',
    xp: 35,
    growth: { stamina: 4, vitality: 2 }
  },
  reading: {
    label: 'Focused reading 30 min',
    xp: 25,
    growth: { knowledge: 4, mindset: 2 }
  },
  nutrition: {
    label: 'Healthy meal prep',
    xp: 30,
    growth: { nutrition: 4, vitality: 2 }
  },
  sleep: {
    label: '7.5+ hours sleep',
    xp: 30,
    growth: { recovery: 4, mindset: 1, vitality: 1 }
  }
};

const RANKS = [
  { level: 1, rank: 'E' },
  { level: 5, rank: 'D' },
  { level: 10, rank: 'C' },
  { level: 20, rank: 'B' },
  { level: 35, rank: 'A' },
  { level: 50, rank: 'S' }
];

const DEFAULT_STATE = {
  level: 1,
  totalXp: 0,
  currentXp: 0,
  xpToNext: 100,
  attributes: {
    hygiene: 5,
    strength: 5,
    stamina: 5,
    discipline: 5,
    mindset: 5,
    nutrition: 5,
    recovery: 5,
    vitality: 5,
    knowledge: 5
  },
  habits: [
    { id: crypto.randomUUID(), name: 'Brush, shower, and skin-care routine', done: false },
    { id: crypto.randomUUID(), name: 'Hit 10,000 steps', done: false },
    { id: crypto.randomUUID(), name: '30 minutes reading', done: false }
  ],
  log: []
};

const state = loadState();

const rankValue = document.getElementById('rankValue');
const levelValue = document.getElementById('levelValue');
const totalXpValue = document.getElementById('totalXpValue');
const xpLabel = document.getElementById('xpLabel');
const xpProgress = document.getElementById('xpProgress');
const attributeGrid = document.getElementById('attributeGrid');
const actionForm = document.getElementById('actionForm');
const actionType = document.getElementById('actionType');
const actionNotes = document.getElementById('actionNotes');
const actionLog = document.getElementById('actionLog');
const habitForm = document.getElementById('habitForm');
const habitInput = document.getElementById('habitInput');
const habitList = document.getElementById('habitList');
const resetDayBtn = document.getElementById('resetDay');

actionForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const key = actionType.value;
  if (!ACTION_LIBRARY[key]) return;

  const action = ACTION_LIBRARY[key];
  awardXp(action.xp);
  applyGrowth(action.growth);

  const noteSuffix = actionNotes.value.trim() ? ` — ${actionNotes.value.trim()}` : '';
  state.log.unshift(
    `${timestamp()} ${action.label}: +${action.xp} XP${noteSuffix}`
  );
  state.log = state.log.slice(0, 12);

  actionType.value = '';
  actionNotes.value = '';

  saveState();
  render();
});

habitForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = habitInput.value.trim();
  if (!name) return;

  state.habits.push({ id: crypto.randomUUID(), name, done: false });
  habitInput.value = '';
  saveState();
  renderHabits();
});

resetDayBtn.addEventListener('click', () => {
  state.habits = state.habits.map((habit) => ({ ...habit, done: false }));
  saveState();
  renderHabits();
});

function awardXp(amount) {
  state.totalXp += amount;
  state.currentXp += amount;

  while (state.currentXp >= state.xpToNext) {
    state.currentXp -= state.xpToNext;
    state.level += 1;
    state.xpToNext = Math.round(state.xpToNext * 1.15 + 20);
  }
}

function applyGrowth(growthMap) {
  Object.entries(growthMap).forEach(([attribute, value]) => {
    state.attributes[attribute] = (state.attributes[attribute] || 0) + value;
  });
}

function render() {
  rankValue.textContent = getRank(state.level);
  levelValue.textContent = String(state.level);
  totalXpValue.textContent = String(state.totalXp);
  xpLabel.textContent = `${state.currentXp} / ${state.xpToNext}`;
  xpProgress.style.width = `${Math.min((state.currentXp / state.xpToNext) * 100, 100)}%`;

  renderAttributes();
  renderLog();
  renderHabits();
}

function renderAttributes() {
  attributeGrid.innerHTML = '';
  const entries = Object.entries(state.attributes).sort((a, b) => b[1] - a[1]);
  for (const [name, value] of entries) {
    const row = document.createElement('div');
    row.className = 'attribute-row';

    const niceName = document.createElement('span');
    niceName.className = 'attribute-name';
    niceName.textContent = capitalize(name);

    const level = document.createElement('span');
    level.className = 'attribute-value';
    level.textContent = value;

    const tier = document.createElement('span');
    tier.className = 'attribute-tag';
    tier.textContent = getAttributeTier(value);

    row.append(niceName, level, tier);
    attributeGrid.appendChild(row);
  }
}

function renderLog() {
  actionLog.innerHTML = '';
  if (!state.log.length) {
    const li = document.createElement('li');
    li.textContent = 'No actions claimed yet. Complete your first daily action to start leveling.';
    actionLog.appendChild(li);
    return;
  }

  state.log.forEach((entry) => {
    const li = document.createElement('li');
    li.textContent = entry;
    actionLog.appendChild(li);
  });
}

function renderHabits() {
  habitList.innerHTML = '';

  state.habits.forEach((habit) => {
    const li = document.createElement('li');
    li.className = 'habit-item';

    const meta = document.createElement('div');
    meta.className = 'habit-meta';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = habit.done;
    checkbox.addEventListener('change', () => {
      habit.done = checkbox.checked;
      if (habit.done) {
        awardXp(15);
        applyGrowth({ discipline: 1, mindset: 1 });
        state.log.unshift(`${timestamp()} Habit complete: ${habit.name} (+15 XP)`);
        state.log = state.log.slice(0, 12);
      }
      saveState();
      render();
    });

    const text = document.createElement('span');
    text.textContent = habit.name;

    meta.append(checkbox, text);

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'delete-btn';
    remove.textContent = 'Delete';
    remove.addEventListener('click', () => {
      state.habits = state.habits.filter((h) => h.id !== habit.id);
      saveState();
      renderHabits();
    });

    li.append(meta, remove);
    habitList.appendChild(li);
  });
}

function getRank(level) {
  let output = 'E';
  RANKS.forEach((entry) => {
    if (level >= entry.level) output = entry.rank;
  });
  return output;
}

function getAttributeTier(value) {
  if (value < 10) return 'Novice';
  if (value < 20) return 'Rising';
  if (value < 35) return 'Advanced';
  return 'Elite';
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function timestamp() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return structuredClone(DEFAULT_STATE);

  try {
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(DEFAULT_STATE),
      ...parsed,
      attributes: {
        ...DEFAULT_STATE.attributes,
        ...(parsed.attributes || {})
      }
    };
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

render();
