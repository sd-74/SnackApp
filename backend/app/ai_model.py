snacks = [
    {"name": "Chocolate Bar", "sweet": True, "salty": False},
    {"name": "Potato Chips", "sweet": False, "salty": True},
    {"name": "Trail Mix", "sweet": True, "salty": True},
    {"name": "Gummy Bears", "sweet": True, "salty": False},
    {"name": "Pretzels", "sweet": False, "salty": True},
    {"name": "Granola Bar", "sweet": True, "salty": False}
]

# snacks = [
#     {
#         "id": 1,
#         "name": "Chocolate Bar",
#         "tags": ["sweet", "chocolate", "creamy"],
#         "attributes": {
#             "sweet": 0.9,
#             "salty": 0.1,
#             "chocolate": 1.0,
#             "creamy": 0.8
#         }
#     },
#     {
#         "id": 2,
#         "name": "Flamin' Hot Cheetos",
#         "tags": ["salty", "spicy", "crunchy"],
#         "attributes": {
#             "sweet": 0.0,
#             "salty": 0.9,
#             "spicy": 0.8,
#             "crunchy": 1.0
#         }
#     }
# ]


def recommend_snacks(user_preferences):
    likes_sweet = user_preferences.get("likes_sweet", True)
    likes_salty = user_preferences.get("likes_salty", False)
    recommended_snacks = [
        snack["name"]
        for snack in snacks
        if (snack["sweet"] == likes_sweet or snack["salty"] == likes_salty)
    ]
    return recommended_snacks if recommended_snacks else ["No matching snacks found."]