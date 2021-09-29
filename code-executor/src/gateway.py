from flask import Flask, jsonify, request

from src.code_executor import CodeExecutor
from src.constants import URL

app = Flask(__name__)
executor = CodeExecutor(URL)


@app.route("/languages")
def get_languages():
    """
    Gets all the different supported languages.
    Returns a json list as a response
    """
    return jsonify(executor.get_supported_languages())


@app.route("/submission", methods="POST")
def submission():
    """
    Execute code and returns a submission tag
    """
    data = request.get_json()
    result = executor.send_to_execute(**data)
    return jsonify({"result": result})


if __name__ == "__main__":
    app.run(debug=True, host="", port=8000)
