// Wger API Service
// Documentation: https://wger.de/api/v2/

const WGER_BASE_URL = "https://wger.de/api/v2";

/**
 * Fetch exercises from Wger API
 * @param {Object} filters - Filter parameters
 * @returns {Promise} - Array of exercises
 */
export const getExercises = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.search) params.append("search", filters.search);
    if (filters.muscle) params.append("muscles", filters.muscle);
    if (filters.equipment) params.append("equipment", filters.equipment);
    if (filters.category) params.append("category", filters.category);

    const limit = filters.limit || 20;
    const offset = filters.offset || 0;

    params.append("limit", limit);
    params.append("offset", offset);

    // Force English language for consistent names
    params.append("language", "2");
    const response = await fetch(`${WGER_BASE_URL}/exercise/?${params}`);
    if (!response.ok) throw new Error("Failed to fetch exercises");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching exercises:", error);
    throw error;
  }
};

/**
 * Get single exercise details
 * @param {number} exerciseId - Exercise ID
 * @returns {Promise} - Exercise details
 */
export const getExerciseDetails = async (exerciseId) => {
  try {
    const response = await fetch(
      `${WGER_BASE_URL}/exercise/${exerciseId}/?language=2`,
    );
    if (!response.ok) throw new Error("Failed to fetch exercise details");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching exercise details:", error);
    throw error;
  }
};

/**
 * Get all muscle groups
 * @returns {Promise} - Array of muscle groups
 */
export const getMuscles = async () => {
  try {
    const response = await fetch(`${WGER_BASE_URL}/muscle/?limit=100`);
    if (!response.ok) throw new Error("Failed to fetch muscles");

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching muscles:", error);
    throw error;
  }
};

/**
 * Get all equipment types
 * @returns {Promise} - Array of equipment
 */
export const getEquipment = async () => {
  try {
    const response = await fetch(`${WGER_BASE_URL}/equipment/?limit=100`);
    if (!response.ok) throw new Error("Failed to fetch equipment");

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching equipment:", error);
    throw error;
  }
};

/**
 * Get exercise categories
 * @returns {Promise} - Array of categories
 */
export const getExerciseCategories = async () => {
  try {
    const response = await fetch(
      `${WGER_BASE_URL}/exercisecategory/?limit=100`,
    );
    if (!response.ok) throw new Error("Failed to fetch categories");

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

/**
 * Get exercise images
 * @param {number} exerciseId - Exercise ID
 * @returns {Promise} - Array of images
 */
export const getExerciseImages = async (exerciseId) => {
  try {
    const response = await fetch(
      `${WGER_BASE_URL}/exerciseimage/?exercise=${exerciseId}&limit=10`,
    );
    if (!response.ok) throw new Error("Failed to fetch exercise images");

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching exercise images:", error);
    throw error;
  }
};
