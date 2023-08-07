# Flight-Plan-Project

Process flight plans obtained from an API and graphically display the coordinates of the flight path on an interactive map.

## Tech Stack

### Frontend

-   React
-   Typescript
-   React Simple Maps
-   Material UI

### Backend

-   Express
-   Node
-   Javascript

### CI/CD

-   Docker
-   Github Actions

## Getting Started

### Install dependencies

-   In the backend and frontend directory

```
npm install
```

### Run tests

-   In the backend and frontend directory

```
npm test
```

### Start frontend/backend individually

-   In the backend or frontend directory

```
npm start
```

### Run Both Containers locally

```
docker compose up -d
```

## API EndPoints

#### Flights

| Method | URL                               | Description                                                               |
| ------ | --------------------------------- | ------------------------------------------------------------------------- |
| `GET`  | `/flights/display`                | Retrieve all flight plans.                                                |
| `GET`  | `/flights/display/path/:flightId` | Retrieve flight path (with coordinates) of flight plan with id #flightId. |
