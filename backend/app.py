import os
import uuid
from datetime import datetime, timezone, date, time
from flask import Flask, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_login import (
    LoginManager,
    UserMixin,
    login_user,
    logout_user,
    login_required,
    current_user,
)
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
from sqlalchemy.types import JSON

load_dotenv()

app = Flask(__name__, static_folder="../dist")
app.secret_key = os.getenv("SECRET_KEY", "dev-secret-key")

# Database Configuration
uri = os.getenv("NEON_URL") or os.getenv("DATABASE_URL")
if uri and uri.startswith("postgres://"):
    uri = uri.replace("postgres://", "postgresql://", 1)

app.config["SQLALCHEMY_DATABASE_URI"] = uri or "sqlite:///local.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)

# JSON-based login view (optional, since we handle 401 manually often)
login_manager.login_view = None

@app.route("/", defaults={'path': ''})
@app.route("/<path:path>")
def catch_all(path):
    if path.startswith("api"):
        return jsonify({"error": "Not found"}), 404
    
    # Check if file exists in dist (e.g. assets)
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
        
    return send_from_directory(app.static_folder, "index.html")


# ================= MODELS =================

class User(UserMixin, db.Model):
    __tablename__ = "users"
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Task(db.Model):
    __tablename__ = "tasks"
    id = db.Column(db.BigInteger, primary_key=True) # Frontend sends generated ID, often number
    # If frontend sends Date.now(), it's a big integer. 
    # Better to map frontend ID if provided, or generate new UUID if not. 
    # Frontend uses Date.now(). Let's stick to BigInt or String.
    # Actually, let's use String to be safe with UUIDs or BigInts.
    id = db.Column(db.String(50), primary_key=True) 
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    text = db.Column(db.Text, nullable=False)
    date = db.Column(db.String(20)) # storing YYYY-MM-DD as string is easiest for JSON
    tags = db.Column(JSON, default=list) # Store tags as JSON array
    status = db.Column(db.String(50), default="NOT STARTED")
    note = db.Column(db.Text)


class Goal(db.Model):
    __tablename__ = "goals"
    id = db.Column(db.String(50), primary_key=True)
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    text = db.Column(db.Text, nullable=False)
    priority = db.Column(db.String(20))
    date = db.Column(db.String(20))


class Reminder(db.Model):
    __tablename__ = "reminders"
    id = db.Column(db.String(50), primary_key=True)
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    text = db.Column(db.Text, nullable=False)
    date = db.Column(db.String(20))
    time = db.Column(db.String(10))
    repeat = db.Column(db.String(20))


class Habit(db.Model):
    __tablename__ = "habits"
    id = db.Column(db.String(50), primary_key=True)
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    text = db.Column(db.Text, nullable=False)
    frequency = db.Column(db.String(50))
    completions = db.Column(JSON, default=list) # Array of objects {date: ...}
    streak = db.Column(db.Integer, default=0)


@login_manager.user_loader
def load_user(user_id):
    return db.session.get(User, user_id)


@app.route("/api/init_db")
def init_db():
    if app.debug:
        db.create_all()
        return jsonify({"message": "Database initialized"})
    return jsonify({"error": "Not allowed"}), 403


# ================= AUTH =================

@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.json
    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Missing fields"}), 400

    email = data.get("email").lower()
    password = data.get("password")
    username = data.get("username") or email.split("@")[0]

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "Email already registered"}), 400

    try:
        new_user = User(
            id=str(uuid.uuid4()),
            email=email,
            username=username
        )
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()
        login_user(new_user)
        return jsonify({"success": True, "user": {"id": new_user.id, "email": new_user.email, "username": new_user.username}})
    except Exception as e:
        db.session.rollback()
        print(f"Signup error: {e}")
        return jsonify({"error": "Registration failed"}), 500


@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email").lower()
    password = data.get("password")
    user = User.query.filter_by(email=email).first()

    if user and user.check_password(password):
        login_user(user, remember=True)
        return jsonify({"success": True, "user": {"id": user.id, "email": user.email, "username": user.username}})
    
    return jsonify({"error": "Invalid credentials"}), 401


