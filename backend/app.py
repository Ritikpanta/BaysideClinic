from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash
import config

app = Flask(__name__)
CORS(app)

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

@app.route('/api/test-db', methods=['GET'])
def test_db():
    try:
        db, cursor = get_db()
        cursor.execute("SELECT 1")
        cursor.close()
        db.close()
        return jsonify({"message": "Database connected successfully"}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')
    if not username or not password or not role:
        return jsonify({"message": "All fields are required"}), 400
    hashed_password = generate_password_hash(password)
    try:
        db, cursor = get_db()
        cursor.execute("INSERT INTO users (username, password, role) VALUES (%s, %s, %s)", (username, hashed_password, role))
        db.commit()
        cursor.close()
        db.close()
        return jsonify({"message": "User registered successfully"}), 201
    except mysql.connector.Error as err:
        return jsonify({"message": str(err)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400
    try:
        db, cursor = get_db()
        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()
        cursor.close()
        db.close()
        if user and check_password_hash(user['password'], password):
            return jsonify({"message": "Login successful", "role": user['role'], "username": user['username']}), 200
        return jsonify({"message": "Invalid username or password"}), 401
    except mysql.connector.Error as err:
        return jsonify({"message": str(err)}), 500

@app.route('/api/patients', methods=['GET'])
def get_patients():
    try:
        db, cursor = get_db()
        cursor.execute("SELECT * FROM patients ORDER BY id DESC")
        patients = cursor.fetchall()
        cursor.close()
        db.close()
        return jsonify(patients), 200
    except mysql.connector.Error as err:
        return jsonify({"message": str(err)}), 500

@app.route('/api/patients', methods=['POST'])
def add_patient():
    data = request.get_json()
    name = data.get('name')
    age = data.get('age')
    gender = data.get('gender')
    phone = data.get('phone')
    email = data.get('email')
    address = data.get('address')
    if not name:
        return jsonify({"message": "Patient name is required"}), 400
    try:
        db, cursor = get_db()
        cursor.execute("INSERT INTO patients (name, age, gender, phone, email, address) VALUES (%s, %s, %s, %s, %s, %s)", (name, age, gender, phone, email, address))
        db.commit()
        cursor.close()
        db.close()
        return jsonify({"message": "Patient added successfully"}), 201
    except mysql.connector.Error as err:
        return jsonify({"message": str(err)}), 500

@app.route('/api/patients/<int:patient_id>', methods=['DELETE'])
def delete_patient(patient_id):
    try:
        db, cursor = get_db()
        cursor.execute("DELETE FROM patients WHERE id = %s", (patient_id,))
        db.commit()
        cursor.close()
        db.close()
        return jsonify({"message": "Patient deleted successfully"}), 200
    except mysql.connector.Error as err:
        return jsonify({"message": str(err)}), 500

@app.route('/api/appointments', methods=['GET'])
def get_appointments():
    try:
        db, cursor = get_db()
        cursor.execute("""
            SELECT appointments.id, patients.name AS patient_name,
                   appointments.appointment_date, appointments.status
            FROM appointments
            JOIN patients ON appointments.patient_id = patients.id
            ORDER BY appointments.id DESC
        """)
        appointments = cursor.fetchall()
        cursor.close()
        db.close()
        return jsonify(appointments), 200
    except mysql.connector.Error as err:
        return jsonify({"message": str(err)}), 500

@app.route('/api/appointments', methods=['POST'])
def add_appointment():
    data = request.get_json()
    patient_id = data.get('patient_id')
    appointment_date = data.get('appointment_date')
    status = data.get('status', 'Booked')
    if not patient_id or not appointment_date:
        return jsonify({"message": "Patient ID and appointment date are required"}), 400
    try:
        db, cursor = get_db()
        cursor.execute("INSERT INTO appointments (patient_id, appointment_date, status) VALUES (%s, %s, %s)", (patient_id, appointment_date, status))
        db.commit()
        cursor.close()
        db.close()
        return jsonify({"message": "Appointment added successfully"}), 201
    except mysql.connector.Error as err:
        return jsonify({"message": str(err)}), 500

@app.route('/api/appointments/<int:appointment_id>', methods=['DELETE'])
def delete_appointment(appointment_id):
    try:
        db, cursor = get_db()
        cursor.execute("DELETE FROM appointments WHERE id = %s", (appointment_id,))
        db.commit()
        cursor.close()
        db.close()
        return jsonify({"message": "Appointment deleted successfully"}), 200
    except mysql.connector.Error as err:
        return jsonify({"message": str(err)}), 500

if __name__ == '__main__':
    app.run(debug=True)