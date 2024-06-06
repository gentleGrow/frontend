from enum import StrEnum


class ProviderEnum(StrEnum):
    GOOGLE = "google"
    KAKAO = "kakao"
    NAVER = "naver"


class UserRoleEnum(StrEnum):
    ADMIN = "admin"
    USER = "user"
