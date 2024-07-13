from flask import Flask, request, jsonify
from models.image_processor import ImageProcessor
from models.style_analyzer import StyleAnalyzer
from models.recommender import Recommender
from utils.firebase_utils import fetch_media_from_firebase
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


image_processor = ImageProcessor()
style_analyzer = StyleAnalyzer(n_clusters=5)
recommender = Recommender()

@app.route('/analyze', methods=['POST'])
def analyze_user_style():
    # Validate JSON payload
    json_data = request.json
    if not json_data or 'user_id' not in json_data:
        return jsonify({'error': 'Invalid JSON payload. Missing user_id.'}), 400

    user_id = json_data['user_id']
    media_urls = fetch_media_from_firebase(user_id)

    if not media_urls:
        return jsonify({'error': 'No media found for the user.'}), 404

    features = []
    for url in media_urls:
        feature = image_processor.process_image(url)
        features.append(feature)

    styles = [style_analyzer.analyze_style(feature) for feature in features]
    overall_style = style_analyzer.aggregate_style(styles)

    recommendations = recommender.get_recommendations(overall_style)

    # Build response including image_urls for recommendations
    response_recommendations = []
    for recommendation in recommendations:
        response_recommendations.append({
            'id': recommendation['id'],
            'name': recommendation['name'],
            'style': recommendation['style'],
            'image_urls': recommendation['image_urls']
        })

    return jsonify({
        'user_id': user_id,
        'overall_style': int(overall_style),
        'recommendations': response_recommendations
    })

if __name__ == '__main__':
    app.run(debug=True)
