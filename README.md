# 📚 BookStore — Full Stack Bookstore App

Aplikasi toko buku online berbasis **Express.js + Prisma + React** dengan payment gateway **Midtrans**, tema **Navy & Copper**, dan font **Poppins**.

---

## 🗂️ Struktur Proyek

```
bookstore/
├── backend/
│   ├── controllers/
│   │   └── orderController.js
│   ├── routes/
│   │   └── orderRoutes.js
│   ├── middleware/
│   │   └── auth.js
│   ├── prisma/
│   │   └── schema.prisma
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Home/
    │   │   │   └── Home.jsx
    │   │   ├── MyOrders/
    │   │   │   └── MyOrders.jsx
    │   │   └── Admin/
    │   │       └── AdminOrders.jsx
    │   ├── components/
    │   │   └── Books/
    │   │       └── BookCard.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── services/
    │   │   └── api.js
    │   └── App.jsx
    └── index.html
```

---

## ⚙️ Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | React, React Router, Lucide React |
| Backend | Express.js, Node.js |
| ORM | Prisma |
| Database | PostgreSQL / MySQL |
| Payment | Midtrans Snap |
| Styling | CSS-in-JS (inline styles per page) |
| Font | Poppins (Google Fonts) |

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 2. Environment Variables

Buat file `.env` di folder `backend/`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/bookstore"

# Midtrans
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxx
MIDTRANS_IS_PRODUCTION=false

# App
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_here
PORT=3000
```

### 3. Setup Database

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Jalankan Aplikasi

```bash
# Backend (dari folder backend/)
npm run dev

# Frontend (dari folder frontend/)
npm run dev
```

---

## 🗃️ Prisma Schema

Model utama yang digunakan:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  role      String   @default("USER")  // "USER" | "ADMIN"
  orders    Order[]
  cart      Cart?
  createdAt DateTime @default(now())
}

model Book {
  id          Int         @id @default(autoincrement())
  title       String
  author      String
  price       Float
  stock       Int
  coverImage  String?
  categoryId  Int?
  category    Category?   @relation(fields: [categoryId], references: [id])
  orderItems  OrderItem[]
  cartItems   CartItem[]
}

model Order {
  id               Int         @id @default(autoincrement())
  userId           Int
  user             User        @relation(fields: [userId], references: [id])
  totalAmount      Float
  status           String      @default("PENDING")
  // PENDING | PROCESSING | SHIPPED | DELIVERED | CANCELLED
  paymentStatus    String      @default("UNPAID")
  // UNPAID | PAID | FAILED | EXPIRED | CHALLENGE
  paymentMethod    String?
  midtransOrderId  String?     @unique
  snapToken        String?
  paidAt           DateTime?
  items            OrderItem[]
  revenue          Revenue?
  createdAt        DateTime    @default(now())
}

model OrderItem {
  id       Int   @id @default(autoincrement())
  orderId  Int
  order    Order @relation(fields: [orderId], references: [id])
  bookId   Int
  book     Book  @relation(fields: [bookId], references: [id])
  quantity Int
  price    Float
}

model Cart {
  id     Int        @id @default(autoincrement())
  userId Int        @unique
  user   User       @relation(fields: [userId], references: [id])
  items  CartItem[]
}

model CartItem {
  id       Int  @id @default(autoincrement())
  cartId   Int
  cart     Cart @relation(fields: [cartId], references: [id])
  bookId   Int
  book     Book @relation(fields: [bookId], references: [id])
  quantity Int
}

model Revenue {
  id          Int      @id @default(autoincrement())
  orderId     Int      @unique
  order       Order    @relation(fields: [orderId], references: [id])
  amount      Float
  type        String   // "ORDER"
  description String?
  createdAt   DateTime @default(now())
}

model Category {
  id    Int    @id @default(autoincrement())
  name  String
  books Book[]
}
```

---

## 🛣️ API Routes

### Auth
| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | `/api/auth/register` | Registrasi user baru |
| POST | `/api/auth/login` | Login, mendapat JWT token |

### Orders (User)
| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| POST | `/api/orders/checkout` | Buat order + Midtrans Snap token | ✅ |
| GET | `/api/orders` | Ambil semua order milik user | ✅ |
| GET | `/api/orders/:id` | Ambil detail satu order | ✅ |
| POST | `/api/orders/webhook` | Webhook notifikasi Midtrans | ❌ |

### Orders (Admin)
| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| GET | `/api/admin/orders` | Ambil semua order (admin) | ✅ Admin |
| PUT | `/api/admin/orders/:id` | Update status order | ✅ Admin |

### Books & Categories
| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/books` | List buku (support `?limit=`, `?q=`, `?category=`) |
| GET | `/api/categories` | List semua kategori |

---

## 💳 Integrasi Midtrans

### Alur Pembayaran

```
User checkout
    ↓
POST /api/orders/checkout
    ↓ Buat Order (PENDING/UNPAID) di DB
    ↓ Request Snap token ke Midtrans
    ↓ Simpan snapToken ke Order
    ↓ Return token ke frontend
    ↓
Frontend buka window.snap.pay(token)
    ↓
User bayar di popup Midtrans
    ↓
Midtrans kirim notifikasi ke webhook
    ↓
POST /api/orders/webhook
    ↓ Update paymentStatus = PAID
    ↓ Update status = PROCESSING
    ↓ Kosongkan cart user
    ↓ (stok & revenue BELUM berubah)
    ↓
