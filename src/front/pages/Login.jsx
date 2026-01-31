import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import "../../styles/auth.css";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState("customer"); // customer or coach
    const { dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // TODO: Implement actual backend authentication
        // For now, simulate login
        const userData = {
            id: 1,
            email: email,
            userType: userType,
            membershipLevel: userType === "customer" ? "basic" : null
        };

        dispatch({ type: 'login', payload: userData });
        navigate('/');
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1 className="auth-title">SIGN IN</h1>
                <p className="auth-subtitle">Welcome back to Rudy's Fitness</p>

                <div className="user-type-selector">
                    <button
                        className={`type-btn ${userType === 'customer' ? 'active' : ''}`}
                        onClick={() => setUserType('customer')}
                    >
                        Customer
                    </button>
                    <button
                        className={`type-btn ${userType === 'coach' ? 'active' : ''}`}
                        onClick={() => setUserType('coach')}
                    >
                        Coach
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button type="submit" className="auth-btn">
                        SIGN IN
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/registration">Register here</Link></p>
                </div>
            </div>
        </div>
    );
};
