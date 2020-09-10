BEGIN;

CREATE TABLE IF NOT EXISTS relationship (
    _id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    followed_user_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(user_id),
    CONSTRAINT fk_followed_user FOREIGN KEY(user_id) REFERENCES users(user_id)
);

COMMIT;
