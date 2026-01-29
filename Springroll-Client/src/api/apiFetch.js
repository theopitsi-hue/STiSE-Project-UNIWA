import { useNavigate } from "react-router-dom";

export function apiFetch() {
    const navigate = useNavigate();

    return async function apiFetch(url, options = {}) {
        const config = {
            ...options,
            credentials: "include",
            headers: { "Content-Type": "application/json", ...(options.headers || {}) },
        };

        const response = await fetch(url, config);

        if (response.status === 401) {
            navigate("/login"); // This is safe because it's inside a hook
            return null;
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return response.json();
        }

        return response;
    };
}
