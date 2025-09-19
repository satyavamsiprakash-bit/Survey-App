export const getSummitSuggestions = async (profession: string, challenges: string): Promise<string> => {
  try {
    const response = await fetch('/api/suggest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ profession, challenges }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData.error);
        throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.suggestions;
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return "Thank you for registering! We're excited to have you at the summit. We couldn't generate custom suggestions at this time, but please check the event schedule for sessions relevant to your interests.";
  }
};