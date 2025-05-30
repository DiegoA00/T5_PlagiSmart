export async function login(email, password) {
  try {
    // TODO: replace with actual backend URL
    const response = await fetch("http://localhost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();

    const { token } = data;
    return token;
  } catch (error) {
    throw error;
  }
}
