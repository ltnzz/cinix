export const isAdminAuthenticated = () => {
    return localStorage.getItem("admin_auth") === "true";
};

export const getAdminToken = () => {
    return localStorage.getItem("admin_token");
};

export const setAdminAuth = (token) => {
    localStorage.setItem("admin_auth", "true");
    if (token) localStorage.setItem("admin_token", token);
};

export const clearAdminAuth = () => {
    localStorage.removeItem("admin_auth");
    localStorage.removeItem("admin_token");
};