import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL?.trim().replace(/\/$/, "");
const API_BASE = `${BACKEND_URL}/api`;

const RegistrationForm = () => {
    const [searchParams] = useSearchParams();
    const [role, setRole] = useState("customer");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    // Customer fields
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [dob, setDob] = useState("");
    const [address, setAddress] = useState("");
    const [membership, setMembership] = useState("Basic");
    // UI state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const strength = useMemo(() => {
        const s = {
            length: password.length >= 8,
            letter: /[A-Za-z]/.test(password),
            number: /\d/.test(password),
        };
        s.valid = s.length && s.letter && s.number;
        return s;
    }, [password]);

    useEffect(() => {
        const r = searchParams.get("role");
        if (r === "coach" || r === "customer") setRole(r);
    }, [searchParams]);

    const isValidCommon = (fields) => {
        return fields.every((f) => f && String(f).trim().length > 0);
    };

    const submitDisabledCustomer = useMemo(() => {
        // For customer require name, email, strong password match
        return !(
            strength.valid && password === confirmPassword
        );
    }, [strength, password, confirmPassword]);

    const submitDisabledCoach = useMemo(() => {
        // For coach require strong password match
        return !(
            strength.valid && password === confirmPassword
        );
    }, [strength, password, confirmPassword]);

    return (
        <div className="container py-4" style={{ maxWidth: 800 }}>
            <h2 className="text-light">Registration ({role})</h2>
            {role === "customer" ? (
                <form className="mt-3" onSubmit={async (e) => {
                    e.preventDefault();
                    setError("");
                    setSuccess("");
                    if (submitDisabledCustomer) return;
                    if (!name || !email || !dob || !address) {
                        setError("Please fill in all required fields.");
                        return;
                    }
                    setLoading(true);
                    try {
                        const resp = await fetch(`${API_BASE}/customer-signup`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                name,
                                email,
                                password,
                                dob,
                                address,
                                membership
                            })
                        });
                        const data = await resp.json();
                        if (resp.ok) {
                            setSuccess("Registration successful! You can now log in.");
                        } else {
                            setError(data.msg || `Registration failed (status ${resp.status}).`);
                        }
                    } catch (err) {
                        setError("Network error. Please try again.");
                    } finally {
                        setLoading(false);
                    }
                }}>
                    <div className="mb-3">
                        <label className="form-label text-light">Full Name</label>
                        <input className="form-control bg-dark text-light border-secondary" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-light">Email</label>
                        <input type="email" className="form-control bg-dark text-light border-secondary" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-light">Date of Birth</label>
                        <input type="date" className="form-control bg-dark text-light border-secondary" value={dob} onChange={e => setDob(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-light">Address</label>
                        <input className="form-control bg-dark text-light border-secondary" value={address} onChange={e => setAddress(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-light">Password</label>
                        <input
                            type="password"
                            className="form-control bg-dark text-light border-secondary"
                            placeholder="Create a strong password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <small className="text-secondary d-block mt-1">
                            Must be at least 8 characters, include a letter and a number.
                        </small>
                        <div className="mt-1">
                            <span className={`badge me-1 ${strength.length ? "bg-success" : "bg-secondary"}`}>8+ chars</span>
                            <span className={`badge me-1 ${strength.letter ? "bg-success" : "bg-secondary"}`}>letter</span>
                            <span className={`badge ${strength.number ? "bg-success" : "bg-secondary"}`}>number</span>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-light">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control bg-dark text-light border-secondary"
                            placeholder="Repeat password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {confirmPassword && (
                            <small className={`d-block mt-1 ${password === confirmPassword ? "text-success" : "text-warning"}`}>
                                {password === confirmPassword ? "Passwords match" : "Passwords do not match"}
                            </small>
                        )}
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-light">Membership</label>
                        <select className="form-select bg-dark text-light border-secondary" value={membership} onChange={e => setMembership(e.target.value)}>
                            <option>Basic</option>
                            <option>Premium</option>
                        </select>
                    </div>
                    {error && <div className="alert alert-danger py-2">{error}</div>}
                    {success && <div className="alert alert-success py-2">{success}</div>}
                    <button className="btn btn-outline-success" disabled={submitDisabledCustomer || loading}>
                        {loading ? "Registering..." : "Submit"}
                    </button>
                </form>
            ) : (
                <form className="mt-3" onSubmit={async (e) => {
                    e.preventDefault();
                    setError("");
                    setSuccess("");
                    if (submitDisabledCoach) return;
                    if (!email) {
                        setError("Please provide email.");
                        return;
                    }
                    setLoading(true);
                    try {
                        const resp = await fetch(`${API_BASE}/user-signup`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email, password })
                        });
                        const data = await resp.json();
                        if (resp.ok) {
                            setSuccess("Coach registration successful! You can now log in.");
                        } else {
                            setError(data.msg || `Registration failed (status ${resp.status}).`);
                        }
                    } catch (err) {
                        setError("Network error. Please try again.");
                    } finally {
                        setLoading(false);
                    }
                }}>
                    <div className="mb-3">
                        <label className="form-label text-light">Email</label>
                        <input type="email" className="form-control bg-dark text-light border-secondary" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-light">Password</label>
                        <input
                            type="password"
                            className="form-control bg-dark text-light border-secondary"
                            placeholder="Create a strong password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <small className="text-secondary d-block mt-1">
                            Must be at least 8 characters, include a letter and a number.
                        </small>
                        <div className="mt-1">
                            <span className={`badge me-1 ${strength.length ? "bg-success" : "bg-secondary"}`}>8+ chars</span>
                            <span className={`badge me-1 ${strength.letter ? "bg-success" : "bg-secondary"}`}>letter</span>
                            <span className={`badge ${strength.number ? "bg-success" : "bg-secondary"}`}>number</span>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-light">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control bg-dark text-light border-secondary"
                            placeholder="Repeat password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {confirmPassword && (
                            <small className={`d-block mt-1 ${password === confirmPassword ? "text-success" : "text-warning"}`}>
                                {password === confirmPassword ? "Passwords match" : "Passwords do not match"}
                            </small>
                        )}
                    </div>
                    {error && <div className="alert alert-danger py-2">{error}</div>}
                    {success && <div className="alert alert-success py-2">{success}</div>}
                    <button className="btn btn-outline-info" disabled={submitDisabledCoach || loading}>
                        {loading ? "Registering..." : "Submit"}
                    </button>
                </form>
            )}
        </div>
    );
};

export default RegistrationForm;
