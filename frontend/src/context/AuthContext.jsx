import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("supportSphereUser");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("supportSphereToken") || null;
  });

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);

    localStorage.setItem(
      "supportSphereUser",
      JSON.stringify(userData)
    );

    localStorage.setItem(
      "supportSphereToken",
      jwtToken
    );
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("supportSphereUser");
    localStorage.removeItem("supportSphereToken");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}