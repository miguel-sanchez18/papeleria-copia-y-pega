
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    ...options.headers,
    'Authorization': `Bearer ${token || ''}`
  };

  if (!(options.body instanceof FormData)) {
    (headers as any)['Content-Type'] = 'application/json';
  }

  try {
    const res = await fetch(url, { ...options, headers });

    // Handle Auth Errors (401/403)
    if (res.status === 401 || res.status === 403) {
      console.warn(`Auth Error (${res.status}): Redirecting to login.`);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login'; // Force full reload/redirect
      return res; // Return res so caller can stop execution if needed, though redirect happens slightly later
    }

    return res;
  } catch (error) {
    console.error("Network or Fetch Error:", error);
    throw error;
  }
};
