# Food Scan App - Production-Ready Coding Standards
*This document defines how all code must be written, structured, deployed, and maintained. It ensures the codebase remains production-ready, secure, performant, and maintainable as the app scales.*

---

## 🧭 CORE PRINCIPLES

### Before Writing Any Code
* Understand existing patterns and reuse existing utilities — **never duplicate logic**.
* Follow **DRY**, **KISS**, **SOLID**, and **single responsibility** principles.
* Keep functions small, readable, and testable.
* Prefer clarity and maintainability over cleverness.
* Think about scalability from day one — design for 10x user growth.
* **Mobile-first mindset:** Always think about offline, slow networks, and data efficiency.

### Code Quality & Style
* Use **TypeScript strict mode** (`"strict": true`).
* Run type checks (`tsc --noEmit`), linter, and formatters before every commit.
* Use **descriptive names** for variables, functions, and components.
* Comment **why**, not **what** — the code should be self-documenting.
* Follow existing architecture and file structure conventions.

### After Implementation
* Remove all debug code, `console.log()`, and commented-out experiments.
* Ensure no secrets, API keys, tokens, or sensitive data remain in code or logs.
* Verify all error paths are handled gracefully.

---

## 🏗️ ARCHITECTURE RULES

### 1. Layered Architecture (MANDATORY)

**React Native Frontend:**
```
screens/          → UI containers (pages)
components/       → Reusable UI components
hooks/            → Custom React hooks (business logic)
services/         → API calls, device APIs, data transformation
store/            → State management (Redux/Zustand)
types/            → TypeScript interfaces & types
utils/            → Helpers, formatters, validators
constants/        → App-wide constants
config/           → App configuration
```

**Backend (Node.js/Express):**
```
routes/           → HTTP endpoints (/api/products, /api/auth, etc)
controllers/      → Request/response handling
services/         → Business logic, validation, orchestration
repositories/     → Database queries (Drizzle ORM)
models/           → Database schema definitions
middleware/       → Auth, logging, error handling, rate limiting
validators/       → Input validation (Zod)
types/            → TypeScript interfaces & types
constants/        → App-wide constants
utils/            → Helpers, formatters, dates
config/           → Environment & app configuration
scripts/          → Database migrations, seeds, utilities
```

**Request/Response Data Flow:**

```
Mobile App Request:
  Screen Component
    ↓
  Custom Hook (e.g., useScanProduct)
    ↓
  Service (e.g., productService.fetchByBarcode)
    ↓
  API Client (HTTP POST/GET)
    ↓
  [Internet → Network Request]
    ↓
  Backend Route Handler
    ↓
  Controller (extract request body, validate)
    ↓
  Service (business logic)
    ↓
  Repository (Drizzle query)
    ↓
  PostgreSQL Database
    ↓
  [Response travels back up]
    ↓
  Mobile App Updates State (Zustand)
    ↓
  UI Re-renders with new data

Offline Flow:
  If no internet, queue the request in:
    → AsyncStorage / SQLite (sync queue)
    ↓
  When internet returns:
    → Automatically retry queued requests
    ↓
  Backend processes sync queue
```

**Critical Rule:** Never skip layers or put business logic in the wrong place.

### React Native Frontend Directory Structure
```
food-scan-app/
├── app/                           # App entry point & root setup
│   └── App.tsx
├── screens/                       # Full-screen UI containers
│   ├── scan-screen.tsx
│   ├── product-detail-screen.tsx
│   ├── preferences-screen.tsx
│   └── history-screen.tsx
├── components/                    # Reusable UI components
│   ├── product-card.tsx
│   ├── ingredient-list.tsx
│   ├── health-score-badge.tsx
│   └── warning-alert.tsx
├── hooks/                         # Custom React hooks
│   ├── use-scan-product.ts
│   ├── use-user-preferences.ts
│   ├── use-sync-queue.ts
│   └── use-local-storage.ts
├── services/                      # Business logic & API calls
│   ├── api-client.ts              # Centralized HTTP client
│   ├── product-service.ts
│   ├── barcode-service.ts
│   ├── camera-service.ts
│   ├── storage-service.ts
│   └── sync-service.ts
├── store/                         # Zustand global state
│   ├── product-store.ts
│   ├── user-store.ts
│   └── sync-store.ts
├── types/                         # TypeScript interfaces
│   ├── product-types.ts
│   ├── ingredient-types.ts
│   ├── user-types.ts
│   └── api-types.ts
├── utils/                         # Helpers & utilities
│   ├── validators.ts
│   ├── formatters.ts
│   ├── date-utils.ts
│   └── error-handler.ts
├── constants/                     # App-wide constants
│   ├── app-config.ts
│   ├── api-config.ts
│   ├── error-messages.ts
│   └── health-score-config.ts
├── config/                        # Environment & app setup
│   └── environment.ts
└── navigation/                    # React Navigation setup
    └── root-navigator.tsx
```

