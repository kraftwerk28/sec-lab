DROP TABLE clients CASCADE;
DROP TABLE airports CASCADE;
DROP TABLE flights CASCADE;
DROP TABLE tickets CASCADE;

CREATE TYPE ticket_class AS ENUM ('economy', 'business', 'first_class');
CREATE TYPE ticket_type AS ENUM (
  'W', 'S', 'B', 'K', 'L', 'M', 'N', 'V', 'G',
  'J', 'C', 'D',
  'P', 'F', 'A'
);


CREATE TABLE IF NOT EXISTS clients (
  client_id SERIAL PRIMARY KEY NOT NULL,
  first_name VARCHAR(64),
  last_name VARCHAR(64),
  passport_id VARCHAR(16),
  birth_date TIMESTAMP,
  photo BYTEA,
  registered_time TIMESTAMP
);

CREATE TABLE IF NOT EXISTS airports (
  airport_id SERIAL PRIMARY KEY NOT NULL,
  airport_name VARCHAR(64),
  country VARCHAR(32),
  city VARCHAR(32)
);

CREATE TABLE IF NOT EXISTS flights (
  flight_id SERIAL PRIMARY KEY NOT NULL,
  airport_id INT NOT NULL
    REFERENCES airports(airport_id)
    ON DELETE CASCADE,
  plane_model VARCHAR(32),
  departure_time TIMESTAMP,
  arrival_time TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tickets (
  id_ticket SERIAL PRIMARY KEY NOT NULL,
  class ticket_class NOT NULL,
  sub_class ticket_type,
  ordered_by INT NOT NULL
    REFERENCES clients(client_id)
    ON DELETE CASCADE,
  flight_id INT NOT NULL
    REFERENCES flights(flight_id)
    ON DELETE CASCADE,
  from_airp INT,
  to_airp INT,
  time TIMESTAMP,
  price FLOAT,
  booked BOOLEAN NOT NULL,
  seat VARCHAR(8)
);
