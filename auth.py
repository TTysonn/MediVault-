from flask import Blueprint, request, jsonify
from config import users_collection
from flask_jwt_extended import create_access_token
import bcrypt

auth = Blueprint("auth", __name__)

# REGISTER
@auth.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    existing_user = users_collection.find_one({"email": email})
    if existing_user:
        return jsonify({"error": "Email already registered"}), 409

    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    users_collection.insert_one({
        "name": name,
        "email": email,
        "password": hashed_password
    })

    return jsonify({"message": "User registered successfully"}), 201


# LOGIN
@auth.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found"}), 404

    password_matches = bcrypt.checkpw(
        password.encode("utf-8"),
        user["password"]
    )
    if not password_matches:
        return jsonify({"error": "Invalid password"}), 401

    token = create_access_token(identity=str(user["_id"]))

    return jsonify({
        "message": "Login successful",
        "token": token,
        "name": user["name"]
    }), 200