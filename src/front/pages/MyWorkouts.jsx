import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import "../../styles/my-workouts.css";

export const MyWorkouts = () => {
    const { store } = useGlobalReducer();
    const { user, isAuthenticated } = store;
    const [coachingSessions, setCoachingSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [joinedSessions, setJoinedSessions] = useState({});

    // Coaching sessions data
    useEffect(() => {
        // In a real app, this would come from the backend
        setCoachingSessions([
            {
                id: 101,
                name: "HIIT Cardio Blast",
                coach: "Sarah Martinez",
                coachImage: "S",
                date: "2024-12-20",
                time: "6:00 PM",
                duration: "45 min",
                intensity: "Very High",
                maxParticipants: 20,
                currentParticipants: 15,
                description: "High-intensity interval training to maximize fat burn",
                exercises: [
                    { name: "Jumping Jacks", duration: "30s" },
                    { name: "Burpees", duration: "30s" },
                    { name: "Mountain Climbers", duration: "30s" },
                    { name: "High Knees", duration: "30s" },
                    { name: "Rest", duration: "30s" },
                ],
            },
            {
                id: 102,
                name: "Spinning Class",
                coach: "Maria Santos",
                coachImage: "M",
                date: "2024-12-21",
                time: "7:00 PM",
                duration: "50 min",
                intensity: "High",
                maxParticipants: 30,
                currentParticipants: 22,
                description: "Indoor cycling session with motivating music",
                exercises: [
                    { name: "Warm-up", duration: "5 min" },
                    { name: "Hill Climbs", duration: "15 min" },
                    { name: "Speed Intervals", duration: "20 min" },
                    { name: "Cool Down", duration: "10 min" },
                ],
            },
            {
                id: 103,
                name: "Boxing Circuit",
                coach: "Carlos Rodriguez",
                coachImage: "C",
                date: "2024-12-22",
                time: "5:00 PM",
                duration: "60 min",
                intensity: "High",
                maxParticipants: 12,
                currentParticipants: 8,
                description: "Combine boxing techniques with circuit training",
                exercises: [
                    { name: "Speed Bag", duration: "2 min" },
                    { name: "Heavy Bag", duration: "3 min" },
                    { name: "Double-End Bag", duration: "2 min" },
                    { name: "Circuit Station", duration: "3 min" },
                ],
            },
        ]);
    }, []);

    const handleJoinSession = (sessionId) => {
        setJoinedSessions((prev) => ({
            ...prev,
            [sessionId]: !prev[sessionId],
        }));
        const isJoining = !joinedSessions[sessionId];
        alert(isJoining ? `Successfully joined the session!` : `You have left the session`);
    };

    if (!isAuthenticated || user?.userType === "coach") {
        return (
            <div className="workouts-container">
                <div className="access-denied">
                    <h2>Access Denied</h2>
                    <p>This page is for customers only. Please log in as a customer.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="workouts-container">
            {/* Hero Section */}
            <div className="workouts-hero">
                <div className="workouts-hero-overlay">
                    <h1>COACHING SESSIONS</h1>
                    <p>Join upcoming sessions with our expert coaches</p>
                </div>
            </div>

            {/* Content */}
            <div className="workouts-content">
                {/* Coaching Sessions Section */}
                {coachingSessions.length === 0 ? (
                    <div className="no-workouts">
                        <h2>No Available Sessions</h2>
                        <p>Check back soon for upcoming coaching sessions!</p>
                    </div>
                ) : (
                    <div className="sessions-grid">
                        {coachingSessions.map((session) => (
                            <div
                                key={session.id}
                                className={`session-card ${joinedSessions[session.id] ? 'joined' : ''}`}
                            >
                                {/* Card Header */}
                                <div className="session-card-header">
                                    <div>
                                        <h3>{session.name}</h3>
                                        <p className="session-date-time">{session.date} at {session.time}</p>
                                    </div>
                                    <div className="session-coach">
                                        <div className="coach-avatar">{session.coachImage}</div>
                                        <span>{session.coach}</span>
                                    </div>
                                </div>

                                {/* Session Details */}
                                <div className="session-details">
                                    <div className="session-info">
                                        <span className="info-label">Duration:</span>
                                        <span>{session.duration}</span>
                                    </div>
                                    <div className="session-info">
                                        <span className="info-label">Intensity:</span>
                                        <span className="intensity-badge">{session.intensity}</span>
                                    </div>
                                    <div className="session-info">
                                        <span className="info-label">Participants:</span>
                                        <span>{session.currentParticipants} / {session.maxParticipants}</span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="session-description">{session.description}</p>

                                {/* Actions */}
                                <div className="session-actions">
                                    <button
                                        type="button"
                                        className="join-btn"
                                        onClick={() => handleJoinSession(session.id)}
                                    >
                                        {joinedSessions[session.id] ? 'LEAVE SESSION' : 'JOIN SESSION'}
                                    </button>
                                    <button
                                        type="button"
                                        className="view-session-btn"
                                        onClick={() => setSelectedSession(session)}
                                    >
                                        VIEW DETAILS
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Session Details Modal */}
            {selectedSession && (
                <div className="modal" onClick={() => setSelectedSession(null)}>
                    <div
                        className="modal-content session-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="modal-header">
                            <div className="modal-header-content">
                                <h2>{selectedSession.name}</h2>
                                <div className="modal-coach-info">
                                    <div className="coach-avatar-small">
                                        {selectedSession.coachImage}
                                    </div>
                                    <span>Coach: {selectedSession.coach}</span>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="close-modal"
                                onClick={() => setSelectedSession(null)}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Session Info */}
                        <div className="modal-session-info">
                            <div className="modal-info-item">
                                <strong>Date & Time:</strong> {selectedSession.date} at {selectedSession.time}
                            </div>
                            <div className="modal-info-item">
                                <strong>Duration:</strong> {selectedSession.duration}
                            </div>
                            <div className="modal-info-item">
                                <strong>Intensity:</strong> <span className="intensity-badge">{selectedSession.intensity}</span>
                            </div>
                            <div className="modal-info-item">
                                <strong>Participants:</strong> {selectedSession.currentParticipants} / {selectedSession.maxParticipants}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="modal-description">
                            <h3>About This Session</h3>
                            <p>{selectedSession.description}</p>
                        </div>

                        {/* Exercises List */}
                        <div className="modal-exercises">
                            <h3>Session Activities</h3>
                            <div className="activities-list">
                                {selectedSession.exercises.map((exercise, idx) => (
                                    <div key={idx} className="activity-item">
                                        <span className="activity-number">{idx + 1}</span>
                                        <span className="activity-name">{exercise.name}</span>
                                        <span className="activity-duration">{exercise.duration}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Modal Actions */}
                        <div className="modal-actions">
                            <button
                                type="button"
                                className="join-btn-modal"
                                onClick={() => {
                                    handleJoinSession(selectedSession.id);
                                    setSelectedSession(null);
                                }}
                            >
                                {joinedSessions[selectedSession.id] ? 'LEAVE SESSION' : 'JOIN SESSION'}
                            </button>
                            <button
                                type="button"
                                className="close-btn"
                                onClick={() => setSelectedSession(null)}
                            >
                                CLOSE
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
