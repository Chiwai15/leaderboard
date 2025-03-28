from marshmallow import Schema, fields, validate, pre_load


class LoginPayloadSchema(Schema):
    username = fields.Str(
        required=True,
        validate=validate.Length(min=3, max=80),
    )
    password = fields.Str(
        required=True,
        validate=validate.Length(min=5, max=255),
    )

    @pre_load
    def strip_username(self, data, **kwargs):
        if "username" in data and isinstance(data["username"], str):
            data["username"] = data["username"].strip()
        return data


# Optional: helper function similar to your validate_login_payload
def validate_login_payload(data: dict) -> dict:
    schema = LoginPayloadSchema()
    return schema.load(data)