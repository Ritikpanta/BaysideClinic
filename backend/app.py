from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash
import config
from lockout_helper import check_lockout, record_failed_attempt, reset_lockout
import re

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

def get_db():
    db = mysql.connector.connect(
        host=config.DB_HOST,
        port=config.DB_PORT,
        user=config.DB_USER,
        password=config.DB_PASSWORD,
        database=config.DB_NAME,
        ssl_disabled=False,
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
    username = (data.get('username') or '').strip()
    password = (data.get('password') or '').strip()

    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    db, cursor = get_db()

    try:
        is_locked, lock_msg, seconds_remaining = check_lockout(cursor, "users", username)
        if is_locked:
            return jsonify({
                "message": lock_msg,
                "seconds_remaining": seconds_remaining
            }), 429

        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()

        if not user or not user.get('password') or not check_password_hash(user['password'], password):
            record_failed_attempt(cursor, db, "users", username)
            return jsonify({"message": "Invalid username or password"}), 401

        reset_lockout(cursor, db, "users", username)

        return jsonify({
            "message": "Login successful",
            "role": user['role'],
            "username": user['username']
        }), 200

    except Exception as e:
        print("ADMIN LOGIN ERROR:", e)
        return jsonify({"message": "Server error"}), 500

    finally:
        cursor.close()
        db.close()
# ── Patient Auth ──────────────────────────────────────────────────────────────
@app.route('/api/patient/register', methods=['POST'])
def patient_register():
    data = request.get_json()

    name = (data.get('name') or '').strip()
    username = (data.get('username') or '').strip()
    password = (data.get('password') or '').strip()
    email = (data.get('email') or '').strip()
    phone = (data.get('phone') or '').strip()
    gender = (data.get('gender') or '').strip()
    age_raw = (data.get('age') or '').strip()

    name_pattern = r"^[A-Za-z\s'-]{2,50}$"
    username_pattern = r'^[a-zA-Z0-9_]{4,20}$'
    email_pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    phone_pattern = r'^\d{10}$'
    password_pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_\-]).{8,}$'

    if not name:
        return jsonify({"message": "Full name is required", "field": "name"}), 400
    if not re.match(name_pattern, name):
        return jsonify({"message": "Enter a proper full name", "field": "name"}), 400
    if len(name.split()) < 2:
        return jsonify({"message": "Please enter first and last name", "field": "name"}), 400

    if not username:
        return jsonify({"message": "Username is required", "field": "username"}), 400
    if not re.match(username_pattern, username):
        return jsonify({
            "message": "Username must be 4 to 20 characters and contain only letters, numbers, or underscore",
            "field": "username"
        }), 400

    if not password:
        return jsonify({"message": "Password is required", "field": "password"}), 400
    if not re.match(password_pattern, password):
        return jsonify({
            "message": "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
            "field": "password"
        }), 400

    if not age_raw:
        return jsonify({"message": "Age is required", "field": "age"}), 400
    try:
        age = int(age_raw)
        if age < 1 or age > 120:
            return jsonify({"message": "Enter a valid age between 1 and 120", "field": "age"}), 400
    except ValueError:
        return jsonify({"message": "Age must be a valid number", "field": "age"}), 400

    if not gender:
        return jsonify({"message": "Gender is required", "field": "gender"}), 400

    if not phone:
        return jsonify({"message": "Phone number is required", "field": "phone"}), 400
    if not re.match(phone_pattern, phone):
        return jsonify({"message": "Enter a valid 10-digit phone number", "field": "phone"}), 400

    if not email:
        return jsonify({"message": "Email is required", "field": "email"}), 400
    if not re.match(email_pattern, email):
        return jsonify({"message": "Enter a valid email address", "field": "email"}), 400

    try:
        db, cursor = get_db()

        cursor.execute("SELECT id FROM patients WHERE username = %s", (username,))
        if cursor.fetchone():
            cursor.close()
            db.close()
            return jsonify({"message": "Username already exists", "field": "username"}), 400

        cursor.execute("SELECT id FROM patients WHERE email = %s", (email,))
        if cursor.fetchone():
            cursor.close()
            db.close()
            return jsonify({"message": "Email already exists", "field": "email"}), 400

        cursor.execute(
            """
            INSERT INTO patients (name, username, password, email, phone, age, gender)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (
                name,
                username,
                generate_password_hash(password),
                email,
                phone,
                age,
                gender
            )
        )

        db.commit()
        patient_id = cursor.lastrowid
        cursor.close()
        db.close()

        return jsonify({
            "message": "Registered successfully",
            "patient_id": patient_id,
            "username": username,
            "name": name
        }), 201

    except mysql.connector.Error as err:
        return jsonify({"message": str(err)}), 500

@app.route('/api/patient/login', methods=['POST'])
def patient_login():
    data = request.get_json()
    username = (data.get('username') or '').strip()
    password = (data.get('password') or '').strip()

    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    db, cursor = get_db()

    try:
        is_locked, lock_msg, seconds_remaining = check_lockout(cursor, "patients", username)
        if is_locked:
            return jsonify({
                "message": lock_msg,
                "seconds_remaining": seconds_remaining
            }), 429

        cursor.execute("SELECT * FROM patients WHERE username = %s", (username,))
        patient = cursor.fetchone()

        if not patient or not patient.get('password') or not check_password_hash(patient['password'], password):
            record_failed_attempt(cursor, db, "patients", username)
            return jsonify({"message": "Invalid username or password"}), 401

        reset_lockout(cursor, db, "patients", username)

        return jsonify({
            "message": "Login successful",
            "patient_id": patient['id'],
            "username": patient['username'],
            "name": patient['name']
        }), 200

    except Exception as e:
        print("Patient login error:", e)
        return jsonify({"message": "Server error"}), 500

    finally:
        cursor.close()
        db.close()
    
# ── Doctor Auth ───────────────────────────────────────────────────────────────
@app.route('/api/doctor/login', methods=['POST'])
@app.route('/api/doctor/login', methods=['POST'])
def doctor_login():
    data = request.get_json()
    username = (data.get('username') or '').strip()
    password = (data.get('password') or '').strip()

    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    db, cursor = get_db()

    try:
        is_locked, lock_msg, seconds_remaining = check_lockout(cursor, "doctors", username)
        if is_locked:
            return jsonify({
                "message": lock_msg,
                "seconds_remaining": seconds_remaining
            }), 429

        cursor.execute("SELECT * FROM doctors WHERE username = %s", (username,))
        doctor = cursor.fetchone()

        if not doctor or not doctor.get('password') or not check_password_hash(doctor['password'], password):
            record_failed_attempt(cursor, db, "doctors", username)
            return jsonify({"message": "Invalid username or password"}), 401

        reset_lockout(cursor, db, "doctors", username)

        return jsonify({
            "message": "Login successful",
            "doctor_id": doctor['id'],
            "username": doctor['username'],
            "name": doctor['name'],
            "specialty": doctor['specialty'],
            "status": doctor['status']
        }), 200

    except Exception as e:
        print("DOCTOR LOGIN ERROR:", e)
        return jsonify({"message": "Server error"}), 500

    finally:
        cursor.close()
        db.close()

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