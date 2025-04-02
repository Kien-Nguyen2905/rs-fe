import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { LoginPage } from '@/pages/auth/LoginPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { useAppContext } from '@/context/AppContext';

import { UserListPage } from '@/pages/users/UserListPage';
import { PropertyListPage } from '@/pages/properties/PropertyListPage';
import { PropertyDetailPage } from '@/pages/properties/PropertyDetailPage';
import { PropertyFormPage } from '@/pages/properties/PropertyFormPage';
import { ContractListPage } from '@/pages/contracts/ContractListPage';
import { ContractDetailPage } from '@/pages/contracts/ContractDetailPage';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import CustomerListPage from './pages/customers/CustomerListPage';
import CustomerDetailPage from './pages/customers/CustomerDetailPage';

const RequireAuth = ({ children }) => {
  const { role } = useAppContext();
  if (role === null) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes with layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/staffs" replace />} />

          {/* <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <DashboardPage />
              </RequireAuth>
            }
          /> */}

          <Route
            path="/staffs"
            element={
              <RequireAuth>
                <UserListPage />
              </RequireAuth>
            }
          />
          <Route
            path="/customers"
            element={
              <RequireAuth>
                <CustomerListPage />
              </RequireAuth>
            }
          />
          <Route
            path="/customers/:id"
            element={
              <RequireAuth>
                <CustomerDetailPage />
              </RequireAuth>
            }
          />

          {/* <Route
            path="/properties"
            element={
              <RequireAuth>
                <PropertyListPage />
              </RequireAuth>
            }
          /> */}

          {/* <Route
            path="/properties/:id"
            element={
              <RequireAuth>
                <PropertyDetailPage />
              </RequireAuth>
            }
          /> */}

          {/* <Route
            path="/properties/create"
            element={
              <RequireAuth>
                <PropertyFormPage />
              </RequireAuth>
            }
          /> */}
          {/* 
          <Route
            path="/properties/:id/edit"
            element={
              <RequireAuth>
                <PropertyFormPage />
              </RequireAuth>
            }
          /> */}
          {/* 
          <Route
            path="/contracts"
            element={
              <RequireAuth>
                <ContractListPage />
              </RequireAuth>
            }
          />

          <Route
            path="/contracts/:id"
            element={
              <RequireAuth>
                <ContractDetailPage />
              </RequireAuth>
            }
          /> */}

          <Route
            path="/profile"
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
