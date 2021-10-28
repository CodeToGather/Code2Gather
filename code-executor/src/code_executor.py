import base64
import json
from typing import Optional, Union

import requests
from src.constants import (
    BASE64_RESULTS_FIELDS,
    ERROR_KEY,
    ID_KEY,
    JSON_HEADERS,
    LANGUAGE_ID_KEY,
    LANGUAGES_URL,
    NAME_KEY,
    SOURCE_CODE_KEY,
    STATUS_KEY,
    STDIN_KEY,
    SUBMISSION_RETRIEVAL_URL,
    SUBMISSIONS_SEND_URL,
    TOKEN_KEY,
    URL,
)
from src.utils.bimap import Bimap


class CodeExecutor:
    def __init__(self, judge_url: str) -> None:
        """
        Code Executor.
        Sends code execution instructions to remote Judge0 API
        """
        if len(judge_url) == 0:
            raise ValueError("URL cannot be empty")
        self._url = judge_url
        self._languages: Bimap[int, str] = self._set_supported_languages()

    def _create_send_payload(
        self, code: str, language_id: int, input: Optional[str]
    ) -> dict[str, Optional[Union[str, int]]]:
        return {
            SOURCE_CODE_KEY: code,
            LANGUAGE_ID_KEY: language_id,
            STDIN_KEY: input,
        }

    def send_to_execute(
        self, code: str, language_id: int, input: Optional[str]
    ) -> tuple[Optional[str], Optional[str]]:
        """
        Sends the code to an executor to be executed.
        Language is based on the language id that is provided
        Input is entry to stdin

        Returns a submission_id containing the results of the output.
        On error returns None
        """
        response = requests.post(
            SUBMISSIONS_SEND_URL.format(url=self._url),
            json.dumps(self._create_send_payload(code, language_id, input)),
            headers=JSON_HEADERS,
        )
        resp_body = json.loads(response.content)
        submission_id = resp_body.get(TOKEN_KEY, None)
        error_msg = resp_body.get(ERROR_KEY, None)
        return (str(submission_id) if submission_id is not None else None, error_msg)

    def _convert_from_base64(self, result: dict, key: str) -> None:
        """Converts a give key of the result from base 64"""
        if key in result and result[key] is not None:
            result[key] = base64.b64decode(result[key]).decode()

    def _get_results(self, submission_id: str) -> dict:
        """Retrieves result from the server 1 time."""
        response = requests.get(
            SUBMISSION_RETRIEVAL_URL.format(url=self._url, submission_id=submission_id)
        )
        return dict(json.loads(response.content))

    def get_results(
        self, submission_id: str, block: bool = True
    ) -> dict[str, Optional[Union[str, None, int]]]:
        """This method will block and return the submission"""
        result = self._get_results(submission_id)

        while block and result.get(STATUS_KEY, {}).get(ID_KEY, None) == 1:
            result = self._get_results(submission_id)

        for b64_attr in BASE64_RESULTS_FIELDS:
            self._convert_from_base64(result, b64_attr)
        return result

    def _set_supported_languages(self) -> Bimap:
        """
        Returns a Bimap of language that is supported by the executor.
        Throws an error if there is a connection error.
        """
        response = requests.get(LANGUAGES_URL.format(url=self._url))
        languageList = json.loads(response.content)
        return Bimap(map(lambda x: (x[ID_KEY], x[NAME_KEY]), languageList))

    def get_language_from_id(self, id: int) -> Optional[str]:
        """
        Gets the programming language from the id.
        Returns None is the id is not found
        """
        return self._languages.get_value_from_key(id)

    def get_id_from_language(self, language: str) -> Optional[int]:
        """
        Gets the id of the language from the name
        Returns None if the language is not found
        """
        return self._languages.get_key_from_value(language)

    def get_supported_languages(self) -> list[str]:
        """Get all the programming languages that are supported"""
        return list(self._languages.get_values())


def main():
    codeExecutor = CodeExecutor(URL)
    languages = codeExecutor.get_supported_languages()
    language = languages[-9]
    lang_id = codeExecutor.get_id_from_language(language)
    print(f"{language}: {lang_id}")
    if lang_id is None:
        return

    submission_id, error = codeExecutor.send_to_execute(
        # "import ctypes\nx = ctypes.c_double.from_param(1e300)\nrepr(x)",
        "print('hello world')",
        lang_id,
        None,
    )
    print(f"Id: {submission_id}\nError: {error}")
    if submission_id is None:
        return

    results = codeExecutor.get_results(submission_id)
    print(results)


if __name__ == "__main__":
    main()
