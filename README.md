# 🐾 Petzy

Aplikasi mobile **Petzy** dibangun menggunakan **React Native + Expo** dengan arsitektur **Clean Architecture** dan state management **Zustand**.

---

## 📦 Tech Stack

| Technology                 | Version | Kegunaan                        |
| -------------------------- | ------- | ------------------------------- |
| Expo                       | SDK 53  | Managed workflow & build tools  |
| React Native               | 0.79.x  | Framework mobile cross-platform |
| React                      | 19.x    | UI library                      |
| TypeScript                 | 5.x     | Static typing                   |
| Zustand                    | 5.x     | State management                |
| Axios                      | 1.x     | HTTP client                     |
| React Navigation           | 7.x     | Navigasi antar screen           |
| Expo Font                  | 13.x    | Custom font loading             |
| React Native Toast Message | 2.x     | Notifikasi toast                |

---

## 🏗️ Arsitektur: Clean Architecture

Project ini mengikuti prinsip **Clean Architecture** yang membagi kode menjadi 3 layer utama agar mudah di-maintain, di-test, dan di-scale.

```
┌─────────────────────────────────────────────────┐
│                 Presentation                     │
│         (Screens, Components, Navigation)        │
├─────────────────────────────────────────────────┤
│                    Domain                        │
│           (Entities, UseCases, Repos)            │
├─────────────────────────────────────────────────┤
│                     Data                         │
│       (Repositories, DataSources, Models)        │
└─────────────────────────────────────────────────┘
```

**Aturan dependency:** Layer atas boleh mengakses layer bawah, tapi **tidak sebaliknya**.

---

## 📁 Struktur Folder

```
petzy/
├── assets/
│   └── fonts/                        # Font files (Outfit-Light, Regular, Medium, SemiBold, Bold)
├── src/
│   ├── core/                         # Shared utilities & konfigurasi global
│   │   ├── constants/                # Konstanta aplikasi (API URLs, keys, enums, dll)
│   │   ├── hooks/                    # Custom React hooks yang reusable
│   │   ├── store/                    # Zustand stores (global state management)
│   │   ├── theme/                    # Design system (warna, typography, spacing)
│   │   └── utils/                    # Helper functions & utilities
│   │
│   ├── data/                         # Layer data — implementasi akses data
│   │   ├── datasources/
│   │   │   ├── local/                # Local storage (AsyncStorage, SQLite, MMKV)
│   │   │   └── remote/               # API client & network calls
│   │   ├── models/                   # Data Transfer Objects (DTO) / response models
│   │   └── repositories/            # Implementasi repository (menghubungkan datasource ke domain)
│   │
│   ├── domain/                       # Layer domain — business logic murni
│   │   ├── entities/                 # Entity / model bisnis (tidak tergantung framework)
│   │   ├── repositories/            # Interface/contract repository (abstract)
│   │   └── usecases/                # Use cases — satu aksi bisnis per file
│   │
│   ├── presentation/                 # Layer presentasi — semua yang dilihat user
│   │   ├── components/              # Reusable UI components
│   │   ├── navigation/              # React Navigation setup & navigators
│   │   └── screens/                 # Halaman/screen utama aplikasi
│   │
│   └── services/                     # External services (push notification, analytics, dll)
│
├── App.tsx                           # Entry point aplikasi (font loading + navigation)
├── app.json                          # Konfigurasi Expo (nama, icon, splash, plugins)
├── package.json                      # Dependencies & scripts
└── tsconfig.json                     # TypeScript configuration (extends expo)
```

---

## 📂 Penjelasan Detail Setiap Folder

### `src/core/` — Konfigurasi & Utilitas Global

| Folder       | Kegunaan                                                                                                                                                             |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `constants/` | Menyimpan nilai konstan seperti API base URL, enum, storage keys, dsb.                                                                                               |
| `hooks/`     | Custom hooks reusable, misalnya `useDebounce`, `useKeyboard`, `useAppState`.                                                                                         |
| `store/`     | **Zustand stores** untuk global state. Saat ini berisi `authStore.ts` yang mengelola state autentikasi (token, isLoading, isAuthenticated, login, register, logout). |
| `theme/`     | **Design system** — `colors.ts` (palet warna), `typography.ts` (font family & sizes), `spacing.ts` (spacing & border radius). Semua di-export via `index.ts`.        |
| `utils/`     | Helper functions umum seperti formatter, validator, date utils, dsb.                                                                                                 |

### `src/data/` — Layer Akses Data

