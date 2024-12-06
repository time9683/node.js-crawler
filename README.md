# Node.js Crawler

## Description
This project is a Node.js application that crawls rates and stores them in a database. It also provides an API to access the stored rates.

## Setup Instructions

### Prerequisites
- Node.js 22.x
- npm or pnpm

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/time9683/node.js-crawler
    cd node.js-crawler
    ```

2. Install dependencies:
    ```sh
    pnpm install
    ```


### Running the Application

1. Start the development server and initialize the database:
    ```sh
    pnpm run dev
    ```

2. The server will start on port 3000 by default. You can access the API documentation at:
    ```
    http://localhost:3000/api-docs
    ```

### Scripts

- `pnpm run dev`: Starts the development server.
- `pnpm run test`: Runs the tests.
- `pnpm run fake`: Generates fake data.

### API Endpoints

- `GET /api/rates/current`: Retrieves the stored rates.
- `GET /api/rates/history`: Retrieves the stored rates within a date range.

### Database

The application uses SQLite3 as the database. The database file will be created and initialized automatically when you run the application.

### Error Handling

All errors are logged using the custom logger service.

### Swagger

Swagger is used for API documentation. You can access the Swagger UI at `/api-docs`.