### Backend Directory Structure
```
backend/
├── src/
│   ├── routes/                    # HTTP route handlers
│   │   ├── products-routes.ts
│   │   ├── auth-routes.ts
│   │   ├── ingredients-routes.ts
│   │   └── preferences-routes.ts
│   ├── controllers/               # Request handling
│   │   ├── product-controller.ts
│   │   ├── auth-controller.ts
│   │   └── ingredient-controller.ts
│   ├── services/                  # Business logic
│   │   ├── product-service.ts
│   │   ├── ingredient-service.ts
│   │   ├── user-service.ts
│   │   └── analysis-service.ts
│   ├── repositories/              # Database queries
│   │   ├── product-repository.ts
│   │   ├── ingredient-repository.ts
│   │   ├── user-repository.ts
│   │   └── sync-queue-repository.ts
│   ├── models/                    # Database schemas (Drizzle)
│   │   ├── products-schema.ts
│   │   ├── ingredients-schema.ts
│   │   ├── users-schema.ts
│   │   └── sync-queue-schema.ts
│   ├── middleware/                # Express middleware
│   │   ├── auth-middleware.ts
│   │   ├── error-middleware.ts
│   │   ├── logger-middleware.ts
│   │   └── rate-limit-middleware.ts
│   ├── validators/                # Input validation (Zod)
│   │   ├── product-validator.ts
│   │   ├── user-validator.ts
│   │   └── preference-validator.ts
│   ├── types/                     # TypeScript interfaces
│   │   ├── product-types.ts
│   │   ├── api-types.ts
│   │   └── database-types.ts
│   ├── utils/                     # Helpers
│   │   ├── error-handler.ts
│   │   ├── logger.ts
│   │   ├── formatters.ts
│   │   └── validators-utils.ts
│   ├── constants/                 # App constants
│   │   ├── app-config.ts
│   │   ├── database-config.ts
│   │   └── error-messages.ts
│   ├── config/                    # Environment setup
│   │   └── environment.ts
│   ├── scripts/                   # Database utilities
│   │   ├── seed-ingredients.ts
│   │   ├── seed-diseases.ts
│   │   └── migrate-db.ts
│   └── server.ts                  # Express app & server entry
├── migrations/                    # Drizzle migrations
│   └── *.sql
├── .env.example
├── tsconfig.json
└── package.json
```

### 2. Function & Component Size
* Functions: **≤ 50 lines** (aim for 20–30).
* React components: **≤ 300 lines**. Extract hooks or sub-components as needed.
* React hooks: **≤ 40 lines**. Complex logic goes to services.
* Custom hooks that manage state should be single-responsibility.

**Example - Too Long, Split It:**
```typescript
// ❌ BAD - 120 lines of mixed concerns
function ScanResultScreen() {
  const [product, setProduct] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [warnings, setWarnings] = useState([]);
  // ... 100 more lines mixing API calls, formatting, state management
}

// ✅ GOOD - Separated concerns
function ScanResultScreen() {
  const { product, ingredients, warnings, loading } = useProductAnalysis();
  return <ProductResultView product={product} warnings={warnings} />;
}
```

### 3. No Magic Values
* Define all constants in `/constants/` directory.
* Use `UPPER_SNAKE_CASE` naming.
* No hardcoded strings, numbers, URLs, or thresholds in logic.
* Constants include: API endpoints, timeouts, limits, regexes, error messages.

**Example:**
```typescript
// constants/app-config.ts
export const HEALTH_SCORE_CONFIG = {
  CRITICAL: { min: 1, max: 3, label: 'High Risk' },
  WARNING: { min: 4, max: 6, label: 'Medium Risk' },
  SAFE: { min: 7, max: 10, label: 'Safe' },
} as const;

export const API_CONFIG = {
  OPENFOODFACTS_BASE_URL: 'https://world.openfoodfacts.org/api/v0',
  USDA_BASE_URL: 'https://api.nal.usda.gov/fdc/v1',
  REQUEST_TIMEOUT: 15000,
  RETRY_ATTEMPTS: 3,
  CACHE_TTL: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const;

export const DB_CONFIG = {
  MAX_PRODUCTS_PER_QUERY: 100,
  DEFAULT_PAGE_SIZE: 25,
  SYNC_INTERVAL: 60000, // 60 seconds
} as const;
```

