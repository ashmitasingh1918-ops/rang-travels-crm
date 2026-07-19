import random
import string
from datetime import datetime

def generate_tour_id(city_code: str) -> str:
    """Generates tour IDs format: RNG-DEL-202612-AB12"""
    date_str = datetime.utcnow().strftime("%Y%m")
    random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return f"RNG-{city_code.upper()}-{date_str}-{random_str}"
