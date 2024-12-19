import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: "https://keycloak-for-lab3.app.cloud.cbh.kth.se",
    realm: "fullstack_labb3",
    clientId: "labb2frontend",
});
/**
 * Initialize Keycloak and handle login if required.
 * @returns {Promise<void>}
 */
export const initKeycloak = () => {
    return keycloak.init({
        onLoad: "check-sso", // Check Single Sign-On (SSO) but don't automatically log the user in
        checkLoginIframe: false, // Optional: Disable iframe for login state checking
    })
        .then((authenticated) => {
            if (authenticated) {
                console.log("User is authenticated");
                sessionStorage.setItem("userId", keycloak.tokenParsed.sub);
                sessionStorage.setItem("role", keycloak.tokenParsed.realm_access.roles);
            } else {
                console.warn("User is not authenticated");
            }
        })
        .catch((err) => {
            console.error("Error during Keycloak initialization", err);
        });
};


/**
 * Trigger Keycloak login manually.
 */
export const login = () => {
    keycloak.login();
};

/**
 * Trigger Keycloak logout manually.
 */
export const logout = () => {
    keycloak.logout();
};

/**
 * Get the Keycloak token for API requests.
 * @returns {string | null} The Keycloak token or null if not available.
 */
export const getToken = () => {
    return keycloak.token || null;
};

/**
 * Refresh the Keycloak token if needed.
 * @returns {Promise<void>}
 */
export const refreshToken = () => {
    return keycloak.updateToken(30) // Refresh token if it's going to expire in 30 seconds
        .then((refreshed) => {
            if (refreshed) {
                console.log("Token refreshed");
            } else {
                console.log("Token is still valid");
            }
        })
        .catch((err) => {
            console.error("Failed to refresh token", err);
        });
};

export default keycloak;
