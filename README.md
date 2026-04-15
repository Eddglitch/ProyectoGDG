# Google Cloud Summit 2026 — GDG Codelab Project

This project contains the 4 exercises from the **"Compila con Google Antigravity"** Google Codelab.

## 📂 Project Structure

```
ProyectoGDG/
├── web-research/          # Exercise 1: Web Research & News Highlights
│   └── index.html         # Informational dashboard with prompts
├── conference-app/        # Exercise 2: Conference Website (Flask)
│   ├── app.py             # Flask server
│   ├── data.py            # Dummy data (talks, speakers)
│   ├── requirements.txt
│   ├── templates/
│   │   └── index.html     # Jinja2 template
│   └── static/
│       ├── css/style.css
│       └── js/app.js
├── pomodoro-app/          # Exercise 3: Pomodoro Timer
│   ├── index.html
│   ├── style.css
│   └── app.js
├── order-service/         # Exercise 4: Order Service + Unit Tests
│   ├── order.py           # Business logic
│   ├── test_order.py      # 25+ pytest tests with mocks
│   └── requirements.txt
└── README.md              # This file
```

---

## 🚀 Quick Start

### Exercise 1: Web Research
Open `web-research/index.html` in your browser. This is a reference guide with the prompts to use in Google Antigravity's Agent Manager.

### Exercise 2: Conference Website
```bash
cd conference-app
pip install -r requirements.txt
python app.py
# Open http://127.0.0.1:5000
```

**Features:**
- 8 talks about Google Cloud Technologies + lunch break
- 12 speakers with LinkedIn profiles
- Real-time search by title, speaker, or keyword
- Category filtering (AI & ML / Cloud Infrastructure)
- Premium dark-mode design with timeline layout
- Fully responsive

### Exercise 3: Pomodoro Timer
Open `pomodoro-app/index.html` in your browser.

**Features:**
- 25-min Focus / 5-min Short Break / 15-min Long Break
- SVG circular progress ring
- Auto-switch between focus and break modes
- Audio chime notification using Web Audio API
- Daily progress tracker (8-session goal)
- Keyboard shortcuts: `Space` (start/pause), `R` (reset), `S` (skip)
- Calm aesthetic with ambient background blobs

### Exercise 4: Order Service + Tests
```bash
cd order-service
pip install -r requirements.txt
python -m pytest test_order.py -v
```

**Test Coverage:**
- `add_item` — valid items, negative price, zero/negative quantity, free items
- `remove_item` — existing, non-existent, partial removal
- `total_price` — empty cart, single, multiple items
- `apply_discount` — VIP 20% off, regular 10% over $100, no discount, rounding
- `checkout` — full flow, empty cart, insufficient stock, payment declined, gateway errors, VIP discount, multi-item stock verification

---

## 🛠 Tech Stack

| Component | Technology |
|-----------|------------|
| Conference Backend | Python 3.12 + Flask |
| Conference Frontend | HTML5 + CSS3 + Vanilla JS |
| Pomodoro App | Pure HTML/CSS/JS (no dependencies) |
| Unit Tests | pytest + unittest.mock |
| Design | Google Cloud color palette, Dark mode, Glassmorphism |

---

## 📝 Making Changes

### Adding Talks to Conference App
Edit `conference-app/data.py`:
1. Add a new speaker to the `SPEAKERS` list
2. Add a new talk to the `TALKS` list with the speaker's ID
3. Restart the Flask server

### Modifying Pomodoro Durations
Edit `pomodoro-app/app.js`, lines 7-11:
```javascript
const MODES = {
    'focus':       { minutes: 25, ... },  // Change focus duration
    'short-break': { minutes: 5,  ... },  // Change short break
    'long-break':  { minutes: 15, ... },  // Change long break
};
```

### Adding Order Tests
Add new test methods to `order-service/test_order.py` inside any `Test*` class or create a new one.

---

*Built for the GDG Codelab — "Compila con Google Antigravity"*
