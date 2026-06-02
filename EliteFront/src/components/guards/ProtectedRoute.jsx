import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Wraps a route group and enforces auth + role checks.
 *
 * Props:
 *   allowedRoles  - string[]  — at least one must match the user's roles
 *   children      - ReactNode — the layout or element to render when access is granted
 */
export function ProtectedRoute({ allowedRoles = [], children }) {
  const { isAuthenticated, roles, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const hasAccess = allowedRoles.length === 0 || allowedRoles.some(r => roles.includes(r));

  if (!hasAccess) {
    // Redirect to the correct dashboard for this user's role
    return <Navigate to={isAdmin ? '/staff' : '/users'} replace />;
  }

  return children;
}
