CREATE DATABASE IF NOT EXISTS traveloop
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE traveloop;
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    hashed_password VARCHAR(200) NOT NULL,
    photo VARCHAR(500) DEFAULT '',
    language VARCHAR(10) DEFAULT 'en',
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_email (email)
);
CREATE TABLE cities (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    region VARCHAR(100),
    cost_index FLOAT DEFAULT 2.0,
    popularity INT DEFAULT 80,
    image VARCHAR(500),
    description TEXT,
    INDEX idx_city_region (region),
    INDEX idx_city_popularity (popularity)
);
CREATE TABLE trips (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    cover_photo VARCHAR(500) DEFAULT '',
    is_public BOOLEAN DEFAULT FALSE,
    share_code VARCHAR(20) UNIQUE,
    budget FLOAT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_trip_user (user_id),
    INDEX idx_trip_share_code (share_code),
    INDEX idx_trip_dates (start_date, end_date)
);




CREATE TABLE stop_activities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    stop_id INT NOT NULL,
    activity_id INT NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(10) DEFAULT '10:00',
    FOREIGN KEY (stop_id) REFERENCES stops(id) ON DELETE CASCADE,
    FOREIGN KEY (activity_id) REFERENCES activities(id),
    INDEX idx_sa_stop (stop_id),
    INDEX idx_sa_activity (activity_id),
    INDEX idx_sa_date (date)
);
CREATE TABLE packing_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    trip_id INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(50),
    is_packed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    INDEX idx_packing_trip (trip_id),
    INDEX idx_packing_category (category)
);
CREATE TABLE trip_notes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    trip_id INT NOT NULL,
    stop_id INT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    FOREIGN KEY (stop_id) REFERENCES stops(id) ON DELETE SET NULL,
    INDEX idx_note_trip (trip_id),
    INDEX idx_note_timestamp (timestamp)
);
INSERT INTO cities (id, name, country, region, cost_index, popularity, image, description) VALUES
(1, 'Delhi', 'India', 'North India', 2.5, 95, 'https://picsum.photos/seed/delhi2025/400/250', 'Capital city blending Mughal heritage with modern energy. Monuments, street food, and vibrant markets.'),
(2, 'Jaipur', 'India', 'Rajasthan', 2.0, 92, 'https://picsum.photos/seed/jaipur2025/400/250', 'The Pink City — royal palaces, forts, and colorful bazaars that define Rajasthani grandeur.'),
(3, 'Goa', 'India', 'West India', 2.8, 96, 'https://picsum.photos/seed/goa2025/400/250', 'Sun-kissed beaches, Portuguese architecture, seafood, and legendary nightlife.'),
(4, 'Varanasi', 'India', 'Uttar Pradesh', 1.5, 85, 'https://picsum.photos/seed/varanasi2025/400/250', 'Spiritual capital on the Ganges — ancient ghats, evening aarti, and timeless rituals.'),
(5, 'Mumbai', 'India', 'West India', 3.5, 94, 'https://picsum.photos/seed/mumbai2025/400/250', 'City of Dreams — Bollywood, Marine Drive, street food, and non-stop energy.'),
(6, 'Kochi', 'India', 'Kerala', 2.2, 80, 'https://picsum.photos/seed/kochi2025/400/250', 'Gateway to Kerala — Chinese fishing nets, spice markets, and serene backwaters.'),
(7, 'Udaipur', 'India', 'Rajasthan', 2.8, 88, 'https://picsum.photos/seed/udaipur2025/400/250', 'City of Lakes — romantic palaces, sunset boat rides, and Rajput heritage.'),
(8, 'Rishikesh', 'India', 'Uttarakhand', 1.5, 82, 'https://picsum.photos/seed/rishikesh2025/400/250', 'Yoga capital of the world — ashrams, Ganga rapids, and the iconic Lakshman Jhula.'),
(9, 'Agra', 'India', 'Uttar Pradesh', 1.8, 98, 'https://picsum.photos/seed/agra2025/400/250', 'Home of the Taj Mahal — a monument to love that needs no introduction.'),
(10, 'Amritsar', 'India', 'Punjab', 1.8, 86, 'https://picsum.photos/seed/amritsar2025/400/250', 'Golden Temple, Wagah Border ceremony, and legendary Punjabi cuisine.'),
(11, 'Hyderabad', 'India', 'South India', 2.5, 83, 'https://picsum.photos/seed/hyderabad2025/400/250', 'City of Pearls — biryani, Charminar, and a booming tech scene.'),
(12, 'Mysore', 'India', 'Karnataka', 1.8, 75, 'https://picsum.photos/seed/mysore2025/400/250', 'Royal heritage — Mysore Palace, sandalwood, silk, and Dasara festivities.'),
(13, 'Shimla', 'India', 'Himachal Pradesh', 2.5, 78, 'https://picsum.photos/seed/shimla2025/400/250', 'Queen of Hills — colonial charm, Mall Road, and misty mountain vistas.'),
(14, 'Jaisalmer', 'India', 'Rajasthan', 2.2, 76, 'https://picsum.photos/seed/jaisalmer2025/400/250', 'Golden City — desert safaris, Sam Dunes, and a living fort rising from the sand.'),
(15, 'Manali', 'India', 'Himachal Pradesh', 2.8, 84, 'https://picsum.photos/seed/manali2025/400/250', 'Adventure paradise — snow-capped peaks, paragliding, and the Rohtang Pass.'),
(16, 'Puducherry', 'India', 'South India', 2.0, 72, 'https://picsum.photos/seed/pondicherry2025/400/250', 'French Riviera of the East — colonial streets, cafes, and serene Auroville.');

