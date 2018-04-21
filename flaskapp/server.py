from flask import Flask
from flask import request
import flask
import json
import pprint

import sys
sys.path.insert(0, '../server')

from process_text import process_text as get_rank

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/process', methods=['POST'])
def process():
	print(request)
	json_data = request.get_json()
	print(json_data)
	json_data = json_data['messages']
	print(json_data)
	print(json_data.items())
	results = get_rank(json_data.items())
	response = flask.jsonify({'results': results})
	response.headers.add('Access-Control-Allow-Origin', '*')
	return response

from flask import request

def shutdown_server():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()

@app.route('/shutdown', methods=['POST'])
def shutdown():
	shutdown_server()
	resp = flask.make_response()
	resp.headers['Access-Control-Allow-Origin'] = '*'
	return resp
	return 'Server shutting down...'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8081)