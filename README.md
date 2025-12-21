# Expensio

A modern expense tracker with insights - visualize your spending patterns, track income and expenses, and make informed financial decisions.

## Features

- **Quick Expense Tracking**: Add expenses instantly with the quick expense modal featuring predefined categories (Food, Health, Household)
- **Dashboard Overview**: Real-time financial statistics including income, expenses, balance, and savings
- **Transaction Management**: Comprehensive transaction history with filtering and categorization
- **Recurring Transactions**: Automate tracking of subscriptions and regular payments
- **Category Management**: Organize expenses with custom categories
- **Visual Reports**: Interactive charts and analytics powered by Highcharts
- **Responsive Design**: Mobile-first PWA with offline support
- **Dark Mode**: Built-in theme switching with next-themes

## Tech Stack

### Core
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **shadcn/ui** - Re-usable component patterns

### Data & State
- **TanStack Query** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Axios** - HTTP client

### Visualization
- **Highcharts** - Interactive charts and graphs

### Testing
- **Vitest** - Unit testing framework
- **Testing Library** - React component testing

## Prerequisites

- **Node.js** >= 23.11.0
- **npm** or **yarn**
- Backend API running (see [Backend Repository](https://github.com/mohammadrahmanian/Expense-tracker-be))

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run typecheck` - Run TypeScript type checking
- `npm run test` - Run tests
- `npm run format.fix` - Format code with Prettier

## Testing

The project uses Vitest for testing. Run tests with:

```bash
npm run test
```

For UI testing with Playwright (when configured):
- Test credentials are available via `UI_TEST_EMAIL` and `UI_TEST_PASSWORD` environment variables
- Application runs at `http://localhost:8080`

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── layouts/      # Layout components
│   ├── ui/           # shadcn/ui components
│   ├── transactions/ # Transaction-related components
│   └── recurring/    # Recurring transaction components
├── contexts/         # React contexts (Currency, DataRefresh)
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── pages/            # Page components
│   ├── Dashboard.tsx
│   ├── Transactions.tsx
│   ├── Reports.tsx
│   ├── Categories.tsx
│   ├── RecurringTransactions.tsx
│   ├── Profile.tsx
│   └── More.tsx
├── services/         # API services
├── types/            # TypeScript type definitions
└── App.tsx           # Main application component
```

## Deployment

The application is configured for deployment on Fly.io using Docker and Nginx.

### Fly.io Deployment

1. Install Fly CLI:
```bash
curl -L https://fly.io/install.sh | sh
```

2. Login to Fly.io:
```bash
fly auth login
```

3. Deploy the application:
```bash
fly deploy --build-arg VITE_API_BASE_URL=https://your-api-domain.com/api
```

The Dockerfile uses a multi-stage build:
- **Build stage**: Installs dependencies and builds the Vite application
- **Production stage**: Serves the built files with Nginx

### Environment Variables for Production

Set build-time environment variables:
```bash
fly secrets set VITE_API_BASE_URL=https://your-api-domain.com/api
```

## Backend Integration

This frontend application requires the Expensio backend API. See the [backend repository](https://github.com/mohammadrahmanian/Expense-tracker-be) for setup instructions.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the GNU Affero General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

**Note**: Prior to 21 Dec 2025, this project was licensed under GPL-3.0. All versions from 21 Dec 2025 onward are AGPL-3.0.

