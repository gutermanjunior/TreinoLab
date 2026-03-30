# 🏋️ TreinoLab

![Next.js](https://img.shields.io/badge/Next.js-13+-black)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)
![License](https://img.shields.io/badge/license-MIT-green)

TreinoLab is a modern workout tracking application focused on simplicity, performance, and structured training progression.

It allows users to manage routines, track workouts, and analyze performance — all in a clean and responsive interface.

---

## 🚀 Features

* 📋 Create and manage workout routines
* 🏋️ Track exercises (sets, reps, rest timer)
* 📊 Visualize performance statistics
* 🕒 Access full training history
* 📱 Responsive UI (mobile-friendly)
* ⚡ Fast and lightweight (local-first)

---

## 🧠 Philosophy

TreinoLab follows a **local-first approach**:

* No account required
* Instant usage
* Full control of your data

Future versions may include optional cloud sync.

---

## 🧱 Tech Stack

* **Next.js (App Router)**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **LocalStorage (persistence layer)**

---

## 📂 Project Structure

```
app/
  treino/        # Workout execution
  rotinas/       # Routine management
  historico/     # Training history
  estatisticas/  # Performance stats

components/
  workout/       # Workout-specific components
  ui/            # Reusable UI components

lib/
  storage.ts     # Local persistence logic
  types.ts       # Type definitions
```

---

## ⚙️ Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Run the development server

```bash
pnpm dev
```

### 3. Open in browser

```
http://localhost:3000
```

---

## 🌐 Deployment

Recommended platform:

* **Vercel** (native support for Next.js)

```bash
pnpm build
pnpm start
```

---

## 📌 Roadmap

### Core Improvements

* [ ] User authentication
* [ ] Cloud sync (Supabase / Firebase)
* [ ] Data backup & restore

### Product Evolution

* [ ] Progressive Web App (PWA)
* [ ] Mobile app (React Native / Expo)
* [ ] Advanced analytics dashboard
* [ ] Exercise database

### UX/UI

* [ ] Custom themes
* [ ] Dark mode improvements
* [ ] Better onboarding

---

## 📸 Preview

> Add screenshots here once UI is stable

```
/public/screenshots/
```

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the project
2. Create your branch
3. Commit your changes
4. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## ⚠️ Disclaimer

TreinoLab is a personal project and not intended as medical or professional fitness advice.

Always consult a qualified professional before starting a training program.
