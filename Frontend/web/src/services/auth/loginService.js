const url = import.meta.env.VITE_BACKEND_URL;

export async function login(email, password) {
  const response = await fetch(`${url}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error("Login failed");
    error.status = response.status;
    throw error;
  }

  const { token } = data;
  return token;
}
