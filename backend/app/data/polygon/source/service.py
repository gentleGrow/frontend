from polygon.websocket.models import EquityTrade, WebSocketMessage


def handle_msg(msgs: list[WebSocketMessage]):
    for m in msgs:
        if type(m) == EquityTrade:
            pass  # 오전에 장이 열릴 때, 데이터 저장 로직을 추가 하겠습니다.