### 4. File & Naming Conventions
* All filenames: **kebab-case**
* All exports use **PascalCase** (types, components, classes)
* All constants use **UPPER_SNAKE_CASE**

**Naming Examples:**
```
Components:        scan-screen.tsx, product-card.tsx
Hooks:             use-product-analysis.ts, use-local-storage.ts
Services:          product-service.ts, barcode-service.ts
Types:             product-types.ts, ingredient-types.ts
Utilities:         date-formatter.ts, validators.ts
Constants:         app-config.ts, error-messages.ts
Middleware:        auth-middleware.ts
Repositories:      product-repository.ts
```

### 5. Error Handling
* Create centralized error handling utilities.
* Use typed error responses and custom error classes.
* Wrap all async/await logic in try-catch with meaningful context.
* Never expose internal error details to users.
* Log errors with requestId/sessionId for tracing.

**Backend Example:**
```typescript
// utils/error-handler.ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
  }
}

// middleware/error-middleware.ts
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const sessionId = req.id;
  
  if (err instanceof AppError) {
    logger.warn({ sessionId, error: err.code, statusCode: err.statusCode });
    return res.status(err.statusCode).json({
      error: err.code,
      message: err.message,
      sessionId,
    });
  }
  
  // Unknown error - don't expose details
  logger.error({ sessionId, error: err.message, stack: err.stack });
  res.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred',
    sessionId,
  });
});
```

**Frontend Example:**
```typescript
// services/product-service.ts
export async function fetchProductByBarcode(barcode: string) {
  try {
    const response = await apiClient.get(`/products/barcode/${barcode}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new AppError('PRODUCT_NOT_FOUND', 'Product not found in database');
    }
    if (error.message === 'Network Error') {
      throw new AppError('OFFLINE', 'No internet connection');
    }
    throw new AppError('FETCH_FAILED', 'Failed to fetch product');
  }
}
```

---

## ⚙️ PRODUCTION-READY CODE REQUIREMENTS

### Frontend (React Native + Expo)

#### State Management
* Use **Zustand** or **Redux Toolkit** for global state.
* Separate concerns: UI state vs. data state.
* Never store sensitive data (tokens, passwords) in Redux — use Secure Storage.
* Minimize re-renders with proper selector memoization.

```typescript
// store/product-store.ts
interface ProductStore {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  setSelectedProduct: (product: Product) => void;
  addProduct: (product: Product) => void;
  clearCache: () => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  selectedProduct: null,
  loading: false,
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  addProduct: (product) => set((state) => ({
    products: [product, ...state.products],
  })),
  clearCache: () => set({ products: [], selectedProduct: null }),
}));
```

#### API Client
* Create a centralized, typed API client with interceptors.
* Handle token refresh, offline mode, and retries automatically.
* Never make direct API calls from components.

```typescript
// services/api-client.ts
const apiClient = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  timeout: CONFIG.REQUEST_TIMEOUT,
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Refresh token logic
      const newToken = await refreshAuthToken();
      return apiClient.request(error.config);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

#### Local Storage
* Use **expo-secure-store** for sensitive data (tokens, user preferences with auth).
* Use **AsyncStorage** for non-sensitive cached data.
* Always wrap in try-catch for storage errors.
* Implement data versioning for migrations.

```typescript
// services/storage-service.ts
export async function saveUserPreferences(prefs: UserPreferences) {
  try {
    await AsyncStorage.setItem(
      'USER_PREFERENCES_V1',
      JSON.stringify(prefs)
    );
  } catch (error) {
    logger.error('Failed to save preferences', error);
  }
}

export async function saveAuthToken(token: string) {
  try {
    await SecureStore.setItemAsync('AUTH_TOKEN', token);
  } catch (error) {
    logger.error('Failed to save token', error);
  }
}
```

#### Offline-First Architecture
* All data reads come from local cache first.
* Queue writes when offline, sync when online.
* Show sync status to user (not intrusive).
* Implement optimistic updates where appropriate.

```typescript
// hooks/use-sync-queue.ts
export function useSyncQueue() {
  const [isSyncing, setIsSyncing] = useState(false);
  
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && !isSyncing) {
        syncPendingChanges();
      }
    });
    
    return unsubscribe;
  }, [isSyncing]);
}
```

#### Performance & Optimization
* Use `React.memo()` for expensive components.
* Use `useCallback()` to prevent unnecessary re-renders.
* Lazy load large screens with `React.lazy()` and `Suspense`.
* Implement pagination for long lists (never load all data at once).
* Cache API responses aggressively (with TTL).

