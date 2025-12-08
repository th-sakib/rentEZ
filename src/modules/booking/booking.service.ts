import { pool } from "../../config/db";

const createBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;
  if (!(customer_id || vehicle_id || rent_start_date || rent_end_date)) {
    throw new Error("Required field is not provided");
  }

  const vehicleQuery = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [
    vehicle_id,
  ]);
  if (vehicleQuery.rows.length === 0) {
    throw new Error("Vehicle not found");
  }
  const vehicle = vehicleQuery.rows[0];

  if (vehicle.availability_status !== "available") {
    throw new Error("Vehicle not available");
  }

  // calculating price
  const startDate = new Date(rent_start_date as Date);
  const endDate = new Date(rent_end_date as Date);

  if (endDate < startDate) {
    throw new Error("end date cannot be before start date");
  }

  const number_of_days = Math.floor(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const total_price = vehicle.daily_rent_price * number_of_days;

  // updating vehicle status to BOOKED
  const updateVehicleStatus = await pool.query(
    `
    UPDATE vehicles
    SET availability_status = 'booked'
    WHERE id=$1 RETURNING *
    `,
    [vehicle.id]
  );

  if (updateVehicleStatus.rows.length === 0) {
    throw new Error("Vehicle status update failed");
  }

  const result = await pool.query(
    `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price ) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
  );

  if (result.rows.length === 0) {
    throw new Error("booking creation failed");
  }

  return { result, vehicle };
};

const getBookings = async (role: string, userId: string) => {
  if (role === "admin") {
    const result = await pool.query(
      `
        SELECT
        b.id,
        b.customer_id,
        b.vehicle_id,
        b.rent_start_date,
        b.rent_end_date,
        b.total_price,
        b.status,
        json_build_object(
            'name', c.name,
            'email', c.email
        ) AS customer,
        json_build_object(
            'vehicle_name', v.vehicle_name,
            'registration_number', v.registration_number
        ) AS vehicle
        FROM bookings b
        JOIN users c ON b.customer_id = c.id
        JOIN vehicles v ON b.vehicle_id = v.id
        `
    );
    if (result.rows.length === 0) {
      throw new Error("Bookings retrieve failed");
    }

    return result;
  }
  if (role === "customer") {
    const result = await pool.query(
      `
        SELECT
        b.id,
        b.customer_id,
        b.vehicle_id,
        b.rent_start_date,
        b.rent_end_date,
        b.total_price,
        b.status,
        json_build_object(
            'name', c.name,
            'email', c.email
        ) AS customer,
        json_build_object(
            'vehicle_name', v.vehicle_name,
            'registration_number', v.registration_number
        ) AS vehicle
        FROM bookings b
        JOIN users c ON b.customer_id = c.id
        JOIN vehicles v ON b.vehicle_id = v.id
        WHERE c.id=$1
        `,
      [userId]
    );
    if (result.rows.length === 0) {
      throw new Error("Bookings retrieve failed");
    }

    return result;
  }
};

const updateBookings = async (
  role: string,
  bookingId: string,
  status: string
) => {
  if (role === "admin") {
    if (status !== "returned") {
      throw new Error("invalid status");
    }
    const adminUpdate = await pool.query(
      `
        UPDATE bookings
        SET status=$1
        WHERE id=$2
        RETURNING *
        `,
      [status, bookingId]
    );

    if (adminUpdate.rows.length === 0) {
      throw new Error("failed to update the status");
    }

    // update availability
    if (adminUpdate.rows.length) {
      const vehicleQuery = await pool.query(
        `UPDATE vehicles 
                                    SET availability_status='available'
                                    WHERE id=$1
                                    RETURNING *
        `,
        [adminUpdate.rows[0].vehicle_id]
      );
      const result = {
        ...adminUpdate.rows[0],
        vehicle: {
          availability_status: vehicleQuery.rows[0].availability_status,
        },
      };

      return result;
    }
  }
  if (role === "customer") {
    if (status !== "cancelled") {
      throw new Error("invalid status");
    }

    const bookingQuery = await pool.query(
      `
        SELECT * FROM bookings WHERE id=$1
        `,
      [bookingId]
    );

    if (bookingQuery.rows.length === 0) {
      throw new Error("failed to update the status");
    }
    const startTime = new Date(bookingQuery.rows[0].rent_start_date).getTime();

    if (startTime < Date.now()) {
      console.log(bookingQuery.rows);
      // update status
      const result = await pool.query(
        `
        UPDATE bookings
        SET status=$1
        WHERE id=$2
        RETURNING *
        `,
        [status, bookingId]
      );

      if (result.rows.length === 0) {
        throw new Error("failed to update the status");
      }

      // update availability
      if (result.rows.length) {
        const vehicleQuery = await pool.query(
          `UPDATE vehicles 
                                    SET availability_status='available'
                                    WHERE id=$1
                                    RETURNING *
        `,
          [result.rows[0].vehicle_id]
        );
      }
      return result;
    }
  }
};
export const bookingService = { createBooking, getBookings, updateBookings };
