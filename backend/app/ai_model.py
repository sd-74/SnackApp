def recommend_snacks(preferences):

    if preferences["likes sweet"]:
        return {"recommendations:": ["ice cream", "candy"]}
    else:
        return {"recommendations:": ["chips", "pretzels"]}