from abc import ABC, abstractmethod


class AbstractCRUDRepository(ABC):
    @abstractmethod
    async def save(self, key, value, expiry: int) -> None:
        pass

    @abstractmethod
    async def get(self, key):
        pass