```typescript
// components/ingredient-list.tsx
interface IngredientListProps {
  ingredients: Ingredient[];
  onPress: (ingredient: Ingredient) => void;
}

const IngredientListItem = React.memo(({ item, onPress }: IngredientItemProps) => (
  <TouchableOpacity onPress={() => onPress(item)}>
    <Text>{item.name}</Text>
  </TouchableOpacity>
));

export const IngredientList = React.memo(function IngredientList({
  ingredients,
  onPress,
}: IngredientListProps) {
  const handlePress = useCallback((item) => onPress(item), [onPress]);
  
  return (
    <FlatList
      data={ingredients}
      renderItem={({ item }) => <IngredientListItem item={item} onPress={handlePress} />}
      keyExtractor={(item) => item.id}
      initialNumToRender={15}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
    />
  );
});
```

#### Camera & Sensor Access
* Always check permissions before accessing camera/location.
* Gracefully handle denied permissions.
* Provide clear user feedback about why permissions are needed.

```typescript
// services/barcode-scanner-service.ts
export async function requestCameraPermission() {
  const { status } = await Camera.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    throw new AppError('PERMISSION_DENIED', 'Camera permission required');
  }
}
```

### Backend (Express + Node.js)

#### Database (PostgreSQL via Supabase)
* Always **index** foreign keys, WHERE clauses, and ORDER BY columns.
* Always **paginate** list endpoints (default: 25, max: 100).
* Use **JOINs** to avoid N+1 queries.
* **Never** use `SELECT *` — request only needed columns.
* Use **soft deletes** (`deletedAt`) where logically appropriate.
* Implement **query timeouts** to prevent runaway queries.
* Store images/files in external storage (S3/Supabase Storage) — never in DB.

```typescript
// repositories/product-repository.ts
export async function getProductsByUserId(
  userId: string,
  page: number = 1,
  limit: number = 25
) {
  const offset = (page - 1) * limit;
  
  const products = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      barcode: productsTable.barcode,
      createdAt: productsTable.createdAt,
    })
    .from(productsTable)
    .where(
      and(
        eq(productsTable.userId, userId),
        isNull(productsTable.deletedAt)
      )
    )
    .orderBy(desc(productsTable.createdAt))
    .limit(limit)
    .offset(offset);
  
  return products;
}
```

#### Queries & Transactions
* Use transactions for multi-step operations (e.g., create user + set preferences).
* Keep transactions **short** — never include API calls inside them.
* Always paginate queries.
* Use **connection pooling** (already configured in Drizzle).

```typescript
// services/user-service.ts
export async function createUserWithPreferences(
  email: string,
  preferences: UserPreferences
) {
  return await db.transaction(async (trx) => {
    const [user] = await trx
      .insert(usersTable)
      .values({ email, createdAt: new Date() })
      .returning();
    
    await trx.insert(userPreferencesTable).values({
      userId: user.id,
      ...preferences,
    });
    
    return user;
  });
}
```

#### Validation & Sanitization
* Validate **all inputs** with **Zod** on the server (client validation is UX, not security).
* Sanitize strings to prevent XSS and SQL injection.
* Use Drizzle's **parameterized queries** (automatic with ORM).
* Reject oversized payloads.

```typescript
// validators/product-validator.ts
import { z } from 'zod';

export const CreateProductSchema = z.object({
  barcode: z.string().length(12, '13').regex(/^\d+$/),
  name: z.string().min(1).max(255),
  ingredients: z.array(z.string().max(255)).min(1),
});

export type CreateProductRequest = z.infer<typeof CreateProductSchema>;
```

```typescript
// controllers/product-controller.ts
export async function createProduct(req: Request, res: Response) {
  try {
    const parsed = CreateProductSchema.parse(req.body);
    const product = await productService.create(parsed);
    res.status(201).json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    }
  }
}
```

#### API Rate Limiting
* Implement rate limiting on sensitive endpoints (auth, submissions, APIs).
* Use express-rate-limit or similar middleware.

```typescript
// middleware/rate-limit.ts
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  keyGenerator: (req) => req.user?.id || req.ip,
});

export const sensitiveEndpointLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute
});

app.post('/auth/login', sensitiveEndpointLimiter, loginController);
```

#### Authentication & Sessions
* Use secure cookies with `Secure`, `HttpOnly`, and `SameSite=Strict`.
* Store JWT in HttpOnly cookies (not localStorage).
* Implement token refresh tokens separately.
* Never log passwords, tokens, or sensitive data.
* Implement session expiration.

```typescript
// middleware/auth-middleware.ts
export function setAuthCookie(res: Response, token: string) {
  res.cookie('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}
```

### Knowledge Base & Data Management

