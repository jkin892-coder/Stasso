import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("stasso_land.db");

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK(role IN ('investor', 'owner', 'farmer')) NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    verification_status TEXT DEFAULT 'unverified', -- unverified, pending, verified
    experience_years INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author_id INTEGER,
    content TEXT NOT NULL,
    media_url TEXT,
    media_type TEXT CHECK(media_type IN ('image', 'video')),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(author_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER,
    author_id INTEGER,
    content TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(post_id) REFERENCES posts(id),
    FOREIGN KEY(author_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS land_listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT NOT NULL,
    price REAL NOT NULL,
    size REAL NOT NULL, -- in acres
    type TEXT CHECK(type IN ('agricultural', 'hunting', 'sporting', 'horticulture', 'fishing', 'development')) NOT NULL,
    sector TEXT, -- crops, livestock, forestry, etc.
    risk_level TEXT CHECK(risk_level IN ('Low', 'Medium', 'High')) DEFAULT 'Medium',
    project_stage TEXT CHECK(project_stage IN ('Seed', 'Growth', 'Mature')) DEFAULT 'Seed',
    development_potential TEXT CHECK(development_potential IN ('Low', 'Medium', 'High')) DEFAULT 'Medium',
    historical_yield REAL, -- average past yield if applicable
    image_url TEXT,
    roi_estimate REAL,
    owner_id INTEGER,
    status TEXT DEFAULT 'available',
    total_shares INTEGER DEFAULT 1000,
    share_price REAL DEFAULT 100.0
  );

  CREATE TABLE IF NOT EXISTS user_shares (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    listing_id INTEGER,
    quantity INTEGER DEFAULT 0,
    UNIQUE(user_id, listing_id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(listing_id) REFERENCES land_listings(id)
  );

  CREATE TABLE IF NOT EXISTS live_trades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    listing_id INTEGER,
    type TEXT CHECK(type IN ('buy', 'sell')) NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(listing_id) REFERENCES land_listings(id)
  );

  CREATE TABLE IF NOT EXISTS investor_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE,
    min_roi REAL DEFAULT 5.0,
    max_risk TEXT DEFAULT 'Medium',
    min_historical_yield REAL DEFAULT 0.0,
    preferred_sectors TEXT, -- JSON array
    preferred_locations TEXT, -- JSON array
    preferred_stages TEXT, -- JSON array (Seed, Growth, Mature)
    min_development_potential TEXT DEFAULT 'Medium',
    investment_history TEXT -- JSON array of past investments
  );

  CREATE TABLE IF NOT EXISTS landowner_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE,
    total_acres REAL DEFAULT 0,
    land_locations TEXT, -- JSON array
    land_types TEXT, -- JSON array
    ownership_documents_url TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS farmer_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE,
    specialization TEXT, -- JSON array
    past_projects TEXT, -- JSON array
    project_proposals TEXT, -- JSON array
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS investments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listing_id INTEGER,
    investor_id INTEGER,
    amount REAL NOT NULL,
    date TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(listing_id) REFERENCES land_listings(id)
  );

  CREATE TABLE IF NOT EXISTS disputes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'Open', -- Open, In Progress, Resolved, Closed
    initiator_id INTEGER,
    respondent_id INTEGER,
    mediator_id INTEGER,
    is_escalated INTEGER DEFAULT 0,
    mediation_suggestions TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS dispute_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dispute_id INTEGER,
    sender_id INTEGER,
    sender_name TEXT,
    content TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(dispute_id) REFERENCES disputes(id)
  );

  CREATE TABLE IF NOT EXISTS dispute_documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dispute_id INTEGER,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    uploaded_by INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(dispute_id) REFERENCES disputes(id)
  );
