from datetime import datetime, timezone

from sqlalchemy import Column, DateTime


class TimestampMixin:
    createdAt = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    updatedAt = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
