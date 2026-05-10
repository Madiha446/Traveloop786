CREATE DATABASE IF NOT EXISTS traveloop;
USE traveloop;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    photo_emoji VARCHAR(10) DEFAULT '👤',
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trips table
CREATE TABLE trips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    description TEXT,
    cover_photo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Stops (cities within a trip)
CREATE TABLE stops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    city_name VARCHAR(255) NOT NULL,
    country VARCHAR(255),
    cost_index INT DEFAULT 50,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    order_index INT DEFAULT 0,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

-- Activities table (predefined list, can be extended)
CREATE TABLE activities_master (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    cost DECIMAL(10,2),
    duration_hours DECIMAL(5,2),
    city_name VARCHAR(255),
    image_emoji VARCHAR(10)
);

-- User selected activities per stop
CREATE TABLE stop_activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stop_id INT NOT NULL,
    activity_id INT NOT NULL,
    FOREIGN KEY (stop_id) REFERENCES stops(id) ON DELETE CASCADE,
    FOREIGN KEY (activity_id) REFERENCES activities_master(id)
);

-- Packing checklist items per trip
CREATE TABLE checklist_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    item_text VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    is_packed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

-- Trip notes
CREATE TABLE trip_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

-- Insert demo activities
INSERT INTO activities_master (name, type, cost, duration_hours, city_name, image_emoji) VALUES
('Eiffel Tower Visit', 'Sightseeing', 28, 2, 'Paris', '🗼'),
('Louvre Museum', 'Culture', 22, 3, 'Paris', '🎨'),
('Central Park Bike Tour', 'Outdoor', 35, 2, 'New York', '🚴'),
('Shibuya Crossing', 'Sightseeing', 0, 1, 'Tokyo', '🚦'),
('Colosseum Tour', 'History', 24, 2, 'Rome', '🏛️');