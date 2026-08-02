CREATE TABLE IF NOT EXISTS pins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    type TEXT NOT NULL, -- 'evacuation' or 'medical'
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'outdated'
    tally INTEGER DEFAULT 1,
    pwd_friendly BOOLEAN,
    pet_friendly BOOLEAN,
    has_water BOOLEAN,
    has_power BOOLEAN,
    has_restrooms BOOLEAN,
    medical_type TEXT, -- 'hospital', 'tent', 'first-aid'
    notes TEXT,
    photo_url TEXT,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
);