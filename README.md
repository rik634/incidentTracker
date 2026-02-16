# Incident Tracker System

A modern, full-stack incident management dashboard designed for high-availability system monitoring. Built with a focus on clean UX, server-side performance, and robust data integrity.

## 🚀 Setup and Run Instructions

### Prerequisites
* Java 17 or higher
* Node.js 18 or higher
* Gradle (built-in wrapper provided)

### Backend (Spring Boot)
1. Navigate to the root directory.
2. Ensure your database configuration is set in `src/main/resources/application.properties`.
3. Run the application:
   ```bash
   ./gradlew bootRun

4. The API will be available at http://localhost:8080.
Note: On startup, the system automatically seeds ~200 records to demonstrate pagination and filtering.

### Frontend (React+Vite)
1. Navigate to the frontend folder.
2. Install dependencies:
   ```bash
   npm install
3. Start the development server:
   ```bash
   npm run dev
5. Open your browser to http://localhost:5173.

### API Overview

- GET: `/api/incidents`
  - Fetches paginated incidents with support for search, status, service, and severity filters
- POST: `/api/incidents`
  - Creates a new incident. Validates that the owner (if provided) is a valid email.
- GET: `/api/incidents/{id}`
  - Retrieves detailed information for a specific incident.
- PUT: `/api/incidents/{id}`
  - Updates incident details (Status, Owner, Summary.

### Design Decision and tradeoffs:
1. Automatic "Live" Search with Debouncing
   - Decision: Implemented a 400ms debounce on the search and filter inputs.
   - Tradeoff: While a manual "Filter" button uses fewer API calls, a debounced live search provides a much snappier, "Stripe-like" experience. The debounce ensures that we don't overwhelm the database with requests on every single keystroke.

2. Server-Side Pagination & JPA Specifications
   - Decision: Used JPA Specifications for dynamic query building and handled all pagination on the backend.
   - Tradeoff: Client-side pagination is easier to build but fails as the dataset grows. Server-side pagination ensures the app stays fast even with 100,000+ incidents, at the cost of slightly more complex state management in React.

3. API Design: Flat DTOs vs. Nested Entities
   - Decision: Used flat Data Transfer Objects (DTOs) for the API response instead of returning the raw JPA Entities.
   - Tradeoff: This requires extra mapping code (using a mapper or manual conversion), but it decouples the database schema from the frontend. This prevents "over-posting" security vulnerabilities and ensures that if we change a column name in the database, the frontend doesn't immediately crash.

4. UI Consistency: Tailwind Utility Classes vs. Styled Components
   - Decision: Used Tailwind CSS for all styling.
   - Tradeoff: Tailwind can make the JSX look "busy" with many class names, but it ensures zero runtime CSS overhead and extremely fast prototyping. It allowed me to build a consistent "Enterprise Gray" aesthetic that matches professional monitoring tools like Datadog or PagerDuty without writing a single line of custom CSS.

5. Database Decision: PostgreSQL vs. MySQL
   - Decision: Used PostgreSQL for its strict schema enforcement and MVCC (Multi-Version Concurrency Control).
   - Tradeoff: PostgreSQL is slightly more resource-intensive than MySQL, but it provides superior data integrity and advanced indexing (like GIN for text search), which is critical for an audit-ready system like an incident tracker.
  
### Improvements 

1. Security (JWT/RBAC): Implement JSON Web Tokens and Role-Based Access Control to distinguish between Viewers, Engineers, and Admins.
2. Real-Time Updates: Add WebSockets to push "New Incident" alerts to the dashboard instantly for critical SEV1 issues.
3. Observability: Integrate Micrometer and Prometheus to track MTTR (Mean Time to Resolution) and incident frequency metrics.
4. Rate Limiting: Add Bucket4j to protect the API from automated scripts or malicious traffic.
5. Advanced Error Handling: Implement a global Frontend Error Boundary and backend @ControllerAdvice to provide specific user feedback for all failure scenarios.
