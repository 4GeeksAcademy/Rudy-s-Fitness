import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import "../../styles/benefits.css";

export const Benefits = () => {
    const { store } = useGlobalReducer();
    const { user, isAuthenticated } = store;

    const membershipTiers = [
        {
            id: "basic",
            name: "BASIC",
            price: "$49/month",
            color: "#666",
            benefits: [
                "Access to gym facilities",
                "Basic group classes",
                "Free fitness assessment",
                "Email support",
                "Member community access",
            ],
        },
        {
            id: "premium",
            name: "PREMIUM",
            price: "$99/month",
            color: "#0f0",
            highlight: true,
            benefits: [
                "Everything in Basic",
                "Unlimited group classes",
                "Personal trainer consultation (1x/month)",
                "10% discount on shop items",
                "Priority class booking",
                "Nutrition guide",
                "Advanced fitness tracking",
            ],
        },
        {
            id: "vip",
            name: "VIP",
            price: "$149/month",
            color: "#ffd700",
            benefits: [
                "Everything in Premium",
                "Unlimited personal training sessions",
                "20% discount on shop items",
                "Custom meal planning",
                "VIP lounge access",
                "Exclusive member events",
                "Priority support 24/7",
                "Wearable sync integration",
            ],
        },
    ];

    return (
        <div className="benefits-container">
            {/* Hero Section */}
            <div className="benefits-hero">
                <div className="benefits-hero-overlay">
                    <h1>MEMBERSHIP BENEFITS</h1>
                    <p>Choose the perfect plan for your fitness journey</p>
                </div>
            </div>

            {/* Current Status */}
            {isAuthenticated && user && (
                <div className="current-membership">
                    <div className="current-membership-content">
                        <h2>Your Current Plan</h2>
                        <p className="current-level">
                            {user.membershipLevel
                                ? user.membershipLevel.toUpperCase()
                                : "BASIC"}
                        </p>
                        <p className="membership-info">
                            Enjoy all benefits included in your membership tier and upgrade
                            anytime.
                        </p>
                    </div>
                </div>
            )}

            {/* Benefits Comparison */}
            <div className="benefits-content">
                {/* Desktop View - Table */}
                <div className="benefits-table-container">
                    <table className="benefits-table">
                        <thead>
                            <tr>
                                <th>Feature</th>
                                {membershipTiers.map((tier) => (
                                    <th key={tier.id} className={`tier-column ${tier.id}`}>
                                        {tier.name}
                                        <div className="tier-price">{tier.price}</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {/* Access to Gym */}
                            <tr>
                                <td className="feature-name">Gym Access</td>
                                <td className="check-cell">✓</td>
                                <td className="check-cell">✓</td>
                                <td className="check-cell">✓</td>
                            </tr>

                            {/* Classes */}
                            <tr>
                                <td className="feature-name">Group Classes</td>
                                <td className="value-cell">Basic</td>
                                <td className="value-cell">Unlimited</td>
                                <td className="value-cell">Unlimited</td>
                            </tr>

                            {/* Personal Training */}
                            <tr>
                                <td className="feature-name">Personal Training</td>
                                <td className="check-cell">—</td>
                                <td className="value-cell">1x/month</td>
                                <td className="value-cell">Unlimited</td>
                            </tr>

                            {/* Shop Discount */}
                            <tr>
                                <td className="feature-name">Shop Discount</td>
                                <td className="value-cell">0%</td>
                                <td className="value-cell">10%</td>
                                <td className="value-cell">20%</td>
                            </tr>

                            {/* Nutrition */}
                            <tr>
                                <td className="feature-name">Nutrition Planning</td>
                                <td className="check-cell">—</td>
                                <td className="value-cell">Guide</td>
                                <td className="value-cell">Custom</td>
                            </tr>

                            {/* Priority Booking */}
                            <tr>
                                <td className="feature-name">Priority Class Booking</td>
                                <td className="check-cell">—</td>
                                <td className="check-cell">✓</td>
                                <td className="check-cell">✓</td>
                            </tr>

                            {/* Support */}
                            <tr>
                                <td className="feature-name">Support</td>
                                <td className="value-cell">Email</td>
                                <td className="value-cell">Email</td>
                                <td className="value-cell">24/7 Priority</td>
                            </tr>

                            {/* VIP Lounge */}
                            <tr>
                                <td className="feature-name">VIP Lounge Access</td>
                                <td className="check-cell">—</td>
                                <td className="check-cell">—</td>
                                <td className="check-cell">✓</td>
                            </tr>

                            {/* Fitness Tracking */}
                            <tr>
                                <td className="feature-name">Advanced Fitness Tracking</td>
                                <td className="check-cell">—</td>
                                <td className="check-cell">✓</td>
                                <td className="check-cell">✓</td>
                            </tr>

                            {/* Exclusive Events */}
                            <tr>
                                <td className="feature-name">Exclusive Events</td>
                                <td className="check-cell">—</td>
                                <td className="check-cell">—</td>
                                <td className="check-cell">✓</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Mobile View - Cards */}
                <div className="benefits-cards-container">
                    {membershipTiers.map((tier) => (
                        <div
                            key={tier.id}
                            className={`benefit-card ${tier.id} ${tier.highlight ? "highlight" : ""
                                }`}
                        >
                            <div className="card-header">
                                <h3>{tier.name}</h3>
                                <div className="card-price">{tier.price}</div>
                            </div>

                            <div className="card-benefits">
                                <ul>
                                    {tier.benefits.map((benefit, idx) => (
                                        <li key={idx}>
                                            <span className="checkmark">✓</span>
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {isAuthenticated &&
                                user?.membershipLevel === tier.id ? (
                                <div className="card-footer">
                                    <button className="current-btn">Current Plan</button>
                                </div>
                            ) : (
                                <div className="card-footer">
                                    <button className="upgrade-btn">Upgrade to {tier.name}</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Additional Info */}
            <div className="benefits-info-section">
                <h2>Why Choose Rudy's Fitness?</h2>
                <div className="info-grid">
                    <div className="info-card">
                        <div className="info-icon">💪</div>
                        <h4>Expert Coaches</h4>
                        <p>Certified professionals ready to guide your fitness journey</p>
                    </div>
                    <div className="info-card">
                        <div className="info-icon">🏋️</div>
                        <h4>Modern Equipment</h4>
                        <p>State-of-the-art fitness equipment and facilities</p>
                    </div>
                    <div className="info-card">
                        <div className="info-icon">🎯</div>
                        <h4>Personalized Plans</h4>
                        <p>Custom workout and nutrition plans tailored to your goals</p>
                    </div>
                    <div className="info-card">
                        <div className="info-icon">📱</div>
                        <h4>Digital Tracking</h4>
                        <p>Advanced tools to track progress and achieve results</p>
                    </div>
                    <div className="info-card">
                        <div className="info-icon">👥</div>
                        <h4>Community</h4>
                        <p>Join a supportive community of fitness enthusiasts</p>
                    </div>
                    <div className="info-card">
                        <div className="info-icon">🎁</div>
                        <h4>Member Perks</h4>
                        <p>Exclusive discounts and special member-only benefits</p>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            {!isAuthenticated && (
                <div className="benefits-cta">
                    <h2>Ready to Start Your Fitness Journey?</h2>
                    <p>Join Rudy's Fitness today and transform your life</p>
                    <button className="cta-btn">Get Started Now</button>
                </div>
            )}
        </div>
    );
};
