from app.module.auth.constant import JWT_ACCESS_TIME_MINUTE, JWT_REFRESH_TIME_MINUTE


class TestJWTBuilder:
    def test_equal_jwt_expire(self):
        assert JWT_ACCESS_TIME_MINUTE != JWT_REFRESH_TIME_MINUTE
