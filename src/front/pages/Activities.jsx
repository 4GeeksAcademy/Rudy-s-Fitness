import React, { useState } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import "../../styles/activities.css";

export const Activities = () => {
    const { store } = useGlobalReducer();
    const { isAuthenticated, user } = store;
    const [selectedClass, setSelectedClass] = useState(null);

    // Mock data for classes
    const classes = [
        {
            id: 1,
            name: "STRENGTH TRAINING",
            description: "Build muscle and increase power with our intensive strength training program",
            schedule: ["Mon/Wed/Fri - 6:00 AM", "Tue/Thu - 7:00 PM"],
            coach: "Mike Johnson",
            duration: "60 min",
            intensity: "High",
            requiredLevel: "basic",
            image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400"
        },
        {
            id: 2,
            name: "CARDIO BLAST",
            description: "High-intensity interval training to maximize fat burn and endurance",
            schedule: ["Mon/Wed/Fri - 8:00 AM", "Tue/Thu/Sat - 6:00 PM"],
            coach: "Sarah Martinez",
            duration: "45 min",
            intensity: "Very High",
            requiredLevel: "basic",
            image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400"
        },
        {
            id: 3,
            name: "YOGA FLOW",
            description: "Improve flexibility, balance, and mental clarity through guided yoga",
            schedule: ["Tue/Thu - 9:00 AM", "Sat/Sun - 10:00 AM"],
            coach: "Emma Wilson",
            duration: "60 min",
            intensity: "Low",
            requiredLevel: "basic",
            image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400"
        },
        {
            id: 4,
            name: "BOXING CIRCUIT",
            description: "Combine boxing techniques with circuit training for a full-body workout",
            schedule: ["Mon/Wed - 7:00 PM", "Sat - 11:00 AM"],
            coach: "Carlos Rodriguez",
            duration: "50 min",
            intensity: "High",
            requiredLevel: "premium",
            image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400"
        },
        {
            id: 5,
            name: "ADVANCED POWERLIFTING",
            description: "Elite powerlifting program for experienced athletes",
            schedule: ["Tue/Thu/Sat - 5:00 AM"],
            coach: "Derek Thompson",
            duration: "90 min",
            intensity: "Very High",
            requiredLevel: "vip",
            image: "https://images.unsplash.com/photo-1580086319619-3ed498161c77?w=400"
        },
        {
            id: 6,
            name: "PRIVATE TRAINING",
            description: "One-on-one personalized training with our expert coaches",
            schedule: ["By Appointment"],
            coach: "Various Coaches",
            duration: "60 min",
            intensity: "Custom",
            requiredLevel: "vip",
            image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400"
        }
    ];

    const coaches = [
        {
            name: "Mike Johnson",
            specialty: "Strength & Conditioning",
            experience: "10+ years",
            certifications: "NSCA-CSCS, ACE",
            bio: "Former professional athlete specializing in strength development"
        },
        {
            name: "Sarah Martinez",
            specialty: "HIIT & Cardio",
            experience: "8 years",
            certifications: "NASM-CPT, TRX",
            bio: "Marathon runner and cardio enthusiast"
        },
        {
            name: "Emma Wilson",
            specialty: "Yoga & Flexibility",
            experience: "12 years",
            certifications: "RYT-500, E-RYT",
            bio: "Certified yoga instructor with extensive mindfulness training"
        },
        {
            name: "Carlos Rodriguez",
            specialty: "Boxing & Combat",
            experience: "15 years",
            certifications: "USA Boxing Coach",
            bio: "Professional boxing coach and former competitive boxer"
        },
        {
            name: "Derek Thompson",
            specialty: "Powerlifting",
            experience: "20+ years",
            certifications: "USAPL Coach",
            bio: "National powerlifting champion and elite coach"
        }
    ];

    const membershipLevels = [
        {
            level: "basic",
            name: "BASIC",
            price: 49,
            features: [
                "Access to all basic classes",
                "Standard gym equipment",
                "Locker room access",
                "Mobile app access",
                "2 guest passes per month"
            ],
            classAccess: "Basic classes included"
        },
        {
            level: "premium",
            name: "PREMIUM",
            price: 99,
            features: [
                "All Basic features",
                "Access to premium classes",
                "Priority booking",
                "Nutrition consultation",
                "10% discount on shop",
                "Free protein shake daily",
                "5 guest passes per month"
            ],
            classAccess: "Basic + Premium classes"
        },
        {
            level: "vip",
            name: "VIP",
            price: 149,
            features: [
                "All Premium features",
                "24/7 gym access",
                "Private training sessions",
                "Personal locker",
                "Towel service",
                "20% discount on shop",
                "Monthly body composition analysis",
                "Unlimited guest passes"
            ],
            classAccess: "All classes + Private training"
        }
    ];

    const canAccessClass = (classLevel) => {
        if (!isAuthenticated) return false;
        const levels = ["basic", "premium", "vip"];
        const userLevelIndex = levels.indexOf(user?.membershipLevel);
        const requiredLevelIndex = levels.indexOf(classLevel);
        return userLevelIndex >= requiredLevelIndex;
    };

    const getUpgradeMessage = (classLevel) => {
        const levelNames = { premium: "Premium", vip: "VIP" };
        return `Upgrade to ${levelNames[classLevel]} to access this class`;
    };

    return (
        <div className="activities-container">
            {/* Hero Section */}
            <section className="activities-hero">
                <div className="activities-hero-overlay">
                    <h1 className="activities-hero-title">
                        {isAuthenticated ? `WELCOME BACK, ${user?.email?.split('@')[0].toUpperCase()}` : "CLASSES & ACTIVITIES"}
                    </h1>
                    <p className="activities-hero-subtitle">
                        {isAuthenticated
                            ? `Your membership: ${user?.membershipLevel?.toUpperCase()}`
                            : "Transform your body with our expert-led classes"}
                    </p>
                </div>
            </section>

            {/* Classes Grid Section */}
            <section className="classes-section">
                <div className="container">
                    <h2 className="section-title">AVAILABLE CLASSES</h2>
                    <div className="classes-grid">
                        {classes.map((classItem) => {
                            const hasAccess = canAccessClass(classItem.requiredLevel);
                            const isLocked = isAuthenticated && !hasAccess;

                            return (
                                <div
                                    key={classItem.id}
                                    className={`class-card ${isLocked ? 'locked' : ''}`}
                                    onClick={() => setSelectedClass(classItem)}
                                >
                                    <div className="class-image" style={{ backgroundImage: `url(${classItem.image})` }}>
                                        {isLocked && (
                                            <div className="locked-overlay">
                                                <span className="lock-icon">🔒</span>
                                                <p>{getUpgradeMessage(classItem.requiredLevel)}</p>
                                            </div>
                                        )}
                                        <div className="class-badge">{classItem.intensity}</div>
                                    </div>
                                    <div className="class-content">
                                        <h3>{classItem.name}</h3>
                                        <p className="class-description">{classItem.description}</p>
                                        <div className="class-details">
                                            <div className="detail-item">
                                                <span className="detail-label">Coach:</span>
                                                <span>{classItem.coach}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Duration:</span>
                                                <span>{classItem.duration}</span>
                                            </div>
                                            <div className="class-schedule">
                                                {classItem.schedule.map((time, idx) => (
                                                    <div key={idx} className="schedule-item">{time}</div>
                                                ))}
                                            </div>
                                        </div>
                                        {isAuthenticated && hasAccess && (
                                            <button className="book-btn">BOOK CLASS</button>
                                        )}
                                        {!isAuthenticated && (
                                            <Link to="/registration" className="book-btn">JOIN NOW</Link>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Coaches Section */}
            <section className="coaches-section">
                <div className="container">
                    <h2 className="section-title">OUR EXPERT COACHES</h2>
                    <div className="coaches-grid">
                        {coaches.map((coach, idx) => (
                            <div key={idx} className="coach-card">
                                <div className="coach-avatar">{coach.name.split(' ').map(n => n[0]).join('')}</div>
                                <h3>{coach.name}</h3>
                                <p className="coach-specialty">{coach.specialty}</p>
                                <p className="coach-experience">{coach.experience} Experience</p>
                                <p className="coach-certs">{coach.certifications}</p>
                                <p className="coach-bio">{coach.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Membership Levels Section */}
            <section className="membership-section">
                <div className="container">
                    <h2 className="section-title">
                        {isAuthenticated ? "UPGRADE YOUR MEMBERSHIP" : "MEMBERSHIP LEVELS"}
                    </h2>
                    <div className="membership-grid">
                        {membershipLevels.map((membership) => {
                            const isCurrentLevel = user?.membershipLevel === membership.level;

                            return (
                                <div
                                    key={membership.level}
                                    className={`membership-card ${isCurrentLevel ? 'current' : ''}`}
                                >
                                    {isCurrentLevel && <div className="current-badge">CURRENT PLAN</div>}
                                    <h3 className="membership-name">{membership.name}</h3>
                                    <div className="membership-price">
                                        <span className="price-amount">${membership.price}</span>
                                        <span className="price-period">/month</span>
                                    </div>
                                    <p className="membership-access">{membership.classAccess}</p>
                                    <ul className="membership-features">
                                        {membership.features.map((feature, idx) => (
                                            <li key={idx}>✓ {feature}</li>
                                        ))}
                                    </ul>
                                    {!isAuthenticated && (
                                        <Link to="/registration" className="membership-btn">
                                            SELECT PLAN
                                        </Link>
                                    )}
                                    {isAuthenticated && !isCurrentLevel && (
                                        <button className="membership-btn">
                                            {membership.level === "basic" ? "DOWNGRADE" : "UPGRADE"}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Class Details Modal */}
            {selectedClass && (
                <div className="modal-overlay" onClick={() => setSelectedClass(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedClass(null)}>✕</button>
                        <h2>{selectedClass.name}</h2>
                        <img src={selectedClass.image} alt={selectedClass.name} className="modal-image" />
                        <p className="modal-description">{selectedClass.description}</p>
                        <div className="modal-details">
                            <div><strong>Coach:</strong> {selectedClass.coach}</div>
                            <div><strong>Duration:</strong> {selectedClass.duration}</div>
                            <div><strong>Intensity:</strong> {selectedClass.intensity}</div>
                            <div><strong>Required Level:</strong> {selectedClass.requiredLevel.toUpperCase()}</div>
                        </div>
                        <div className="modal-schedule">
                            <strong>Schedule:</strong>
                            {selectedClass.schedule.map((time, idx) => (
                                <div key={idx}>{time}</div>
                            ))}
                        </div>
                        {isAuthenticated && canAccessClass(selectedClass.requiredLevel) && (
                            <button className="modal-book-btn">BOOK THIS CLASS</button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
