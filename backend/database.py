import os
import json
import uuid

HAS_POSTGRES = False
try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
    HAS_POSTGRES = True
except ImportError:
    pass

class Database:
    def __init__(self):
        self.mode = "json" # Can be "postgres", "mongo", "json"
        
        self.postgres_url = os.getenv("DATABASE_URL")
        self.mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
        self.db_name = "mindmentor_db"
        self.json_path = os.path.join(os.path.dirname(__file__), "db.json")

        # 1. Try PostgreSQL (Supabase / Render Postgres)
        if HAS_POSTGRES and self.postgres_url:
            try:
                # Handle connection string starting with postgres:// instead of postgresql://
                connection_url = self.postgres_url
                if connection_url.startswith("postgres://"):
                    connection_url = connection_url.replace("postgres://", "postgresql://", 1)
                
                self.conn = psycopg2.connect(connection_url)
                self._create_tables()
                self.mode = "postgres"
                print("Successfully connected to Supabase PostgreSQL Database.")
                return
            except Exception as e:
                print(f"PostgreSQL connection failed: {e}")

        # 2. Try MongoDB Atlas / Local MongoDB
        if self.mongo_uri:
            try:
                from pymongo import MongoClient
                self.client = MongoClient(self.mongo_uri, serverSelectionTimeoutMS=2000)
                self.client.admin.command("ping")
                self.db = self.client[self.db_name]
                self.mode = "mongo"
                print("Successfully connected to MongoDB.")
                return
            except Exception as e:
                print(f"MongoDB connection failed: {e}")

        # 3. Fallback to local JSON
        print(f"Falling back to Local JSON Database storage at: {self.json_path}")
        self.mode = "json"
        self._init_json_db()

    def _create_tables(self):
        with self.conn.cursor() as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    _id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL
                );
            """)
            cur.execute("""
                CREATE TABLE IF NOT EXISTS journals (
                    _id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    text TEXT NOT NULL,
                    emotion TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    study_plan TEXT NOT NULL,
                    hours_studied REAL,
                    sleep_hours REAL,
                    upcoming_exams INTEGER,
                    mood_rating INTEGER,
                    consistency INTEGER,
                    distractions INTEGER
                );
            """)
            cur.execute("""
                CREATE TABLE IF NOT EXISTS goals (
                    _id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    title TEXT NOT NULL,
                    completed BOOLEAN NOT NULL DEFAULT FALSE,
                    created_at TEXT NOT NULL
                );
            """)
            cur.execute("""
                CREATE TABLE IF NOT EXISTS badges (
                    user_id TEXT PRIMARY KEY,
                    badges TEXT NOT NULL
                );
            """)
            self.conn.commit()

    def _init_json_db(self):
        if not os.path.exists(self.json_path):
            with open(self.json_path, "w") as f:
                json.dump({"users": [], "journals": [], "goals": [], "badges": {}}, f, indent=4)

    def _read_json(self):
        try:
            with open(self.json_path, "r") as f:
                return json.load(f)
        except Exception:
            return {"users": [], "journals": [], "goals": [], "badges": {}}

    def _write_json(self, data):
        with open(self.json_path, "w") as f:
            json.dump(data, f, indent=4)

    # User operations
    def find_user_by_email(self, email):
        email_clean = email.strip().lower()
        if self.mode == "postgres":
            with self.conn.cursor() as cur:
                cur.execute("SELECT _id, name, email, password FROM users WHERE LOWER(email) = %s", (email_clean,))
                row = cur.fetchone()
                if row:
                    return {"_id": row[0], "name": row[1], "email": row[2], "password": row[3]}
            return None
        elif self.mode == "mongo":
            return self.db.users.find_one({"email": email_clean})
        else:
            data = self._read_json()
            for user in data["users"]:
                if user["email"].lower() == email_clean:
                    return user
            return None

    def create_user(self, user_dict):
        user_dict["_id"] = str(uuid.uuid4())
        user_dict["email"] = user_dict["email"].strip().lower()
        if self.mode == "postgres":
            with self.conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO users (_id, name, email, password) VALUES (%s, %s, %s, %s)",
                    (user_dict["_id"], user_dict["name"], user_dict["email"], user_dict["password"])
                )
                self.conn.commit()
            return user_dict
        elif self.mode == "mongo":
            self.db.users.insert_one(user_dict)
            return user_dict
        else:
            data = self._read_json()
            data["users"].append(user_dict)
            self._write_json(data)
            return user_dict

    # Journal operations
    def save_journal_entry(self, user_id, entry_dict):
        entry_dict["_id"] = str(uuid.uuid4())
        entry_dict["user_id"] = user_id
        if self.mode == "postgres":
            with self.conn.cursor() as cur:
                cur.execute(
                    """INSERT INTO journals (
                        _id, user_id, text, emotion, created_at, study_plan, 
                        hours_studied, sleep_hours, upcoming_exams, mood_rating, consistency, distractions
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
                    (
                        entry_dict["_id"],
                        entry_dict["user_id"],
                        entry_dict["text"],
                        entry_dict["emotion"],
                        entry_dict["created_at"],
                        json.dumps(entry_dict["study_plan"]),
                        entry_dict.get("hours_studied"),
                        entry_dict.get("sleep_hours"),
                        entry_dict.get("upcoming_exams"),
                        entry_dict.get("mood_rating"),
                        entry_dict.get("consistency"),
                        entry_dict.get("distractions")
                    )
                )
                self.conn.commit()
            return entry_dict
        elif self.mode == "mongo":
            self.db.journals.insert_one(entry_dict)
            return entry_dict
        else:
            data = self._read_json()
            data["journals"].append(entry_dict)
            self._write_json(data)
            return entry_dict

    def get_journal_entries(self, user_id):
        if self.mode == "postgres":
            journals_list = []
            with self.conn.cursor() as cur:
                cur.execute(
                    """SELECT 
                        _id, user_id, text, emotion, created_at, study_plan, 
                        hours_studied, sleep_hours, upcoming_exams, mood_rating, consistency, distractions
                    FROM journals WHERE user_id = %s""", (user_id,)
                )
                rows = cur.fetchall()
                for row in rows:
                    journals_list.append({
                        "_id": row[0],
                        "user_id": row[1],
                        "text": row[2],
                        "emotion": row[3],
                        "created_at": row[4],
                        "study_plan": json.loads(row[5]),
                        "hours_studied": row[6],
                        "sleep_hours": row[7],
                        "upcoming_exams": row[8],
                        "mood_rating": row[9],
                        "consistency": row[10],
                        "distractions": row[11]
                    })
            return journals_list
        elif self.mode == "mongo":
            return list(self.db.journals.find({"user_id": user_id}))
        else:
            data = self._read_json()
            return [j for j in data["journals"] if j["user_id"] == user_id]

    # Goals operations
    def save_goal(self, user_id, goal_dict):
        goal_dict["_id"] = str(uuid.uuid4())
        goal_dict["user_id"] = user_id
        if self.mode == "postgres":
            with self.conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO goals (_id, user_id, title, completed, created_at) VALUES (%s, %s, %s, %s, %s)",
                    (goal_dict["_id"], goal_dict["user_id"], goal_dict["title"], goal_dict["completed"], goal_dict["created_at"])
                )
                self.conn.commit()
            return goal_dict
        elif self.mode == "mongo":
            self.db.goals.insert_one(goal_dict)
            return goal_dict
        else:
            data = self._read_json()
            data["goals"].append(goal_dict)
            self._write_json(data)
            return goal_dict

    def get_goals(self, user_id):
        if self.mode == "postgres":
            goals_list = []
            with self.conn.cursor() as cur:
                cur.execute("SELECT _id, user_id, title, completed, created_at FROM goals WHERE user_id = %s", (user_id,))
                rows = cur.fetchall()
                for row in rows:
                    goals_list.append({
                        "_id": row[0],
                        "user_id": row[1],
                        "title": row[2],
                        "completed": row[3],
                        "created_at": row[4]
                    })
            return goals_list
        elif self.mode == "mongo":
            return list(self.db.goals.find({"user_id": user_id}))
        else:
            data = self._read_json()
            return [g for g in data["goals"] if g["user_id"] == user_id]

    def update_goal(self, user_id, goal_id, completed):
        if self.mode == "postgres":
            with self.conn.cursor() as cur:
                cur.execute("UPDATE goals SET completed = %s WHERE _id = %s AND user_id = %s", (completed, goal_id, user_id))
                self.conn.commit()
                return cur.rowcount > 0
        elif self.mode == "mongo":
            result = self.db.goals.update_one(
                {"_id": goal_id, "user_id": user_id},
                {"$set": {"completed": completed}}
            )
            return result.modified_count > 0
        else:
            data = self._read_json()
            updated = False
            for g in data["goals"]:
                if g["_id"] == goal_id and g["user_id"] == user_id:
                    g["completed"] = completed
                    updated = True
                    break
            if updated:
                self._write_json(data)
            return updated

    def delete_goal(self, user_id, goal_id):
        if self.mode == "postgres":
            with self.conn.cursor() as cur:
                cur.execute("DELETE FROM goals WHERE _id = %s AND user_id = %s", (goal_id, user_id))
                self.conn.commit()
                return cur.rowcount > 0
        elif self.mode == "mongo":
            result = self.db.goals.delete_one({"_id": goal_id, "user_id": user_id})
            return result.deleted_count > 0
        else:
            data = self._read_json()
            initial_count = len(data["goals"])
            data["goals"] = [g for g in data["goals"] if not (g["_id"] == goal_id and g["user_id"] == user_id)]
            updated = len(data["goals"]) < initial_count
            if updated:
                self._write_json(data)
            return updated

    # Badges operations
    def get_user_badges(self, user_id):
        if self.mode == "postgres":
            with self.conn.cursor() as cur:
                cur.execute("SELECT badges FROM badges WHERE user_id = %s", (user_id,))
                row = cur.fetchone()
                if row:
                    return json.loads(row[0])
            return []
        elif self.mode == "mongo":
            record = self.db.badges.find_one({"user_id": user_id})
            return record["badges"] if record else []
        else:
            data = self._read_json()
            return data["badges"].get(user_id, [])

    def save_user_badges(self, user_id, badges_list):
        if self.mode == "postgres":
            with self.conn.cursor() as cur:
                cur.execute(
                    """INSERT INTO badges (user_id, badges) VALUES (%s, %s)
                       ON CONFLICT (user_id) DO UPDATE SET badges = EXCLUDED.badges""",
                    (user_id, json.dumps(badges_list))
                )
                self.conn.commit()
        elif self.mode == "mongo":
            self.db.badges.update_one(
                {"user_id": user_id},
                {"$set": {"badges": badges_list}},
                upsert=True
            )
        else:
            data = self._read_json()
            data["badges"][user_id] = badges_list
            self._write_json(data)

db = Database()
