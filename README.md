# Camp Management App

![Next.js](https://img.shields.io/badge/Next.js-Black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-6C56F3?style=for-the-badge&logo=clerk&logoColor=white)

A dynamic web application designed to streamline summer camp program management and daily activity scheduling. This app aims to provide a flexible and intelligent system for program directors, unit heads, and activity specialists to manage their camp's daily flow, ensuring a diverse and equitable experience for all campers.

## ✨ Features

*   **Intelligent Daily Scheduling**: Programmatically assigns cabin groups to activity areas, ensuring equitable rotation (every group visits every area weekly).
*   **Dynamic Cabin Merging**: Adapts schedules seamlessly when cabin groups merge due to camper arrivals or departures.
*   **Centralized Program Bank**: Manage all camp programs, including forms, templates, and resource documents (PDF uploads).
*   **AI-Assisted Program Ingestion**: Planned integration to extract keywords, supplies, and summaries from program documents.
*   **Role-Based Access**: Granular permissions for various staff roles (Admin, Program Director, Unit Head, Activity Department Head, Specialist, Councillor).
*   **PWA with Offline Support**: Accessible as an installable app with offline capabilities, crucial for camp environments.
*   **Authentication & SSO**: Secure login via Clerk, with planned integration for enterprise SSO (WorkOS) and major camp management software.
*   **Supply Requisitions**: Streamlined process for ordering program supplies.

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (LTS recommended)
*   npm (comes with Node.js) or Yarn / pnpm

### Installation

1.  **Clone the repo:**
    ```bash
    git clone https://github.com/SamGreenwood1/Camp-Management-App.git
    cd Camp-Management-App
    ```
2.  **Install NPM packages:**
    ```bash
    npm install
    # or yarn
    # yarn
    ```

### Running the Development Server

1.  **Start the development server:**
    ```bash
    npm run dev
    # or yarn dev
    ```
2.  **Open your browser:**
    Visit `http://localhost:3000` to see the application. The current setup focuses on demonstrating the core daily scheduling logic.

## 🤝 Contributing & Seeking Help

This project is actively under development, and I welcome any contributions or insights!

I learn best by understanding and adapting existing code patterns. If you're looking to help, I'm particularly interested in **concrete code examples, architectural patterns illustrated with small snippets, or step-by-step implementation "recipes"** for new features.

Please refer to `PROJECT_OVERVIEW.md` for a more detailed description of the project's vision, modules, and specific areas where I'm seeking architectural and implementation guidance.

Feel free to open issues or pull requests.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
