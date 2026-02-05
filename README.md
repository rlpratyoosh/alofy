![Alofy](https://capsule-render.vercel.app/api?type=waving&height=300&color=gradient&text=Alofy&textBg=false)

<div align="center">

### ✨ A new story for every new game ✨

**AI-Powered Text-Based RPG where you solve DSA challenges to become a coding legend**

[![GitHub](https://img.shields.io/badge/GitHub-rlpratyoosh-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/rlpratyoosh)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-rlpratyoosh-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/rlpratyoosh)
[![Repo](https://img.shields.io/badge/Repo-Alofy-purple?style=for-the-badge&logo=github&logoColor=white)](https://github.com/rlpratyoosh/Alofy)

</div>

---

## 🎮 What is Alofy?

Alofy is a **text-based RPG game powered by AI** where every playthrough generates a unique story. Your journey unfolds based on your choices and coding skills as you face Data Structures and Algorithms (DSA) challenges to progress through the adventure.

### 🌟 Key Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI-Generated Stories** | Every game creates a unique narrative tailored to your character and choices |
| 📚 **10 Levels** | Progress through 10 unique levels with AI-generated story content |
| ❤️ **3 Hearts** | You start with 3 lives - fail a hurdle and lose a heart |
| ⚔️ **3 Hurdles** | Boss battles at levels 3, 6, and 9 with DSA coding challenges |
| 🎭 **Character Creation** | Choose your race, name your hero, and select your coding class |
| 🎓 **Learn DSA** | Master data structures and algorithms while enjoying an immersive RPG experience |

### 👤 Character Classes

Choose your coding language of choice:

| Class | Language |
|-------|----------|
| 🐍 **Python** | Python 3.x |
| ☕ **Java** | Java 15.x |
| ⚡ **C++** | C++ 10.x |

---

## 📸 Screenshots

<div align="center">

<!-- Add your screenshots here -->

| Landing Page | Game Menu |
|:------------:|:---------:|
| ![Landing Page](screenshots/Alofy-Landing.png) | ![Game Menu](screenshots/Alofy-Menu.png) |

| Character Creation | Gameplay |
|:------------------:|:--------:|
| ![Character Creation](screenshots/Alofy-Character.png) | ![Gameplay](screenshots/Alofy-Gameplay.png) |

| Code Editor | Game Over Screen |
|:-----------:|:--------------:|
| ![Code Editor](screenshots/Alofy-Code.png) | ![GameOver](screenshots/Alofy-GameOver.png) |

</div>


---

## 🛠️ Tech Stack

<div align="center">

[![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Nest JS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TurboRepo](https://img.shields.io/badge/TurboRepo-EF5350?style=for-the-badge&logo=turborepo&logoColor=white)](https://turbo.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)](https://www.nginx.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)](https://jwt.io/)
[![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev/)
[![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![Monaco Editor](https://img.shields.io/badge/Monaco_Editor-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white)](https://microsoft.github.io/monaco-editor/)

</div>

### Architecture

```
alofy/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/       # NestJS backend
├── packages/
│   ├── db/           # Prisma database package
│   ├── types/        # Shared TypeScript types
│   └── schema/       # Shared Schemas
└── docker/           # Docker configurations
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 24
- pnpm
- Docker & Docker Compose
- PostgreSQL
- Redis
- Piston

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rlpratyoosh/alofy.git
   cd alofy
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   cp /packages/database/.env.example /packages/database/.env
   cp /apps/api/.env.example /apps/api/.env
   cp /apps/web/.env.example /apps/web/.env

   # Edit .env with your configuration
   ```

4. **Start the database**
   ```bash
   docker-compose up -d
   ```

5. **Run database migrations**
   ```bash
   pnpm db:migrate
   ```

6. **Start the development server**
   ```bash
   pnpm dev
   ```

---

## 🎯 How to Play

1. **Create Your Character** - Choose your race, name your hero, and select your coding class (Python, Java, or C++)

2. **Embark on Your Journey** - Progress through 10 levels with AI-generated story content

3. **Face the Hurdles** - At levels 3, 6, and 9, solve DSA coding challenges to continue

4. **Claim Victory** - Complete all 10 levels to become a coding legend!

### Game Rules

- 🔴 **3 Hearts** - Fail a hurdle and lose a heart. Lose all hearts = Game Over
- ⚔️ **3 Hurdles** - Boss battles at levels 3, 6, and 9 with DSA challenges
- 🏆 **10 Levels** - Each level features unique AI-generated story content

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


---

## ⚠️ Development Status

<div align="center">

# 🚧 Under Active Development 🚧

*Some features may be incomplete or subject to change*

</div>

---

## 📬 Contact

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-rlpratyoosh-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/rlpratyoosh)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-rlpratyoosh-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/rlpratyoosh)

</div>

---

<div align="center">

**Bringing fun to DSA learning** 🎮✨

Made with ❤️ by [Pratyoosh](https://github.com/rlpratyoosh)

![Footer](https://capsule-render.vercel.app/api?type=waving&height=100&color=gradient&section=footer)

</div>