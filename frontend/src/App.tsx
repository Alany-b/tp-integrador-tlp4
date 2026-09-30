import { Navigate, Route, Routes } from "react-router";
import { Navbar } from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminUsersPage } from "./pages/AdminUsersPage";
import { LoginPage } from "./pages/LoginPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { RegisterPage } from "./pages/RegisterPage";
import { TicketDetailPage } from "./pages/TicketDetailPage";
import { TicketFormPage } from "./pages/TicketFormPage";
import { TicketListPage } from "./pages/TicketListPage";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/tickets" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/tickets" element={<TicketListPage />} />
          <Route path="/tickets/:id" element={<TicketDetailPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>
        <Route element={<ProtectedRoute permission="ticket:create" />}>
          <Route path="/tickets/new" element={<TicketFormPage />} />
        </Route>
        <Route element={<ProtectedRoute permission="ticket:update" />}>
          <Route path="/tickets/:id/edit" element={<TicketFormPage />} />
        </Route>
        <Route element={<ProtectedRoute permission="user:read" />}>
          <Route path="/admin/users" element={<AdminUsersPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