#### Ingredient & Disease Mapping
* Store in normalized, indexed tables.
* Support bulk inserts for seeding initial data.
* Version control for regulatory updates.

```typescript
// models/ingredients-schema.ts
export const ingredientsTable = pgTable('ingredients', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  aliases: text('aliases').array(),
  harmfulnessLevel: text('harmfulness_level', {
    enum: ['HIGH', 'MEDIUM', 'LOW'],
  }).notNull(),
  regulatoryNotes: jsonb('regulatory_notes'), // { country: { approved, reason } }
  healthImpactSummary: text('health_impact_summary'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const diseaseIngredientLinksTable = pgTable(
  'disease_ingredient_links',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    ingredientId: uuid('ingredient_id').references(() => ingredientsTable.id),
    diseaseName: text('disease_name').notNull(),
    confidenceLevel: text('confidence_level', {
      enum: ['HIGH', 'MEDIUM', 'LOW'],
    }).notNull(),
    severityLevel: text('severity_level', {
      enum: ['LOW', 'MEDIUM', 'HIGH'],
    }).notNull(),
    summary: text('summary'),
  }
);

// Index critical queries
export const ingredientNameIdx = index('idx_ingredient_name').on(ingredientsTable.name);
export const diseaseIngredientIdx = index('idx_disease_ingredient')
  .on(diseaseIngredientLinksTable.ingredientId, diseaseIngredientLinksTable.diseaseName);
```

---

## 🔒 SECURITY & SAFETY

### Input Validation
* **Frontend:** Validate for UX (catch errors early).
* **Backend:** Validate for security (assume frontend was bypassed).
* Use **Zod** for runtime validation.
* Validate type, length, format, and allowed values.

### Secrets & Environment
* Never commit `.env`, `.env.local`, or any secrets to Git.
* Use `.env.example` with placeholder values.
* Store secrets in Supabase for DB credentials.
* Use environment-specific configs.
* Rotate secrets regularly (especially API keys).

```
.env.example:
DATABASE_URL=postgresql://user:password@host/db
API_KEY=your_api_key_here

.gitignore:
.env
.env.local
*.secret
```

### Authentication & Authorization
* Validate JWT tokens on every protected endpoint.
* Implement role-based access control (RBAC) if needed.
* Use UUIDs for public links/tokens (not incrementing IDs).
* Implement logout by invalidating tokens server-side.

```typescript
// middleware/auth-middleware.ts
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.authToken;
  
  if (!token) {
    return res.status(401).json({ error: 'UNAUTHORIZED' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'INVALID_TOKEN' });
  }
}
```

### HTTPS & Data Protection
* Always serve via HTTPS (Fly.io enforces this by default).
* Use **TLS 1.3** for connections.
* Encrypt sensitive data at rest (passwords, payment info) if applicable.
* Never log or transmit unencrypted sensitive data.

### Data Privacy
* Implement GDPR-compliant data deletion.
* Allow users to export their data.
* Don't collect data you don't need.
* Implement data retention policies.

---

## 📈 PERFORMANCE & SCALABILITY

### Target Metrics
* **API Response Time:** p95 < 200ms
* **App Load Time:** < 2 seconds
* **Bundle Size:** < 500KB (gzipped)
* **Cache Hit Rate:** > 80%

### Caching Strategy
* Cache frequently accessed data (ingredients, diseases) in-memory or Redis.
* Use appropriate TTLs based on update frequency.
* Implement cache invalidation on data updates.
* Use browser storage (AsyncStorage) for user-specific cached data.

```typescript
// services/cache-service.ts
const CACHE_TTL = {
  INGREDIENTS: 24 * 60 * 60 * 1000, // 24 hours
  USER_PREFERENCES: 1 * 60 * 60 * 1000, // 1 hour
  PRODUCTS: 7 * 24 * 60 * 60 * 1000, // 7 days
};

class CacheService {
  private cache = new Map<string, { data: unknown; expiresAt: number }>();
  
  set(key: string, data: unknown, ttl: number) {
    this.cache.set(key, { data, expiresAt: Date.now() + ttl });
  }
  
  get(key: string) {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return item.data;
  }
}
```

### Database Performance
* Use **EXPLAIN ANALYZE** to identify slow queries.
* Add indexes on frequently queried columns.
* Batch database operations where possible.
* Archive old data (users rarely need full history).

```typescript
// Migrate query results in batches
export async function syncProductsInBatches(
  userId: string,
  products: Product[],
  batchSize: number = 100
) {
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    await db.insert(userProductsTable).values(batch);
  }
}
```

