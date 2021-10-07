from typing import Any, Union

import requests
from flask import Blueprint, Response, abort, g, json, jsonify, request

from src.code_executor import CodeExecutor
from src.constants import CODE_KEY, INPUT_KEY, LANGUAGE_KEY, URL

executor_blueprint = Blueprint("/", __name__)


def get_executor() -> Union[Any, CodeExecutor]:
    """
    Returns the Code executor in current context.
    """
    try:
        if "executor" not in g:
            g.executor = CodeExecutor(URL)
        return g.executor
    except requests.exceptions.RequestException:
        abort(500, description={"error": "Execution server is down"})


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
        return abort(401, description={"error": "invalid request or not json request"})

    # Check for valid args
    code = data.get(CODE_KEY, None)
    language = data.get(LANGUAGE_KEY, None)
    stdin = data.get(INPUT_KEY, None)
    if None in (code, language):
        return abort(401, description={"error": "missing either code, language"})

    executor = get_executor()
    language_id = executor.get_id_from_language(language)
    if language_id is None:
        return abort(404, description={"error": "language is not found"})

    result, error = executor.send_to_execute(code, language_id, stdin)
    if result is None:
        return abort(503, description={"error": f"Error: {error}"})
    return jsonify({"result": result})


@executor_blueprint.route("/submissions/<path:path>")
def get_submission(path: str) -> Response:
    """
    Gets the output of the results.
    """
    results = get_executor().get_results(path)
    return jsonify(results)


@executor_blueprint.errorhandler(500)
@executor_blueprint.errorhandler(404)
@executor_blueprint.errorhandler(401)
@executor_blueprint.errorhandler(503)
def error_wrapper(e):
    return jsonify(e.description), e.code
