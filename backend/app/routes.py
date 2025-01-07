from flask import Blueprint, jsonify, request
from .ai_model import recommend_snacks

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return "Backend is working!"

@main.route('/recommend', methods=['POST'])
def recommend():
    try:
        user_preferences = request.json
        recommendations = recommend_snacks(user_preferences)
        return jsonify(recommendations)
    except Exception as e:
        return jsonify({"error": str(e)})