### Frontend Performance
* **Code Splitting:** Lazy load screens and heavy dependencies.
* **Memoization:** Use `React.memo()`, `useMemo()`, `useCallback()`.
* **Pagination:** Never render all items at once.
* **Image Optimization:** Compress and resize images on the backend.
* **Bundle Analysis:** Use tools like `expo-cli` to monitor bundle size.

```typescript
// Lazy load screens
const ScanScreen = React.lazy(() => import('./screens/scan-screen'));
const HistoryScreen = React.lazy(() => import('./screens/history-screen'));

// In navigation
<Suspense fallback={<LoadingScreen />}>
  <ScanScreen />
</Suspense>
```

---

## 🧪 TESTING STRATEGY

### Test Coverage Requirements
* **Services & Utils:** 100% coverage (critical business logic).
* **Controllers/Handlers:** 80%+ coverage (HTTP layer).
* **Components:** 70%+ coverage (UI logic, not style).
* **Overall:** Target 75%+ coverage minimum.

### Testing Levels

**Unit Tests** (Jest)
```typescript
// services/__tests__/product-service.test.ts
describe('ProductService', () => {
  it('should calculate health score correctly', () => {
    const score = calculateHealthScore({
      ingredients: ['sugar', 'salt'],
      allergens: [],
    });
    expect(score).toBeLessThanOrEqual(10);
    expect(score).toBeGreaterThanOrEqual(1);
  });
});
```

**Integration Tests** (Supertest + Jest)
```typescript
// routes/__tests__/products.test.ts
describe('POST /api/products', () => {
  it('should create a product and return 201', async () => {
    const response = await request(app).post('/api/products').send({
      barcode: '012345678901',
      name: 'Test Product',
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });
});
```

**E2E Tests** (Detox for React Native)
```typescript
// e2e/scan-flow.e2e.ts
describe('Barcode Scan Flow', () => {
  it('should scan barcode and display results', async () => {
    await element(by.id('scan-button')).multiTap();
    await element(by.text('Scan Barcode')).tap();
    // Simulate barcode scan
    // Verify results display
  });
});
```

### Test Utilities
* Create mock factories for consistent test data.
* Use test databases (separate from production).
* Implement test helpers for common assertions.

```typescript
// tests/factories/product-factory.ts
export function createMockProduct(overrides?: Partial<Product>): Product {
  return {
    id: uuid(),
    barcode: '012345678901',
    name: 'Test Product',
    ingredients: [],
    ...overrides,
  };
}
```

---

## 🔎 OBSERVABILITY & LOGGING

### Structured Logging
* Use JSON structured logs with consistent fields.
* Include **requestId** (trace identifier) in all logs.
* Never log sensitive data (tokens, passwords, personal info).

```typescript
// utils/logger.ts
interface LogContext {
  requestId?: string;
  userId?: string;
  sessionId?: string;
  action?: string;
  duration?: number;
  error?: string;
}

export function logInfo(message: string, context: LogContext) {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level: 'INFO',
    message,
    ...context,
  }));
}

export function logError(message: string, error: Error, context: LogContext) {
  console.error(JSON.stringify({
    timestamp: new Date().toISOString(),
    level: 'ERROR',
    message,
    errorName: error.name,
    errorMessage: error.message,
    stack: error.stack,
    ...context,
  }));
}
```

### Backend Observability
* Add request/response logging middleware.
* Track request duration and response status.
* Monitor database query performance.
* Use Fly.io logs + Sentry for error tracking (optional).

```typescript
// middleware/request-logger.ts
app.use((req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const requestId = uuid();
  
  req.id = requestId;
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logInfo('HTTP Request', {
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
    });
  });
  
  next();
});
```

### Frontend Observability
* Log critical user actions (scan, save, preference change).
* Track errors and crashes.
* Monitor app performance metrics.
* Don't log overly verbose app lifecycle events.

```typescript
// services/analytics-service.ts
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  // Send to analytics backend or service
  logInfo(`Event: ${eventName}`, { properties });
}

// Usage
trackEvent('PRODUCT_SCANNED', { barcode: '012345678901' });
trackEvent('HEALTH_ALERT_SHOWN', { healthScore: 3 });
```

---

## 🚀 DEPLOYMENT & CI/CD

### Git Workflow
* All code changes require PRs — no direct pushes to `main`.
* Enforce PR reviews by team members.
* Automated checks must pass before merge:
  * `npm run type-check` (TypeScript)
  * `npm run lint` (ESLint)
  * `npm run test` (Jest)
  * `npm run build` (Production build succeeds)
* Use **conventional commits** for clear commit history.

```
Commit format:
feat: add barcode scanning
fix: resolve sync queue race condition
docs: update README
test: add product service tests
chore: upgrade dependencies
```

