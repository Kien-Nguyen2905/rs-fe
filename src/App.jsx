import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { LoginPage } from '@/pages/auth/LoginPage';
import { useAppContext } from '@/context/AppContext';
import { UserListPage } from '@/pages/users/UserListPage';
import { PropertyListPage } from '@/pages/properties/PropertyListPage';
import { PropertyDetailPage } from '@/pages/properties/PropertyDetailPage';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import CustomerListPage from './pages/customers/CustomerListPage';
import CustomerDetailPage from './pages/customers/CustomerDetailPage';
import ConsignmentListPage from './pages/consignments/ConsignmentListPage';
import ConsignmentDetailPage from './pages/consignments/ConsignmentDetailPage';
import DepositListPage from './pages/deposits/DepositListPage';
import DepositDetailPage from './pages/deposits/DepositDetailPage';
import TransferListPage from './pages/transfers/TransferListPage';
import TransferDetailPage from './pages/transfers/TransferDetailPage';

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
        <Route path="/login" element={<LoginPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/staffs" replace />} />

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

          <Route
            path="/properties"
            element={
              <RequireAuth>
                <PropertyListPage />
              </RequireAuth>
            }
          />

          <Route
            path="/properties/:id"
            element={
              <RequireAuth>
                <PropertyDetailPage />
              </RequireAuth>
            }
          />

          <Route
            path="/consignments"
            element={
              <RequireAuth>
                <ConsignmentListPage />
              </RequireAuth>
            }
          />

          <Route
            path="/consignments/:id"
            element={
              <RequireAuth>
                <ConsignmentDetailPage />
              </RequireAuth>
            }
          />

          <Route
            path="/deposits"
            element={
              <RequireAuth>
                <DepositListPage />
              </RequireAuth>
            }
          />

          <Route
            path="/deposits/:id"
            element={
              <RequireAuth>
                <DepositDetailPage />
              </RequireAuth>
            }
          />

          <Route
            path="/transfers"
            element={
              <RequireAuth>
                <TransferListPage />
              </RequireAuth>
            }
          />

          <Route
            path="/transfers/:id"
            element={
              <RequireAuth>
                <TransferDetailPage />
              </RequireAuth>
            }
          />

          <Route
            path="/profile"
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
