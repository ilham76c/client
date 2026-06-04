# EquityLens Project Structure

## Overview
Struktur project yang terorganisir dengan baik menggunakan Next.js 16, TypeScript, dan Tailwind CSS.

## Struktur Folder

```
src/
├── app/                           # Next.js App Router
│   ├── (public)/                 # Route group untuk halaman publik
│   ├── (protected)/              # Route group untuk halaman protected
│   ├── api/                      # Route handlers
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── favicon.ico
│
├── components/                    # React Components
│   ├── ui/                       # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── LoadingSpinner.tsx
│   ├── common/                   # Common components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   ├── layout/                   # Layout wrappers
│   │   ├── MainLayout.tsx
│   │   ├── AuthLayout.tsx
│   │   └── DashboardLayout.tsx
│   └── charts/                   # Chart components
│       ├── BaseChart.tsx
│       ├── FinancialChart.tsx
│       └── InvestorChart.tsx
│
├── features/                      # Feature-based modules
│   ├── auth/                     # Authentication feature
│   │   ├── api/
│   │   ├── hooks/
│   │   ├── components/
│   │   └── types/
│   ├── dashboard/
│   ├── financials/
│   ├── investor/
│   └── ownership/
│
├── lib/                          # Utility & configuration
│   ├── api/                      # API client & endpoints
│   │   ├── client.ts
│   │   └── endpoints.ts
│   ├── hooks/                    # Custom React hooks
│   ├── types/                    # TypeScript types
│   ├── utils/                    # Utility functions
│   │   ├── constants.ts
│   │   ├── formatters.ts
│   │   └── validators.ts
│   ├── config/                   # Configuration
│   │   ├── environment.ts
│   │   └── muiTheme.ts
│   └── middleware.ts
│
├── styles/                        # Global styles
│   ├── globals.css
│   └── variables.css
│
└── providers.tsx                  # App providers

public/                           # Static files
├── icons/
├── images/
└── ...
```

## Key Directories

### `/src/app`
- **Definisi:** Next.js App Router directory
- **Kegunaan:** Mendefinisikan routes aplikasi
- **Contoh:**
  - `(public)/` - Public pages (login, register)
  - `(protected)/` - Protected pages (dashboard, settings)
  - `api/` - API route handlers

### `/src/components`
- **Definisi:** Reusable React components
- **Struktur:**
  - `ui/` - Atomic components (Button, Input, Card)
  - `common/` - Components used throughout app (Header, Sidebar)
  - `layout/` - Layout containers
  - `charts/` - Data visualization components

### `/src/features`
- **Definisi:** Feature-based modules dengan business logic
- **Struktur setiap feature:**
  - `api/` - API calls
  - `hooks/` - Custom React hooks
  - `components/` - Feature-specific components
  - `types/` - TypeScript interfaces
  - `utils/` - Helper functions

### `/src/lib`
- **Definisi:** Shared utilities dan konfigurasi
- **Isi:**
  - `api/client.ts` - HTTP client configuration
  - `api/endpoints.ts` - API endpoints constants
  - `hooks/` - Reusable custom hooks
  - `types/` - Shared TypeScript types
  - `utils/` - Helper functions (format, validate, etc.)
  - `config/` - App configuration (theme, environment)

## Component Hierarchy

```
App Root
├── Providers (NextAuth, React Query, Theme)
├── Layout
│   ├── Header
│   ├── Sidebar
│   └── Main Content
│       ├── Page Components
│       ├── Feature Components
│       └── UI Components
└── Footer
```

## Import Conventions

```typescript
// Absolute imports
import { Button } from '@/components/ui';
import { useAuth } from '@/lib/hooks';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { formatCurrency } from '@/lib/utils/formatters';
import { LoginForm } from '@/features/auth/components/LoginForm';

// Path aliases configured in tsconfig.json
```

## File Naming Conventions

- **Components:** PascalCase (e.g., `LoginForm.tsx`)
- **Utils/Hooks:** camelCase (e.g., `formatters.ts`, `useAuth.ts`)
- **Types:** PascalCase (e.g., `User`, `ApiResponse`)
- **Folders:** kebab-case (e.g., `react-query`, `form-components`)

## Dependencies

- **UI Framework:** Material-UI (MUI)
- **Styling:** Tailwind CSS
- **Data Fetching:** React Query (@tanstack/react-query)
- **Authentication:** NextAuth.js
- **Charts:** ECharts
- **Date Handling:** Day.js
- **Table:** @tanstack/react-table

## Best Practices

1. **Component Placement:**
   - Generic UI → `/components/ui`
   - Layout components → `/components/layout`
   - Feature-specific → `/features/[feature-name]/components`

2. **API Calls:**
   - Selalu gunakan API client wrapper
   - Group related endpoints dalam feature API files

3. **Type Safety:**
   - Define types for all API responses
   - Use strict TypeScript config

4. **State Management:**
   - React Query untuk server state
   - Context API untuk UI state
   - NextAuth untuk authentication

5. **Hooks:**
   - Custom hooks di `/lib/hooks` untuk reusable logic
   - Feature hooks di `/features/[name]/hooks`

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
NODE_ENV=development
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Material-UI Documentation](https://mui.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [NextAuth.js Documentation](https://next-auth.js.org)