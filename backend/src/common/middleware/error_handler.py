import logging
from functools import wraps
from flask import jsonify

def handle_errors(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except ValidationError as e:
            logging.error(f"Validation error: {e}")
            return jsonify({"error": "Invalid input", "message": str(e)}), 400
        except DatabaseError as e:
            logging.error(f"Database error: {e}")
            return jsonify({"error": "Database error"}), 500
        except Exception as e:
            logging.error(f"Unexpected error: {e}")
            return jsonify({"error": "Internal server error"}), 500
    return decorated_function

class ValidationError(Exception):
    pass

class DatabaseError(Exception):
    pass
