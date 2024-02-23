// Referencing: all the source codes, lecture slides and videos from the Advanced Web Applications course implemented by Erno Vanhala at LUT University in 2023-2024

export async function fetchWithAuth(urlPath: string, options: RequestInit = {}): Promise<Response | undefined> {
    const authToken = localStorage.getItem('auth_token');

    // If the user is not logged in
    if (!authToken) {
        throw new Error('UNAUTHORIZED: Redirecting to login page.');
    }

    const response = await fetch(urlPath, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${authToken}`,
        },
    });

    // If the token is invalid or expired
    if (response.status === 401) {
        localStorage.removeItem('auth_token');
        throw new Error('AUTH_EXPIRED: Please log in again.');
    }

    return response;
}
