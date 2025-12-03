import React from "react";
import { useNavigate } from "react-router-dom";

const Registration = () => {
    const navigate = useNavigate();

    const handleAcceptWaiver = () => {
        // TODO: Navigate to registration form after waiver acceptance
        navigate("/registration/form");
    };

    return (
        <div className="container py-4" style={{ maxWidth: 700 }}>
            <h2 className="text-light">Digital Waiver</h2>
            <p className="text-secondary">Please read and accept the waiver before registration.</p>
            <div className="bg-dark text-light p-3 rounded border border-secondary" style={{ minHeight: 200 }}>
                <p>
                    By proceeding, you acknowledge the risks associated with physical activity and agree to hold
                    Rudy's Fitness harmless for any injuries sustained.
                </p>
                <p>
                    You also agree to our privacy policy and terms of service.
                </p>
            </div>
            <div className="mt-3 d-flex gap-2">
                <button className="btn btn-outline-success" onClick={handleAcceptWaiver}>
                    Accept and Continue
                </button>
                <button className="btn btn-outline-secondary" onClick={() => navigate("/")}>Cancel</button>
            </div>
            <div className="mt-4">
                <p className="text-secondary">Are you registering as a coach or a customer?</p>
                <div className="d-flex gap-3">
                    <a href="/registration/form?role=customer" className="btn btn-outline-light">Customer</a>
                    <a href="/registration/form?role=coach" className="btn btn-outline-info">Coach</a>
                </div>
            </div>
        </div>
    );
};

export default Registration;
