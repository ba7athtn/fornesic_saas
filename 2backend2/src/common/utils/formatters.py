from datetime import datetime
from typing import Any, Dict

def format_date(date_obj: datetime, format_type: str = "iso") -> str:
    """Formate une date selon différents formats"""
    if not date_obj:
        return ""
    
    formats = {
        "iso": "%Y-%m-%dT%H:%M:%S",
        "french": "%d/%m/%Y",
        "datetime": "%d/%m/%Y %H:%M",
        "time": "%H:%M"
    }
    
    return date_obj.strftime(formats.get(format_type, formats["iso"]))

def format_response(data: Any, message: str = "", status: str = "success") -> Dict:
    """Formate une réponse API standard"""
    return {
        "status": status,
        "message": message,
        "data": data,
        "timestamp": datetime.now().isoformat()
    }

def format_error_response(error: str, code: int = 400) -> Dict:
    """Formate une réponse d'erreur standard"""
    return {
        "status": "error",
        "error": error,
        "code": code,
        "timestamp": datetime.now().isoformat()
    }
