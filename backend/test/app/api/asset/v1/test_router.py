import pytest
from fastapi import status


@pytest.mark.asyncio
async def test_save_assets_stock_not_found(client, transaction_data_with_wrong_stock_code):
    response = client.post(
        "/api/v1/assetstock",
        json=transaction_data_with_wrong_stock_code,
        headers={"Authorization": "Bearer testtoken"},
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "종목 코드 UNKNOWN_CODE에 해당하는 주식을 찾을 수 없습니다."


@pytest.mark.asyncio
async def test_save_assets_asset_id_not_found(client, transaction_data_with_invalid_id):
    response = client.post(
        "/api/v1/assetstock",
        json=transaction_data_with_invalid_id,
        headers={"Authorization": "Bearer testtoken"},
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "Asset ID 999를 찾을 수 없습니다."


@pytest.mark.asyncio
async def test_save_assets_success(client, transaction_data_success):
    response = client.post(
        "/api/v1/assetstock",
        json=transaction_data_success,
        headers={"Authorization": "Bearer testtoken"},
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["content"]["detail"] == "주식 자산 테이블을 성공적으로 저장하였습니다."
