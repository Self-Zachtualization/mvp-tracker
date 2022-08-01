DROP TABLE IF EXISTS users, goals CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT
);

CREATE TABLE goals (
  id SERIAL PRIMARY KEY,
  title TEXT,
  description TEXT,
  deadline DATE,
  completed BOOLEAN NOT NULL,
  user_id INTEGER NOT NULL,
   FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO users (name) VALUES ('Zach');


INSERT INTO goals (title, description, deadline, completed, user_id) VALUES ('Homework', 'Read ch 5','2022-08-01'  ,true, 1);
INSERT INTO goals (title, description, deadline, completed, user_id) VALUES ('Homework', 'Read ch 10','2022-08-10' ,false, 1);
INSERT INTO goals (title, description, deadline, completed, user_id) VALUES ('Homework', 'Read ch 15','2022-08-15' ,false, 1);
INSERT INTO goals (title, description, deadline, completed, user_id) VALUES ('Homework', 'Read ch 20','2022-08-20' ,false, 1);
INSERT INTO goals (title, description, deadline, completed, user_id) VALUES ('Homework', 'Read ch 25','2022-08-25' ,false, 1);
INSERT INTO goals (title, description, deadline, completed, user_id) VALUES ('Homework', 'Read ch 30','2022-08-30' ,false, 1);