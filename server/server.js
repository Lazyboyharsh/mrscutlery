const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// --- 1. SETUP PATHS (The Fix for Windows) ---
// This forces the server to look exactly where the file is, not where you ran the command from
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const DATA_FILE = path.join(__dirname, 'data.json');

// --- 2. AUTO-CREATE FOLDERS ---
if (!fs.existsSync(UPLOADS_DIR)) {
    try {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
        console.log(`✅ Created missing folder: ${UPLOADS_DIR}`);
    } catch (err) {
        console.error("❌ Could not create uploads folder:", err);
    }
}

if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ products: [], categories: ["All", "Racks", "Cutlery"] }, null, 2));
}

// --- 3. MIDDLEWARE ---
app.use(cors({ origin: "*" })); // Allow all connections
app.use(express.json());
// Serve images explicitly from the absolute path
app.use('/uploads', express.static(UPLOADS_DIR));

// --- 4. IMAGE STORAGE CONFIG ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // FORCE Multer to use the absolute path we defined earlier
        cb(null, UPLOADS_DIR); 
    },
    filename: (req, file, cb) => {
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.]/g, "_");
        cb(null, Date.now() + '-' + safeName);
    }
});
const upload = multer({ storage: storage });

// --- 5. HELPERS ---
const readData = () => {
    try { return JSON.parse(fs.readFileSync(DATA_FILE)); } 
    catch (e) { return { products: [], categories: [] }; }
};
const writeData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// --- 6. ROUTES ---
app.get('/', (req, res) => res.send('Server is Running!'));

app.get('/api/data', (req, res) => res.json(readData()));

app.post('/api/products', (req, res) => {
    const data = readData();
    const newProduct = { id: Date.now(), ...req.body };
    if (!data.products) data.products = [];
    data.products.unshift(newProduct);
    writeData(data);
    res.json(newProduct);
});

app.delete('/api/products/:id', (req, res) => {
    const data = readData();
    data.products = data.products.filter(p => p.id != req.params.id);
    writeData(data);
    res.json({ success: true });
});

// CATEGORY ROUTES
app.post('/api/categories', (req, res) => {
    const data = readData();
    const { category } = req.body;
    if (category && !data.categories.includes(category)) {
        data.categories.push(category);
        writeData(data);
    }
    res.json(data.categories);
});

app.delete('/api/categories/:name', (req, res) => {
    const data = readData();
    data.categories = data.categories.filter(c => c !== req.params.name);
    writeData(data);
    res.json(data.categories);
});

// UPLOAD ROUTE (With Error Logging)
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        console.error("Upload failed: No file received");
        return res.status(400).send('No file uploaded');
    }
    // Return the URL
    const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    console.log("✅ Image Uploaded Successfully:", imageUrl);
    res.json({ imageUrl });
});

app.listen(PORT, () => {
    console.log(`-----------------------------------------------`);
    console.log(`✅ Server running at http://localhost:${PORT}`);
    console.log(`📂 Saving images to: ${UPLOADS_DIR}`);
    console.log(`-----------------------------------------------`);
});