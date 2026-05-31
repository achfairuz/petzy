# 📂 Struktur Folder Petzy

Dokumen ini menjelaskan **fungsi setiap folder**, **contoh isi**, dan **alur kerja** aplikasi Petzy yang menggunakan **Clean Architecture**.

---

## 🎯 Prinsip Clean Architecture

Aplikasi dibagi menjadi **3 layer utama** + folder pendukung:

```
┌─────────────────────────────────────────────────┐
│              Presentation Layer                  │ ← UI (yang dilihat user)
├─────────────────────────────────────────────────┤
│                Domain Layer                      │ ← Business logic murni
├─────────────────────────────────────────────────┤
│                 Data Layer                       │ ← Akses data (API, DB, dll)
└─────────────────────────────────────────────────┘
```

**Aturan dependency:** Layer atas boleh tahu layer bawah, **tidak sebaliknya**. Domain tidak boleh tahu Data atau Presentation.

---

## 📁 Penjelasan Setiap Folder

### `src/core/` — Konfigurasi & utilitas global

Tempat semua hal yang **dipakai lintas layer** seperti konstanta, theme, hooks, dan global state.

#### `core/constants/`

Menyimpan nilai konstan: API URL, endpoint, env variable.

**Contoh — `endpoint.ts`:**

```ts
export const endpoints = {
  auth: {
    login: "/login",
    register: "/register",
  },
};
```

#### `core/hooks/`

Custom React hooks reusable. Diorganisasi per domain (misal `auth/`).

**Contoh — `core/hooks/auth/useLogin.ts`:**

```ts
export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {login, isLoading} = useAuthStore();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Toast.show({type: "error", text1: "Validation Error"});
      return;
    }
    try {
      await login(email, password);
      Toast.show({type: "success", text1: "Login Successful"});
    } catch (e: any) {
      Toast.show({type: "error", text1: "Login Failed", text2: e.message});
    }
  };

  return {email, setEmail, password, setPassword, handleLogin, isLoading};
};
```

#### `core/store/`

Zustand stores untuk **global state**. Jembatan antara UI ↔ usecase.

**Contoh — `authStore.ts`:**

```ts
const login = loginUseCase(authRepository);

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email, password) => {
    set({isLoading: true});
    try {
      const user = await login(email, password);
      set({token: user.token, isAuthenticated: true, isLoading: false});
    } catch (e) {
      set({isLoading: false});
      throw e;
    }
  },
}));
```

#### `core/theme/`

Design system: warna, font, spacing.

**Contoh — `colors.ts`:**

```ts
export const Colors = {
  primary: "#ff6464",
  secondary: "#ffBA69",
  background: "#fff",
};
```

#### `core/utils/`

Helper functions umum (formatter, validator, dsb).

---

### `src/domain/` — Business logic murni

Layer **paling penting & paling abstrak**. Tidak boleh import apapun dari `data/` atau `presentation/`. Tidak tahu soal Axios, React, Zustand, dll.

#### `domain/entities/`

Model bisnis **murni**, bebas dari struktur API.

**Contoh — `User.ts`:**

```ts
export interface User {
  token: string;
}
```

#### `domain/repositories/`

**Interface (contract)** — mendefinisikan "apa yang bisa dilakukan", bukan caranya.

**Contoh — `IAuthRepository.ts`:**

```ts
import {User} from "../entities/User";

export interface IAuthRepository {
  login(email: string, password: string): Promise<User>;
  register(email: string, password: string): Promise<User>;
}
```

#### `domain/usecases/`

Satu file = satu aksi bisnis. Function yang menerima repository dan mengembalikan function yang siap dipanggil.

**Contoh — `LoginUseCase.ts`:**

```ts
import {IAuthRepository} from "../repositories/IAuthRepository";

export const loginUseCase =
  (repository: IAuthRepository) => (email: string, password: string) =>
    repository.login(email, password);
```

---

### `src/data/` — Implementasi akses data

Layer yang **menyentuh dunia luar**: API, AsyncStorage, SQLite, dll.

#### `data/datasources/remote/`

Setup HTTP client.

**Contoh — `apiClient.ts`:**

```ts
export const apiClient = axios.create({
  baseURL: ENV.BASE_URL,
  timeout: ENV.API_TIMEOUT,
  headers: {"Content-Type": "application/json"},
});
```

#### `data/datasources/local/`

Akses local storage (AsyncStorage, MMKV, SQLite).

**Contoh — `tokenStorage.ts`:**

