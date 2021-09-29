from typing import Any, Union

from flask import Blueprint, Response, g, json, jsonify, request

from src.code_executor import CodeExecutor
from src.constants import CODE_KEY, INPUT_KEY, LANGUAGE_KEY, URL

executor_blueprint = Blueprint("/", __name__)


def get_executor() -> Union[Any, CodeExecutor]:
    """
    Returns the Code executor in current context.
    """
    if "executor" not in g:
        g.executor = CodeExecutor(URL)
    return g.executor


@executor_blueprint.route("/languages")
def get_languages() -> Response:
    """
    Gets all the different supported languages.
    Returns a json list as a response.
    """
    return jsonify(get_executor().get_supported_languages())


@executor_blueprint.route("/submission", methods=["POST"])
def submission() -> Response:
    """
    Execute code and returns a submission tag.
    """
    data = request.get_json()

    if data is None:
        return jsonify({"error": "invalid request"})

    # Check for valid args
    code = data.get(CODE_KEY, None)
    language = data.get(LANGUAGE_KEY, None)
    stdin = data.get(INPUT_KEY, None)
    if None in (code, language):
        return jsonify({"error": "missing either code, language or input"})

    executor = get_executor()
    language_id = executor.get_id_from_language(language)
    if language_id is None:
        return jsonify({"error": "language is not found"})

    result = executor.send_to_execute(code, language_id, stdin)
    return jsonify({"result": result})


@executor_blueprint.route("/submissions/<path:path>")
def get_submission(path: str) -> Response:
    """
    Gets the output of the results.
    """
    results = get_executor().get_results(path)
    return jsonify(results)