### Deployment Checklist
* [ ] All tests pass locally and in CI
* [ ] TypeScript compiles without errors
* [ ] Database migrations tested on staging
* [ ] Environment secrets configured in Fly.io (`fly secrets set`)
* [ ] Build succeeds: `npm run build`
* [ ] Health check endpoint responds (backend: `GET /healthz`)
* [ ] Rollback plan documented

### Staging vs Production
* Deploy to staging first.
* Run smoke tests on staging.
* Monitor staging for 24 hours before production deploy.
* Keep staging data separate from production.
* Implement feature flags for gradual rollouts.

### Continuous Deployment (CD)
```yaml
# Example GitHub Actions workflow
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm run type-check
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: flyctl deploy -a app-staging
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - run: flyctl deploy -a app-production
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

---

## 🗄️ DATABASE MIGRATIONS

### Migration Strategy
* Use **Drizzle migrations** for all schema changes.
* Version control all migrations.
* Never manually edit database — always use migrations.
* Test migrations on staging before production.

### Safe Migration Patterns
* **Adding columns:** Add as nullable → backfill → mark as NOT NULL.
* **Renaming columns:** Create new, migrate data, drop old (with grace period).
* **Deleting columns:** Use soft deletes first, archive data, then remove.
* **Adding indexes:** Use `CONCURRENTLY` (PostgreSQL) to avoid locks.

```typescript
// migrations/001_create_products_table.ts
export async function up(db: Database) {
  await db.schema
    .createTable('products')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultRandom())
    .addColumn('barcode', 'text', (col) => col.notNull().unique())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) => col.defaultNow())
    .execute();

  // Create indexes
  await db.schema
    .createIndex('idx_barcode')
    .on('products')
    .column('barcode')
    .execute();
}

export async function down(db: Database) {
  await db.schema.dropTable('products').execute();
}
```

---

## ✅ PRE-COMMIT CHECKLIST

**Architecture & Code Quality**
* [ ] Business logic in services/repositories, not controllers/components
* [ ] Functions < 50 lines (aim for 20–30)
* [ ] React components < 300 lines
* [ ] No code duplication (DRY principle applied)
* [ ] No magic values (all constants extracted)
* [ ] Meaningful variable/function names

**TypeScript & Types**
* [ ] `npm run type-check` passes
* [ ] All function parameters typed
* [ ] All function return types explicit (no implicit `any`)
* [ ] All API responses typed
* [ ] No `as any` or `@ts-ignore` comments

**Linting & Formatting**
* [ ] `npm run lint` passes
* [ ] `npm run format` applied (Prettier)
* [ ] No `console.log()` or debug code
* [ ] No commented-out code

**Errors & Logging**
* [ ] All async operations wrapped in try-catch
* [ ] Errors logged with context (requestId, userId)
* [ ] User-facing errors are meaningful (not technical)
* [ ] No sensitive data logged (tokens, passwords, emails)

**Testing**
* [ ] New logic has unit tests
* [ ] Unit tests pass: `npm test`
* [ ] Integration tests updated
* [ ] E2E tests pass for critical flows

**Security**
* [ ] No hardcoded API keys or secrets
* [ ] Input validated on backend
* [ ] SQL queries use parameterized queries (Drizzle)
* [ ] No exposed error stack traces to client

**Performance**
* [ ] Database queries use indexes
* [ ] No N+1 queries
* [ ] Pagination implemented for large datasets
* [ ] Expensive components memoized

**Database**
* [ ] Migrations created for schema changes
* [ ] Indexes added for new WHERE/JOIN columns
* [ ] No `SELECT *` (only needed columns)
* [ ] Pagination tested

**Documentation**
* [ ] Complex logic has comments explaining **why**
* [ ] README updated if behavior changed
* [ ] API changes documented
* [ ] New constants documented in constants file

---

## 🛠️ KEY DEV & BUILD COMMANDS

**Frontend:**
```bash
npm run start              # Start Expo dev server
npm run android           # Run on Android emulator
npm run ios              # Run on iOS simulator
npm run build            # Build for production (EAS)
npm run type-check       # TypeScript check
npm run lint             # ESLint check
npm run format           # Prettier format
npm test                 # Run Jest tests
npm run test:watch      # Watch mode for tests
```

**Backend:**
```bash
npm run dev              # Start dev server with hot reload
npm run build            # Build for production
npm start                # Run production build
npm run db:push          # Sync schema to Supabase
npm run db:generate      # Generate Drizzle migrations
npm run db:migrate       # Run pending migrations
npm run type-check       # TypeScript check
npm run lint             # ESLint check
npm test                 # Run tests
```

---

## 📦 ENVIRONMENT VARIABLES

**Frontend (.env.local):**
```
EXPO_PUBLIC_API_BASE_URL=http://localhost:5000
EXPO_PUBLIC_ENVIRONMENT=development
EXPO_PUBLIC_LOG_LEVEL=debug
```

**Backend (.env):**
```
# Database
DATABASE_URL=postgresql://user:password@host:5432/db

