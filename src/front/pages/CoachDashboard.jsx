import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { getExercises } from "../services/wgerService.js";
import "../../styles/coach-dashboard.css";

export const CoachDashboard = () => {
    const { store } = useGlobalReducer();
    const { isAuthenticated, user } = store;
    const [activeTab, setActiveTab] = useState("clients"); // clients, create-routine, my-routines
    const [clients, setClients] = useState([]);
    const [routines, setRoutines] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [exercises, setExercises] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [newRoutine, setNewRoutine] = useState({
        name: "",
        clientId: "",
        exercises: []
    });

    // Mock clients data
    useEffect(() => {
        // In a real app, this would come from the backend
        setClients([
            { id: 1, name: "John Smith", email: "john@example.com", membershipLevel: "premium" },
            { id: 2, name: "Sarah Johnson", email: "sarah@example.com", membershipLevel: "vip" },
            { id: 3, name: "Mike Davis", email: "mike@example.com", membershipLevel: "basic" }
        ]);

        // Mock routines data
        setRoutines([
            {
                id: 1,
                name: "Upper Body Strength",
                clientId: 1,
                clientName: "John Smith",
                exercises: 5,
                createdAt: "2025-12-10",
                status: "Active"
            },
            {
                id: 2,
                name: "Cardio & Core",
                clientId: 2,
                clientName: "Sarah Johnson",
                exercises: 4,
                createdAt: "2025-12-12",
                status: "Active"
            }
        ]);
    }, []);

    // Search exercises
    const handleSearchExercises = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim().length > 2) {
            try {
                const result = await getExercises({ search: query, limit: 10 });
                setExercises(result.results);
            } catch (error) {
                console.error('Error searching exercises:', error);
            }
        }
    };

    const addExerciseToRoutine = (exercise) => {
        const exerciseData = {
            id: exercise.id,
            name: exercise.name,
            sets: 3,
            reps: 10,
            rest: 60,
            notes: ""
        };

        setNewRoutine(prev => ({
            ...prev,
            exercises: [...prev.exercises, exerciseData]
        }));

        setSearchQuery("");
        setExercises([]);
    };

    const removeExerciseFromRoutine = (exerciseId) => {
        setNewRoutine(prev => ({
            ...prev,
            exercises: prev.exercises.filter(ex => ex.id !== exerciseId)
        }));
    };

    const updateExerciseDetails = (exerciseId, field, value) => {
        setNewRoutine(prev => ({
            ...prev,
            exercises: prev.exercises.map(ex =>
                ex.id === exerciseId
                    ? { ...ex, [field]: value }
                    : ex
            )
        }));
    };

    const saveRoutine = () => {
        if (!newRoutine.name || !newRoutine.clientId || newRoutine.exercises.length === 0) {
            alert("Please fill in all required fields");
            return;
        }

        // In a real app, this would be sent to the backend
        const routine = {
            id: routines.length + 1,
            ...newRoutine,
            clientName: clients.find(c => c.id === parseInt(newRoutine.clientId))?.name,
            createdAt: new Date().toISOString().split('T')[0],
            status: "Active"
        };

        setRoutines([...routines, routine]);
        setNewRoutine({ name: "", clientId: "", exercises: [] });
        setActiveTab("my-routines");
        alert("Routine created successfully!");
    };

    if (!isAuthenticated || user?.userType !== 'coach') {
        return (
            <div className="coach-container">
                <section className="coach-hero">
                    <h1>COACH DASHBOARD</h1>
                    <p>Only available for coaches</p>
                </section>
            </div>
        );
    }

    return (
        <div className="coach-container">
            {/* Hero Section */}
            <section className="coach-hero">
                <div className="coach-hero-overlay">
                    <h1>COACH DASHBOARD</h1>
                    <p>Manage your clients and create customized training routines</p>
                </div>
            </section>

            <div className="coach-content">
                {/* Navigation Tabs */}
                <div className="coach-tabs">
                    <button
                        className={`tab-btn ${activeTab === "clients" ? "active" : ""}`}
                        onClick={() => setActiveTab("clients")}
                    >
                        MY CLIENTS
                    </button>
                    <button
                        className={`tab-btn ${activeTab === "create-routine" ? "active" : ""}`}
                        onClick={() => setActiveTab("create-routine")}
                    >
                        CREATE ROUTINE
                    </button>
                    <button
                        className={`tab-btn ${activeTab === "my-routines" ? "active" : ""}`}
                        onClick={() => setActiveTab("my-routines")}
                    >
                        MY ROUTINES ({routines.length})
                    </button>
                </div>

                <div className="coach-content-area">
                    {/* Clients Tab */}
                    {activeTab === "clients" && (
                        <section className="clients-section">
                            <h2>YOUR CLIENTS</h2>
                            <div className="clients-grid">
                                {clients.map(client => (
                                    <div key={client.id} className="client-card">
                                        <div className="client-avatar">{client.name.split(' ').map(n => n[0]).join('')}</div>
                                        <h3>{client.name}</h3>
                                        <p className="client-email">{client.email}</p>
                                        <div className="client-membership">
                                            <span className="membership-badge">{client.membershipLevel.toUpperCase()}</span>
                                        </div>
                                        <div className="client-actions">
                                            <button className="action-btn">VIEW PROGRESS</button>
                                            <button className="action-btn">CREATE ROUTINE</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Create Routine Tab */}
                    {activeTab === "create-routine" && (
                        <section className="create-routine-section">
                            <h2>CREATE NEW ROUTINE</h2>

                            <div className="routine-form">
                                <div className="form-group">
                                    <label htmlFor="routineName">Routine Name</label>
                                    <input
                                        type="text"
                                        id="routineName"
                                        value={newRoutine.name}
                                        onChange={(e) => setNewRoutine({ ...newRoutine, name: e.target.value })}
                                        placeholder="e.g., Upper Body Strength"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="clientSelect">Select Client</label>
                                    <select
                                        id="clientSelect"
                                        value={newRoutine.clientId}
                                        onChange={(e) => setNewRoutine({ ...newRoutine, clientId: e.target.value })}
                                    >
                                        <option value="">-- Choose a client --</option>
                                        {clients.map(client => (
                                            <option key={client.id} value={client.id}>
                                                {client.name} ({client.membershipLevel})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="exerciseSearch">Search & Add Exercises</label>
                                    <input
                                        type="text"
                                        id="exerciseSearch"
                                        value={searchQuery}
                                        onChange={handleSearchExercises}
                                        placeholder="Search exercises..."
                                    />

                                    {exercises.length > 0 && (
                                        <div className="search-results">
                                            {exercises.map(exercise => (
                                                <div key={exercise.id} className="search-result-item">
                                                    <div className="result-info">
                                                        <p className="result-name">{exercise.name}</p>
                                                    </div>
                                                    <button
                                                        className="add-btn"
                                                        onClick={() => addExerciseToRoutine(exercise)}
                                                    >
                                                        + ADD
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Selected Exercises */}
                                {newRoutine.exercises.length > 0 && (
                                    <div className="selected-exercises">
                                        <h3>ROUTINE EXERCISES</h3>
                                        <div className="exercises-list">
                                            {newRoutine.exercises.map((exercise, idx) => (
                                                <div key={exercise.id} className="routine-exercise-item">
                                                    <div className="exercise-number">{idx + 1}</div>
                                                    <div className="exercise-details">
                                                        <h4>{exercise.name}</h4>
                                                        <div className="exercise-controls">
                                                            <div className="control-group">
                                                                <label>Sets</label>
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    value={exercise.sets}
                                                                    onChange={(e) => updateExerciseDetails(exercise.id, 'sets', e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="control-group">
                                                                <label>Reps</label>
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    value={exercise.reps}
                                                                    onChange={(e) => updateExerciseDetails(exercise.id, 'reps', e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="control-group">
                                                                <label>Rest (sec)</label>
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    step="10"
                                                                    value={exercise.rest}
                                                                    onChange={(e) => updateExerciseDetails(exercise.id, 'rest', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <textarea
                                                            placeholder="Add notes for this exercise..."
                                                            value={exercise.notes}
                                                            onChange={(e) => updateExerciseDetails(exercise.id, 'notes', e.target.value)}
                                                        />
                                                    </div>
                                                    <button
                                                        className="remove-btn"
                                                        onClick={() => removeExerciseFromRoutine(exercise.id)}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="form-actions">
                                    <button className="save-btn" onClick={saveRoutine}>
                                        SAVE ROUTINE
                                    </button>
                                    <button
                                        className="cancel-btn"
                                        onClick={() => setNewRoutine({ name: "", clientId: "", exercises: [] })}
                                    >
                                        CLEAR
                                    </button>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* My Routines Tab */}
                    {activeTab === "my-routines" && (
                        <section className="my-routines-section">
                            <h2>MY ROUTINES</h2>
                            {routines.length > 0 ? (
                                <div className="routines-grid">
                                    {routines.map(routine => (
                                        <div key={routine.id} className="routine-card">
                                            <div className="routine-header">
                                                <h3>{routine.name}</h3>
                                                <span className={`status-badge ${routine.status.toLowerCase()}`}>
                                                    {routine.status}
                                                </span>
                                            </div>
                                            <p className="routine-client">
                                                <strong>Client:</strong> {routine.clientName}
                                            </p>
                                            <p className="routine-exercises">
                                                <strong>Exercises:</strong> {routine.exercises}
                                            </p>
                                            <p className="routine-date">
                                                <strong>Created:</strong> {routine.createdAt}
                                            </p>
                                            <div className="routine-actions">
                                                <button className="action-btn">EDIT</button>
                                                <button className="action-btn">VIEW</button>
                                                <button className="action-btn danger">DELETE</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-routines">
                                    <p>No routines created yet. Start by creating a new routine!</p>
                                </div>
                            )}
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};
