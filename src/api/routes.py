"""
API endpoints for authentication, membership management, workouts/routines, progress tracking
and billing placeholders to back the front-end flows.
"""
from flask import request, jsonify, Blueprint
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from api.models import db, User, Workout, WorkoutExercise, Progress, BillingRecord
from api.utils import APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200


# ---------- AUTH ----------
@api.route('/register', methods=['POST'])
def register_user():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    full_name = data.get('full_name')
    user_type = data.get('user_type', 'customer')
    membership_level = data.get('membership_level', 'basic')

    if not email or not password:
        raise APIException("Email and password are required", status_code=400)

    if User.query.filter_by(email=email).first():
        raise APIException("User already exists", status_code=409)

    hashed = generate_password_hash(password)
    user = User(email=email, password=hashed, full_name=full_name,
                user_type=user_type, membership_level=membership_level, is_active=True)
    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=user.id)
    return jsonify({"token": token, "user": user.serialize()}), 201


@api.route('/login', methods=['POST'])
def login_user():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        raise APIException("Email and password are required", status_code=400)

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        raise APIException("Invalid credentials", status_code=401)

    token = create_access_token(identity=user.id)
    return jsonify({"token": token, "user": user.serialize()}), 200


@api.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        raise APIException("User not found", status_code=404)
    return jsonify(user.serialize()), 200


# ---------- MEMBERSHIP ----------
@api.route('/membership', methods=['PUT'])
@jwt_required()
def update_membership():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        raise APIException("User not found", status_code=404)

    data = request.get_json() or {}
    level = data.get('membership_level')
    if level not in ['basic', 'premium', 'vip']:
        raise APIException("Invalid membership level", status_code=400)

    user.membership_level = level
    db.session.commit()
    return jsonify({"user": user.serialize()}), 200


# ---------- WORKOUTS / ROUTINES ----------
@api.route('/workouts', methods=['GET', 'POST'])
@jwt_required()
def workouts():
    user_id = get_jwt_identity()
    current_user = User.query.get(user_id)
    if not current_user:
        raise APIException("User not found", status_code=404)

    if request.method == 'GET':
        # Coaches see created workouts, customers see assigned workouts
        if current_user.user_type == 'coach':
            items = Workout.query.filter_by(created_by=user_id).order_by(
                Workout.created_at.desc()).all()
        else:
            items = Workout.query.filter((Workout.assigned_to == user_id) | (
                Workout.created_by == user_id)).order_by(Workout.created_at.desc()).all()
        return jsonify([w.serialize() for w in items]), 200

    # POST create workout (coach by default, but allow user to self-create)
    data = request.get_json() or {}
    title = data.get('title')
    if not title:
        raise APIException("Title is required", status_code=400)

    workout = Workout(
        title=title,
        description=data.get('description'),
        membership_level=data.get(
            'membership_level', current_user.membership_level),
        created_by=user_id,
        assigned_to=data.get('assigned_to')
    )
    db.session.add(workout)

    exercises = data.get('exercises', [])
    for ex in exercises:
        w_ex = WorkoutExercise(
            workout=workout,
            name=ex.get('name', 'Exercise'),
            wger_exercise_id=ex.get('wger_exercise_id'),
            sets=ex.get('sets'),
            reps=ex.get('reps'),
            weight=ex.get('weight'),
            notes=ex.get('notes')
        )
        db.session.add(w_ex)

    db.session.commit()
    return jsonify(workout.serialize()), 201


@api.route('/workouts/<int:workout_id>', methods=['GET'])
@jwt_required()
def get_workout(workout_id):
    user_id = get_jwt_identity()
    workout = Workout.query.get(workout_id)
    if not workout:
        raise APIException("Workout not found", status_code=404)
    # Simple permission: allow owner, assigned user, or coach creator
    if workout.created_by != user_id and workout.assigned_to != user_id:
        raise APIException("Not authorized", status_code=403)
    return jsonify(workout.serialize()), 200


# ---------- PROGRESS ----------
@api.route('/progress', methods=['GET', 'POST'])
@jwt_required()
def progress():
    user_id = get_jwt_identity()

    if request.method == 'GET':
        logs = Progress.query.filter_by(user_id=user_id).order_by(
            Progress.logged_at.desc()).all()
        return jsonify([p.serialize() for p in logs]), 200

    data = request.get_json() or {}
    log = Progress(
        user_id=user_id,
        workout_id=data.get('workout_id'),
        exercise_name=data.get('exercise_name'),
        status=data.get('status', 'completed'),
        notes=data.get('notes')
    )
    db.session.add(log)
    db.session.commit()
    return jsonify(log.serialize()), 201


# ---------- BILLING (placeholder) ----------
@api.route('/billing', methods=['POST'])
@jwt_required()
def billing():
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    amount = data.get('amount')
    if amount is None:
        raise APIException("Amount is required", status_code=400)

    record = BillingRecord(
        user_id=user_id,
        amount=amount,
        currency=data.get('currency', 'USD'),
        status=data.get('status', 'pending'),
        description=data.get('description')
    )
    db.session.add(record)
    db.session.commit()
    return jsonify(record.serialize()), 201
