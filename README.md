# DS Digital solutions Connect Registration

This is an elegant web application for managing attendee registrations for DS Digital solutions Connect. It features a clean, modern user interface and leverages the Gemini API to provide personalized session and networking suggestions to attendees based on their professional background and challenges.

## ✨ Features

-   **Modern Registration Form**: A sleek, user-friendly form for collecting attendee information, including personal details, profession, and business address.
-   **AI-Powered Suggestions**: Integrates with the Google Gemini API to generate personalized summit session recommendations.
-   **Persistent Serverless Database**: Attendee data is stored centrally in Vercel KV, a Redis-compatible database, ensuring data is consistent and accessible across all devices.
-   **Admin Attendee List**: A private, secure dashboard to view and manage all registered attendees.
-   **Responsive Design**: The application is fully responsive and works beautifully on all screen sizes, from mobile phones to desktops.
-   **Built with Modern Tech**: Crafted with React, TypeScript, and Vite for a fast, reliable, and scalable development experience.

## 🚀 Tech Stack

-   **Frontend**: React, TypeScript, Tailwind CSS
-   **Build Tool**: Vite
-   **Database**: Vercel KV
-   **AI**: Google Gemini API (`gemini-2.5-flash`)
-   **Deployment**: Vercel (Frontend and Serverless Functions)

## 🛠️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later recommended)
-   [npm](https://www.npmjs.com/) or a compatible package manager
-   A Google Gemini API Key
-   A Vercel account with a KV Database created

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ds-digital-solutions-connect-registration.git
    cd ds-digital-solutions-connect-registration
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a file named `.env.development.local` in the root of your project. Add your Google Gemini API key and your Vercel KV store connection details.
    ```
    # Google Gemini API Key
    API_KEY="YOUR_GEMINI_API_KEY"

    # Vercel KV Database
    KV_URL="YOUR_KV_URL"
    KV_REST_API_URL="YOUR_KV_REST_API_URL"
    KV_REST_API_TOKEN="YOUR_KV_REST_API_TOKEN"
    KV_REST_API_READ_ONLY_TOKEN="YOUR_KV_REST_API_READ_ONLY_TOKEN"
    ```

4.  **Run the development server:**

    To run the frontend and the serverless function locally, you'll need the Vercel CLI.

    ```bash
    npm i -g vercel
    vercel dev
    ```
    This will start the development server, typically at `http://localhost:3000`. The Vite frontend will be available on a different port but will be proxied correctly.

## 🚢 Deployment

This application is optimized for deployment on [Vercel](https://vercel.com/).

1.  Push your code to a GitHub repository.
2.  Import the repository into your Vercel dashboard.
3.  Connect your Vercel KV database in the project's storage settings.
4.  Add your `API_KEY` as an environment variable in the Vercel project settings. The KV variables will be added automatically when you connect the database.
5.  Deploy! Your application will be live.