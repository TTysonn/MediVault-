from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from config import documents_collection
from bson.objectid import ObjectId
import os
import uuid

documents = Blueprint("documents", __name__)

UPLOAD_FOLDER = "uploads"

# UPLOAD
@documents.route("/upload", methods=["POST"])
@jwt_required()
def upload_document():
    user_id = get_jwt_identity()

    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    # Generate unique filename
    ext = file.filename.rsplit(".", 1)[-1].lower()
    unique_filename = str(uuid.uuid4()) + "." + ext
    file_path = os.path.join(UPLOAD_FOLDER, unique_filename)

    # Save file to uploads folder
    file.save(file_path)

    # Save metadata to MongoDB
    documents_collection.insert_one({
        "user_id": user_id,
        "original_name": file.filename,
        "saved_name": unique_filename,
        "file_path": file_path,
        "category": "Uncategorized",
        "extracted_text": ""
    })

    return jsonify({"message": "File uploaded successfully", "filename": unique_filename}), 201


# GET ALL DOCUMENTS
@documents.route("/", methods=["GET"])
@jwt_required()
def get_documents():
    user_id = get_jwt_identity()

    docs = documents_collection.find({"user_id": user_id})

    result = []
    for doc in docs:
        result.append({
            "id": str(doc["_id"]),
            "original_name": doc["original_name"],
            "category": doc["category"],
            "file_path": doc["file_path"]
        })

    return jsonify({"documents": result}), 200


# DELETE DOCUMENT
@documents.route("/<doc_id>", methods=["DELETE"])
@jwt_required()
def delete_document(doc_id):
    user_id = get_jwt_identity()

    doc = documents_collection.find_one({
        "_id": ObjectId(doc_id),
        "user_id": user_id
    })

    if not doc:
        return jsonify({"error": "Document not found"}), 404

    # Delete file from uploads folder
    if os.path.exists(doc["file_path"]):
        os.remove(doc["file_path"])

    # Delete from MongoDB
    documents_collection.delete_one({"_id": ObjectId(doc_id)})

    return jsonify({"message": "Document deleted successfully"}), 200