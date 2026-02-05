# Habit Flow

This project has been migrated to a React application using Vite.

## Setup

1.  **Fix Permissions** (Required due to system error):
    Run this command in your terminal to fix the npm cache permissions:
    ```bash
    sudo chown -R 501:20 "/Users/ysf/.npm"
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## Structure

- **src/components/MainPanel.jsx**: Contains the main lists (Tasks, Goals, Reminders, Habits) and routing.
- **src/components/CalendarWidget.jsx**: The calendar component.
- **src/components/UpcomingWidget.jsx**: The upcoming events side panel.
- **src/App.jsx**: Main application layout and state management.
