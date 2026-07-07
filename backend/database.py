import os
import json
import uuid
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

class Database:
    def __init__(self):
        self.use_mongo = False
        self.mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
        self.db_name = "mindmentor_db"
        self.json_path = os.path.join("d:\\PROJECT capstone\\MindMentor-AI\\backend", "db.json")
        
        try:
            # Try to connect with 2-second timeout
            self.client = MongoClient(self.mongo_uri, serverSelectionTimeoutMS=2000)
            self.client.admin.command("ping")
            self.db = self.client[self.db_name]
            self.use_mongo = True
            print("Successfully connected to MongoDB.")
        except (ConnectionFailure, ServerSelectionTimeoutError, Exception) as e:
            print(f"MongoDB connection failed: {e}")
            print(f"Falling back to Local JSON Database storage at: {self.json_path}")
            self.use_mongo = False
            self._init_json_db()

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
        if self.use_mongo:
            return self.db.users.find_one({"email": email.lower()})
        else:
            data = self._read_json()
            for user in data["users"]:
                if user["email"].lower() == email.lower():
                    return user
            return None

    def create_user(self, user_dict):
        if self.use_mongo:
            user_dict["_id"] = str(uuid.uuid4())
            self.db.users.insert_one(user_dict)
            return user_dict
        else:
            data = self._read_json()
            user_dict["_id"] = str(uuid.uuid4())
            data["users"].append(user_dict)
            self._write_json(data)
            return user_dict

    # Journal operations
    def save_journal_entry(self, user_id, entry_dict):
        entry_dict["_id"] = str(uuid.uuid4())
        entry_dict["user_id"] = user_id
        if self.use_mongo:
            self.db.journals.insert_one(entry_dict)
            return entry_dict
        else:
            data = self._read_json()
            data["journals"].append(entry_dict)
            self._write_json(data)
            return entry_dict

    def get_journal_entries(self, user_id):
        if self.use_mongo:
            return list(self.db.journals.find({"user_id": user_id}))
        else:
            data = self._read_json()
            return [j for j in data["journals"] if j["user_id"] == user_id]

    # Goals operations
    def save_goal(self, user_id, goal_dict):
        goal_dict["_id"] = str(uuid.uuid4())
        goal_dict["user_id"] = user_id
        if self.use_mongo:
            self.db.goals.insert_one(goal_dict)
            return goal_dict
        else:
            data = self._read_json()
            data["goals"].append(goal_dict)
            self._write_json(data)
            return goal_dict

    def get_goals(self, user_id):
        if self.use_mongo:
            return list(self.db.goals.find({"user_id": user_id}))
        else:
            data = self._read_json()
            return [g for g in data["goals"] if g["user_id"] == user_id]

    def update_goal(self, user_id, goal_id, completed):
        if self.use_mongo:
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
        if self.use_mongo:
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
        if self.use_mongo:
            record = self.db.badges.find_one({"user_id": user_id})
            return record["badges"] if record else []
        else:
            data = self._read_json()
            return data["badges"].get(user_id, [])

    def save_user_badges(self, user_id, badges_list):
        if self.use_mongo:
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
