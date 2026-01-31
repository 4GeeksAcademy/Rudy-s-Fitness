import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { getExercises, getMuscles, getEquipment, getExerciseImages } from "../services/wgerService.js";
import "../../styles/exercises.css";

export const Exercises = () => {
    const { store } = useGlobalReducer();
    const { isAuthenticated, user } = store;
    const [exercises, setExercises] = useState([]);
    const [muscles, setMuscles] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [myRoutine, setMyRoutine] = useState([]);
    const [showFiltersModal, setShowFiltersModal] = useState(false);
    const [filters, setFilters] = useState({
        search: "",
        muscle: "",
        equipment: ""
    });

    // Load initial data
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [musclesData, equipmentData, exercisesData] = await Promise.all([
                    getMuscles(),
                    getEquipment(),
                    getExercises({ limit: 20 })
                ]);

                setMuscles(musclesData);
                setEquipment(equipmentData);
                // Enrich exercises with normalized names and images
                const enriched = await enrichExercises(exercisesData.results);
                setExercises(enriched);
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Handle search and filters
    const handleSearch = async () => {
        try {
            setLoading(true);
            const result = await getExercises({
                search: filters.search,
                muscle: filters.muscle,
                equipment: filters.equipment,
                limit: 20
            });
            const enriched = await enrichExercises(result.results);
            setExercises(enriched);
        } catch (error) {
            console.error('Error searching exercises:', error);
        } finally {
            setLoading(false);
        }
    };

    // Helper: enrich exercises with fallback name and main image
    const enrichExercises = async (list) => {
        // First pass: ensure name, fetch when missing
        const withNames = await Promise.all(list.map(async (ex) => {
            if (ex.name && ex.name.trim() !== '') return ex;
            try {
                const details = await getExerciseDetails(ex.id);
                if (details && details.name) return { ...ex, name: details.name };
            } catch (_) {
                // ignore and fallback below
            }
            return { ...ex, name: `Exercise #${ex.id}` };
        }));

        // Second pass: attach images
        const withImages = await Promise.all(withNames.map(async (ex) => {
            try {
                const imgs = await getExerciseImages(ex.id);
                const main = imgs.find(i => i.is_main) || imgs[0];
                return { ...ex, image: main ? main.image : null };
            } catch (_) {
                return { ...ex, image: null };
            }
        }));

        return withImages;
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const getMuscleLabel = (muscleId) => {
        const muscle = muscles.find(m => m.id === parseInt(muscleId));
        return muscle ? muscle.name : 'Unknown';
    };

    const getEquipmentLabel = (equipmentId) => {
        const equip = equipment.find(e => e.id === parseInt(equipmentId));
        return equip ? equip.name : 'Bodyweight';
    };

    const handleAddToRoutine = (exercise) => {
        // Check if exercise already exists in routine
        const exists = myRoutine.find(ex => ex.id === exercise.id);
        if (!exists) {
            setMyRoutine(prev => [...prev, exercise]);
            alert(`${exercise.name} added to your routine!`);
        } else {
            alert(`${exercise.name} is already in your routine!`);
        }
        setSelectedExercise(null);
    };

    const handleRemoveFromRoutine = (exerciseId) => {
        setMyRoutine(prev => prev.filter(ex => ex.id !== exerciseId));
    };

    const handleClearRoutine = () => {
        if (window.confirm('Are you sure you want to clear your entire routine?')) {
            setMyRoutine([]);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="exercises-container">
                <section className="exercises-hero">
                    <div className="exercises-hero-overlay">
                        <h1>TRAINING EXERCISES</h1>
                        <p>Sign in to access personalized workout routines</p>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="exercises-container">
            {/* Hero Section */}
            <section className="exercises-hero">
                <div className="exercises-hero-overlay">
                    <h1>TRAINING EXERCISES</h1>
                    <p>Explore and master exercises from our comprehensive library</p>
                </div>
            </section>

            <div className="exercises-content">
                {/* Filter Section */}
                <div className="filter-section">
                    <button
                        className="filter-btn-sidebar"
                        onClick={() => setShowFiltersModal(true)}
                    >
                        🔍 FILTER
                    </button>
                </div>

                {/* My Routine Sidebar */}
                <aside className="routine-sidebar">
                    {/* My Routine Section */}
                    {myRoutine.length > 0 && (
                        <div className="my-routine-box">
                            <div className="routine-header">
                                <h3>MY ROUTINE</h3>
                                <button
                                    className="clear-routine-btn"
                                    onClick={handleClearRoutine}
                                    title="Clear all exercises"
                                >
                                    Clear All
                                </button>
                            </div>
                            <div className="routine-list">
                                {myRoutine.map((exercise) => {
                                    const exerciseName = exercise.name || exercise.exercise_name || `Exercise #${exercise.id}`;
                                    return (
                                        <div key={exercise.id} className="routine-item">
                                            <div className="routine-item-content">
                                                <span className="routine-item-name">{exerciseName}</span>
                                                {exercise.muscles && exercise.muscles.length > 0 && (
                                                    <span className="routine-item-muscle">
                                                        {getMuscleLabel(exercise.muscles[0])}
                                                    </span>
                                                )}
                                            </div>
                                            <button
                                                className="remove-btn"
                                                onClick={() => handleRemoveFromRoutine(exercise.id)}
                                                title="Remove from routine"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="routine-footer">
                                <span className="routine-count">{myRoutine.length} exercise{myRoutine.length !== 1 ? 's' : ''}</span>
                            </div>
                        </div>
                    )}
                    {myRoutine.length === 0 && (
                        <div className="empty-routine-sidebar">
                            <p>Add exercises to build your routine</p>
                        </div>
                    )}
                </aside>

                {/* Exercises Grid */}
                <main className="exercises-main">
                    {loading ? (
                        <div className="loading">
                            <p>Loading exercises...</p>
                        </div>
                    ) : exercises.length > 0 ? (
                        <div className="exercises-grid">
                            {exercises.map((exercise) => (
                                <div
                                    key={exercise.id}
                                    className="exercise-card"
                                    onClick={() => setSelectedExercise(exercise)}
                                >
                                    <div className="exercise-preview">
                                        {exercise.image ? (
                                            <img src={exercise.image} alt={exercise.name} />
                                        ) : (
                                            <div className="no-image">No Image</div>
                                        )}
                                    </div>
                                    <div className="exercise-info">
                                        <h3>{exercise.name}</h3>
                                        <div className="exercise-meta">
                                            {exercise.muscles && exercise.muscles.length > 0 && (
                                                <div className="meta-item">
                                                    <span className="meta-label">Muscles:</span>
                                                    <span>{exercise.muscles.map(m => getMuscleLabel(m)).join(', ')}</span>
                                                </div>
                                            )}
                                            {exercise.equipment && exercise.equipment.length > 0 && (
                                                <div className="meta-item">
                                                    <span className="meta-label">Equipment:</span>
                                                    <span>{exercise.equipment.map(e => getEquipmentLabel(e)).join(', ')}</span>
                                                </div>
                                            )}
                                        </div>
                                        <button className="view-btn">VIEW DETAILS</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-results">
                            <p>No exercises found. Try different filters.</p>
                        </div>
                    )}
                </main>
            </div>

            {/* Filters Modal */}
            {showFiltersModal && (
                <div className="modal-overlay" onClick={() => setShowFiltersModal(false)}>
                    <div className="modal-content filters-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowFiltersModal(false)}>✕</button>

                        <div className="modal-header">
                            <h2>FILTER EXERCISES</h2>
                        </div>

                        <div className="modal-filters">
                            <div className="filter-group">
                                <label htmlFor="search">Search</label>
                                <input
                                    type="text"
                                    id="search"
                                    name="search"
                                    value={filters.search}
                                    onChange={handleFilterChange}
                                    placeholder="Exercise name..."
                                />
                            </div>

                            <div className="filter-group">
                                <label htmlFor="muscle">Muscle Group</label>
                                <select
                                    id="muscle"
                                    name="muscle"
                                    value={filters.muscle}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">All Muscles</option>
                                    {muscles.map(muscle => (
                                        <option key={muscle.id} value={muscle.id}>
                                            {muscle.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="filter-group">
                                <label htmlFor="equipment">Equipment</label>
                                <select
                                    id="equipment"
                                    name="equipment"
                                    value={filters.equipment}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">All Equipment</option>
                                    {equipment.map(equip => (
                                        <option key={equip.id} value={equip.id}>
                                            {equip.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button
                                className="search-btn"
                                onClick={() => {
                                    handleSearch();
                                    setShowFiltersModal(false);
                                }}
                            >
                                APPLY FILTERS
                            </button>
                            <button
                                className="close-btn"
                                onClick={() => setShowFiltersModal(false)}
                            >
                                CANCEL
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Exercise Details Modal */}
            {selectedExercise && (
                <div className="modal-overlay" onClick={() => setSelectedExercise(null)}>
                    <div className="modal-content exercise-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedExercise(null)}>✕</button>

                        <div className="modal-header">
                            <h2>{selectedExercise.name}</h2>
                        </div>

                        {selectedExercise.image && (
                            <img src={selectedExercise.image} alt={selectedExercise.name} className="modal-exercise-image" />
                        )}

                        <div className="modal-details">
                            {selectedExercise.description && (
                                <div className="detail-section">
                                    <h4>Description</h4>
                                    <p>{selectedExercise.description}</p>
                                </div>
                            )}

                            {selectedExercise.muscles && selectedExercise.muscles.length > 0 && (
                                <div className="detail-section">
                                    <h4>Primary Muscles</h4>
                                    <div className="tags">
                                        {selectedExercise.muscles.map(m => (
                                            <span key={m} className="tag">{getMuscleLabel(m)}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedExercise.equipment && selectedExercise.equipment.length > 0 && (
                                <div className="detail-section">
                                    <h4>Equipment Needed</h4>
                                    <div className="tags">
                                        {selectedExercise.equipment.map(e => (
                                            <span key={e} className="tag equipment-tag">{getEquipmentLabel(e)}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedExercise.category && (
                                <div className="detail-section">
                                    <h4>Category</h4>
                                    <p>{selectedExercise.category}</p>
                                </div>
                            )}
                        </div>

                        <div className="modal-actions">
                            <button
                                className="add-to-routine-btn"
                                onClick={() => handleAddToRoutine(selectedExercise)}
                            >
                                ADD TO MY ROUTINE
                            </button>
                            <button className="close-btn" onClick={() => setSelectedExercise(null)}>CLOSE</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
