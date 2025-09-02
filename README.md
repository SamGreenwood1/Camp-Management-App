# Camp Management App

![Next.js](https://img.shields.io/badge/Next.js-Black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

A dynamic web application designed to streamline summer camp program management and daily activity scheduling. This app aims to provide a flexible and intelligent system for program directors, unit heads, and activity specialists to manage their camp's daily flow, ensuring a diverse and equitable experience for all campers.

## ✨ Project Vision & Goals
This application addresses key challenges in summer camp logistics:
1.  **Dynamic Scheduling**: Intelligently assign cabin groups to activity areas daily, ensuring fair and equitable rotation (every cabin group aims to visit every area weekly).
2.  **Evolving Roster**: Adapt schedules seamlessly when cabin groups merge mid-session due to camper arrivals or departures.
3.  **Program Management**: Centralize all camp program details, supplies, and approval workflows.
4.  **Staff Coordination**: Manage staff roles, assignments, and day-offs efficiently.

## 📁 Project Structure

```
Camp-Management-App/
├── public-site/                # Public landing page
├── user-app/                   # Core application (dashboard)
├── src/                       # Shared source code
│   ├── components/            # React components
│   ├── hooks/                 # Custom React hooks
│   ├── scheduling/            # Scheduling types and logic
│   └── algorithm/             # Core scheduling algorithm
├── README.md                  # This file
├── PROJECT_OVERVIEW.md        # Detailed project overview
├── MONOREPO_README.md         # Monorepo setup guide
├── vercel.json                # Vercel deployment config
└── package.json               # Root dependencies
```

For a comprehensive overview of the project's detailed features, modules, and architectural plans, please refer to the dedicated [`PROJECT_OVERVIEW.md`](./PROJECT_OVERVIEW.md) file.

## 🚀 Getting Started

### Prerequisites
*   Node.js (LTS recommended)
*   npm (comes with Node.js) or Yarn / pnpm

### Installation
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/SamGreenwood1/Camp-Management-App.git
    cd Camp-Management-App
    ```

2.  **Install all dependencies:**
    ```bash
    npm run install:all
    ```

### Running the Development Servers
1.  **Start both applications simultaneously:**
    ```bash
    npm run dev
    ```
    - Public site: http://localhost:3001
    - User app: http://localhost:3002

2.  **Or start individually:**
    ```bash
    npm run dev:public    # Public site only
    npm run dev:app       # User app only
    ```

## 🏗️ Building for Production

```bash
# Build both applications
npm run build

# Or build individually
npm run build:public
npm run build:app
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel
```

The `vercel.json` configuration automatically handles routing:
- `/app/*` → User application
- `/*` → Public landing page

### Manual Deployment
Each application can be deployed separately:
```bash
cd public-site && npm run build
cd user-app && npm run build
```

## 🔧 Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both development servers |
| `npm run dev:public` | Start public site only (port 3001) |
| `npm run dev:app` | Start user app only (port 3002) |
| `npm run build` | Build both applications |
| `npm run preview` | Preview both built applications |
| `npm run install:all` | Install dependencies for all apps |
| `npm run clean` | Clean build artifacts |

## 📱 Applications

### Public Site (`/public-site`)
- Marketing landing page
- Feature showcase
- Call-to-action for potential customers
- SEO optimized

### User App (`/user-app`)
- Core camp management functionality
- Intelligent scheduling algorithm
- Program management system
- Staff coordination tools

## 🤝 Contributing & Seeking Help

This project is actively under development, and I warmly invite contributions and insights from experienced web and app developers.

The current application's functionality has largely been developed through an intuitive, "vibe-coding" approach. While I possess a strong understanding of the existing codebase and have actively participated in its creation by integrating, adapting, and refining its components (not merely copying code), initiating entirely new features or implementing novel architectural patterns from a blank slate remains a significant challenge.

If you're looking to contribute, providing concrete code examples, specific design patterns, or structured implementation steps would be particularly valuable. Please feel free to open issues or submit pull requests. Your expertise in advancing this application is highly valued and immensely appreciated.

## 📄 License
This project is currently licensed under the **MIT License**.

**Please Note:** While in development, the project is openly licensed under MIT. However, once the application is ready for a formal release, it is likely to be relicensed. See [LICENSE](./LICENSE) for the current full text.