INSERT INTO activities (id, city_id, name, type, cost, duration, image, description) VALUES
(1, 1, 'Red Fort & Chandni Chowk Walk', 'sightseeing', 500, 4, 'https://picsum.photos/seed/redfort/300/200', 'Explore the iconic Mughal fort and the bustling lanes of Old Delhi.'),
(2, 1, 'Street Food Tour — Parathe Wali Gali', 'food', 300, 2, 'https://picsum.photos/seed/parantha/300/200', 'Taste the legendary stuffed parathas, chaat, and jalebis of Old Delhi.'),
(3, 1, 'Qutub Minar & Mehrauli Heritage Walk', 'culture', 400, 3, 'https://picsum.photos/seed/qutub/300/200', 'Walk through centuries of Delhi Sultanate history and architecture.'),
(4, 2, 'Amber Fort Elephant Ride', 'adventure', 800, 3, 'https://picsum.photos/seed/amberfort/300/200', 'Ride up to the majestic Amber Fort like Rajput royalty.'),
(5, 2, 'Hawa Mahal & City Palace Tour', 'sightseeing', 350, 2.5, 'https://picsum.photos/seed/hawamahal/300/200', 'Discover the Palace of Winds and the royal residence of Jaipur.'),
(6, 2, 'Jaipur Blue Pottery Workshop', 'culture', 600, 2, 'https://picsum.photos/seed/bluepottery/300/200', 'Learn the art of traditional Jaipur blue pottery from local artisans.'),
(7, 3, 'Baga Beach & Night Market', 'sightseeing', 200, 4, 'https://picsum.photos/seed/bagabeach/300/200', 'Relax on the beach by day, shop and party by night.'),
(8, 3, 'Goa Spice Plantation Tour', 'culture', 700, 3, 'https://picsum.photos/seed/spicegoa/300/200', 'Walk through aromatic spice gardens with a traditional Goan lunch.'),
(9, 3, 'Scuba Diving at Grande Island', 'adventure', 2500, 4, 'https://picsum.photos/seed/scubagoa/300/200', 'Dive into the Arabian Sea and discover vibrant coral and marine life.'),
(10, 4, 'Evening Ganga Aarti Ceremony', 'culture', 0, 2, 'https://picsum.photos/seed/gangaaarti/300/200', 'Witness the mesmerizing evening prayer at Dashashwamedh Ghat.'),
(11, 4, 'Boat Ride on the Ganges at Dawn', 'sightseeing', 300, 1.5, 'https://picsum.photos/seed/gangaboat/300/200', 'Row past ancient ghats as the sun rises over the holy river.'),
(12, 5, 'Gateway of India & Colaba Walk', 'sightseeing', 0, 2, 'https://picsum.photos/seed/gatewayindia/300/200', 'Stroll along the waterfront and explore Mumbais art district.'),
(13, 5, 'Dharavi Slum Tour', 'culture', 500, 2.5, 'https://picsum.photos/seed/dharavi/300/200', 'Experience the resilience and enterprise of Asias largest slum.'),
(14, 5, 'Mumbai Street Food Crawl', 'food', 400, 3, 'https://picsum.photos/seed/vadapav/300/200', 'Vada pav, pav bhaji, bhel puri — taste the flavours of Mumbai.'),
(15, 6, 'Kerala Backwater Houseboat', 'sightseeing', 3500, 8, 'https://picsum.photos/seed/backwater/300/200', 'Cruise the tranquil backwaters on a traditional kettuvallam houseboat.'),
(16, 6, 'Kathakali Performance', 'culture', 600, 2, 'https://picsum.photos/seed/kathakali/300/200', 'Watch the dramatic dance-drama of Kerala in full costume and makeup.'),
(17, 7, 'City Palace & Lake Pichola Boat Ride', 'sightseeing', 700, 3, 'https://picsum.photos/seed/lakepichola/300/200', 'Explore the grand palace and glide across Udaipurs iconic lake.'),
(18, 8, 'Yoga & Meditation Session', 'culture', 500, 2, 'https://picsum.photos/seed/yogarishikesh/300/200', 'Find inner peace with a guided yoga session by the Ganges.'),
(19, 8, 'White Water Rafting on Ganga', 'adventure', 1200, 3, 'https://picsum.photos/seed/rafting/300/200', 'Tackle Grade III and IV rapids on the mighty Ganges.'),
(20, 9, 'Taj Mahal Sunrise Visit', 'sightseeing', 1100, 3, 'https://picsum.photos/seed/tajmahal/300/200', 'Witness the Taj Mahal at dawn — a once-in-a-lifetime experience.'),
(21, 9, 'Agra Fort & Mehtab Bagh', 'culture', 500, 2.5, 'https://picsum.photos/seed/agrafort/300/200', 'Explore the red sandstone fort and the garden with Taj views.'),
(22, 10, 'Golden Temple & Langar Experience', 'culture', 0, 3, 'https://picsum.photos/seed/goldentemple/300/200', 'Visit the holiest Sikh shrine and volunteer at the community kitchen.'),
(23, 10, 'Wagah Border Ceremony', 'sightseeing', 500, 3, 'https://picsum.photos/seed/wagah/300/200', 'Witness the patriotic border closing ceremony at the India-Pakistan border.'),
(24, 11, 'Hyderabadi Biryani Trail', 'food', 450, 2, 'https://picsum.photos/seed/biryani/300/200', 'Savour authentic Dum Biryani at the citys most legendary joints.'),
(25, 11, 'Charminar & Laad Bazaar Walk', 'shopping', 200, 2, 'https://picsum.photos/seed/charminar/300/200', 'Shop for bangles, pearls, and perfumes in the old city.'),
(26, 12, 'Mysore Palace Illumination', 'sightseeing', 300, 2, 'https://picsum.photos/seed/mysorepalace/300/200', 'See the palace glow with 97,000 bulbs on Sunday evenings.'),
(27, 13, 'Mall Road & Ridge Walk', 'sightseeing', 0, 2, 'https://picsum.photos/seed/mallroad/300/200', 'Stroll the colonial-era promenade with panoramic Himalayan views.'),
(28, 14, 'Jaisalmer Desert Safari & Camping', 'adventure', 2500, 6, 'https://picsum.photos/seed/desertsafari/300/200', 'Ride camels into the Thar Desert and sleep under the stars.'),
(29, 15, 'Solang Valley Paragliding', 'adventure', 1500, 2, 'https://picsum.photos/seed/paraglide/300/200', 'Soar above the Kullu Valley with breathtaking Himalayan views.'),
(30, 16, 'Auroville & French Quarter Walk', 'culture', 400, 3, 'https://picsum.photos/seed/auroville/300/200', 'Explore the experimental township and charming French colonial streets.');

SHOW TABLES;
SELECT COUNT(*) FROM cities;   
SELECT COUNT(*) FROM activities;
 