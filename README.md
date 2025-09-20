# DS Digital solutions Connect Registration

This is an elegant web application for managing attendee registrations for DS Digital solutions Connect. It features a clean, modern user interface and leverages the Gemini API to provide personalized session and networking suggestions to attendees based on their professional background and challenges.

## ✨ Features

-   **Modern Registration Form**: A sleek, user-friendly form for collecting attendee information, including personal details, profession, and business address.
-   **AI-Powered Suggestions**: Integrates with the Google Gemini API to generate personalized summit session recommendations.
-   **Local Storage Persistence**: Attendee data is saved in the browser's local storage, so registrations are not lost on page reload.
-   **Admin Attendee List**: A private view to see all registered attendees in a clean, sortable table.
-   **Responsive Design**: The application is fully responsive and works beautifully on all screen sizes, from mobile phones to desktops.
-   **Built with Modern Tech**: Crafted with React, TypeScript, and Vite for a fast, reliable, and scalable development experience.

## 🚀 Tech Stack

-   **Frontend**: React, TypeScript, Tailwind CSS
-   **Build Tool**: Vite
-   **AI**: Google Gemini API (`gemini-2.5-flash`)
-   **Deployment**: Vercel (Frontend and Serverless Functions)

## 🛠️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later recommended)
-   [npm](https://www.npmjs.com/) or a compatible package manager
-   A Google Gemini API Key

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

    Create a file named `.env` in the root of your project and add your Google Gemini API key:
    ```
    # Google Gemini API Key
    API_KEY="YOUR_GEMINI_API_KEY"
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
3.  Vercel will automatically detect that it is a Vite application and configure the build settings.
4.  Add your `API_KEY` as an environment variable in the Vercel project settings.
5.  Deploy! Your application will be live.