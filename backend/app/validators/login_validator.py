from typing import Annotated, Literal

from pydantic import BaseModel, StringConstraints

UsernameStr = Annotated[str, StringConstraints(strip_whitespace=True, min_length=3, max_length=80)]
FirstnameStr = Annotated[str, StringConstraints(min_length=1, max_length=80)]
LastnameStr = Annotated[str, StringConstraints(min_length=1, max_length=80)]
PasswordStr = Annotated[str, StringConstraints(min_length=5, max_length=255)]
GenderStr = Literal["male", "female", "other"]

class LoginPayload(BaseModel):
    username: UsernameStr
    password: PasswordStr

def validate_login_payload(data: dict) -> dict:
    return LoginPayload(**data).model_dump()
     