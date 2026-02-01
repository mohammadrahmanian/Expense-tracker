# Deployment & CI/CD

---

## Environment Variables

### Required (Build Time)

| Variable            | Description     | Example                        |
| ------------------- | --------------- | ------------------------------ |
| `VITE_API_BASE_URL` | Backend API URL | `https://api.expensio.com/api` |

### For UI Testing

| Variable           | Description           |
| ------------------ | --------------------- |
| `UI_TEST_EMAIL`    | Test account email    |
| `UI_TEST_PASSWORD` | Test account password |

### Local Development

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```bash
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## Build Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview

# Type check
npm run typecheck

# Run tests
npm run test

# Format code
npm run format.fix
```

---

## CI/CD Pipeline

### Current Setup

- **Platform:** GitHub Actions
- **Config:** `.github/workflows/fly-deploy.yml`
- **Hosting:** Fly.io

### Pipeline Steps (Current)

1. Push to main branch
2. GitHub Actions triggered
3. Build Docker image
4. Deploy to Fly.io

### Pipeline Improvements (Planned)

Future additions to the pipeline:

1. **Pre-deploy checks:**
   - `npm run typecheck` - TypeScript validation
   - `npm run test` - Unit tests
   - `npm run lint` - Code linting

2. **Build validation:**
   - Build must succeed
   - Bundle size check

---

## Fly.io Configuration

Config file: `fly.toml`

```toml
app = "expensio-frontend"
primary_region = "iad"

[build]

[http_service]
  internal_port = 80
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
```

### Deploy Manually

```bash
# Login to Fly.io
fly auth login

# Deploy
fly deploy
```

---

## Docker Configuration

File: `Dockerfile`

The app is containerized with:

1. Node.js for building
2. Nginx for serving static files

### Build Docker Image Locally

```bash
docker build -t expensio-frontend .
docker run -p 8080:80 expensio-frontend
```

---

## Pre-Deployment Checklist

Before deploying:

- [ ] `npm run typecheck` passes
- [ ] `npm run test` passes
- [ ] `npm run build` succeeds
- [ ] No console errors in browser
- [ ] Tested on mobile viewport
- [ ] Tested dark mode
- [ ] Environment variables configured

---

## Rollback

If deployment fails or issues are found:

```bash
# List recent deployments
fly releases list

# Rollback to previous version
fly deploy --image <previous-image>
```

---

## Monitoring

### Browser Console

Check for:

- JavaScript errors
- Network request failures
- Console warnings

### Fly.io Logs

```bash
# View recent logs
fly logs

# Follow logs in real-time
fly logs -f
```

---

## Production Environment Notes

- **HTTPS:** Enforced via Fly.io
- **Static assets:** Served by Nginx with caching headers
- **API proxy:** Not configured - frontend calls API directly
- **PWA:** Service worker enabled for offline support
