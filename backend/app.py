from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash
import config

app = Flask(__name__)
CORS(
    app,
    origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "https://baysideclinic.vercel.app"
    ],
    supports_credentials=True
)
def get_db():
    db = mysql.connector.connect(
        host=config.DB_HOST,
        port=config.DB_PORT,
        user=config.DB_USER,
        password=config.DB_PASSWORD,
        database=config.DB_NAME,
        consume_results=True
    )
    cursor = db.cursor(dictionary=True)
    return db, cursor


# ── Test ──────────────────────────────────────────────────────────────────────
@app.route('/api/test-db', methods=['GET'])
def test_db():
    try:
        db, cursor = get_db()
        cursor.execute("SELECT 1")
        cursor.close(); db.close()
        return jsonify({"message": "Database connected successfully"}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500


# ── Admin Auth ────────────────────────────────────────────────────────────────
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username, password, role = data.get('username'), data.get('password'), data.get('role')
    if not username or not password or not role:
        return jsonify({"message": "All fields are required"}), 400
    try:
        db, cursor = get_db()
        cursor.execute("INSERT INTO users (username, password, role) VALUES (%s, %s, %s)",
                       (username, generate_password_hash(password), role))
        db.commit(); cursor.close(); db.close()
        return jsonify({"message": "User registered successfully"}), 201
    except mysql.connector.Error as err:
        return jsonify({"message": str(err)}), 500


@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username, password = data.get('username'), data.get('password')
    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400
    try:
        db, cursor = get_db()
        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        user = cursor.fetchone(); cursor.close(); db.close()
        if user and check_password_hash(user['password'], password):
            return jsonify({"message": "Login successful", "role": user['role'], "username": user['username']}), 200
        return jsonify({"message": "Invalid username or password"}), 401
    except mysql.connector.Error as err:
        return jsonify({"message": str(err)}), 500


# ── Patient Auth ──────────────────────────────────────────────────────────────
@app.route('/api/patient/register', methods=['POST'])
def patient_register():
    data = request.get_json()
    name, username, password = data.get('name'), data.get('username'), data.get('password')
    if not name or not username or not password:
        return jsonify({"message": "Name, username and password are required"}), 400
    try:
        db, cursor = get_db()
        cursor.execute(
            "INSERT INTO patients (name, username, password, email, phone, age, gender) VALUES (%s,%s,%s,%s,%s,%s,%s)",
            (name, username, generate_password_hash(password),
             data.get('email'), data.get('phone'), data.get('age'), data.get('gender'))
        )
        db.commit()
        patient_id = cursor.lastrowid
        cursor.close(); db.close()
        return jsonify({"message": "Registered successfully", "patient_id": patient_id, "username": username, "name": name}), 201
    except mysql.connector.Error as err:
        return jsonify({"message": str(err)}), 500


@app.route('/api/patient/login', methods=['POST'])
def patient_login():
    data = request.get_json()
    username, password = data.get('username'), data.get('password')
    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400
    try:
        db, cursor = get_db()
        cursor.execute("SELECT * FROM patients WHERE username = %s", (username,))
        patient = cursor.fetchone(); cursor.close(); db.close()
        if patient and patient.get('password') and check_password_hash(patient['password'], password):
            return jsonify({"message": "Login successful", "patient_id": patient['id'],
                            "username": patient['username'], "name": patient['name']}), 200
        return jsonify({"message": "Invalid username or password"}), 401
    except mysql.connector.Error as err:
        return jsonify({"message": str(err)}), 500


# ── Doctor Auth ───────────────────────────────────────────────────────────────
@app.route('/api/doctor/login', methods=['POST'])
def doctor_login():
    data = request.get_json()
    username, password = data.get('username'), data.get('password')
    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400
    try:
        db, cursor = get_db()
        cursor.execute("SELECT * FROM doctors WHERE username = %s", (username,))
        doctor = cursor.fetchone(); cursor.close(); db.close()
        if doctor and doctor.get('password') and check_password_hash(doctor['password'], password):
            return jsonify({"message": "Login successful", "doctor_id": doctor['id'],
                            "username": doctor['username'], "name": doctor['name'],
                            "specialty": doctor['specialty'], "status": doctor['status']}), 200
        return jsonify({"message": "Invalid username or password"}), 401
    except mysql.connector.Error as err:
        return jsonify({"message": str(err)}), 500


# ── Admin: Patients ───────────────────────────────────────────────────────────
@app.route('/api/patients', methods=['GET'])
def get_patients():
    try:
        db, cursor = get_db()
        cursor.execute("SELECT * FROM patients ORDER BY id DESC")
        patients = cursor.fetchall(); cursor.close(); db.close()
        return jsonify(patients), 200
    except mysql.connector.Error as err:
        return jsonify({"message": str(err)}), 500


@app.route('/api/patients', methods=['POST'])
def add_patient():
    data = request.get_json()
    if not data.get('name'):
        return jsonify({"message": "Patient name is required"}), 400
    try:
        db, cursor = get_db()
        cursor.execute(
            "INSERT INTO patients (name, age, gender, phone, email, address) VALUES (%s,%s,%s,%s,%s,%s)",
            (data.get('name'), data.get('age'), data.get('gender'),
             data.get('phone'), data.get('email'), data.get('address'))
        )
        db.commit(); cursor.close(); db.close()
        return jsonify({"message": "Patient added successfully"}), 201
    except mysql.connector.Error as err:
        return jsonify({"message": str(err)}), 500


@app.route('/api/patients/<int:patient_id>', methods=['GET'])
def get_patient(patient_id):
    try:
        db, cursor = get_db()
        cursor.execute("SELECT * FROM patients WHERE id = %s", (patient_id,))
        patient = cursor.fetchone(); cursor.close(); db.close()
        return jsonify(patient), 200 if patient else (jsonify({"message": "Not found"}), 404)
    except mysql.connector.Error as err:
        return jsonify({"message": str(err)}), 500


@app.route('/api/patients/<int:patient_id>', methods=['DELETE'])
def delete_patient(patient_id):
    try:
        db, cursor = get_db()
        cursor.execute("DELETE FROM patients WHERE id = %s", (patient_id,))
        db.commit(); cursor.close(); db.close()
        return jsonify({"message": "Patient deleted"}), 200
    except mysql.connector.Error as err:
        return jsonify({"message": str(err)}), 500


# ── Admin: Doctors ────────────────────────────────────────────────────────────
@app.route('/api/doctors', methods=['GET'])
def get_doctors():
    try:
        db, cursor = get_db()
        cursor.execute("SELECT * FROM doctors ORDER BY id DESC")
        doctors = cursor.fetchall(); cursor.close(); db.close()
        return jsonify(doctors), 200
    except mysql.connector.Error as err:
        return jsonify({"message": str(err)}), 500


@app.route('/api/doctors', methods=['POST'])
def add_doctor():
    data = request.get_json()
    if not data.get('name'):
        return jsonify({"message": "Doctor name is required"}), 400
    password = data.get('password')
    hashed = generate_password_hash(password) if password else None
    try:
        db, cursor = get_db()
        cursor.execute(
            "INSERT INTO doctors (name, specialty, status, phone, email, experience_years, username, password) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)",
            (data.get('name'), data.get('specialty'), data.get('status', 'Available'),
             data.get('phone'), data.get('email'), data.get('experience_years'),
             data.get('username'), hashed)
        )
        db.commit(); cursor.close(); db.close()
        return jsonify({"message": "Doctor added successfully"}), 201
    except mysql.connector.Error as err:
        return jsonify({"message": str(err)}), 500


@app.route('/api/doctors/<int:doctor_id>', methods=['DELETE'])
def delete_doctor(doctor_id):
    try:
        db, cursor = get_db()
        cursor.execute("DELETE FROM doctors WHERE id = %s", (doctor_id,))
        db.commit(); cursor.close(); db.close()
        return jsonify({"message": "Doctor deleted"}), 200
    except mysql.connector.Error as err:
        return jsonify({"message": str(err)}), 500


# ── Doctor Portal ─────────────────────────────────────────────────────────────
@app.route('/api/doctor/availability/<int:doctor_id>', methods=['PATCH'])
def toggle_availability(doctor_id):
    data = request.get_json()
    status = data.get('status')
    if not status:
        return jsonify({"message": "Status is required"}), 400
    try:
        db, cursor = get_db()
        cursor.execute("UPDATE doctors SET status = %s WHERE id = %s", (status, doctor_id))
        db.commit(); cursor.close(); db.close()
        return jsonify({"message": "Availability updated"}), 200
    except mysql.connector.Error as err:
        return jsonify({"message": str(err)}), 500


@app.route('/api/doctor/appointments/<int:doctor_id>', methods=['GET'])
def get_doctor_appointments(doctor_id):
    try:
        db, cursor = get_db()
        cursor.execute("""
            SELECT a.id, a.appointment_date, a.status,
                   p.name AS patient_name, p.age, p.gender, p.phone, p.email
            FROM appointments a
            JOIN patients p ON a.patient_id = p.id
            WHERE a.doctor_id = %s
            ORDER BY a.appointment_date ASC
        """, (doctor_id,))
        appointments = cursor.fetchall(); cursor.close(); db.close()
        return jsonify(appointments), 200
    except mysql.connector.Error as err:
        return jsonify({"message": str(err)}), 500


@app.route('/api/doctor/appointments/<int:appointment_id>/status', methods=['PATCH'])
def update_appointment_status(appointment_id):
    data = request.get_json()
    status = data.get('status')
    if not status:
        return jsonify({"message": "Status is required"}), 400
    try:
        db, cursor = get_db()
        cursor.execute("UPDATE appointments SET status = %s WHERE id = %s", (status, appointment_id))
        db.commit(); cursor.close(); db.close()
        return jsonify({"message": "Appointment updated"}), 200
    except mysql.connector.Error as err:
        return jsonify({"message": str(err)}), 500


# ── Patient Portal ────────────────────────────────────────────────────────────
@app.route('/api/patient/doctors', methods=['GET'])
def get_available_doctors():
    try:
        db, cursor = get_db()
        cursor.execute("SELECT id, name, specialty, status, experience_years, email, phone FROM doctors WHERE status = 'Available' ORDER BY name")
        doctors = cursor.fetchall(); cursor.close(); db.close()
        return jsonify(doctors), 200
    except mysql.connector.Error as err:
        return jsonify({"message": str(err)}), 500


@app.route('/api/patient/appointments', methods=['POST'])
def patient_book_appointment():
    data = request.get_json()
    patient_id, doctor_id, appointment_date = data.get('patient_id'), data.get('doctor_id'), data.get('appointment_date')
    if not patient_id or not doctor_id or not appointment_date:
        return jsonify({"message": "Patient, doctor and date are required"}), 400
    try:
        db, cursor = get_db()
        cursor.execute(
            "INSERT INTO appointments (patient_id, doctor_id, appointment_date, status) VALUES (%s,%s,%s,'Booked')",
            (patient_id, doctor_id, appointment_date)
        )
        db.commit(); cursor.close(); db.close()
        return jsonify({"message": "Appointment booked successfully"}), 201
    except mysql.connector.Error as err:
        return jsonify({"message": str(err)}), 500


@app.route('/api/patient/appointments/<int:patient_id>', methods=['GET'])
def get_patient_appointments(patient_id):
    try:
        db, cursor = get_db()
        cursor.execute("""
            SELECT a.id, a.appointment_date, a.status,
                   d.name AS doctor_name, d.specialty
            FROM appointments a
            LEFT JOIN doctors d ON a.doctor_id = d.id
            WHERE a.patient_id = %s
            ORDER BY a.appointment_date DESC
        """, (patient_id,))
        appointments = cursor.fetchall(); cursor.close(); db.close()
        return jsonify(appointments), 200
    except mysql.connector.Error as err:
        return jsonify({"message": str(err)}), 500


@app.route('/api/patient/appointments/<int:appointment_id>/cancel', methods=['PATCH'])
def cancel_appointment(appointment_id):
    try:
        db, cursor = get_db()
        cursor.execute("UPDATE appointments SET status = 'Cancelled' WHERE id = %s", (appointment_id,))
        db.commit(); cursor.close(); db.close()
        return jsonify({"message": "Appointment cancelled"}), 200
    except mysql.connector.Error as err:
        return jsonify({"message": str(err)}), 500


# ── Admin: Appointments ───────────────────────────────────────────────────────
@app.route('/api/appointments', methods=['GET'])
def get_appointments():
    try:
        db, cursor = get_db()
        cursor.execute("""
            SELECT a.id, p.name AS patient_name, d.name AS doctor_name,
                   a.appointment_date, a.status
            FROM appointments a
            JOIN patients p ON a.patient_id = p.id
            LEFT JOIN doctors d ON a.doctor_id = d.id
            ORDER BY a.id DESC
        """)
        appointments = cursor.fetchall(); cursor.close(); db.close()
        return jsonify(appointments), 200
    except mysql.connector.Error as err:
        return jsonify({"message": str(err)}), 500


@app.route('/api/appointments', methods=['POST'])
def add_appointment():
    data = request.get_json()
    if not data.get('patient_id') or not data.get('appointment_date'):
        return jsonify({"message": "Patient ID and date are required"}), 400
    try:
        db, cursor = get_db()
        cursor.execute(
            "INSERT INTO appointments (patient_id, doctor_id, appointment_date, status) VALUES (%s,%s,%s,%s)",
            (data.get('patient_id'), data.get('doctor_id'), data.get('appointment_date'), data.get('status', 'Booked'))
        )
        db.commit(); cursor.close(); db.close()
        return jsonify({"message": "Appointment added successfully"}), 201
    except mysql.connector.Error as err:
        return jsonify({"message": str(err)}), 500


@app.route('/api/appointments/<int:appointment_id>', methods=['DELETE'])
def delete_appointment(appointment_id):
    try:
        db, cursor = get_db()
        cursor.execute("DELETE FROM appointments WHERE id = %s", (appointment_id,))
        db.commit(); cursor.close(); db.close()
        return jsonify({"message": "Appointment deleted"}), 200
    except mysql.connector.Error as err:
        return jsonify({"message": str(err)}), 500


if __name__ == '__main__':
    app.run(debug=True)