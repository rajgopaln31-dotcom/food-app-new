# FoodieGo - Food Delivery Website

An eight-screen food delivery website built with **React 18 + TypeScript + Material UI (MUI) + Redux Toolkit + React Router**.
It works as a real app (not only static screens): login, browse, cart, address, payment, order tracking.
There is no backend, so **mock services** (with fake network delay) are used.

## 1. Installation and start

You need **Node.js 18 or newer** ([nodejs.org](https://nodejs.org)).

```bash
npm install        # downloads all libraries (needs internet)
npm run dev        # starts the website, open the link shown (usually http://localhost:5173)
npm run build      # (optional) checks TypeScript and creates a production build
```

**Demo login:** `demo@food.com` / `Demo@123` (or create your own account in the Register tab).

## 2. Customer journey (all screens work together)

Login -> Home -> Restaurant Listing -> Restaurant Details -> Food Details / Cart -> Address / Checkout -> Payment -> Order Confirmation / Tracking

| # | Screen | File | Route |
|---|--------|------|-------|
| 1 | Login / Registration | `src/pages/LoginPage.tsx` | `/login` |
| 2 | Home | `src/pages/HomePage.tsx` | `/` |
| 3 | Restaurant Listing / Search | `src/pages/RestaurantListPage.tsx` | `/restaurants` |
| 4 | Restaurant Details / Menu | `src/pages/RestaurantDetailsPage.tsx` | `/restaurants/:restaurantId` |
| 5 | Food Details + Cart | `src/components/FoodDetailsDialog.tsx` + `src/pages/CartPage.tsx` | popup + `/cart` |
| 6 | Delivery Address / Checkout | `src/pages/CheckoutPage.tsx` | `/checkout` |
| 7 | Payment | `src/pages/PaymentPage.tsx` | `/payment` |
| 8 | Order Confirmation / Tracking | `src/pages/OrderConfirmationPage.tsx` | `/order-confirmation/:orderId` |
| + | My Orders (history) | `src/pages/MyOrdersPage.tsx` | `/orders` |

All pages except `/login` are protected (`src/components/ProtectedRoute.tsx`).

## 3. Folder structure

```
src/
  components/   reusable UI parts (Header, Footer, RestaurantCard, FoodCard, dialogs, ...)
  pages/        one file per screen
  store/        Redux Toolkit: one slice per topic + store + typed hooks
  services/     "API" layer (mock). UI never talks to data directly
  data/         mock JSON-like data (restaurants, food, banners)
  hooks/        custom hook useCartActions
  utils/        validators, price calculation, helpers, storage
  types/        all TypeScript interfaces
  theme.ts      MUI colours and fonts
public/images/  SVG pictures (logo, banners, restaurants, 48 dishes)
```

## 4. Redux implementation

| Slice | Holds | Persisted in localStorage |
|-------|-------|---|
| `authSlice` | logged in user, login/register status, errors | yes |
| `restaurantSlice` | categories, restaurants, food items, loading status | no (loaded from the service) |
| `cartSlice` | cart items, restaurant, coupon | yes |
| `addressSlice` | saved addresses, selected address, delivery city | yes |
| `orderSlice` | order history, order placing status | yes |
| `favouriteSlice` | favourite restaurant ids | yes |

* Async work uses `createAsyncThunk` (login, register, load restaurants, place order).
* Selectors (e.g. `selectCartCount`, `selectPriceBreakdown`) read values; totals are calculated in one place: `src/utils/pricing.ts`.
* Typed hooks `useAppDispatch` / `useAppSelector` are in `src/store/hooks.ts` (no `any` anywhere).
* `src/store/index.ts` saves state to localStorage after every change.

## 5. Mock data and API explanation

* `src/data/mockData.ts` - 8 restaurants, 48 dishes, 8 categories, 3 banners.
* `src/services/*.ts` - functions return Promises after a delay, exactly like a real API. To use a real backend, replace the body of those functions with `fetch(`${API_BASE_URL}/...`)`. No page needs to change.
* `.env` has `VITE_API_BASE_URL`. No secrets or API keys are in the code.
* Login users are stored in localStorage (`authService.ts`). **Passwords in localStorage are only for this demo** - never do this in a real app.
* **Payment is simulated.** Test failure: card number ending in `0000` or UPI id starting with `fail`. You can press *Cancel payment* during processing.
* **Order tracking is simulated.** The status moves forward every 15 seconds after the order is placed.

## 6. Business rules (change them in `src/utils/pricing.ts`)

* Delivery charge: Rs 40, free above Rs 500.
* Tax: 5% GST on (subtotal - discount).
* Coupons: `WELCOME50` (50% up to Rs 100, min Rs 199), `SAVE50` (flat Rs 50, min Rs 399), `FREEDEL` (free delivery, min Rs 299).
* Maximum 10 of one item.
* Cart can hold food from ONE restaurant only; adding from another restaurant asks for confirmation.

## 7. Validation rules (`src/utils/validators.ts`)

Email format; mobile = 10 digits starting 6-9; password >= 6 chars with a letter and a number; confirm password must match;
PIN code = 6 digits; UPI id format; card number 16 digits; expiry MM/YY not in the past; CVV 3 digits.
Errors are shown under each field, and buttons are disabled while loading (no duplicate submissions).

## 8. Testing checklist

| Area | How to test | Expected |
|------|-------------|----------|
| Login | Submit empty form; wrong password; demo login | Field errors; error snackbar; goes to Home |
| Register | Mismatched passwords; existing email; valid data | Errors; "already exists"; success, back to Login |
| Show/hide password | Click the eye icon | Text appears/hides |
| Home | Banner, categories, restaurant cards, recommended food | All clickable and navigate correctly |
| Search | Type "pizza", "biryani", "xyz" | Matching restaurants/dishes; empty state for "xyz" |
| Filters/sort | Category chips, Pure veg, Rating 4.5+, Favourites, Sort | List updates correctly |
| Favourites | Click the heart | Snackbar; Favourites filter shows it |
| Restaurant | Category tabs; Add on simple item; open customisable item | Scrolls; stepper appears; dialog price changes |
| Other restaurant | Add item from a second restaurant | Confirmation dialog before replacing the cart |
| Cart | +, -, remove, apply WELCOME50 / wrong code | Totals recalculate; error text for bad code |
| Empty cart | Remove all items, open /checkout | Empty state; cannot continue |
| Address | Add, edit, delete, set default; invalid mobile/PIN | Validation errors; list updates |
| Payment | Each method; empty fields; failing card `... 0000`; Cancel | Errors; failure alert; cancelled message |
| Duplicate click | Double click Pay | Only one order is created |
| Order | After payment | Order ID, items, address, timeline moves every 15 s |
| My Orders | Open `/orders` | Order history with status |
| Refresh | Reload page on any screen | Login, cart, addresses, orders are still there |
| Responsive | Browser DevTools -> mobile / tablet / desktop | No sideways scrolling; hamburger menu on phones |

## 9. Completed functionality and pending issues

**Completed:** all 8 screens plus My Orders, protected routes, Redux slices, validation, loading skeletons, empty/error states,
snackbars, confirmation dialogs, persistent cart, coupons, address CRUD, simulated payment and tracking, responsive layout.

**Pending / limitations:**
* No real backend, real payment gateway or real e-mail (forgot password only checks that the account exists).
* Data is saved in this browser only (localStorage), so it is not shared between devices.
* Cart, addresses and favourites are shared by all accounts on the same browser.
* Pictures are generated SVG illustrations, not real photos.

## 10. Screenshots (for your submission)

Run `npm run dev`, open Chrome DevTools (F12) -> device toolbar (Ctrl+Shift+M), and take screenshots of each screen
in desktop and mobile size. Put them in a `screenshots/` folder.
