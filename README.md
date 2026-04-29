# Base Shadcn Dashboard

A scalable front-end dashboard project built with Next.js, TypeScript, and Shadcn UI.

## Features

### 1. Authentication
- Third-party API authentication using DummyJSON API
- Hardcoded credentials: `emilys` / `emilyspass`
- JWT token stored in HTTP-only cookies
- Protected routes with middleware
- Zustand state management for auth state

### 2. Dashboard Page
- **KPI Cards**: Quick access buttons to navigate to data page
- **Reactive Charts**: Line chart with filters (Week/Month/Year) using ApexCharts
- **Stacked Bar Chart**: Weekly revenue visualization
- **Data Tables**: Check table and complex table with status badges
- **Calendar Integration**
- **Dark Mode**: Full dark mode support with next-themes

### 3. Data Page (VPIC API Integration)
- Integration with NHTSA VPIC API (https://vpic.nhtsa.dot.gov/api)
- Vehicle models data table with search functionality
- Detail modal popup for each vehicle
- Error handling example with trigger button

### 4. UI/UX Features
- Responsive design
- Theme toggle (Light/Dark/System)
- Shadcn UI components
- Iconify icons
- Toast notifications

## How to Run

```bash
# Install dependencies
npm install or npm i --legacy-peer-deps

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Required Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=https://dummyjson.com
```

## Architecture & Trade-offs

### Tech Stack
- **Framework**: Next.js 15.1.0 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **State Management**: Zustand (with persistence)
- **Charts**: React-ApexCharts
- **Forms**: React Hook Form + Zod validation
- **Icons**: Iconify + Lucide React
- **Theme**: next-themes
- **HTTP Client**: Axios

### Architecture Decisions
1. **App Router over Pages Router**: Using Next.js 15 App Router for better layout nesting and server components
2. **Zustand over Redux**: Simpler state management with less boilerplate
3. **Shadcn UI**: Customizable components with direct access to code
4. **Server-side API routes**: For secure cookie handling (auth token)

### Trade-offs
- **Hardcoded credentials**: For demo purposes, using DummyJSON API
- **No SSR for charts**: ApexCharts requires client-side rendering (using dynamic import)
- **Prototype data**: Some dashboard data uses static/random values

## Project Structure

```
app/
├── (auth)/login/          # Login page
├── (dashboard)/
│   ├── layout.tsx         # Dashboard layout with sidebar
│   ├── dashboard/         # Main dashboard
│   └── data/             # VPIC data page
├── api/auth/              # Auth API routes
└── _services/             # API service layer
components/
├── ui/                    # Shadcn UI components
├── app-sidebar.tsx        # Sidebar navigation
└── theme-toggle.tsx       # Dark mode toggle
store/
├── authStore.ts           # Authentication state
└── globalStore.ts         # Global app state
```

## Additional Features

- **Error Handling**: Trigger error button on data page for testing
- **Role-based UI**: Menu structure supports role-based navigation
- **Toast Notifications**: User feedback for actions
- **Form Validation**: Zod schema validation
- **Calendar**: Date picker integration
- **Responsive Sidebar**: Collapsible sidebar navigation
