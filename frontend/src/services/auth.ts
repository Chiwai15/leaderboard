export const saveTokenWithRole = (token: string, role: string, user: object) => {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("role", role);
    sessionStorage.setItem("user", JSON.stringify(user));
};
  
  export const getToken = (): string | null => {
    return sessionStorage.getItem("token");
  };
  
  export const getUser = (): string | null => {
    return sessionStorage.getItem("user");
  };

  export const logout = () => {
    sessionStorage.removeItem("token");
  };
  
  export const getUserRole = () => {
    return sessionStorage.getItem("role");
  };