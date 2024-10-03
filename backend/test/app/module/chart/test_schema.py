from datetime import date
from statistics import mean

from app.module.chart.enum import IntervalType
from app.module.chart.schema import PerformanceAnalysisResponse


class TestPerformanceAnalysisResponse:
    def test_get_performance_analysis_response(self):
        # Given
        market_analysis_result = {
            date(2024, 7, 1): 5.0,
            date(2024, 7, 2): 7.0,
            date(2024, 8, 1): 10.0,
            date(2024, 8, 2): 12.0,
            date(2024, 9, 1): 8.0,
            date(2024, 9, 2): 6.0,
            date(2025, 1, 1): 15.0,
            date(2025, 1, 2): 17.0,
        }

        user_analysis_result = {
            date(2024, 7, 1): 3.0,
            date(2024, 7, 2): 6.0,
            date(2024, 8, 1): 9.0,
            date(2024, 8, 2): 11.0,
            date(2024, 9, 1): 7.0,
            date(2024, 9, 2): 5.0,
            date(2025, 1, 1): 14.0,
            date(2025, 1, 2): 16.0,
        }

        # When
        response = PerformanceAnalysisResponse.get_performance_analysis_response(
            market_analysis_result, user_analysis_result, IntervalType.ONEYEAR
        )

        # Then
        expected_xAxises = ["24.07", "08", "09", "25.01"]
        expected_values1 = [mean([3.0, 6.0]), mean([9.0, 11.0]), mean([7.0, 5.0]), mean([14.0, 16.0])]
        expected_values2 = [mean([5.0, 7.0]), mean([10.0, 12.0]), mean([8.0, 6.0]), mean([15.0, 17.0])]

        assert response.xAxises == expected_xAxises
        assert response.values1["values"] == expected_values1
        assert response.values2["values"] == expected_values2
        assert response.unit == "%"
