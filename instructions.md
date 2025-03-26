# Project Setup Instructions for Real Estate Admin Panel

## Overview

This document provides the setup instructions for generating a **Real Estate Admin Panel** using **Cursor**. The application will be built with the following technologies:

- **React v18**
- **Vite**
- **Tailwind CSS v3**
- **ShadCN UI**

Cursor should generate the UI automatically based on the specified structure.

## Project Structure

The admin panel should include the following pages and features:

### 1. Authentication & User Management

- **Login Page** (Admin authentication)
- **User Management Page** (CRUD operations for admin users)
- **Profile Update Page** (Allow admins to update their details)

### 2. Real Estate Management

- **Property List Page** (View all properties with filtering and sorting options)
- **Property Details Page** (View detailed information about a property)
- **Create/Edit Property Page** (Form to add or edit property details)

### 3. Contract Management

- **Contracts List Page** (View all contracts related to properties)
- **Contract Details Page** (View, edit, or delete contract details)

## Setup Instructions

### Step 1: Initialize Vite Project

```sh
npx create-vite@latest real-estate --template react
cd real-estate
```

### Step 2: Install Dependencies

```sh
npm install -D tailwindcss@3 postcss autoprefixer @shadcn/ui react-router-dom axios react-query

npm install react@18 react-dom@18

npx tailwindcss init -p
```

### Step 3: Configure Tailwind CSS

Modify `index.css`;
@tailwind base;
@tailwind components;
@tailwind utilities;

Modify `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### Step 4: Set Up ShadCN UI

```sh
npx shadcn-ui@latest init
```

### Step 5: Generate UI Components

Cursor should generate UI components based on the following:

- **Navigation Bar** (Sidebar with links to all sections)
- **Data Tables** (For displaying users, properties, and contracts)
- **Forms** (For creating/editing properties and contracts)
- **Modals** (For confirming actions)

### Step 6: Implement Pages

Generate React Router routes for:

- `/dashboard`
- `/staffs`
- `/properties`
- `/contracts`
- `/profile`

Each page should have **ShadCN UI components** styled with TailwindCSS.

### Step 7: API Integration (Optional)

Cursor should set up a dummy API structure with mock data for testing.

### Step 8: Initialize Global Context API

Create a context provider for managing global state using React Context:

#### `src/context/AppContext.jsx`

```jsx
import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
```

Wrap the application with `AppProvider` in `main.jsx`:

#### `src/main.jsx`

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProvider } from './context/AppContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
);
```
