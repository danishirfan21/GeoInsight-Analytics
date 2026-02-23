# GeoInsight Analytics

GeoInsight Analytics is a production-grade real estate analytics dashboard that provides interactive visualizations of property listings, price trends, and regional performance metrics.

## Features

- **Interactive Map:** Visualize property locations with density-based heatmap mode.
- **Dynamic Charts:**
  - **Price Trends:** Monthly average price changes.
  - **Property Type Distribution:** Breakdown of listings by category.
  - **Region Comparison:** Comparative analysis of property values across different areas.
- **Advanced Filtering:** Filter all data by Region, Property Type, and Price range.
- **Role-Based Access Control (RBAC):**
  - **Viewer:** Standard access to dashboard and charts.
  - **Admin:** Access to exclusive "Region Performance Metrics" table and elevated analytics.
- **Performance Optimized:** API caching for analytics queries and debounced filter updates.

## Tech Stack

- **Frontend:** React 19, Material UI, Recharts, Leaflet.
- **Backend:** Node.js, Express, MongoDB (In-Memory for demo).
- **Security:** JWT Authentication, Password Hashing (bcrypt).

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   # Root directory
   npm install
   # Backend
   cd backend && npm install
   # Frontend
   cd ../frontend && npm install
   ```

### Running the Application

1. **Seed the database:**
   ```bash
   cd backend
   node scripts/seed.js
   ```
2. **Start the backend:**
   ```bash
   npm start
   ```
3. **Start the frontend:**
   ```bash
   cd ../frontend
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## User Roles

| Role   | Email                  | Password   |
|--------|------------------------|------------|
| Admin  | admin@geoinsight.com   | admin123   |
| Viewer | viewer@geoinsight.com  | viewer123  |

## Project Structure

- `backend/`: Express server, models, and routes.
- `frontend/src/components/`: Reusable UI components (Map, Charts, Filters).
- `frontend/src/pages/`: Main application pages (Login, Register, Dashboard).
- `frontend/src/context/`: Auth state management.
