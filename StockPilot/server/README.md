# StockPilot – Server

Node.js + Express REST API with MongoDB Atlas.

## Setup

```bash
npm install
cp .env.example .env
```

Fill in `.env`:

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long random string for JWT signing |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `7d`) |
| `PORT` | Port to listen on (default: `5000`) |
| `CLIENT_URL` | Frontend URL for CORS (e.g. `http://localhost:5173`) |

## Run

```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

## API Endpoints

### Auth (public)
| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |

### Products (🔒 JWT required)
| Method | Path | Description |
|---|---|---|
| GET | `/api/products` | List products (search/filter/page) |
| POST | `/api/products` | Create product |
| GET | `/api/products/low-stock` | Products below reorder threshold |
| GET | `/api/products/:id` | Get one product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

### Suppliers (🔒 JWT required)
Full CRUD at `/api/suppliers` and `/api/suppliers/:id`

### Sales (🔒 JWT required)
| Method | Path | Description |
|---|---|---|
| GET | `/api/sales` | List all sales |
| POST | `/api/sales` | Record sale (auto-decrements stock) |
| GET | `/api/sales/summary` | Daily/weekly/monthly totals + chart data |

### Purchases (🔒 JWT required)
| Method | Path | Description |
|---|---|---|
| GET | `/api/purchases` | List all purchases |
| POST | `/api/purchases` | Record purchase (auto-increments stock) |

### Dashboard (🔒 JWT required)
| Method | Path | Description |
|---|---|---|
| GET | `/api/dashboard/stats` | Aggregate stats for dashboard overview |

## Deployment (Vercel)

1. Push `/server` to a GitHub repo
2. Import to Vercel, set root directory to `/server`
3. Add environment variables in Vercel dashboard
4. Deploy — `vercel.json` handles routing
