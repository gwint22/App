# LifeTime

LifeTime is a Solo Leveling-inspired self-improvement app with two core systems:

1. **XP & Attribute Progression**
2. **Daily Habit Tracking**

## Core gameplay loop

- Complete high-impact daily actions (hygiene, gym, steps, reading, nutrition, sleep).
- Each action grants **XP** and boosts specific **attributes**.
- XP fills your progress bar, triggers level-ups, and raises your rank from **E → S**.
- Keep momentum with custom daily habits and claim extra XP when you check them off.

## Systems implemented

### 1) Hunter profile

- Rank progression brackets:
  - E: Level 1+
  - D: Level 5+
  - C: Level 10+
  - B: Level 20+
  - A: Level 35+
  - S: Level 50+
- XP requirements scale each level:
  - Starts at 100 XP.
  - New threshold formula after each level-up: `xpToNext = round(xpToNext * 1.15 + 20)`.

### 2) Daily action feed (fixed high-value actions)

Each action has a targeted growth profile:

- **Morning hygiene routine**: +20 XP | Hygiene +3, Discipline +1
- **Gym session 45+ min**: +45 XP | Strength +4, Stamina +2, Discipline +2
- **10,000 steps milestone**: +35 XP | Stamina +4, Vitality +2
- **Focused reading 30 min**: +25 XP | Knowledge +4, Mindset +2
- **Healthy meal prep**: +30 XP | Nutrition +4, Vitality +2
- **7.5+ hours sleep**: +30 XP | Recovery +4, Mindset +1, Vitality +1

Optional action notes are appended to the activity timeline.

### 3) Attribute model

Tracked attributes:

- Hygiene
- Strength
- Stamina
- Discipline
- Mindset
- Nutrition
- Recovery
- Vitality
- Knowledge

Every attribute starts at **5** and displays a tier label:

- `< 10`: Novice
- `10–19`: Rising
- `20–34`: Advanced
- `35+`: Elite

### 4) Habit tracker

- Add unlimited custom daily tasks.
- Check/uncheck completion state.
- On first check of a task in a day, gain:
  - +15 XP
  - Discipline +1
  - Mindset +1
- Delete habits you no longer need.
- "Reset Daily Checkboxes" button sets all habits back to unchecked for a fresh day.

### 5) Activity timeline

- Records recent action claims and habit completions.
- Keeps the latest 12 entries to stay focused.
- Shows timestamp + reward details.

### 6) Persistence

- App state is saved with `localStorage` under key `lifetime-state-v1`.
- Survives refreshes/browser restarts.
- Includes default seed habits for a quick start.

## Run locally

You can open `index.html` directly, or run a static server:

```bash
python3 -m http.server 4173
```

Then visit `http://localhost:4173`.
