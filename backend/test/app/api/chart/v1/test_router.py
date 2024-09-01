from unittest.mock import patch

import pytest
from fastapi import status


class TestGetTodayTip:
    @pytest.mark.asyncio
    async def test_tip_id_not_cached(self, client, mock_redis_repositories):
        response = client.get(
            "/api/chart/v1/tip",
            headers={"Authorization": "Bearer testtoken"},
        )
        assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
        assert response.json()["detail"] == "오늘의 팁 id가 캐싱되어 있지 않습니다."

    @pytest.mark.asyncio
    async def test_tip_data_not_found(self, client, mock_redis_repositories):
        with patch("app.module.chart.redis_repository.RedisTipRepository.get", return_value="1"):
            response = client.get(
                "/api/chart/v1/tip",
                headers={"Authorization": "Bearer testtoken"},
            )
            assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
            assert response.json()["detail"] == "오늘의 팁 데이터가 존재하지 않습니다."
