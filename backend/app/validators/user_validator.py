from marshmallow import Schema, fields, validate, ValidationError


class CreateUserSchema(Schema):
    username = fields.Str(required=True, validate=validate.Length(min=3, max=30))
    password = fields.Str(required=True, validate=validate.Length(min=6))
    firstname = fields.Str(required=True, validate=validate.Length(min=1))
    lastname = fields.Str(required=True, validate=validate.Length(min=1))
    gender = fields.Str(required=True, validate=validate.OneOf(["male", "female", "other"]))
    score = fields.Int(missing=0)
    role = fields.Str(missing="user", validate=validate.OneOf(["user", "admin"]))


class UpdateUserSchema(Schema):
    firstname = fields.Str(validate=validate.Length(min=1))
    lastname = fields.Str(validate=validate.Length(min=1))
    gender = fields.Str(validate=validate.OneOf(["male", "female", "other"]))
    score = fields.Int()
    role = fields.Str(validate=validate.OneOf(["user", "admin"]))
    password = fields.Str(validate=validate.Length(min=6))


def validate_create_user_payload(payload: dict) -> dict:
    """
    Validates and transforms data for user creation.
    Raises ValidationError if data is invalid.
    """
    schema = CreateUserSchema()
    result = schema.load(payload)
    return result


def validate_update_user_payload(payload: dict) -> dict:
    """
    Validates and transforms data for user update.
    Ignores unknown fields. Raises ValidationError if invalid.
    """
    schema = UpdateUserSchema()
    result = schema.load(payload, partial=True)
    return result

def validate_delete_user_payload(user) -> None:
    """
    Prevents deletion of the original super admin account.
    """
    if user.username == "admin" and user.role == "admin":
        raise ValidationError("The original super admin cannot be deleted.")