from enum import StrEnum


class ProviderEnum(StrEnum):
    google = "google"
    kakao = "kakao"
    naver = "naver"


class UserRoleEnum(StrEnum):
    admin = "admin"
    user = "user"
