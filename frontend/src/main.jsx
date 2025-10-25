import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import HomePage from './pages/HomePage'
import EventsListPage from './pages/EventsListPage'
import EventDetailPage from './pages/EventDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import UserProfilePage from './pages/UserProfilePage'
import UserInscriptionsPage from './pages/UserInscriptionsPage'
import UserTeamsPage from './pages/UserTeamsPage'
import CreateTeamPage from './pages/CreateTeamPage'
import TeamDetailPage from './pages/TeamDetailPage'
import JoinTeamPage from './pages/JoinTeamPage'
import JoinWithCodePage from './pages/JoinWithCodePage'
import RegistrationPage from './pages/RegistrationPage' // NUEVA PÁGINA
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'

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
        path: "/login",
        element: <LoginPage />
      },
      {
        path: "/register",
        element: <RegisterPage />
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />
          },
          {
            path: "/dashboard/profile",
            element: <UserProfilePage />
          },
          {
            path: "/dashboard/inscripciones",
            element: <UserInscriptionsPage />
          },
          {
            path: "/dashboard/teams",
            element: <UserTeamsPage />
          },
          {
            path: "/dashboard/teams/create",
            element: <CreateTeamPage />
          },
          {
            path: "/dashboard/teams/:id",
            element: <TeamDetailPage />
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
            path: "/eventos/:id/register", // NUEVA RUTA
            element: <RegistrationPage />
          }
        ]
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)