| Folder                | Kegunaan                                                                                                                                     |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `datasources/remote/` | Setup HTTP client menggunakan Axios (`apiClient.ts`). Termasuk interceptors untuk request/response handling.                                 |
| `datasources/local/`  | Akses ke local storage (AsyncStorage, MMKV, SQLite) untuk caching atau offline data.                                                         |
| `models/`             | Data Transfer Objects — representasi data dari API response. Bisa berbeda dari entity di domain.                                             |
| `repositories/`       | **Implementasi** repository yang menghubungkan datasource ke domain. Contoh: `authRepository.ts` mengimplementasi login & register API call. |

### `src/domain/` — Layer Business Logic

| Folder          | Kegunaan                                                                                                                                    |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `entities/`     | Model/entitas bisnis murni. Tidak bergantung pada framework apapun. Contoh: `User`, `Pet`, `Order`.                                         |
| `repositories/` | **Interface/contract** repository (abstract). Mendefinisikan method apa saja yang harus diimplementasikan oleh data layer.                  |
| `usecases/`     | Satu use case = satu aksi bisnis. Contoh: `LoginUseCase`, `RegisterUseCase`, `GetPetsUseCase`. Setiap file hanya punya satu tanggung jawab. |

### `src/presentation/` — Layer UI

| Folder        | Kegunaan                                                                                                                                                     |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `components/` | Komponen UI reusable. Contoh: `AuthComponents.tsx` berisi `InputField` dan `PrimaryButton` yang dipakai di Login & Register.                                 |
| `navigation/` | Setup navigasi: `RootNavigator.tsx` (switch auth/app), `AuthNavigator.tsx` (Login ↔ Register), `AppNavigator.tsx` (Home), dan `types.ts` (type definitions). |
| `screens/`    | Halaman utama: `LoginScreen.tsx`, `RegisterScreen.tsx`, `HomeScreen.tsx`. Setiap screen adalah satu halaman penuh.                                           |

### `src/services/` — External Services

Folder untuk integrasi layanan eksternal seperti:

- Push Notifications (Firebase, OneSignal)
- Analytics (Mixpanel, Amplitude)
- Crash Reporting (Sentry, Crashlytics)

---

## 🎨 Design System

### Warna

| Tipe           | Warna | Hex       |
| -------------- | ----- | --------- |
| Primary        | 🔴    | `#ff6464` |
| Primary Dark   | 🟠    | `#ff8D4D` |
| Secondary      | 🟡    | `#ffBA69` |
| Secondary Dark | 🟤    | `#5A2828` |

### Font

**Outfit** — Google Font dengan 5 weight:

| Weight         | File                  | Penggunaan              |
| -------------- | --------------------- | ----------------------- |
| Light (300)    | `Outfit-Light.ttf`    | Body text               |
| Regular (400)  | `Outfit-Regular.ttf`  | Subtitle, caption       |
| Medium (500)   | `Outfit-Medium.ttf`   | Subtitle 1, body medium |
| SemiBold (600) | `Outfit-SemiBold.ttf` | Title, button           |
| Bold (700)     | `Outfit-Bold.ttf`     | Heading tebal           |

### Typography Scale

| Style       | Font Weight | Size |
| ----------- | ----------- | ---- |
| Title       | SemiBold    | 40px |
| Subtitle 1  | Medium      | 30px |
| Subtitle 2  | Regular     | 24px |
| Body        | Light       | 16px |
| Body Medium | Medium      | 14px |
| Button      | SemiBold    | 14px |
| Caption     | Regular     | 12px |
| Small       | Light       | 10px |

---

## 🔐 Auth Flow

Aplikasi menggunakan **reqres.in** sebagai mock API untuk testing autentikasi.

```
User Input → Screen → Zustand Store → Repository → API Client → reqres.in
     ↑                                                              │
     └──────────── Toast Notification (success/error) ←─────────────┘
```

### Testing Credentials (reqres.in)

| Field    | Value                |
| -------- | -------------------- |
| Email    | `eve.holt@reqres.in` |
| Password | `cityslicka`         |

### Navigasi

- **Belum login** → `AuthNavigator` (Login ↔ Register)
- **Sudah login** → `AppNavigator` (Home + Logout)

---

## 🚀 Menjalankan Aplikasi

```bash
# Install dependencies
npm install

# Jalankan Expo dev server
npm start

# Jalankan di Android
npm run android

# Jalankan di iOS
npm run ios

# Jalankan di Web
npm run web
```

---

## 📝 Scripts

| Script            | Perintah               | Kegunaan                    |
| ----------------- | ---------------------- | --------------------------- |
| `npm start`       | `expo start`           | Menjalankan Expo dev server |
| `npm run android` | `expo start --android` | Build & run di Android      |
| `npm run ios`     | `expo start --ios`     | Build & run di iOS          |
| `npm run web`     | `expo start --web`     | Build & run di Web browser  |
| `npm run lint`    | `eslint .`             | Cek kode dengan ESLint      |
