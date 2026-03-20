export const buildTravelPrompt = ({
  budget,
  days,
  travelStyle,
  groupType,
  currentCity
}) => {

  return `
You are an expert travel planner.

Plan a detailed trip based on the user details.

User Details:
Budget: ₹${budget}
Trip Duration: ${days} days
Travel Style: ${travelStyle}
Group Type: ${groupType}
Starting City: ${currentCity}

Choose the best travel destination within 500km from the starting city.

Return ONLY valid JSON in this exact format:

{
  "destination": "",
  "latitude": 0,
  "longitude": 0,

  "reason": "",

  "imageKeywords": [],

  "hotels": [
    {
      "name": "",
      "priceRange": "",
      "description": ""
    }
  ],

  "restaurants": [
    {
      "name": "",
      "specialty": "",
      "location": ""
    }
  ],

  "itinerary": [
    {
      "day": 1,
      "morning": "",
      "afternoon": "",
      "evening": "",
      "activities": [],
      "places": []
    }
  ],

  "budgetBreakdown": {
    "transport": "",
    "accommodation": "",
    "food": "",
    "activities": ""
  },

  "travelTips": [],

  "bestTimeToVisit": "",
  "recommendedTransport": ""
}

Rules:
- No markdown
- No explanation
- Only JSON
`;
};