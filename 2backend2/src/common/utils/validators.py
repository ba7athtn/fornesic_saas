import re
from typing import Union, List

def validate_email(email: str) -> bool:
    """Valide un format d'email"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def validate_phone(phone: str) -> bool:
    """Valide un numéro de téléphone français"""
    pattern = r'^(?:(?:\+33|0)[1-9](?:[0-9]{8}))$'
    return bool(re.match(pattern, phone.replace(' ', '').replace('.', '')))

def validate_required_fields(data: dict, required_fields: List[str]) -> Union[bool, str]:
    """Vérifie que tous les champs requis sont présents"""
    missing = [field for field in required_fields if field not in data or not data[field]]
    if missing:
        return f"Champs manquants : {', '.join(missing)}"
    return True

def sanitize_string(text: str) -> str:
    """Nettoie une chaîne de caractères"""
    if not text:
        return ""
    return text.strip().replace('<', '&lt;').replace('>', '&gt;')
