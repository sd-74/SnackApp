from flask import Blueprint, jsonify
from .ai_model import recommend_snacks

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return "Backend is working!"

@main.route('/recommend', methods=['POST'])
def recommend():
    user_preferences = {"likes sweet": True, "likes_salty": False}
    recommendations = recommend_snacks(user_preferences)
    return jsonify(recommendations)