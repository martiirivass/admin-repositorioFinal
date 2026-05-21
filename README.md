# Food Store — Administración (admin-app)

Panel administrativo para la gestión del sistema Food Store.

Permite administrar:

- Productos
- Ingredientes
- Categorías
- Subcategorías
- Pedidos

La aplicación contempla distintos roles:

- Administrador → acceso completo
- Empleado → solo visualización y gestión parcial de pedidos

Los otros repositorios del sistema son:

- store-app — tienda pública
- backend — API REST con autenticación JWT

---

# Stack Tecnológico

| Tecnología | Propósito |
|---|---|
| React + TypeScript | Framework principal |
| Vite | Bundler y entorno de desarrollo |
| Tailwind CSS | Estilos utilitarios |
| React Router DOM | Navegación |
| TanStack Query | Manejo de datos del servidor |
| TanStack Table | Tablas avanzadas |
| TanStack Form | Formularios y validaciones |
| Axios | Cliente HTTP |
| Zustand | Estado global |

---

# Cómo levantar el proyecto

Instalar dependencias:

```bash
npm install
```

Crear variables de entorno:

```bash
cp .env.example .env
```

Levantar entorno de desarrollo:

```bash
npm run dev
```

Servidor:

```txt
http://localhost:5173
```

---

# Variables de entorno

Archivo `.env`

```env
VITE_API_URL=http://localhost:3000
```

---

# Estructura de Carpetas

```txt
src/
├── assets/
├── features/
│   ├── products/
│   ├── ingredients/
│   ├── categories/
│   ├── orders/
│   └── auth/
│
├── shared/
│   ├── ui/
│   └── layout/
│
├── store/
│   └── useAuthStore.ts
│
├── router/
│   └── index.tsx
│
├── lib/
│   ├── axios.ts
│   └── queryClient.ts
│
├── hooks/
├── types/
├── utils/
│
└── main.tsx
```

---

# Funcionalidades

## Administrador

- Crear productos
- Editar productos
- Eliminar productos
- Gestionar ingredientes
- Gestionar categorías
- Gestionar pedidos

---

## Empleado

- Visualizar información
- Gestionar estados de pedidos

---

# Pantallas Requeridas

| Pantalla | Feature |
|---|---|
| Login | auth |
| Productos | products |
| Ingredientes | ingredients |
| Categorías | categories |
| Pedidos | orders |

---

# Estado del Proyecto

## ✅ Completado

- Setup inicial con React + TypeScript + Vite
- Configuración de Tailwind CSS
- Configuración de React Router
- Configuración de TanStack Query
- Configuración de Zustand
- Configuración de Axios
- Estructura modular

---

## 🚧 En desarrollo

- CRUD de productos
- CRUD de ingredientes
- CRUD de categorías
- Gestión de pedidos
- Roles y permisos
- Integración backend

---

# Convenciones

| Elemento | Convención |
|---|---|
| Componentes | PascalCase |
| Hooks | useHook |
| Services | nombreService |
| Stores | useStore |
| Types | PascalCase |

---

# Ejemplos

```txt
ProductsTable.tsx
useProducts.ts
productService.ts
useAuthStore.ts
Product.ts
```

---

# Integrantes

- Nombre Apellido
- Nombre Apellido
- Nombre Apellido