```ts
export const tokenStorage = {
  save: (token: string) => AsyncStorage.setItem("token", token),
  get: () => AsyncStorage.getItem("token"),
  clear: () => AsyncStorage.removeItem("token"),
};
```

#### `data/models/`

**DTO (Data Transfer Object)** — bentuk data dari API response. Bisa berbeda dari entity.

**Contoh — `AuthDto.ts`:**

```ts
export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  token: string;
}
```

#### `data/repositories/`

**Implementasi** dari interface di `domain/repositories/`. Mapping DTO → Entity.

**Contoh — `authRepository.ts`:**

```ts
export const authRepository: IAuthRepository = {
  login: async (email, password): Promise<User> => {
    const res = await apiClient.post<AuthResponseDto>("/login", {
      email,
      password,
    });
    return {token: res.data.token}; // mapping DTO → Entity
  },
};
```

---

### `src/presentation/` — Layer UI

Semua yang dilihat user.

#### `presentation/components/`

Komponen UI **reusable**.

**Contoh — `AuthComponents.tsx`:**

```tsx
export const InputField = ({ label, value, onChangeText, ... }) => ( ... );
export const PrimaryButton = ({ title, onPress, isLoading, ... }) => ( ... );
```

#### `presentation/navigation/`

Setup React Navigation.

**Contoh — `AuthNavigator.tsx`:**

```tsx
<Stack.Navigator>
  <Stack.Screen name="Login" component={LoginScreen} />
  <Stack.Screen name="Register" component={RegisterScreen} />
</Stack.Navigator>
```

#### `presentation/screens/`

Halaman utama. Diorganisasi per fitur (misal `auth/`).

**Contoh — `screens/auth/LoginScreen.tsx`:**

```tsx
const LoginScreen = () => {
  const { email, setEmail, password, setPassword, handleLogin, isLoading } = useLogin();
  return ( ...UI... );
};
```

---

### `src/services/` — External services

Integrasi layanan eksternal: Push Notification (Firebase/OneSignal), Analytics (Mixpanel), Crash Reporting (Sentry).

---

## 📊 Tabel Ringkasan Struktur Folder

| Folder                     | Layer        | Fungsi                            | Boleh import dari                             |
| -------------------------- | ------------ | --------------------------------- | --------------------------------------------- |
| `core/constants/`          | Core         | Konstanta global (URL, key, enum) | —                                             |
| `core/hooks/`              | Core         | Custom React hooks                | `core/store`, `core/utils`                    |
| `core/store/`              | Core         | Zustand global state              | `domain/usecases`, `data/repositories`        |
| `core/theme/`              | Core         | Design system (warna, font)       | —                                             |
| `core/utils/`              | Core         | Helper functions                  | —                                             |
| `domain/entities/`         | Domain       | Model bisnis murni                | — (paling abstrak)                            |
| `domain/repositories/`     | Domain       | Interface/contract repository     | `domain/entities`                             |
| `domain/usecases/`         | Domain       | Satu aksi bisnis per file         | `domain/repositories`, `domain/entities`      |
| `data/datasources/remote/` | Data         | HTTP client (Axios)               | `core/constants`                              |
| `data/datasources/local/`  | Data         | Local storage                     | —                                             |
| `data/models/`             | Data         | DTO dari API                      | —                                             |
| `data/repositories/`       | Data         | Implementasi `IRepository`        | `domain/*`, `data/datasources`, `data/models` |
| `presentation/components/` | Presentation | UI components reusable            | `core/theme`                                  |
| `presentation/navigation/` | Presentation | Setup navigasi                    | `presentation/screens`                        |
| `presentation/screens/`    | Presentation | Halaman aplikasi                  | `core/hooks`, `presentation/components`       |
| `services/`                | —            | External service (FCM, Analytics) | —                                             |

---

## 🔄 Alur Login & Register

