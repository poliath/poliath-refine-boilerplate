import { AuthBindings } from "@refinedev/core";
import {message} from "antd";
import {TOKEN_KEY, REFRESH_TOKEN_KEY, TOKEN_EXPIRES_AT_KEY, API_URL} from "../constants";

export const authProvider: AuthBindings = {
  register: async ({ email, password, firstName, lastName }) => {
    try {
      const response = await fetch(`${API_URL}/auth/email/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password, firstName: firstName, lastName: lastName })
      });

      if (response.ok) {
        return {
          success: true,
          redirectTo: "/login",
        };
      } else {
        return {
          success: false,
          error: {
            name: "LoginError",
            message: "Invalid username or password",
          },
        };
      }
    } catch (error) {
      console.error("Error occurred during login:", error);
      return {
        success: false,
        error: {
          name: "LoginError",
          message: "An error occurred during login.",
        },
      };
    }
  },
  login: async ({ email, password }) => {
    try {
      const response = await fetch(`${API_URL}/auth/email/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
        localStorage.setItem(TOKEN_EXPIRES_AT_KEY, data.tokenExpires);
        return {
          success: true,
          redirectTo: "/",
        };
      } else {
        return {
          success: false,
          error: {
            name: "LoginError",
            message: "Invalid username or password",
          },
        };
      }
    } catch (error) {
      console.error("Error occurred during login:", error);
      return {
        success: false,
        error: {
          name: "LoginError",
          message: "An error occurred during login.",
        },
      };
    }
  },

  logout: async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRES_AT_KEY);
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => {
    interface Role {
      id: string;
      name: string;
    }

    function extractRoleInfoFromToken(token: string | null): Role | null {
      if(!token) {
        return null;
      }
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const roleInfo = payload.role;
        return roleInfo !== undefined ? roleInfo : null;
      } catch (error) {
        console.error('Error parsing JWT token:', error);
        return null;
      }
    }


    const token = localStorage.getItem(TOKEN_KEY);
    const roleInfo = extractRoleInfoFromToken(token);
    if (roleInfo !== null) {
      return roleInfo.id;
    } else {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.id) {
          const role: Role = {id: data.role.id, name: data.role.name};

          if(role) {
            return role.id;
          }

        } else {
          return {
            authenticated: false,
            redirectTo: "/login",
          };
        }
      } catch (error) {
        return {
          authenticated: false,
          redirectTo: "/login",
        };
      }
    }
  },
  getIdentity: async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.id) {
        return {
          id: data.id,
          name: data.firstName + ' ' + data.lastName,
          avatar: "https://i.pravatar.cc/300",
        };

      } else {
        return {
          authenticated: false,
          redirectTo: "/login",
        };
      }
    } catch (error) {
      return {
        authenticated: false,
        redirectTo: "/login",
      };
    }
  },
  forgotPassword: async ({ email }) => {
    try {
      const response = await fetch(`${API_URL}/auth/forgot/password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
      });

      if (response.ok) {
        message.success("Email successfully sent");
        return {
          success: true,
          redirectTo: "/login",
        };
      } else {
        return {
          success: false,
          error: {
            name: "PasswordResetError",
            message: "An error occurred.",
          },
        };
      }
    } catch (error) {
      return {
        success: false,
        error: {
          name: "PasswordResetError",
          message: "An error occurred.",
        },
      };
    }
  },
  updatePassword: async ( {id, password} ) => {
    try {
      const response = await fetch(`${API_URL}/auth/reset/password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: password, hash: id })
      });

      if (response.ok) {
        message.success("Password successfully reset");
        return {
          success: true,
          redirectTo: "/login",
        };
      } else {
        return {
          success: false,
          error: {
            name: "PasswordResetError",
            message: "An error occurred.",
          },
        };
      }
    } catch (error) {
      return {
        success: false,
        error: {
          name: "PasswordResetError",
          message: "An error occurred.",
        },
      };
    }
  },
  onError: async (error) => {
   // console.error(error);
    return { error };
  },
};
