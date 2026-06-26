export const getRecommendations = async (skills) => {
  const response = await fetch("http://localhost:5000/api/recommendation/recommend", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ skills })
  });

  return response.json();
};