```
┌──────────────────────────────────────────────────────────────┐
│ 1. USER mengetik email + password di LoginScreen             │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│ 2. presentation/screens/auth/LoginScreen.tsx                 │
│    → render UI, panggil handleLogin() dari useLogin()        │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│ 3. core/hooks/auth/useLogin.ts                               │
│    → validasi input, panggil store.login(email, password)    │
│    → tampilkan Toast success/error                           │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│ 4. core/store/authStore.ts                                   │
│    → set isLoading=true                                      │
│    → panggil loginUseCase(authRepository)(email, password)   │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│ 5. domain/usecases/LoginUseCase.ts                           │
│    → repository.login(email, password)                       │
│    (Use case ini hanya tahu interface, bukan implementasi)   │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│ 6. data/repositories/authRepository.ts                       │
│    → implements IAuthRepository                              │
│    → apiClient.post('/login', { email, password })           │
│    → mapping AuthResponseDto → User entity                   │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│ 7. data/datasources/remote/apiClient.ts                      │
│    → Axios kirim HTTP POST ke reqres.in                      │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│ 8. Response balik:                                           │
│    Store update → token, isAuthenticated=true                │
│    RootNavigator switch ke AppNavigator (HomeScreen)         │
│    Toast "Login Successful" muncul                           │
└──────────────────────────────────────────────────────────────┘
```

**Untuk Register**: alurnya **persis sama**, tinggal ganti `LoginScreen` → `RegisterScreen`, `useLogin` → `useRegister`, `loginUseCase` → `registerUseCase`.

---

## ➕ Cara Menambah Fitur Baru (Contoh: Pet)

Misal mau bikin fitur **list pet** (`GET /pets`).

Urutannya **dari domain ke presentation** (dari dalam ke luar):

### 1️⃣ Domain — definisikan dulu "apa yang dibutuhkan"

**`domain/entities/Pet.ts`**

```ts
export interface Pet {
  id: string;
  name: string;
  species: string;
}
```

**`domain/repositories/IPetRepository.ts`**

```ts
import {Pet} from "../entities/Pet";

export interface IPetRepository {
  getAll(): Promise<Pet[]>;
}
```

**`domain/usecases/GetPetsUseCase.ts`**

```ts
import {IPetRepository} from "../repositories/IPetRepository";

export const getPetsUseCase =
  (repository: IPetRepository) => (): Promise<Pet[]> =>
    repository.getAll();
```

### 2️⃣ Data — implementasikan akses datanya

**`data/models/PetDto.ts`**

```ts
export interface PetDto {
  id: string;
  name: string;
  species: string;
}
```

**`data/repositories/petRepository.ts`**

```ts
import {apiClient} from "../datasources/remote/apiClient";
import {PetDto} from "../models/PetDto";
import {IPetRepository} from "../../domain/repositories/IPetRepository";
import {Pet} from "../../domain/entities/Pet";

export const petRepository: IPetRepository = {
  getAll: async (): Promise<Pet[]> => {
    const res = await apiClient.get<PetDto[]>("/pets");
    return res.data.map((dto) => ({
      id: dto.id,
      name: dto.name,
      species: dto.species,
    }));
  },
};
```

### 3️⃣ Core — store + hook

**`core/store/petStore.ts`**

```ts
import {create} from "zustand";
import {getPetsUseCase} from "../../domain/usecases/GetPetsUseCase";
import {petRepository} from "../../data/repositories/petRepository";

const getPets = getPetsUseCase(petRepository);

export const usePetStore = create((set) => ({
  pets: [],
  isLoading: false,
  fetchPets: async () => {
    set({isLoading: true});
    const pets = await getPets();
    set({pets, isLoading: false});
  },
}));
```

**`core/hooks/pet/usePetList.ts`**

```ts
export const usePetList = () => {
  const {pets, isLoading, fetchPets} = usePetStore();
  useEffect(() => {
    fetchPets();
  }, []);
  return {pets, isLoading};
};
```

### 4️⃣ Presentation — UI

**`presentation/screens/pet/PetListScreen.tsx`**

```tsx
const PetListScreen = () => {
  const { pets, isLoading } = usePetList();
  return ( ...render list... );
};
```

**`presentation/navigation/AppNavigator.tsx`** — tambahkan screen baru.

---

## 🧭 Ringkasan Urutan Membuat Fitur Baru

```
1. Entity         (domain/entities/)         → bentuk data
2. Repo Interface (domain/repositories/)     → kontrak
3. UseCase        (domain/usecases/)         → aksi bisnis
4. DTO            (data/models/)             → bentuk dari API
5. Repo Impl      (data/repositories/)       → kerjain HTTP-nya
6. Store          (core/store/)              → state global
7. Hook           (core/hooks/)              → state form + validation
8. Screen         (presentation/screens/)    → UI
9. Navigation     (presentation/navigation/) → daftarkan screen
```

> 💡 **Rule of thumb:** Mulai dari **domain** (paling abstrak) → turun ke **data** → naik ke **presentation**. Domain tidak pernah tergantung pada layer luar.
