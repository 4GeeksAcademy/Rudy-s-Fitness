import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("customer"); // customer | coach
    const [error, setError] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();

    // Initialize role from query string, e.g., /login?coach=true
    useEffect(() => {
        const coachMode = searchParams.get("coach");
        if (coachMode === "true") setRole("coach");
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!username || !password) {
            setError("Please enter username and password.");
            return;
        }
        try {
            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL?.trim().replace(/\/$/, "");
            const API_BASE = `${BACKEND_URL}/api`;
            // Usamos /api/customer-login y /api/user-login (no existe coach-login real aún)
            const endpoint = role === "coach" ? "/user-login" : "/customer-login";
            const resp = await fetch(`${API_BASE}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: username, password })
            });
            const data = await resp.json();
            if (resp.ok && data.access_token) {
                login({ type: role, membership: role === "coach" ? null : "basic", token: data.access_token });
                navigate("/");
            } else {
                setError(data.msg || `Login failed (status ${resp.status}).`);
            }
        } catch (err) {
            setError("Network error. Please try again.");
        }
    };

    return (
        <div className="container py-4" style={{ maxWidth: 500 }}>
            <h2 className="text-light">Login</h2>
            <p className="text-secondary">Enter your credentials or register.</p>
            <form onSubmit={handleSubmit} className="mt-3">
                <div className="mb-3">
                    <label className="form-label text-light">Username</label>
                    <input
                        type="text"
                        className="form-control bg-dark text-light border-secondary"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="your@email.com"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label text-light">Password</label>
                    <input
                        type="password"
                        className="form-control bg-dark text-light border-secondary"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label text-light">Role</label>
                    <select
                        className="form-select bg-dark text-light border-secondary"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="customer">Customer</option>
                        <option value="coach">Coach</option>
                    </select>
                </div>
                {error && <div className="alert alert-warning py-2">{error}</div>}
                <button type="submit" className="btn btn-outline-light w-100">
                    <i className="fas fa-sign-in-alt me-2" /> Login
                </button>
            </form>

            <div className="mt-3 d-flex justify-content-between align-items-center">
                <a href="/registration" className="btn btn-link text-decoration-none">Register</a>
                {role === "coach" ? (
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-info"
                        onClick={() => {
                            setRole("customer");
                            searchParams.delete("coach");
                            setSearchParams(searchParams);
                        }}
                    >
                        Customer Login
                    </button>
                ) : (
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-info"
                        onClick={() => {
                            setRole("coach");
                            searchParams.set("coach", "true");
                            setSearchParams(searchParams);
                        }}
                    >
                        Coach Login
                    </button>
                )}
            </div>
        </div>
    );
};

export default Login;
