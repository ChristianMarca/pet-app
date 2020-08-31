BEGIN;

CREATE TABLE IF NOT EXISTS login (
    _id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    password text NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(user_id)
);

COMMIT;
