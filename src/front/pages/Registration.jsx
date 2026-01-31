import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/auth.css";

export const Registration = () => {
    const [step, setStep] = useState("waiver"); // waiver, form, payment
    const [userType, setUserType] = useState("customer");
    const [waiverAccepted, setWaiverAccepted] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        membershipLevel: "basic"
    });
    const navigate = useNavigate();

    const handleWaiverAccept = () => {
        if (waiverAccepted) {
            setStep("form");
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords don't match!");
            return;
        }
        setStep("payment");
    };

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement payment processing
        alert("Registration successful!");
        navigate("/login");
    };

    return (
        <div className="auth-container">
            <div className="auth-box registration-box">
                {step === "waiver" && (
                    <>
                        <h1 className="auth-title">DIGITAL WAIVER</h1>
                        <p className="auth-subtitle">Please read and accept our terms</p>

                        <div className="user-type-selector">
                            <button
                                className={`type-btn ${userType === 'customer' ? 'active' : ''}`}
                                onClick={() => setUserType('customer')}
                            >
                                Register as Customer
                            </button>
                            <button
                                className={`type-btn ${userType === 'coach' ? 'active' : ''}`}
                                onClick={() => setUserType('coach')}
                            >
                                Register as Coach
                            </button>
                        </div>

                        <div className="waiver-content">
                            <h3>WAIVER AND RELEASE OF LIABILITY</h3>
                            <div className="waiver-text">
                                <p>I hereby acknowledge that I am voluntarily participating in fitness activities at Rudy's Fitness.</p>
                                <p>I understand that such activities involve inherent risks including, but not limited to, risks of injury, disability, or death.</p>
                                <p>I acknowledge that I am in good physical condition and have no medical conditions that would prevent me from participating in these activities.</p>
                                <p>I hereby waive, release, and discharge Rudy's Fitness, its owners, employees, and agents from any and all liability for any injury or damage that may occur as a result of my participation.</p>
                                <p>I have read this waiver carefully and understand its contents.</p>
                            </div>

                            <div className="waiver-checkbox">
                                <input
                                    type="checkbox"
                                    id="waiver"
                                    checked={waiverAccepted}
                                    onChange={(e) => setWaiverAccepted(e.target.checked)}
                                />
                                <label htmlFor="waiver">
                                    I have read and accept the terms of this waiver
                                </label>
                            </div>

                            <button
                                className="auth-btn"
                                onClick={handleWaiverAccept}
                                disabled={!waiverAccepted}
                            >
                                CONTINUE TO REGISTRATION
                            </button>
                        </div>
                    </>
                )}

                {step === "form" && (
                    <>
                        <h1 className="auth-title">REGISTRATION</h1>
                        <p className="auth-subtitle">
                            {userType === "customer" ? "Customer Information" : "Coach Information"}
                        </p>

                        <form onSubmit={handleFormSubmit} className="auth-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="firstName">First Name</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        placeholder="First name"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="lastName">Last Name</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        placeholder="Last name"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="(555) 123-4567"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Create password"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        placeholder="Confirm password"
                                        required
                                    />
                                </div>
                            </div>

                            {userType === "customer" && (
                                <div className="form-group">
                                    <label htmlFor="membershipLevel">Membership Level</label>
                                    <select
                                        id="membershipLevel"
                                        name="membershipLevel"
                                        value={formData.membershipLevel}
                                        onChange={handleInputChange}
                                        className="membership-select"
                                    >
                                        <option value="basic">Basic - $49/month</option>
                                        <option value="premium">Premium - $99/month</option>
                                        <option value="vip">VIP - $149/month</option>
                                    </select>
                                </div>
                            )}

                            <button type="submit" className="auth-btn">
                                {userType === "customer" ? "CONTINUE TO PAYMENT" : "COMPLETE REGISTRATION"}
                            </button>
                        </form>

                        <div className="auth-footer">
                            <p>Already have an account? <Link to="/login">Sign in here</Link></p>
                        </div>
                    </>
                )}

                {step === "payment" && userType === "customer" && (
                    <>
                        <h1 className="auth-title">PAYMENT INFORMATION</h1>
                        <p className="auth-subtitle">Secure payment processing</p>

                        <form onSubmit={handlePaymentSubmit} className="auth-form">
                            <div className="form-group">
                                <label htmlFor="cardNumber">Card Number</label>
                                <input
                                    type="text"
                                    id="cardNumber"
                                    placeholder="1234 5678 9012 3456"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="expiry">Expiry Date</label>
                                    <input
                                        type="text"
                                        id="expiry"
                                        placeholder="MM/YY"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="cvv">CVV</label>
                                    <input
                                        type="text"
                                        id="cvv"
                                        placeholder="123"
                                        maxLength="3"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="payment-summary">
                                <h3>Order Summary</h3>
                                <div className="summary-line">
                                    <span>Membership ({formData.membershipLevel})</span>
                                    <span>
                                        ${formData.membershipLevel === "basic" ? "49" :
                                            formData.membershipLevel === "premium" ? "99" : "149"}/month
                                    </span>
                                </div>
                                <div className="summary-line total">
                                    <span>Total Today</span>
                                    <span>
                                        ${formData.membershipLevel === "basic" ? "49" :
                                            formData.membershipLevel === "premium" ? "99" : "149"}
                                    </span>
                                </div>
                            </div>

                            <button type="submit" className="auth-btn">
                                COMPLETE REGISTRATION
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};
