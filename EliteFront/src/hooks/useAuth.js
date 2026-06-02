export function useAuth() {
  const raw = localStorage.getItem('elitefit_user');
  const user = raw ? JSON.parse(raw) : null;
  const token = localStorage.getItem('token');

  const isAuthenticated = Boolean(token && user);
  const roles = user?.roles ?? [];
  const isAdmin = roles.includes('Admin');
  const isMember = roles.includes('Member');
  const defaultDashboard = isAdmin ? '/staff' : '/users';

  return { user, token, isAuthenticated, roles, isAdmin, isMember, defaultDashboard };
}
