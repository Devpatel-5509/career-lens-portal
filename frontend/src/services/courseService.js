export const fetchCourses = async (skills = []) => {
  try {
    // ✅ Fallback query if no skills
    const searchQuery =
      skills.length > 0 ? skills.join(" ") : "programming";

    const response = await fetch(
      `http://localhost:5000/api/courses/search-courses?query=${encodeURIComponent(
        searchQuery
      )}`
    );

    const data = await response.json();

    // ✅ SUPPORT MULTIPLE BACKEND RESPONSE SHAPES
    if (Array.isArray(data.results)) {
      return data.results;
    }

    if (Array.isArray(data.courses)) {
      return data.courses;
    }

    // 🔴 If backend returns nothing usable
    return [];
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
};
