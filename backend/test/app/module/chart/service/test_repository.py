from app.module.chart.repository import TipRepository
from app.module.chart.constant import DEFAULT_TIP, INVESTMENT_TIP

class TestTipRespository:
    async def test_get_valid_tip(self, session, setup_tip):
        # Given
        valid_tip_id = 1 
        
        # When
        retrieved_tip = await TipRepository.get(session, valid_tip_id)

        # Then
        assert retrieved_tip is not None
        assert retrieved_tip.id == valid_tip_id
        assert retrieved_tip.tip == INVESTMENT_TIP[0]["tip"]

    async def test_get_invalid_tip(self, session, setup_tip):
        # Given
        invalid_tip_id = 9999

        # When
        retrieved_tip = await TipRepository.get(session, invalid_tip_id)

        # Then
        assert retrieved_tip is None