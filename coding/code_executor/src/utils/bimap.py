from typing import Any


class Bimap(object):
    def __init__(self, entries: list[tuple[Any, Any]]):
        """
        A bidirectional map for lookup
        Not meant to be mutated
        """
        self._forward_map = {}
        self._reverse_map = {}
        for key, value in entries:
            self._forward_map[key] = value
            self._reverse_map[value] = key

    def get_keys(self) -> Any:
        """Get all the keys"""
        return self._forward_map.keys()

    def get_values(self) -> Any:
        """Get all the values"""
        return self._reverse_map.keys()

    def get_value_from_key(self, key: Any) -> Any:
        """
        Gets the value from a key.
        Returns None if the key is not found.
        """
        return self._forward_map.get(key, None)

    def get_key_from_value(self, value: Any) -> Any:
        """
        Get a key from a value
        Returns None if the value is not found.
        """
        return self._reverse_map.get(value, None)


if __name__ == "__main__":
    m = Bimap([("hi", "hello")])
    assert m.get_key_from_value("hello") == "hi"
    assert m.get_key_from_value("hi") is None
    assert m.get_value_from_key("hi") == "hello"
    assert m.get_value_from_key("hello") is None
