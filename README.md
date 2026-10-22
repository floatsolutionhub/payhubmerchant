## Getting Started

1. Run `npm install`
2. Copy `.env.example` to `.env` and set your flags
3. Run `npm run dev`

## Environment Flags

- `VITE_USE_MOCK_TOKEN=true`: bypass magic-link verification API and auto-login with mock user
- `VITE_MOCK_EMPLOYEE_TYPE=fulltime|interns|consultant`: choose which dashboard route mock mode should open
