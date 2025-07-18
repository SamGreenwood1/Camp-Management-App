# Camp Management App

![Next.js](https://img.shields.io/badge/Next.js-Black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-6C56F3?style=for-the-badge&logo=clerk&logoColor=white)

A dynamic web application designed to streamline summer camp program management and daily activity scheduling. This app aims to provide a flexible and intelligent system for program directors, unit heads, and activity specialists to manage their camp's daily flow, ensuring a diverse and equitable experience for all campers.

## ✨ Project Vision & Goals
This application addresses key challenges in summer camp logistics:
1.  **Dynamic Scheduling**: Intelligently assign cabin groups to activity areas daily, ensuring fair and equitable rotation (every cabin group aims to visit every area weekly).
2.  **Evolving Roster**: Adapt schedules seamlessly when cabin groups merge mid-session due to camper arrivals or departures.
3.  **Program Management**: Centralize all camp program details, supplies, and approval workflows.
4.  **Staff Coordination**: Manage staff roles, assignments, and day-offs efficiently.

For a comprehensive overview of the project's detailed features, modules, and architectural plans, please refer to the dedicated [`PROJECT_OVERVIEW.md`](./PROJECT_OVERVIEW.md) file.

## 🚀 Getting Started
This guide will help you get the development server running.

### Prerequisites
*   Node.js (LTS recommended)
*   npm (comes with Node.js) or Yarn / pnpm

### Installation
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/SamGreenwood1/Camp-Management-App.git
    cd Camp-Management-App
    ```
2.  **Install project dependencies:**
    ```bash
    npm install
    # or yarn
    # yarn
    ```
### Running the Development Server
1.  **Start the Next.js development server:**
    ```bash
    npm run dev
    # or yarn dev
    ```
2.  **Open in your browser:**
    Visit `http://localhost:3000` to see the application. The current setup is primarily focused on demonstrating and testing the core daily scheduling logic.

## ⚠️ Troubleshooting Installation & Setup
If `npm run dev` fails, please check the following common issues:
*   **"Missing script: 'dev'" error:**
    *   Ensure your `package.json` file explicitly contains the Next.js development scripts. It should have a `"scripts"` section like this (your dependencies will vary but the scripts should be present):
        ```json
        {
          "name": "camp-management-app",
          "version": "1.0.0",
          "private": true,
          "scripts": {
            "dev": "next dev",
            "build": "next build",
            "start": "next start",
            "lint": "next lint"
          },
          "dependencies": { /* ... */ },
          "devDependencies": { /* ... */ }
        }
        ```
*   **"Module parse failed: 'import' and 'export' may appear only with 'sourceType: module'" error (pointing to `index.js`):**
    *   This usually means an extraneous `src/index.js` file exists. Next.js projects don't typically use this as their main entry point. **Please ensure you delete or rename `src/index.js` if it exists.** The main entry point for this project's UI is `src/pages/index.tsx`.
*   **Next.js Configuration Files:**
    *   Ensure you have standard Next.js configuration files in your project root, if they were removed or not created by `create-next-app`:
        *   `next.config.js` (for Next.js specific configurations)
        *   `tsconfig.json` (for TypeScript settings)
        *   `.eslintrc.json` (for ESLint, if using)
        *   `tailwind.config.js` and `postcss.config.js` (if using Tailwind CSS)
    *   For the App Router setup (if you initially chose `--app` with `create-next-app`), ensure `src/app/layout.tsx` and `src/app/page.tsx` exist, and that `src/app/page.tsx` includes `'use client';` at the very top as it uses client-side hooks. If you chose the Pages Router (`--no-app`), `src/pages/_app.tsx` and `src/pages/_document.tsx` are typically present alongside `src/pages/index.tsx`.

## 🤝 Contributing & Seeking Help
This project is actively under development, and I warmly welcome any contributions or insights!

**My Learning Style:**
I learn best by understanding and adapting existing code. While I can read, comprehend, and debug complex code very well, I often find it challenging to initiate new features or implement fresh architectural patterns from a blank slate.

**How You Can Help:**
If you're looking to contribute or provide guidance, I'm particularly interested in:

*   **Debugging Assistance**: Helping me get the project to compile and run reliably if you encounter errors I'm stuck on.
*   **Concrete Code Examples**: Providing small, focused code snippets that demonstrate how to implement a specific feature or pattern.
*   **Architectural Patterns**: Illustrating architectural concepts with small, practical code examples relevant to this project.
*   **Step-by-Step Implementation "Recipes"**: A clear, ordered list of actions to take when building out a new module.

Please feel free to open issues on this repository or submit pull requests. Your help in refining this application and guiding its development is immensely appreciated!

## 📄 License
This project is currently licensed under the **MIT License**.

**Please Note:** While in development, the project is openly licensed under MIT. However, once the application is ready for a formal release, it is likely to be relicensed. See [[LICENSE]] for the current full text.