`);

// Simple migration for existing DBs
try {
  db.exec("ALTER TABLE investor_profiles ADD COLUMN min_historical_yield REAL DEFAULT 0.0");
} catch (e) {}
try {
  db.exec("CREATE TABLE IF NOT EXISTS takaful_pools (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT, risk_type TEXT NOT NULL, contribution_rate REAL NOT NULL, total_fund REAL DEFAULT 0, status TEXT DEFAULT 'active')");
} catch (e) {}
try {
  db.exec("CREATE TABLE IF NOT EXISTS takaful_contributions (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, pool_id INTEGER, investment_id INTEGER, amount REAL NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(user_id) REFERENCES users(id), FOREIGN KEY(pool_id) REFERENCES takaful_pools(id), FOREIGN KEY(investment_id) REFERENCES investments(id))");
} catch (e) {}
try {
  db.exec("CREATE TABLE IF NOT EXISTS takaful_claims (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, pool_id INTEGER, amount_requested REAL NOT NULL, amount_approved REAL DEFAULT 0, reason TEXT NOT NULL, status TEXT DEFAULT 'pending', evidence_url TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP, processed_at TEXT, FOREIGN KEY(user_id) REFERENCES users(id), FOREIGN KEY(pool_id) REFERENCES takaful_pools(id))");
} catch (e) {}
try {
  db.exec("ALTER TABLE land_listings ADD COLUMN project_stage TEXT DEFAULT 'Seed'");
} catch (e) {}
try {
  db.exec("ALTER TABLE land_listings ADD COLUMN development_potential TEXT DEFAULT 'Medium'");
} catch (e) {}
try {
  db.exec("ALTER TABLE land_listings ADD COLUMN historical_yield REAL");
} catch (e) {}
try {
  db.exec("ALTER TABLE investor_profiles ADD COLUMN preferred_stages TEXT");
} catch (e) {}
try {
  db.exec("ALTER TABLE investor_profiles ADD COLUMN min_development_potential TEXT DEFAULT 'Medium'");
} catch (e) {}
try {
  db.exec("ALTER TABLE users ADD COLUMN experience_years INTEGER DEFAULT 0");
} catch (e) {}
try {
  db.exec("ALTER TABLE investor_profiles ADD COLUMN investment_history TEXT");
} catch (e) {}
try {
  db.exec("ALTER TABLE disputes ADD COLUMN is_escalated INTEGER DEFAULT 0");
} catch (e) {}
try {
  db.exec("ALTER TABLE disputes ADD COLUMN mediation_suggestions TEXT");
} catch (e) {}
try {
  db.exec("ALTER TABLE land_listings ADD COLUMN sector TEXT");
} catch (e) {}
try {
  db.exec("ALTER TABLE land_listings ADD COLUMN risk_level TEXT DEFAULT 'Medium'");
} catch (e) {}
try {
  db.exec("ALTER TABLE posts ADD COLUMN media_url TEXT");
} catch (e) {}
try {
  db.exec("ALTER TABLE posts ADD COLUMN media_type TEXT CHECK(media_type IN ('image', 'video'))");
} catch (e) {}
try {
  db.exec("ALTER TABLE land_listings ADD COLUMN total_shares INTEGER DEFAULT 1000");
} catch (e) {}
try {
  db.exec("ALTER TABLE land_listings ADD COLUMN share_price REAL DEFAULT 100.0");
} catch (e) {}

// Seed data if empty
const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
if (userCount.count === 0) {
  const seedUser = db.prepare("INSERT INTO users (name, email, role, bio, avatar_url) VALUES (?, ?, ?, ?, ?)");
  seedUser.run("Alex Investor", "alex@example.com", "investor", "Passionate about sustainable agriculture and long-term land value.", "https://i.pravatar.cc/150?u=alex");
  seedUser.run("Sarah Owner", "sarah@example.com", "owner", "Third-generation farmer looking to modernize operations.", "https://i.pravatar.cc/150?u=sarah");
  
  const seedPost = db.prepare("INSERT INTO posts (author_id, content) VALUES (?, ?)");
  seedPost.run(1, "Just invested in a new wheat farm in Punjab. The ROI looks promising!");
  seedPost.run(2, "Looking for advice on drip irrigation systems for mango orchards in Sindh.");
}

// Seed Takaful Pools
const poolCount = db.prepare("SELECT COUNT(*) as count FROM takaful_pools").get() as { count: number };
if (poolCount.count === 0) {
  const seedPool = db.prepare(`
    INSERT INTO takaful_pools (name, description, risk_type, contribution_rate, total_fund)
    VALUES (?, ?, ?, ?, ?)
  `);
  seedPool.run("Agri-Yield Protection", "Covers losses due to unexpected crop failure or pest infestations.", "Crop Failure", 2.5, 5000000);
  seedPool.run("Climate Resilience Fund", "Protection against extreme weather events like floods, droughts, or locust attacks.", "Weather", 3.0, 8500000);
  seedPool.run("Market Stability Pool", "Mitigates impact of sudden commodity price crashes in the national market.", "Market", 1.5, 3200000);
}

const count = db.prepare("SELECT COUNT(*) as count FROM land_listings").get() as { count: number };
if (count.count === 0) {
  const seed = db.prepare(`
    INSERT INTO land_listings (title, description, location, price, size, type, sector, risk_level, project_stage, development_potential, historical_yield, image_url, roi_estimate)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  seed.run("Indus Valley Farm", "Prime fertile land for wheat and cotton rotation.", "Punjab, Pakistan", 12000000, 500, "agricultural", "crops", "Low", "Mature", "Medium", 7.8, "https://picsum.photos/seed/farm1/800/600", 8.5);
  seed.run("Mato Grosso Soy Belt", "High-yield soybean production in Brazil's agricultural heartland.", "Mato Grosso, Brazil", 45000000, 2500, "agricultural", "crops", "Medium", "Mature", "High", 9.2, "https://picsum.photos/seed/brazil1/800/600", 11.5);
  seed.run("Iowa Corn Corridor", "Premium Grade-A soil in the US Midwest, perfect for corn and soy.", "Iowa, USA", 65000000, 800, "agricultural", "crops", "Low", "Mature", "Medium", 6.5, "https://picsum.photos/seed/iowa1/800/600", 5.8);
  seed.run("Queensland Cattle Station", "Massive grazing land for organic beef production.", "Queensland, Australia", 28000000, 15000, "agricultural", "livestock", "Medium", "Growth", "High", 4.2, "https://picsum.photos/seed/aus1/800/600", 7.2);
  seed.run("Loire Valley Vineyard", "Historic vineyard with established distribution channels.", "Loire Valley, France", 55000000, 120, "horticulture", "crops", "Low", "Mature", "Low", 8.4, "https://picsum.photos/seed/france1/800/600", 9.5);
  seed.run("Sindh River Orchard", "Established mango and citrus orchard with high-yield potential.", "Sindh, Pakistan", 25000000, 150, "agricultural", "crops", "Medium", "Mature", "High", 11.2, "https://picsum.photos/seed/vineyard1/800/600", 12.0);
  seed.run("Swat Valley Timber", "Sustainable forestry operation in the lush valley.", "Khyber Pakhtunkhwa, Pakistan", 18000000, 1000, "development", "forestry", "Low", "Seed", "High", null, "https://picsum.photos/seed/timber1/800/600", 7.5);
  seed.run("Gwadar Coastal Farm", "Modern aquaculture facility for shrimp and fish.", "Balochistan, Pakistan", 32000000, 50, "fishing", "aquaculture", "High", "Growth", "High", 14.1, "https://picsum.photos/seed/fish1/800/600", 15.5);

  // Initialize some shares for mock user
  db.prepare("INSERT OR IGNORE INTO user_shares (user_id, listing_id, quantity) VALUES (1, 1, 50)").run();
  db.prepare("INSERT OR IGNORE INTO user_shares (user_id, listing_id, quantity) VALUES (1, 3, 25)").run();
}

