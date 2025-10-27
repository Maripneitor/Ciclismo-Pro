import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import HomePage from './pages/HomePage'
import EventsListPage from './pages/EventsListPage'
import EventDetailPage from './pages/EventDetailPage'
import StorePage from './pages/StorePage'
import CartPage from './pages/CartPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import UserProfilePage from './pages/UserProfilePage'
import UserInscriptionsPage from './pages/UserInscriptionsPage'
import UserTeamsPage from './pages/UserTeamsPage'
import UserOrdersPage from './pages/UserOrdersPage'
import CreateTeamPage from './pages/CreateTeamPage'
import TeamDetailPage from './pages/TeamDetailPage'
import JoinTeamPage from './pages/JoinTeamPage'
import JoinWithCodePage from './pages/JoinWithCodePage'
import RegistrationPage from './pages/RegistrationPage'
import ProtectedRoute from './components/ProtectedRoute'
import OrganizerRoute from './components/OrganizerRoute'
import AdminRoute from './components/AdminRoute'
import OrganizerLayout from './pages/organizer/OrganizerLayout'
import OrganizerDashboardPage from './pages/organizer/OrganizerDashboardPage'
import OrganizerEventsPage from './pages/organizer/OrganizerEventsPage'
import OrganizerEventDetailPage from './pages/organizer/OrganizerEventDetailPage'
import AdminLayout from './pages/admin/AdminLayout'
import AdminUserManagementPage from './pages/admin/AdminUserManagementPage'
import AdminEventManagementPage from './pages/admin/AdminEventManagementPage'
import AdminProductManagementPage from './pages/admin/AdminProductManagementPage'
import AdminOrderManagementPage from './pages/admin/AdminOrderManagementPage'
import AdminCreateProductPage from './pages/admin/AdminCreateProductPage'
import AdminEditProductPage from './pages/admin/AdminEditProductPage'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ThemeProvider } from './context/ThemeContext'
import RegistrationSuccessPage from './pages/RegistrationSuccessPage';
import UserDashboardLayout from './pages/UserDashboardLayout'
import UserDashboardHomePage from './pages/UserDashboardHomePage'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "/eventos",
        element: <EventsListPage />
      },
      {
        path: "/eventos/:id",
        element: <EventDetailPage />
      },
      {
        path: "/store",
        element: <StorePage />
      },
      {
        path: "/cart",
        element: <CartPage />
      },
      {
        path: "/order-success",
        element: <OrderSuccessPage />
      },
      {
        path: "/login",
        element: <LoginPage />
      },
      {
        path: "/register",
        element: <RegisterPage />
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />
      },
      {
        path: "/reset-password/:token",
        element: <ResetPasswordPage />
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/dashboard",
            element: <UserDashboardLayout />,
            children: [
              { index: true, element: <UserDashboardHomePage /> },
              { path: "profile", element: <UserProfilePage /> },
              { path: "inscripciones", element: <UserInscriptionsPage /> },
              { path: "teams", element: <UserTeamsPage /> },
              { path: "teams/create", element: <CreateTeamPage /> },
              { path: "teams/:id", element: <TeamDetailPage /> },
              { path: "orders", element: <UserOrdersPage /> }
            ]
          },
          {
            path: "/join-team/:inviteToken",
            element: <JoinTeamPage />
          },
          {
            path: "/dashboard/teams/join",
            element: <JoinWithCodePage />
          },
          {
            path: "/eventos/:id/register",
            element: <RegistrationPage />
          },
          {
            path: "/eventos/:id_evento/success",
            element: <RegistrationSuccessPage />
          }
        ]
      },
      {
        element: <OrganizerRoute />,
        children: [
          {
            path: "/organizer",
            element: <OrganizerLayout />,
            children: [
              { 
                path: "dashboard", 
                element: <OrganizerDashboardPage /> 
              },
              { 
                path: "events", 
                element: <OrganizerEventsPage /> 
              },
              { 
                path: "events/:id", 
                element: <OrganizerEventDetailPage /> 
              }
            ]
          }
        ]
      },
      {
        element: <AdminRoute />,
        children: [
          {
            path: "/admin",
            element: <AdminLayout />,
            children: [
              { 
                path: "users", 
                element: <AdminUserManagementPage /> 
              },
              { 
                path: "events", 
                element: <AdminEventManagementPage /> 
              },
              { 
                path: "products", 
                element: <AdminProductManagementPage /> 
              },
              { 
                path: "orders",
                element: <AdminOrderManagementPage /> 
              },
              {
                path: "products/create", 
                element: <AdminCreateProductPage /> 
              },
              {
                path: "products/edit/:id", 
                element: <AdminEditProductPage /> 
              }
            ]
          }
        ]
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)