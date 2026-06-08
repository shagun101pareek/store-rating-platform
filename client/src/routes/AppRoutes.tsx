import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import AdminDashboard from "../pages/AdminDashboard";
import UserDashboard from "../pages/UserDashboard";
import UserHome from "../pages/UserHome";
import MyRatings from "../pages/MyRatings";
import Profile from "../pages/Profile";
import OwnerDashboard from "../pages/OwnerDashboard";
import OwnerReviews from "../pages/OwnerReviews";
import OwnerStoreProfile from "../pages/OwnerStoreProfile";
import ProtectedRoute from "./ProtectedRoute";
import AuthenticatedRoute from "./AuthenticatedRoute";
import AdminUsers from "../pages/AdminUsers";
import AdminStores from "../pages/AdminStores";
import AdminUserDetails from "../pages/AdminUserDetails";
import AdminStoreDetails from "../pages/AdminStoreDetails";
import AdminCreateUser from "../pages/AdminCreateUser";
import AdminCreateStore from "../pages/AdminCreateStore";
import AdminGlobalRatings from "../pages/AdminGlobalRatings";
import ChangePassword from "../pages/ChangePassword";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminUsers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users/new"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminCreateUser />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users/:id"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminUserDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/stores"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminStores />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/stores/new"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminCreateStore />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/stores/:id"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminStoreDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/ratings"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminGlobalRatings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/home"
        element={
          <ProtectedRoute allowedRole="USER">
            <UserHome />
          </ProtectedRoute>
        }
      />

      <Route
        path="/stores"
        element={
          <ProtectedRoute allowedRole="USER">
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-ratings"
        element={
          <ProtectedRoute allowedRole="USER">
            <MyRatings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRole="USER">
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner"
        element={
          <ProtectedRoute allowedRole="STORE_OWNER">
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/reviews"
        element={
          <ProtectedRoute allowedRole="STORE_OWNER">
            <OwnerReviews />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/profile"
        element={
          <ProtectedRoute allowedRole="STORE_OWNER">
            <OwnerStoreProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/change-password"
        element={
          <AuthenticatedRoute>
            <ChangePassword />
          </AuthenticatedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
