from datetime import datetime, timedelta

MAX_ATTEMPTS = 5
LOCKOUT_MINUTES = 15
ALLOWED_TABLES = {"users", "doctors", "patients"}

def validate_table(table):
    if table not in ALLOWED_TABLES:
        raise ValueError("Invalid table name")


def check_lockout(cursor, table, username):
    validate_table(table)

    cursor.execute(
        f"SELECT failed_attempts, locked_until FROM {table} WHERE username = %s",
        (username,)
    )
    row = cursor.fetchone()

    if not row:
        return False, None, 0

    locked_until = row.get("locked_until")

    if locked_until and datetime.utcnow() < locked_until:
        seconds_remaining = int((locked_until - datetime.utcnow()).total_seconds())
        mins = seconds_remaining // 60
        secs = seconds_remaining % 60
        return True, f"Account locked. Try again in {mins}m {secs}s.", seconds_remaining

    return False, None, 0


def record_failed_attempt(cursor, db, table, username):
    validate_table(table)

    cursor.execute(
        f"SELECT failed_attempts FROM {table} WHERE username = %s",
        (username,)
    )
    row = cursor.fetchone()

    if not row:
        return

    new_attempts = row["failed_attempts"] + 1

    if new_attempts >= MAX_ATTEMPTS:
        locked_until = datetime.utcnow() + timedelta(minutes=LOCKOUT_MINUTES)
        cursor.execute(
            f"""
            UPDATE {table}
            SET failed_attempts = %s, locked_until = %s
            WHERE username = %s
            """,
            (new_attempts, locked_until, username)
        )
    else:
        cursor.execute(
            f"""
            UPDATE {table}
            SET failed_attempts = %s
            WHERE username = %s
            """,
            (new_attempts, username)
        )

    db.commit()


def reset_lockout(cursor, db, table, username):
    validate_table(table)

    cursor.execute(
        f"""
        UPDATE {table}
        SET failed_attempts = 0, locked_until = NULL
        WHERE username = %s
        """,
        (username,)
    )
    db.commit()