// Ensure at least one investor profile exists for mock user 1
const profileCount = db.prepare("SELECT COUNT(*) as count FROM investor_profiles WHERE user_id = 1").get() as { count: number };
if (profileCount.count === 0) {
  db.prepare("INSERT INTO investor_profiles (user_id, min_roi, max_risk, preferred_sectors, preferred_locations) VALUES (1, 7.0, 'Medium', '[\"crops\", \"forestry\"]', '[\"Punjab, Pakistan\", \"Khyber Pakhtunkhwa, Pakistan\"]')").run();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/listings", (req, res) => {
    const listings = db.prepare("SELECT * FROM land_listings").all();
    res.json(listings);
  });

  app.get("/api/listings/:id", (req, res) => {
    const listing = db.prepare("SELECT * FROM land_listings WHERE id = ?").get(req.params.id);
    res.json(listing);
  });

  app.post("/api/invest", (req, res) => {
    const { listing_id, investor_id, amount } = req.body;
    const stmt = db.prepare("INSERT INTO investments (listing_id, investor_id, amount) VALUES (?, ?, ?)");
    stmt.run(listing_id, investor_id, amount);
    res.json({ success: true });
  });

  // Dispute API
  app.get("/api/disputes", (req, res) => {
    const disputes = db.prepare("SELECT * FROM disputes ORDER BY created_at DESC").all();
    res.json(disputes);
  });

  app.post("/api/disputes", (req, res) => {
    const { title, description, initiator_id } = req.body;
    const stmt = db.prepare("INSERT INTO disputes (title, description, initiator_id) VALUES (?, ?, ?)");
    const result = stmt.run(title, description, initiator_id);
    res.json({ id: result.lastInsertRowid });
  });

  app.get("/api/disputes/:id", (req, res) => {
    const dispute = db.prepare("SELECT * FROM disputes WHERE id = ?").get(req.params.id);
    if (!dispute) return res.status(404).json({ error: "Dispute not found" });
    
    const messages = db.prepare("SELECT * FROM dispute_messages WHERE dispute_id = ? ORDER BY created_at ASC").all(req.params.id);
    const documents = db.prepare("SELECT * FROM dispute_documents WHERE dispute_id = ? ORDER BY created_at DESC").all(req.params.id);
    
    res.json({ ...dispute, messages, documents });
  });

  app.post("/api/disputes/:id/messages", (req, res) => {
    const { sender_id, sender_name, content } = req.body;
    const stmt = db.prepare("INSERT INTO dispute_messages (dispute_id, sender_id, sender_name, content) VALUES (?, ?, ?, ?)");
    stmt.run(req.params.id, sender_id, sender_name, content);
    res.json({ success: true });
  });

  app.post("/api/disputes/:id/documents", (req, res) => {
    const { name, url, uploaded_by } = req.body;
    const stmt = db.prepare("INSERT INTO dispute_documents (dispute_id, name, url, uploaded_by) VALUES (?, ?, ?, ?)");
    stmt.run(req.params.id, name, url, uploaded_by);
    res.json({ success: true });
  });

  app.patch("/api/disputes/:id", (req, res) => {
    const { status, is_escalated, mediation_suggestions } = req.body;
    const updates: string[] = [];
    const params: any[] = [];

    if (status !== undefined) {
      updates.push("status = ?");
      params.push(status);
    }
    if (is_escalated !== undefined) {
      updates.push("is_escalated = ?");
      params.push(is_escalated);
    }
    if (mediation_suggestions !== undefined) {
      updates.push("mediation_suggestions = ?");
      params.push(mediation_suggestions);
    }

    if (updates.length === 0) return res.json({ success: true });

    updates.push("updated_at = CURRENT_TIMESTAMP");
    params.push(req.params.id);

    const stmt = db.prepare(`UPDATE disputes SET ${updates.join(", ")} WHERE id = ?`);
    stmt.run(...params);
    res.json({ success: true });
  });

  // Investor Profile API
  app.get("/api/investor-profile/:userId", (req, res) => {
    const profile = db.prepare("SELECT * FROM investor_profiles WHERE user_id = ?").get(req.params.userId);
    res.json(profile || {});
  });

  app.post("/api/investor-profile", (req, res) => {
    const { user_id, min_roi, max_risk, min_historical_yield, preferred_sectors, preferred_locations, preferred_stages, min_development_potential } = req.body;
    const stmt = db.prepare(`
      INSERT INTO investor_profiles (user_id, min_roi, max_risk, min_historical_yield, preferred_sectors, preferred_locations, preferred_stages, min_development_potential)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET
        min_roi = excluded.min_roi,
        max_risk = excluded.max_risk,
        min_historical_yield = excluded.min_historical_yield,
        preferred_sectors = excluded.preferred_sectors,
        preferred_locations = excluded.preferred_locations,
        preferred_stages = excluded.preferred_stages,
        min_development_potential = excluded.min_development_potential
    `);
    stmt.run(
      user_id, 
      min_roi, 
      max_risk, 
      min_historical_yield,
      JSON.stringify(preferred_sectors), 
      JSON.stringify(preferred_locations),
      JSON.stringify(preferred_stages),
      min_development_potential
    );
    res.json({ success: true });
  });

  app.get("/api/matches/:userId", (req, res) => {
    const profile = db.prepare("SELECT * FROM investor_profiles WHERE user_id = ?").get(req.params.userId) as any;
    if (!profile) return res.json([]);

    const minRoi = profile.min_roi;
    const maxRisk = profile.max_risk;
    const minHistYield = profile.min_historical_yield || 0;
    const sectors = JSON.parse(profile.preferred_sectors || "[]");
    const locations = JSON.parse(profile.preferred_locations || "[]");
    const stages = JSON.parse(profile.preferred_stages || "[]");
    const minDevPotential = profile.min_development_potential || 'Low';

    // Mapping for comparison
    const riskMap: Record<string, number> = { 'Low': 1, 'Medium': 2, 'High': 3 };
    const devMap: Record<string, number> = { 'Low': 1, 'Medium': 2, 'High': 3 };
    
    const maxRiskVal = riskMap[maxRisk] || 2;
    const minDevVal = devMap[minDevPotential] || 1;

    const allListings = db.prepare("SELECT * FROM land_listings WHERE status = 'available'").all() as any[];
    
    const matches = allListings.map(listing => {
      let score = 0;
      
      // ROI (30%)
      if (listing.roi_estimate >= minRoi) score += 30;
      else if (listing.roi_estimate >= minRoi * 0.8) score += 15;

      // Risk (20%)
      const listingRiskVal = riskMap[listing.risk_level] || 2;
      if (listingRiskVal <= maxRiskVal) score += 20;
      else if (listingRiskVal <= maxRiskVal + 1) score += 5;

      // Historical Yield (15%)
      if (listing.historical_yield && listing.historical_yield >= minHistYield) score += 15;
      else if (listing.historical_yield && listing.historical_yield >= minHistYield * 0.8) score += 7;

      // Development Potential (15%)
      const listingDevVal = devMap[listing.development_potential] || 2;
      if (listingDevVal >= minDevVal) score += 15;
      else if (listingDevVal >= minDevVal - 1) score += 5;

      // Sector & Location Alignment (20%)
      let alignmentScore = 0;
      if (sectors.length > 0 && sectors.includes(listing.sector)) alignmentScore += 10;
      if (locations.length > 0 && locations.includes(listing.location)) alignmentScore += 10;
      score += alignmentScore;

      // Stage alignment (Bonus 10%)
      if (stages.length > 0 && stages.includes(listing.project_stage)) score += 10;

      return { ...listing, match_score_raw: score };
    })
    .filter(m => m.match_score_raw >= 50) // Minimum threshold for "matching"
    .sort((a, b) => b.match_score_raw - a.match_score_raw);

    res.json(matches);
  });

  // Community API
  app.get("/api/posts", (req, res) => {
    const posts = db.prepare(`
      SELECT posts.*, users.name as author_name, users.avatar_url as author_avatar, users.role as author_role
      FROM posts
      JOIN users ON posts.author_id = users.id
      ORDER BY posts.created_at DESC
    `).all();
    
    const postsWithComments = posts.map((post: any) => {
      const comments = db.prepare(`
        SELECT comments.*, users.name as author_name, users.avatar_url as author_avatar
        FROM comments
        JOIN users ON comments.author_id = users.id
        WHERE post_id = ?
        ORDER BY comments.created_at ASC
      `).all(post.id);
      return { ...post, comments };
    });
    
    res.json(postsWithComments);
  });

  app.post("/api/posts", (req, res) => {
    const { author_id, content, media_url, media_type } = req.body;
    const stmt = db.prepare("INSERT INTO posts (author_id, content, media_url, media_type) VALUES (?, ?, ?, ?)");
    const result = stmt.run(author_id, content, media_url, media_type);
    res.json({ id: result.lastInsertRowid });
  });

  app.post("/api/posts/:id/comments", (req, res) => {
    const { author_id, content } = req.body;
    const stmt = db.prepare("INSERT INTO comments (post_id, author_id, content) VALUES (?, ?, ?)");
    stmt.run(req.params.id, author_id, content);
    res.json({ success: true });
  });

  // Live Trading API
  app.get("/api/trades", (req, res) => {
    const trades = db.prepare(`
      SELECT live_trades.*, users.name as user_name, land_listings.title as listing_title
      FROM live_trades
      JOIN users ON live_trades.user_id = users.id
      JOIN land_listings ON live_trades.listing_id = land_listings.id
      ORDER BY live_trades.created_at DESC
      LIMIT 50
    `).all();
    res.json(trades);
  });

  app.get("/api/portfolio/:userId", (req, res) => {
    const portfolio = db.prepare(`
      SELECT user_shares.*, land_listings.title, land_listings.share_price, land_listings.image_url
      FROM user_shares
      JOIN land_listings ON user_shares.listing_id = land_listings.id
      WHERE user_shares.user_id = ? AND user_shares.quantity > 0
    `).all(req.params.userId);
    res.json(portfolio);
  });

  app.post("/api/trade", (req, res) => {
    const { user_id, listing_id, type, quantity } = req.body;
    
    const listing = db.prepare("SELECT share_price FROM land_listings WHERE id = ?").get(listing_id) as any;
    if (!listing) return res.status(404).json({ error: "Listing not found" });

    const price = listing.share_price;

    db.transaction(() => {
      // Record trade
      db.prepare("INSERT INTO live_trades (user_id, listing_id, type, quantity, price) VALUES (?, ?, ?, ?, ?)")
        .run(user_id, listing_id, type, quantity, price);

      // Update user shares
      const currentShares = db.prepare("SELECT quantity FROM user_shares WHERE user_id = ? AND listing_id = ?").get(user_id, listing_id) as any;
      const currentQty = currentShares ? currentShares.quantity : 0;
      const newQty = type === 'buy' ? currentQty + quantity : currentQty - quantity;

      if (newQty < 0) throw new Error("Insufficient shares");

      db.prepare(`
        INSERT INTO user_shares (user_id, listing_id, quantity)
        VALUES (?, ?, ?)
        ON CONFLICT(user_id, listing_id) DO UPDATE SET quantity = excluded.quantity
      `).run(user_id, listing_id, newQty);

      // Simulate price movement (competitive environment)
      const priceChange = type === 'buy' ? 1.02 : 0.98; // 2% up on buy, 2% down on sell
      db.prepare("UPDATE land_listings SET share_price = share_price * ? WHERE id = ?").run(priceChange, listing_id);
    })();

    res.json({ success: true });
  });

  app.get("/api/leaderboard", (req, res) => {
    const leaderboard = db.prepare(`
      SELECT users.name, users.avatar_url, SUM(user_shares.quantity * land_listings.share_price) as portfolio_value
      FROM users
      JOIN user_shares ON users.id = user_shares.user_id
      JOIN land_listings ON user_shares.listing_id = land_listings.id
      GROUP BY users.id
      ORDER BY portfolio_value DESC
      LIMIT 10
    `).all();
    res.json(leaderboard);
  });

  // User Profile API
  // Takaful API
  app.get("/api/takaful/pools", (req, res) => {
    const pools = db.prepare("SELECT * FROM takaful_pools WHERE status = 'active'").all();
    res.json(pools);
  });

  app.get("/api/takaful/my-contributions/:userId", (req, res) => {
    const contributions = db.prepare(`
      SELECT tc.*, tp.name as pool_name, tp.risk_type 
      FROM takaful_contributions tc
      JOIN takaful_pools tp ON tc.pool_id = tp.id
      WHERE tc.user_id = ?
      ORDER BY tc.created_at DESC
    `).all(req.params.userId);
    res.json(contributions);
  });

  app.post("/api/takaful/contribute", (req, res) => {
    const { user_id, pool_id, investment_id, amount } = req.body;
    const stmt = db.prepare(`
      INSERT INTO takaful_contributions (user_id, pool_id, investment_id, amount)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(user_id, pool_id, investment_id, amount);
    
    // Update pool fund
    db.prepare("UPDATE takaful_pools SET total_fund = total_fund + ? WHERE id = ?").run(amount, pool_id);
    
    res.json({ success: true });
  });

  app.get("/api/takaful/my-claims/:userId", (req, res) => {
    const claims = db.prepare(`
      SELECT tc.*, tp.name as pool_name 
      FROM takaful_claims tc
      JOIN takaful_pools tp ON tc.pool_id = tp.id
      WHERE tc.user_id = ?
      ORDER BY tc.created_at DESC
    `).all(req.params.userId);
    res.json(claims);
  });

  app.post("/api/takaful/claim", (req, res) => {
    const { user_id, pool_id, amount_requested, reason, evidence_url } = req.body;
    const stmt = db.prepare(`
      INSERT INTO takaful_claims (user_id, pool_id, amount_requested, reason, evidence_url)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(user_id, pool_id, amount_requested, reason, evidence_url);
    res.json({ success: true });
  });

  app.get("/api/users/:id", (req, res) => {
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id) as any;
    if (!user) return res.status(404).json({ error: "User not found" });

    let profile = {};
    if (user.role === 'investor') {
      profile = db.prepare("SELECT * FROM investor_profiles WHERE user_id = ?").get(user.id) || {};
    } else if (user.role === 'owner') {
      profile = db.prepare("SELECT * FROM landowner_profiles WHERE user_id = ?").get(user.id) || {};
    } else if (user.role === 'farmer') {
      profile = db.prepare("SELECT * FROM farmer_profiles WHERE user_id = ?").get(user.id) || {};
    }

    res.json({ ...user, profile });
  });

  app.patch("/api/users/:id", (req, res) => {
    const { name, bio, avatar_url, role, experience_years, verification_status } = req.body;
    const updates: string[] = [];
    const params: any[] = [];

    if (name) { updates.push("name = ?"); params.push(name); }
    if (bio) { updates.push("bio = ?"); params.push(bio); }
    if (avatar_url) { updates.push("avatar_url = ?"); params.push(avatar_url); }
    if (role) { updates.push("role = ?"); params.push(role); }
    if (experience_years !== undefined) { updates.push("experience_years = ?"); params.push(experience_years); }
    if (verification_status) { updates.push("verification_status = ?"); params.push(verification_status); }

    if (updates.length === 0) return res.json({ success: true });

    params.push(req.params.id);
    const stmt = db.prepare(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`);
    stmt.run(...params);
    res.json({ success: true });
  });

  app.post("/api/profiles/:role", (req, res) => {
    const { role } = req.params;
    const { user_id, ...data } = req.body;

    if (role === 'investor') {
      const stmt = db.prepare(`
        INSERT INTO investor_profiles (user_id, min_roi, max_risk, min_historical_yield, preferred_sectors, preferred_locations, preferred_stages, min_development_potential, investment_history)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
          min_roi = excluded.min_roi,
          max_risk = excluded.max_risk,
          min_historical_yield = excluded.min_historical_yield,
          preferred_sectors = excluded.preferred_sectors,
          preferred_locations = excluded.preferred_locations,
          preferred_stages = excluded.preferred_stages,
          min_development_potential = excluded.min_development_potential,
          investment_history = excluded.investment_history
      `);
      stmt.run(
        user_id, 
        data.min_roi, 
        data.max_risk, 
        data.min_historical_yield,
        JSON.stringify(data.preferred_sectors), 
        JSON.stringify(data.preferred_locations),
        JSON.stringify(data.preferred_stages),
        data.min_development_potential,
        JSON.stringify(data.investment_history)
      );
    } else if (role === 'owner') {
      const stmt = db.prepare(`
        INSERT INTO landowner_profiles (user_id, total_acres, land_locations, land_types, ownership_documents_url)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
          total_acres = excluded.total_acres,
          land_locations = excluded.land_locations,
          land_types = excluded.land_types,
          ownership_documents_url = excluded.ownership_documents_url
      `);
      stmt.run(user_id, data.total_acres, JSON.stringify(data.land_locations), JSON.stringify(data.land_types), data.ownership_documents_url);
    } else if (role === 'farmer') {
      const stmt = db.prepare(`
        INSERT INTO farmer_profiles (user_id, specialization, past_projects, project_proposals)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
          specialization = excluded.specialization,
          past_projects = excluded.past_projects,
          project_proposals = excluded.project_proposals
      `);
      stmt.run(user_id, JSON.stringify(data.specialization), JSON.stringify(data.past_projects), JSON.stringify(data.project_proposals));
    }

    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
