export const sendConfirmationSms = async (phoneNumber: string, message: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch('/api/send-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to: phoneNumber, body: message }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('SMS API Error:', errorData.error);
        return { success: false, error: errorData.error || `SMS API request failed with status ${response.status}` };
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending confirmation SMS:", error);
    return { success: false, error: "An unexpected error occurred while trying to send the SMS." };
  }
};
