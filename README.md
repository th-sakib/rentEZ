# RentEZ - A car renting platform

[live link](asdf);

## Features

- Auth - register, login, jwt authentication, role based api
- User management - user deletion, user profile update
- Booking management - create, update, delete bookings
- Vehicle inventory - create, update, delete vehicles

## Tech Stack

- Typescript
- ExpressJS
- PostgressSQL
- bcryptJS
- jsonwebtoken

## Installation

### 1. Clone the repository

```bash
git clone git@github.com:th-sakib/rentEZ.git
cd rentEZ
```

### 2. install dependencies

```bash
npm i
```

### 3. Create env

```ini
PORT=5000
CONNECTION_STR=your_db_string
JWT_SECRET=your_secret
```

### 4. Run the project

```bash
npm run dev
```

## API Usage

### Base URL

/api/v1

### Authentication

- `POST /auth/signup`
- `POST /auth/signin`

### User Management

- `GET /users`(ADMIN)
- `PUT /users/:userId`
- `DELETE /users/:userId`

### Vehicles

- `POST /vehicles`(ADMIN)
- `GET /vehicles`
- `GET /vehicles/:vehicleId`
- `PUT /vehicles/:vehicleId`(ADMIN)
- `DELETE /vehicles/:vehicleId`(ADMIN)

### Bookings

- `POST /bookings`
- `GET /bookings`
- `PUT /bookings/:bookingId`
