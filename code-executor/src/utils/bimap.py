from typing import Generic, Iterable, Optional, TypeVar

KT = TypeVar("KT")
VT = TypeVar("VT")


class Bimap(Generic[KT, VT]):
    def __init__(self, entries: Iterable[tuple[KT, VT]]) -> None:
        """
        A bidirectional map for lookup.
        Not meant to be mutated.

        Invariant: Bijective key-value pairings.
        """
        self._forward_map: dict[KT, VT] = {}
        self._reverse_map: dict[VT, KT] = {}
        for key, value in entries:
            self._forward_map[key] = value
            self._reverse_map[value] = key

    def get_keys(self) -> list[KT]:
        """Get all the keys"""
        return list(self._forward_map.keys())

    def get_values(self) -> list[VT]:
        """Get all the values"""
        return list(self._reverse_map.keys())

    def get_value_from_key(self, key: KT) -> Optional[VT]:
        """
        Gets the value from a key.
        Returns None if the key is not found.
        """
        return self._forward_map.get(key, None)

    def get_key_from_value(self, value: VT) -> Optional[KT]:
        """
        Get a key from a value
        Returns None if the value is not found.
        """
        return self._reverse_map.get(value, None)
