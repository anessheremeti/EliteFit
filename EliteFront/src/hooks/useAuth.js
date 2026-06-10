import { jwtDecode } from "jwt-decode";

export function useAuth() {
  const token = localStorage.getItem('token');

  let user = null;

  if (token) {
    const decoded = jwtDecode(token);

    user = {
      id: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
      email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
      fullName: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/name"],
      roles: [decoded["role"] || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]]
    };
  }

  const isAuthenticated = !!token;

  return {
    user,
    token,
    isAuthenticated,
    roles: user?.roles || [],
    isAdmin: user?.roles?.includes('Admin'),
    isMember: user?.roles?.includes('Member'),
  };
}