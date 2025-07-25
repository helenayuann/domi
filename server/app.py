from flask import Flask, request, jsonify
from flask_smorest import Api
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config['API_TITLE'] = 'Design My Space API'
app.config['API_VERSION'] = '1.0'
app.config['OPENAPI_VERSION'] = '3.0.2'
app.config['OPENAPI_YAML'] = 'api.yaml'
app.config['OPENAPI_URL_PREFIX'] = '/api/docs'
app.config['OPENAPI_SWAGGER_UI_PATH'] = '/swagger-ui'
app.config['OPENAPI_SWAGGER_UI_URL'] = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist/'

api = Api(app)

@app.route('/api/generate-moodboard', methods=['POST'])
def generate_moodboard():
    data = request.get_json()
    room = data.get('room')
    vibe = data.get('vibe')
    images = [
        f"https://source.unsplash.com/random/800x600/?{room}-{vibe}-{i}"
        for i in range(6)
    ]
    return jsonify({'images': images})

if __name__ == '__main__':
    app.run(debug=True)