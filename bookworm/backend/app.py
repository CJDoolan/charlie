from flask import Flask, render_template, request, redirect, url_for, session, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash
from werkzeug.utils import secure_filename
import os
from datetime import timedelta

app = Flask(__name__, template_folder='../frontend', static_folder='../frontend', static_url_path='')

# Secret key for session management
app.secret_key = 'your_secret_key'

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Make session permanent to last across page reloads and browser sessions
app.permanent_session_lifetime = timedelta(days=7)  # Session lasts for 7 days

@app.before_request
def make_session_permanent():
    session.permanent = True

# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)

# Create the database
with app.app_context():
    db.create_all()

@app.route('/')
def first():
    return render_template('firstpage.html')  # Serve the first page

@app.route('/signup')
def signup():
    return render_template('signup.html')  # Serve the signup page

@app.route('/login')
def login():
    return render_template('login.html')  # Serve the login page

@app.route('/startReading')
def startReading():
    return render_template('startReading.html')  # Serve the login page

@app.route('/backend/uploads/<path:filename>')
def serve_file(filename):
    return send_from_directory('../backend/uploads', filename)

@app.route('/pageReader')
def pageReader():
    return render_template('pageReader.html')  # Serve the login page



@app.route('/home')
def home():
    # Retrieve the user's name from the session
    user_name = session.get('user_name', 'Guest')
    filename = session.get('filename', 'No file selected')

    print("User_Name: ", user_name)
    print("Filename:", filename)
    print(f"Session data: {session}")  # Debugging line
    return render_template('home.html', name=user_name)  # Pass the name to the template

@app.route('/bookLog')
def bookLog():
    
    # filename = session.get('filename', 'No file selected')
    # print("Filename:", filename)
    print(f"Session data: {session}")  # Debugging line
    return render_template('bookLog.html')

@app.route('/submit-login', methods=['POST'])
def login_post():
    
    email = request.form.get('email')
    password = request.form.get('password')

    if email and password:
        # Check if the user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            # If the email exists, redirect to home
            session['user_name'] = existing_user.name  # Set session data to the existing user's name
            return redirect(url_for('home'))  # Redirect to the home route

        return "Error: User does not exist.", 400

        # Redirect to the /home route after successful signup
        return redirect(url_for('home'))  # Redirect to the home route

    # If something goes wrong (e.g., data is missing), show an error
    return "Error: Missing information.", 400


@app.route('/submit-signup', methods=['POST'])
def submit_signup():
    name = request.form.get('name')
    email = request.form.get('email')
    password = request.form.get('password')

    if name and email and password:
        # Check if the user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return "Error: User already exists.", 400

        # Hash the password using the PBKDF2 algorithm
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

        # Create a new user instance
        new_user = User(name=name, email=email, password=hashed_password)

        # Add the user to the database
        db.session.add(new_user)
        db.session.commit()

        # Store the user's name in the session
        session['user_name'] = new_user.name

        # Redirect to the /home route after successful signup
        return redirect(url_for('home'))  # Redirect to the home route

    # If something goes wrong (e.g., data is missing), show an error
    return "Error: Missing information.", 400



UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
ALLOWED_EXTENSIONS = {'pdf'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
    print(f"Created upload folder: {UPLOAD_FOLDER}")

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload_pdf():
    if 'file' not in request.files:
        return jsonify({"message": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        session['filename'] = filename
        print("Filename:", filename)
        print(f"Filename saved to session: {filename}")

     
        if os.path.exists(file_path):
            print(f"File exists at: {file_path}")
            print(f"File size: {os.path.getsize(file_path)} bytes")
        return jsonify({
            "message": "File uploaded successfully",
            "filename": filename
        }), 200
    
    return jsonify({"message": "Invalid file type"}), 400

@app.route('/api/get-uploads', methods=['GET'])
def get_uploads():
    try:
        # Get the list of files in the uploads folder
        files = os.listdir(app.config['UPLOAD_FOLDER'])
        # Filter only PDF files
        pdf_files = [file for file in files if file.lower().endswith('.pdf')]
        return jsonify(pdf_files), 200
    except Exception as e:
        print(f"Error retrieving files: {str(e)}")
        return jsonify({"message": f"Error retrieving files: {str(e)}"}), 500

# @app.route('/api/get-pdf/<filename>', methods=['GET'])
# def get_pdf(filename):
#     try:
#         filename = secure_filename(filename)
#         file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
#         print(f"Attempting to serve file from: {file_path}")
        
#         if os.path.exists(file_path):
#             print(f"File found: {file_path}")
#             print(f"File size: {os.path.getsize(file_path)} bytes")
            
#             response = send_from_directory(app.config['UPLOAD_FOLDER'], filename)
#             response.headers['Content-Type'] = 'application/pdf'
#             response.headers['Access-Control-Allow-Origin'] = '*'
#             response.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
#             response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
#             response.headers['Cache-Control'] = 'no-cache'
#             print("Response headers:", dict(response.headers))
#             return response
#         else:
#             print(f"File not found: {file_path}")
#             return jsonify({"message": "File not found"}), 404
#     except Exception as e:
#         print(f"Error serving file: {str(e)}")
#         return jsonify({"message": f"Error serving file: {str(e)}"}), 500
    

@app.route('/save-reading-time', methods=['POST'])
def save_reading_time():
    data = request.get_json()
    reading_time = data.get('readingTime')
    if reading_time:
        session['reading_time'] = reading_time  # Save the reading time in the session
        return jsonify({"status": "success", "message": "Reading time saved", "reading_time": reading_time}), 200
    else:
        return jsonify({"status": "error", "message": "No reading time provided"}), 400



if __name__ == "__main__":
    app.run(debug=True)


