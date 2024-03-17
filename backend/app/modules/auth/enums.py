from enum import Enum


class ProviderEnum(str, Enum):
    google = "google"
    kakao = "kakao"
    naver = "naver"


class UserRoleEnum(str, Enum):
    admin = "admin"
    user = "user"
