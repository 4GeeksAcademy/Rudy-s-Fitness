import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import { useAuth } from "../hooks/AuthContext";

const Activities = () => {
    const { userType } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [events, setEvents] = useState([]);
    const [customer, setCustomer] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError("");
                const [evRes, custRes] = await Promise.all([
                    apiFetch("/events-all"),
                    // Only try to load customer profile if logged as customer
                    userType === "customer"
                        ? apiFetch("/customer-current").catch(() => null)
                        : Promise.resolve(null),
                ]);
                setEvents(evRes?.events || []);
                setCustomer(custRes);
            } catch (e) {
                setError(e.message || "Failed to load activities");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [userType]);

    const handleSignup = async (eventId) => {
        try {
            setError("");
            if (!customer?.id) throw new Error("Customer profile not loaded");
            await apiFetch("/signup-for-event", {
                method: "POST",
                body: { customer_id: customer.id, event_id: eventId },
            });
            // Refresh list to reflect signups count
            const evRes = await apiFetch("/events-all");
            setEvents(evRes?.events || []);
            alert("Signed up successfully");
        } catch (e) {
            setError(e.message || "Signup failed");
        }
    };

    return (
        <div className="container py-4" style={{ maxWidth: 800 }}>
            <h2 className="text-light">Activities</h2>
            <p className="text-secondary">View available events and sign up.</p>
            {loading && <div className="text-secondary">Loading…</div>}
            {error && <div className="alert alert-warning py-2">{error}</div>}
            {!loading && events.length === 0 && (
                <div className="text-secondary">No events found.</div>
            )}
            <div className="row g-3 mt-2">
                {events.map((ev) => (
                    <div className="col-12 col-md-6" key={ev.id}>
                        <div className="card bg-dark text-light h-100 border-secondary">
                            {ev.photo && (
                                <img src={ev.photo} className="card-img-top" alt={ev.location} />
                            )}
                            <div className="card-body">
                                <h5 className="card-title">{ev.location}</h5>
                                <p className="card-text mb-1">Date: {ev.date}</p>
                                <p className="card-text mb-1">Time: {ev.time}</p>
                                <p className="card-text mb-1">Instructor: {ev.instructor}</p>
                                <p className="card-text mb-2">
                                    Capacity: {ev.signups}/{ev.capacity}
                                </p>
                                {userType === "customer" && (
                                    <button
                                        className="btn btn-outline-info btn-sm"
                                        onClick={() => handleSignup(ev.id)}
                                    >
                                        Sign Up
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Activities;