@app.route("/api/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return jsonify({"success": True})


@app.route("/api/check-auth")
def check_auth():
    if current_user.is_authenticated:
        return jsonify({"authenticated": True, "user": {"id": current_user.id, "email": current_user.email, "username": current_user.username}})
    return jsonify({"authenticated": False}), 401


# ================= CRUD HELPERS =================

def generic_get(Model, sort_key=None):
    if not current_user.is_authenticated:
        return jsonify([]), 401
    query = Model.query.filter_by(user_id=current_user.id)
    items = query.all()
    # Serialize
    result = []
    for item in items:
        # Convert model object to dict safely
        d = {}
        for column in item.__table__.columns:
            val = getattr(item, column.name)
            if column.name == 'user_id': continue
            d[column.name] = val
        result.append(d)
    return jsonify(result)

def generic_add(Model):
    if not current_user.is_authenticated:
        return jsonify({"error": "Unauthorized"}), 401
    data = request.json
    # Frontend may send 'id' or we generate it.
    # Frontend uses Date.now(). Let's use that if provided, else uuid.
    item_id = str(data.get("id")) if data.get("id") else str(uuid.uuid4())
    
    # Check if exists (upsert logic if needed, but 'add' implies new)
    # Frontend might send bulk replace sometimes? No, we switched to granular 'add'.
    
    new_item = Model(id=item_id, user_id=current_user.id)
    for key, val in data.items():
        if hasattr(new_item, key) and key != 'id':
            setattr(new_item, key, val)
            
    db.session.add(new_item)
    db.session.commit()
    return jsonify({"success": True, "id": item_id})

def generic_update(Model, item_id):
    if not current_user.is_authenticated:
        return jsonify({"error": "Unauthorized"}), 401
    item = db.session.get(Model, str(item_id))
    if not item or item.user_id != current_user.id:
        return jsonify({"error": "Not found"}), 404
        
    data = request.json
    for key, val in data.items():
        if hasattr(item, key) and key != 'id' and key != 'user_id':
            setattr(item, key, val)
            
    db.session.commit()
    return jsonify({"success": True})

def generic_delete(Model, item_id):
    if not current_user.is_authenticated:
        return jsonify({"error": "Unauthorized"}), 401
    item = db.session.get(Model, str(item_id))
    if not item or item.user_id != current_user.id:
        return jsonify({"error": "Not found"}), 404
        
    db.session.delete(item)
    db.session.commit()
    return jsonify({"success": True})


# ================= ROUTES =================

@app.route("/api/tasks", methods=["GET"])
def get_tasks(): return generic_get(Task)

@app.route("/api/tasks", methods=["POST"])
def add_task(): return generic_add(Task)

@app.route("/api/tasks/<id>", methods=["PUT"])
def update_task(id): return generic_update(Task, id)

@app.route("/api/tasks/<id>", methods=["DELETE"])
def delete_task(id): return generic_delete(Task, id)


@app.route("/api/goals", methods=["GET"])
def get_goals(): return generic_get(Goal)

@app.route("/api/goals", methods=["POST"])
def add_goal(): return generic_add(Goal)

@app.route("/api/goals/<id>", methods=["PUT"])
def update_goal(id): return generic_update(Goal, id)

@app.route("/api/goals/<id>", methods=["DELETE"])
def delete_goal(id): return generic_delete(Goal, id)


@app.route("/api/reminders", methods=["GET"])
def get_reminders(): return generic_get(Reminder)

@app.route("/api/reminders", methods=["POST"])
def add_reminder(): return generic_add(Reminder)

@app.route("/api/reminders/<id>", methods=["PUT"])
def update_reminder(id): return generic_update(Reminder, id)

@app.route("/api/reminders/<id>", methods=["DELETE"])
def delete_reminder(id): return generic_delete(Reminder, id)


@app.route("/api/habits", methods=["GET"])
def get_habits(): return generic_get(Habit)

@app.route("/api/habits", methods=["POST"])
def add_habit(): return generic_add(Habit)

@app.route("/api/habits/<id>", methods=["PUT"])
def update_habit(id): return generic_update(Habit, id)

@app.route("/api/habits/<id>", methods=["DELETE"])
def delete_habit(id): return generic_delete(Habit, id)


if __name__ == "__main__":
    app.run(debug=True, port=5000)