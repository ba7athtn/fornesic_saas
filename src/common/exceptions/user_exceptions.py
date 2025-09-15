# backend/src/common/exceptions/user_exceptions.py
"""
Exceptions spécifiques au module utilisateur Ba7ath
Gestion d'erreurs forensiques avec codes d'erreur standardisés
"""

class Ba7athUserException(Exception):
    """Exception de base pour toutes les erreurs utilisateur Ba7ath"""
    
    def __init__(self, message: str, error_code: str = None, details: dict = None):
        self.message = message
        self.error_code = error_code or "USER_ERROR"
        self.details = details or {}
        super().__init__(self.message)
    
    def to_dict(self):
        """Convertit l'exception en dictionnaire pour l'API"""
        return {
            "error": self.error_code,
            "message": self.message,
            "details": self.details
        }


class DuplicateEmailError(Ba7athUserException):
    """Erreur: Email déjà utilisé par un autre compte"""
    
    def __init__(self, email: str):
        super().__init__(
            message=f"L'adresse email '{email}' est déjà utilisée par un autre compte",
            error_code="DUPLICATE_EMAIL",
            details={"email": email}
        )


class InvalidSubscriptionPlanError(Ba7athUserException):
    """Erreur: Plan d'abonnement invalide ou non disponible"""
    
    def __init__(self, plan: str, available_plans: list = None):
        available = available_plans or []
        super().__init__(
            message=f"Le plan d'abonnement '{plan}' n'est pas valide",
            error_code="INVALID_SUBSCRIPTION_PLAN",
            details={
                "invalid_plan": plan,
                "available_plans": available
            }
        )


class UserNotFoundError(Ba7athUserException):
    """Erreur: Utilisateur introuvable"""
    
    def __init__(self, user_id: str):
        super().__init__(
            message=f"Aucun utilisateur trouvé avec l'ID '{user_id}'",
            error_code="USER_NOT_FOUND",
            details={"user_id": user_id}
        )


class InsufficientCreditsError(Ba7athUserException):
    """Erreur: Crédits d'analyse insuffisants"""
    
    def __init__(self, required: int, available: int, user_id: str = None):
        super().__init__(
            message=f"Crédits insuffisants. Requis: {required}, Disponible: {available}",
            error_code="INSUFFICIENT_CREDITS",
            details={
                "required_credits": required,
                "available_credits": available,
                "user_id": user_id
            }
        )


class EmailVerificationError(Ba7athUserException):
    """Erreur: Problème de vérification email"""
    
    def __init__(self, reason: str):
        super().__init__(
            message=f"Erreur de vérification email: {reason}",
            error_code="EMAIL_VERIFICATION_ERROR",
            details={"reason": reason}
        )


class AccountLockedError(Ba7athUserException):
    """Erreur: Compte utilisateur verrouillé"""
    
    def __init__(self, user_id: str, reason: str = "Trop de tentatives de connexion"):
        super().__init__(
            message=f"Compte verrouillé: {reason}",
            error_code="ACCOUNT_LOCKED",
            details={
                "user_id": user_id,
                "lock_reason": reason
            }
        )


class InvalidCredentialsError(Ba7athUserException):
    """Erreur: Identifiants de connexion invalides"""
    
    def __init__(self, email: str = None):
        super().__init__(
            message="Identifiants invalides",
            error_code="INVALID_CREDENTIALS",
            details={"email": email} if email else {}
        )


class ExpiredTokenError(Ba7athUserException):
    """Erreur: Token expiré (vérification email, reset password, etc.)"""
    
    def __init__(self, token_type: str = "generic"):
        super().__init__(
            message=f"Le token {token_type} a expiré",
            error_code="EXPIRED_TOKEN",
            details={"token_type": token_type}
        )


class InvalidEmailFormatError(Ba7athUserException):
    """Erreur: Format d'email invalide"""
    
    def __init__(self, email: str):
        super().__init__(
            message=f"Format d'email invalide: '{email}'",
            error_code="INVALID_EMAIL_FORMAT",
            details={"email": email}
        )


class WeakPasswordError(Ba7athUserException):
    """Erreur: Mot de passe trop faible"""
    
    def __init__(self, requirements: list = None):
        reqs = requirements or [
            "Au moins 8 caractères",
            "Au moins une majuscule",
            "Au moins une minuscule", 
            "Au moins un chiffre",
            "Au moins un caractère spécial"
        ]
        super().__init__(
            message="Mot de passe trop faible",
            error_code="WEAK_PASSWORD",
            details={"requirements": reqs}
        )


class RateLimitExceededError(Ba7athUserException):
    """Erreur: Limite de taux d'utilisation dépassée"""
    
    def __init__(self, action: str, limit: int, period: str = "hour"):
        super().__init__(
            message=f"Limite de {action} dépassée: {limit} par {period}",
            error_code="RATE_LIMIT_EXCEEDED",
            details={
                "action": action,
                "limit": limit,
                "period": period
            }
        )


class SubscriptionExpiredError(Ba7athUserException):
    """Erreur: Abonnement expiré"""
    
    def __init__(self, plan: str, expired_date: str = None):
        super().__init__(
            message=f"L'abonnement {plan} a expiré",
            error_code="SUBSCRIPTION_EXPIRED",
            details={
                "plan": plan,
                "expired_date": expired_date
            }
        )


class ProfileIncompleteError(Ba7athUserException):
    """Erreur: Profil utilisateur incomplet"""
    
    def __init__(self, missing_fields: list):
        super().__init__(
            message=f"Profil incomplet. Champs manquants: {', '.join(missing_fields)}",
            error_code="PROFILE_INCOMPLETE",
            details={"missing_fields": missing_fields}
        )


class DatabaseOperationError(Ba7athUserException):
    """Erreur: Opération base de données échouée"""
    
    def __init__(self, operation: str, details: str = None):
        super().__init__(
            message=f"Erreur base de données lors de: {operation}",
            error_code="DATABASE_OPERATION_ERROR",
            details={
                "operation": operation,
                "error_details": details
            }
        )