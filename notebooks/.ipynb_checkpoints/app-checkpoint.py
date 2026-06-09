from flask import Flask, jsonify
from flask_cors import CORS  # 💡 import du module CORS
import json

app = Flask(__name__)
CORS(app)  # 💥 Autorise les requêtes depuis n’importe quelle origine

@app.route('/api/nautilus-data')
def get_nautilus_data():
    with open('../notebooks/escales2.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)

