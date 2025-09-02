# Camp Management App - Monorepo Structure

This repository is structured as a monorepo with two separate applications that can be deployed independently to Vercel:

## 📁 Repository Structure

```
Camp-Management-App/
├── public-site/                # Public Landing Page
│   ├── index.html             # Landing page HTML
│   ├── package.json           # Landing page dependencies
│   ├── vite.config.js         # Landing page Vite config
│   └── tsconfig.json          # Landing page TypeScript config
├── user-app/                   # User-Facing App (Dashboard)
│   ├── index.html             # Dashboard HTML
│   ├── package.json           # Dashboard dependencies
│   ├── vite.config.js         # Dashboard Vite config
│   └── tsconfig.json          # Dashboard TypeScript config
├── src/                       # Shared source code
│   ├── components/            # React components
│   ├── hooks/                 # Custom React hooks
│   ├── scheduling/            # Scheduling types and logic
│   └── algorithm/             # Core scheduling algorithm
├── vercel.json                # Vercel deployment configuration
├── package.json               # Root package.json
├── tsconfig.json              # Root TypeScript config
├── tsconfig.node.json         # Node TypeScript config
├── vite.config.js             # Root Vite config
├── README.md                  # Main project README
├── PROJECT_OVERVIEW.md        # Detailed project overview
└── LICENSE                    # Project license
```

## 🚀 Applications

### 1. Public Landing Page (`/public-site`)
- **Purpose**: Marketing and information page for potential customers
- **Features**: Hero section, feature showcase, call-to-action
- **Port**: 3001 (development)
- **Route**: `/` (root)

### 2. User-Facing App (`/user-app`)
- **Purpose**: Core application with scheduling functionality
- **Features**: Camp scheduling, program management, staff coordination
- **Port**: 3002 (development)
- **Route**: `/app/*`

## 🛠️ Development

### Running Both Apps Locally

1. **Install dependencies:**
   ```bash
   npm run install:all
   ```

2. **Start both apps simultaneously:**
   ```bash
   npm run dev
   # Public site runs on http://localhost:3001
   # User app runs on http://localhost:3002
   ```

3. **Or start individually:**
   ```bash
   npm run dev:public    # Port 3001
   npm run dev:app       # Port 3002
   ```

### Building for Production

1. **Build both apps:**
   ```bash
   npm run build
   ```

2. **Or build individually:**
   ```bash
   npm run build:public
   npm run build:app
   ```

## 🚀 Vercel Deployment

### Option 1: Monorepo Deployment (Recommended)
Deploy the entire repository to Vercel. The `vercel.json` configuration will automatically:
- Build both applications
- Route `/app/*` to the user app
- Route everything else to the public landing page

```bash
vercel
```

### Option 2: Separate Deployments
Deploy each application to separate Vercel projects:

1. **Deploy public landing page:**
   ```bash
   cd public-site
   vercel --name camp-management-public
   ```

2. **Deploy user app:**
   ```bash
   cd user-app
   vercel --name camp-management-dashboard
   ```

## 🔧 Configuration

### Vite Configuration
Each app has its own Vite configuration that references the shared `src/` directory:
- **Public Site**: `public-site/vite.config.js` (port 3001)
- **User App**: `user-app/vite.config.js` (port 3002)

### TypeScript Configuration
Each app has its own TypeScript configuration that includes the shared `src/` directory:
- **Public Site**: `public-site/tsconfig.json`
- **User App**: `user-app/tsconfig.json`

### Vercel Configuration
The `vercel.json` file configures:
- Build commands for both applications
- Routing rules for proper navigation
- Output directories for each build

## 📱 Features

### Public Landing Page
- Responsive design with modern UI
- Feature showcase with icons and descriptions
- Call-to-action buttons
- SEO optimized with meta tags
- Social media sharing support

### User-Facing App
- Intelligent camp scheduling algorithm
- Program management system
- Staff coordination tools
- Real-time schedule updates
- Export functionality (CSV, HTML)

## 🔐 Authentication
The user-facing app is currently set up with sample data for demonstration. In production, you would integrate:
- Clerk for user authentication
- Role-based access control
- Session management
- API endpoints for data persistence

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm run install:all`
3. Run both apps: `npm run dev`
4. Customize the landing page content
5. Configure the scheduling algorithm
6. Deploy to Vercel

## 📞 Support
For questions or issues, please refer to the main README.md or open an issue in the repository.