Admin ubah status → DELIVERED
    ↓
PUT /api/admin/orders/:id { status: "DELIVERED" }
    ↓ Kurangi stok buku
    ↓ Buat record Revenue
    ↓ status = DELIVERED ✅
```

### Setup Webhook (Development)

Gunakan **ngrok** untuk expose localhost:

```bash
ngrok http 3000
```

Daftarkan URL berikut di **Midtrans Dashboard → Settings → Payment → Notification URL**:

```
https://xxxx.ngrok.io/api/orders/webhook
```

### Setup di `index.html`

Tambahkan script Midtrans Snap sebelum `</body>`:

```html
<!-- Sandbox -->
<script src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key="SB-Mid-client-xxxxxxxxxxxx"></script>

<!-- Production -->
<script src="https://app.midtrans.com/snap/snap.js"
        data-client-key="Mid-client-xxxxxxxxxxxx"></script>
```

---

## 📄 Halaman Frontend

### 🏠 Home (`/`)
Halaman utama toko dengan promo bar, hero section, ticker, chip filter kategori, grid buku populer, promo strip, kategori, fitur unggulan, dan CTA registrasi.

> **Catatan:** Section "Bergabung Sekarang" di bagian bawah dan tombol "Daftar Gratis" di hero **otomatis tersembunyi** jika user sudah login.

### 📦 MyOrders (`/orders`)
Halaman riwayat pesanan user dengan layout **timeline vertikal**.

Fitur:
- Garis timeline copper gradient di sisi kiri
- Dot berwarna per status (amber, copper, biru, hijau, merah)
- **Progress tracker** 4 langkah: Menunggu → Diproses → Dikirim → Diterima (selalu terlihat tanpa perlu expand)
- Color bar tipis di atas setiap card sesuai status
- Filter tab: Semua / Belum Bayar / Diproses / Selesai / Dibatalkan
- **Bayar Sekarang** — tombol muncul otomatis untuk order yang belum dibayar, membuka kembali popup Midtrans tanpa kembali ke cart
- Skeleton loading & empty state

Registrasi di `App.jsx`:
```jsx
import MyOrders from './pages/MyOrders/MyOrders'
<Route path="/orders" element={<PrivateRoute><MyOrders /></PrivateRoute>} />
```

### 🛡️ AdminOrders (`/admin/orders`)
Halaman manajemen order admin dengan layout **split panel 3 kolom**.

| Kolom | Lebar | Isi |
|---|---|---|
| Sidebar | 210px | Filter status dengan icon & badge count |
| List | 340px | Daftar order kompak + search bar |
| Detail | flex | Detail order + update status |

Fitur:
- Filter status di sidebar (Semua, Menunggu, Diproses, Dikirim, Selesai, Batal)
- Search order berdasarkan nama/ID
- Detail langsung terlihat di panel kanan (tanpa modal)
- Dropdown update status + tombol Simpan
- Responsive: di bawah 1100px panel bergantian, di bawah 700px sidebar tersembunyi

---

## 💰 Logika Revenue

Revenue **hanya dicatat** ketika admin mengubah status order menjadi **DELIVERED**, bukan saat pembayaran diterima.

| Event | Stok | Revenue | Cart |
|---|---|---|---|
| User bayar (webhook PAID) | ❌ Tidak berubah | ❌ Belum dicatat | ✅ Dikosongkan |
| Admin klik Selesai (DELIVERED) | ✅ Dikurangi | ✅ Dicatat | — |

Hal ini memastikan dana dianggap "masuk" ke toko hanya setelah pesanan benar-benar selesai dan diterima pembeli.

---

## 🎨 Design System

| Token | Nilai |
|---|---|
| `--navy` | `#0f1e42` |
| `--navy-mid` | `#1a2f5e` |
| `--copper` | `#d4823a` |
| `--copper-dk` | `#b06828` |
| `--copper-lt` | `#e89a58` |
| `--bg-page` | `#f5f7ff` |
| Font | Poppins (300–900) |
| Border radius card | 12–14px |
| Border radius badge | 100px (pill) |

---

## 🔐 Auth Context

Semua halaman yang membutuhkan login menggunakan `useAuth()` dari `AuthContext.jsx`:

```jsx
import { useAuth } from '../../context/AuthContext'

const { user, login, logout } = useAuth()

// Cek login
if (!user) return <Navigate to="/login" />
```

---

## 📝 Catatan Pengembangan

- **Midtrans sandbox** menggunakan prefix `SB-` pada server key & client key
- `midtransOrderId` harus unik — format: `BS-{timestamp}-{random}`
- Webhook harus terdaftar tanpa middleware auth
- `prisma.$transaction()` digunakan di `updateOrderStatus` agar operasi DELIVERED bersifat atomik
- Field `price` di `OrderItem` menyimpan harga saat pembelian (bukan harga buku saat ini) untuk mencegah perubahan harga memengaruhi history

---

## 📌 To-Do / Pengembangan Lanjutan

- [ ] Halaman detail buku
- [ ] Fitur pencarian & filter lanjutan di katalog
- [ ] Notifikasi real-time (WebSocket/SSE) untuk update status order
- [ ] Dashboard analitik admin (chart revenue, buku terlaris)
- [ ] Sistem review & rating buku
- [ ] Upload gambar cover buku
- [ ] Export laporan revenue ke Excel/PDF
