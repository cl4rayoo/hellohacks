import json
import os
import sys
from typing import Any

import psycopg
from psycopg.types.json import Jsonb

REQUIRED_PROFILE_FIELDS = frozenset(
    {
        "name",
        "diet",
        "allergies",
        "dislikes",
        "goals",
        "weeklyHoursSaved",
        "healthFocus",
        "weeklyBudget",
        "dietaryNeeds",
        "units",
        "height",
        "weight",
        "gender",
        "activityLevel",
        "weightGoal",
        "calorieTarget",
        "macroTargets",
        "planMethod",
    }
)


def save_user_profile(profile: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(profile, dict):
        raise ValueError("Profile data must be a JSON object.")

    missing_fields = sorted(REQUIRED_PROFILE_FIELDS.difference(profile))
    if missing_fields:
        raise ValueError(f"Missing profile fields: {', '.join(missing_fields)}")

    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL is not configured.")

    name = profile.get("name", "")
    if not isinstance(name, str):
        raise ValueError("Profile name must be text.")

    with psycopg.connect(database_url) as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS user_profiles (
                id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                name TEXT NOT NULL DEFAULT '',
                profile JSONB NOT NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        saved_profile = connection.execute(
            """
            INSERT INTO user_profiles (name, profile)
            VALUES (%s, %s)
            RETURNING id, created_at
            """,
            (name, Jsonb(profile)),
        ).fetchone()

    return {"id": saved_profile[0], "createdAt": saved_profile[1].isoformat()}


def main() -> None:
    try:
        profile = json.load(sys.stdin)
        result = save_user_profile(profile)
    except Exception as error:
        result = {"error": str(error)}
    print(json.dumps(result))


if __name__ == "__main__":
    main()