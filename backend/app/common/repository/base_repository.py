from abc import ABC, abstractmethod


class AbstractCRUDRepository(ABC):
    @abstractmethod
    async def save(self, key: str, value: str | int, expiry: int) -> None:
        pass

    @abstractmethod
    async def get(self, key: str) -> str | int | None:
        pass
