import sqlite3
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from markupsafe import escape
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from dotenv import load_dotenv
import os

# Memuat Environment Variables dari file .env
load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__)

# SECURITY 1: CORS Protection
CORS(app, resources={r"/api/*": {"origins": "*"}}) 

# SECURITY 2: Rate Limiting (Mencegah Spam / Bot)
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["100 per day", "20 per hour"],
    storage_uri="memory://"
)

# Vercel filesystem is read-only except untuk folder /tmp. 
DB_FILE = '/tmp/leads.db' if os.environ.get('VERCEL') else 'leads.db'
# SECURITY 3: Kredensial Admin & Secret Key (.env)
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")
ADMIN_API_KEY = os.getenv("ADMIN_API_KEY", "fallback_rahasia123")

def verify_admin_auth():
    # 1. Check Authorization header (Bearer token)
    auth_header = request.headers.get('Authorization', '')
    if auth_header.startswith('Bearer '):
        token = auth_header.split('Bearer ', 1)[1].strip()
        if token in (ADMIN_API_KEY, ADMIN_PASSWORD):
            return True

    # 2. Check X-API-Key header
    header_key = request.headers.get('X-API-Key', '').strip()
    if header_key and header_key in (ADMIN_API_KEY, ADMIN_PASSWORD):
        return True

    # 3. Check URL query param (backward compatibility)
    query_key = request.args.get('key', '').strip()
    if query_key and query_key in (ADMIN_API_KEY, ADMIN_PASSWORD):
        return True

    return False

def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            company TEXT,
            message TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

# ----------------- ROUTES HTML -----------------
@app.route('/')
def serve_index():
    return send_from_directory(BASE_DIR, 'media_journey_landing.html')

@app.route('/admin')
def serve_admin():
    return send_from_directory(BASE_DIR, 'admin.html')

@app.route('/<path:filename>')
def serve_static(filename):
    # Mengizinkan frontend memanggil file gambar (seperti qris.jpg)
    if filename.endswith(('.jpg', '.png', '.jpeg', '.svg', '.gif')):
        return send_from_directory(BASE_DIR, filename)
    return "File Not Found", 404

# ----------------- ROUTES API -----------------
@app.route('/api/contact', methods=['POST'])
@limiter.limit("5 per day") # SECURITY: Mencegah spam (1 IP = maks 5 pesan per hari)
def contact():
    data = request.json
    
    # SECURITY 4: Input Sanitization (Mencegah XSS)
    name = escape(data.get('name', '')).strip()
    phone = escape(data.get('phone', '')).strip()
    company = escape(data.get('company', '')).strip()
    message = escape(data.get('message', '')).strip()
    
    # Validation
    if not name or not phone:
        return jsonify({'error': 'Nama dan Nomor WhatsApp wajib diisi.'}), 400
        
    try:
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        # SECURITY 5: Parameterized Queries (Mencegah SQL Injection)
        c.execute('INSERT INTO contacts (name, phone, company, message) VALUES (?, ?, ?, ?)',
                (name, phone, company, message))
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'message': 'Pesan berhasil disimpan.'}), 200
    except Exception as e:
        # SECURITY 6: Mencegah kebocoran struktur database
        return jsonify({'error': 'Terjadi kesalahan pada server. Silakan coba lagi.'}), 500

@app.route('/api/login', methods=['POST'])
@limiter.limit("30 per minute")
def admin_login():
    data = request.json or {}
    username = str(data.get('username', '')).strip()
    password = str(data.get('password', '')).strip()
    key = str(data.get('key', '')).strip()

    # 1. Login menggunakan Username & Password
    if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
        return jsonify({
            'success': True,
            'message': 'Login berhasil!',
            'token': ADMIN_API_KEY,
            'username': ADMIN_USERNAME
        }), 200

    # 2. Alternatif: Login menggunakan API Key / Token langsung
    if key in (ADMIN_API_KEY, ADMIN_PASSWORD) or password in (ADMIN_API_KEY, ADMIN_PASSWORD):
        return jsonify({
            'success': True,
            'message': 'Login berhasil dengan API Key!',
            'token': ADMIN_API_KEY,
            'username': ADMIN_USERNAME
        }), 200

    return jsonify({'error': 'Username atau password salah. Silakan coba lagi.'}), 401

@app.route('/api/leads', methods=['GET'])
@limiter.limit("60 per minute") # Rate limit yang wajar untuk admin dashboard
def get_leads():
    # SECURITY 7: Authentication (Mendukung Bearer Token, X-API-Key, & Query Param)
    if not verify_admin_auth():
        return jsonify({'error': 'Akses Ditolak. Silakan login terlebih dahulu.'}), 401

    try:
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        c.execute('SELECT * FROM contacts ORDER BY created_at DESC')
        rows = c.fetchall()
        leads = [dict(ix) for ix in rows]
        conn.close()
        return jsonify({'leads': leads}), 200
    except Exception as e:
        return jsonify({'error': 'Terjadi kesalahan pada server.'}), 500

DEFAULT_PAYMENT_SETTINGS = {
    "qris_image": "https://cdn.corenexis.com/f/vB3JWanbPU7.jpeg",
    "shopee_image": "https://cdn.corenexis.com/f/sof6LO4WchN.png",
    "shopee_number": "081997600171",
    "shopee_name": "Media Journey Solution",
    "shopee_pay_url": "https://shopee.co.id",
    "mandiri_image": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Bank_Mandiri_logo_2016.svg/1200px-Bank_Mandiri_logo_2016.svg.png",
    "mandiri_account": "1370012345678",
    "mandiri_name": "PT MEDIA JOURNEY SOLUSI"
}

@app.route('/api/payment-settings', methods=['GET'])
def get_payment_settings():
    try:
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute('SELECT key, value FROM settings')
        rows = c.fetchall()
        conn.close()
        
        settings = dict(DEFAULT_PAYMENT_SETTINGS)
        for key, val in rows:
            if key in settings:
                settings[key] = val
        return jsonify(settings), 200
    except Exception as e:
        return jsonify(DEFAULT_PAYMENT_SETTINGS), 200

@app.route('/api/payment-settings', methods=['POST'])
def save_payment_settings():
    data = request.json or {}
    try:
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        allowed_keys = [
            'qris_image', 'shopee_image', 'shopee_number', 'shopee_name',
            'shopee_pay_url', 'mandiri_image', 'mandiri_account', 'mandiri_name'
        ]
        for key in allowed_keys:
            if key in data:
                val = str(data[key]).strip()
                c.execute('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', (key, val))
        conn.commit()

        c.execute('SELECT key, value FROM settings')
        rows = c.fetchall()
        conn.close()

        updated = dict(DEFAULT_PAYMENT_SETTINGS)
        for k, v in rows:
            if k in updated:
                updated[k] = v
        return jsonify({'success': True, 'message': 'Pengaturan pembayaran berhasil disimpan.', 'settings': updated}), 200
    except Exception as e:
        return jsonify({'error': 'Gagal menyimpan pengaturan: ' + str(e)}), 500

if __name__ == '__main__':
    init_db()
    print("==================================================")
    print(" Media Journey Solution - SERVER RUNNING         ")
    print("==================================================")
    print(" Landing Page   : http://localhost:5000")
    print(" Dashboard Admin : http://localhost:5000/admin")
    print(f" Username Admin : {ADMIN_USERNAME}")
    print(f" Password Admin : {ADMIN_PASSWORD}")
    print(f" API Key Secret : {ADMIN_API_KEY}")
    print("==================================================")
    app.run(host='0.0.0.0', port=5000, debug=True)
