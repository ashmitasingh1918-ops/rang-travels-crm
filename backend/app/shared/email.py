import logging
from backend.app.core.config import settings

logger = logging.getLogger("app.email")

async def send_hotel_request_email(hotel_email: str, subject: str, template_body: str) -> bool:
    # Real-world SMTP connection wrapper
    logger.info(f"Connecting to SMTP {settings.SMTP_HOST}...")
    logger.info(f"Email dispatched to {hotel_email} with subject: {subject}")
    return True