# Authentication
JWT_SECRET=your-secret-key
SESSION_SECRET=your-session-secret

# APIs
OPENFOODFACTS_API_KEY=...
USDA_API_KEY=...
GOOGLE_VISION_API_KEY=...

# App Config
NODE_ENV=development
PORT=5000
LOG_LEVEL=info
```

**Production Secrets (Fly.io):**
```bash
fly secrets set DATABASE_URL=postgresql://...
fly secrets set JWT_SECRET=...
fly secrets set GOOGLE_VISION_API_KEY=...
```

---

## 🎯 ENFORCEMENT

**Every PR must:**
1. Pass all automated checks (type-check, lint, test, build)
2. Include meaningful description and linked issues
3. Have at least 1 approval from team member
4. Include tests for new logic
5. Update documentation if needed

**Every deployment must:**
1. Be fully tested and approved
2. Have a rollback plan
3. Include changelog entry
4. Monitor health for 1 hour post-deploy

---

## 🏗️ INFRASTRUCTURE ARCHITECTURE

### Frontend (Mobile Only)
* **Framework:** React Native + Expo
* **Deployment:** Expo EAS (build & submit to App Store/Google Play)
* **State Management:** Zustand or Redux Toolkit
* **Storage:** AsyncStorage + Secure Storage
* **API Calls:** REST via centralized HTTP client

### Backend (API Server)
* **Framework:** Node.js + Express + TypeScript
* **Deployment:** DigitalOcean Droplet or App Platform
* **Server Port:** 5000 (configurable via environment)
* **Health Check:** GET `/healthz` → returns 200 OK

### Database (PostgreSQL)
* **Hosting:** DigitalOcean Managed PostgreSQL
* **Plan:** Starter (1GB RAM, 25GB storage) → $15/month
* **Backups:** Automatic daily backups included
* **Scaling:** Easy upgrade path to Standard (2GB) → $30/month

### File Storage
* **Service:** DigitalOcean Spaces (S3-compatible)
* **Use Case:** Product images, barcode scans, user uploads
* **Cost:** $5/month (250GB included)

### Monitoring & Logs
* **Logs:** DigitalOcean built-in logs for Droplet/App Platform
* **Database Monitoring:** DigitalOcean managed DB metrics dashboard
* **Error Tracking:** Optional: Sentry (free tier available)

---

## 💰 MONTHLY COST BREAKDOWN (MVP Phase)

| Component | Service | Cost | Notes |
|-----------|---------|------|-------|
| **Database** | DigitalOcean Managed PostgreSQL (1GB) | $15 | Includes backups |
| **API Backend** | DigitalOcean Droplet (Basic) | $5 | Or $12 for Premium |
| **File Storage** | DigitalOcean Spaces | $5 | 250GB included |
| **Monitoring** | Built-in (DO) | Included | — |
| **Frontend Build** | Expo EAS | $49/month | Optional (free with eas-cli local build) |
| | | | |
| **TOTAL** | | **$25-29/month** | Production-ready |

**Scaling Path:**
- DB upgrade to Standard (2GB): +$15/month
- Droplet upgrade to General Purpose: +$10/month
- New total at scale: ~$50/month

---

## 📌 PROJECT SNAPSHOT

**Tech Stack:**
* **Frontend:** React Native + Expo + TypeScript + Zustand
* **Backend:** Node.js + Express + TypeScript + Drizzle ORM
* **Database:** PostgreSQL (DigitalOcean Managed)
* **Hosting:** DigitalOcean (Droplet/App Platform)
* **File Storage:** DigitalOcean Spaces
* **Package Manager:** npm

**Deployment Pipeline:**
* Mobile app → Expo EAS Build → App Store + Google Play
* Backend → Git push → DigitalOcean deploy (via GitHub Actions or manual)
* Database → Migrations via Drizzle → DigitalOcean dashboard

**Key Features:**
* Barcode & image-based product scanning
* Ingredient harm classification & warnings
* User dietary preferences & tracking
* Offline-first with cloud sync
* User account management
* Product & shopping list management

**Target Metrics:**
* API p95 < 200ms
* App startup < 2 seconds
* Bundle size < 500KB (gzipped)
* Test coverage > 75%
* Cache hit rate > 80%
* Monthly hosting cost: $25-50