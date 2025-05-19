from fastapi import FastAPI, HTTPException, Depends, status, UploadFile, File
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr, Field
from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from typing import Optional, List
import jwt
from jwt.exceptions import PyJWTError
import logging
import base64

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="User Management API",
    description="A professional API for user management with admin capabilities",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JWT Configuration
SECRET_KEY = "your-secret-key-here"  # In production, use environment variable
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="signin")

# Generate a valid bcrypt hash for the admin password "11110"
admin_password = "11110"
hashed_admin_password = pwd_context.hash(admin_password)

# In-memory database (replace with real database in production)
users_db = {
    "admin@test.com": {
        "email": "admin@test.com",
        "educationLevel": "university",
        "institutionName": "Admin University",
        "major": "Computer Science",
        "graduationMonth": "May",
        "graduationYear": "2020",
        "password": hashed_admin_password,
        "name": "Admin User",
        "about": "I am the admin of this platform.",
        "role": "admin",
        "is_blocked": False,
        "created_at": datetime.utcnow().isoformat(),
        "last_login": None,
        "profile_completed": False,
        "resume": None  # Add resume field
    }
}

# Pydantic Models
class UserBase(BaseModel):
    email: EmailStr
    name: str = Field(..., min_length=2, max_length=100)
    about: str = Field(..., min_length=5, max_length=500)

class UserSignup(UserBase):
    educationLevel: str = Field(..., pattern="^(school|college|university)$")
    institutionName: str = Field(..., min_length=2, max_length=100)
    major: str = Field(..., min_length=2, max_length=50)
    graduationMonth: str = Field(..., pattern="^(January|February|March|April|May|June|July|August|September|October|November|December)$")
    graduationYear: str = Field(..., pattern="^(20[2-3][0-9])$")
    password: str = Field(..., min_length=8)

class UserSignin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    educationLevel: Optional[str] = Field(None, pattern="^(school|college|university)$")
    institutionName: Optional[str] = Field(None, min_length=2, max_length=100)
    major: Optional[str] = Field(None, min_length=2, max_length=50)
    graduationMonth: Optional[str] = Field(None, pattern="^(January|February|March|April|May|June|July|August|September|October|November|December)$")
    graduationYear: Optional[str] = Field(None, pattern="^(20[2-3][0-9])$")
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    about: Optional[str] = Field(None, min_length=5, max_length=500)

class UserInDB(BaseModel):
    email: EmailStr
    educationLevel: str
    institutionName: str
    major: str
    graduationMonth: str
    graduationYear: str
    name: str
    about: str
    role: str
    is_blocked: bool
    created_at: str
    last_login: Optional[str]
    profile_completed: bool
    resume: Optional[str]  # Add resume field to store base64 string

class Token(BaseModel):
    access_token: str
    token_type: str

# Helper Functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            logger.warning("Invalid token: No email in payload")
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except PyJWTError as e:
        logger.error(f"Token decode error: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

    if email not in users_db:
        logger.warning(f"User not found for email: {email}")
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    user = users_db[email]
    if user.get("is_blocked", False):
        logger.warning(f"User {email} is blocked")
        raise HTTPException(status_code=403, detail="User is blocked")
    
    return user

async def get_current_admin(user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        logger.warning(f"User {user['email']} attempted admin access without permission")
        raise HTTPException(status_code=403, detail="Not authorized as admin")
    return user

# Calculate profile completion
def calculate_profile_completion(user: dict) -> bool:
    required_fields = [
        "educationLevel", "institutionName", "major", 
        "graduationMonth", "graduationYear", "name", "about"
    ]
    return all(user.get(field) for field in required_fields)

# API Endpoints
@app.post("/signup", response_model=dict, status_code=status.HTTP_201_CREATED)
async def signup(user: UserSignup):
    logger.info(f"Signup attempt for email: {user.email}")
    
    if user.email in users_db:
        logger.warning(f"Signup failed: Email {user.email} already registered")
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = hash_password(user.password)
    
    user_data = user.dict()
    user_data.update({
        "password": hashed_password,
        "role": "user",
        "is_blocked": False,
        "created_at": datetime.utcnow().isoformat(),
        "last_login": None,
        "profile_completed": False,
        "resume": None  # Initialize resume field
    })
    
    users_db[user.email] = user_data
    user_data["profile_completed"] = calculate_profile_completion(user_data)
    
    logger.info(f"User {user.email} registered successfully as user")
    return {"message": "User registered successfully"}

@app.post("/signin", response_model=Token)
async def signin(form_data: OAuth2PasswordRequestForm = Depends()):
    email = form_data.username
    password = form_data.password
    
    logger.info(f"Signin attempt for email: {email}")
    
    if email not in users_db:
        logger.warning(f"Signin failed for {email}: Invalid email")
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    stored_user = users_db[email]
    if not verify_password(password, stored_user["password"]):
        logger.warning(f"Signin failed for {email}: Invalid password")
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    if stored_user.get("is_blocked", False):
        logger.warning(f"Signin failed for {email}: User is blocked")
        raise HTTPException(status_code=403, detail="User is blocked")
    
    # Update last login
    stored_user["last_login"] = datetime.utcnow().isoformat()
    stored_user["profile_completed"] = calculate_profile_completion(stored_user)
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": email}, expires_delta=access_token_expires
    )
    
    logger.info(f"User {email} signed in successfully")
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/upload_resume", response_model=dict)
async def upload_resume(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    logger.info(f"User {current_user['email']} attempting to upload resume")
    
    if file.content_type != "application/pdf":
        logger.warning(f"User {current_user['email']} uploaded invalid file type: {file.content_type}")
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    # Read the file and convert to base64
    content = await file.read()
    encoded_file = base64.b64encode(content).decode('utf-8')
    
    # Update user data with the resume
    users_db[current_user["email"]]["resume"] = encoded_file
    
    logger.info(f"User {current_user['email']} uploaded resume successfully")
    return {"message": "Resume uploaded successfully"}

@app.get("/me", response_model=UserInDB)
async def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    logger.info(f"User {current_user['email']} accessed their profile")
    return current_user

@app.put("/me", response_model=dict)
async def update_user_profile(
    user_update: UserUpdate,
    current_user: dict = Depends(get_current_user)
):
    logger.info(f"User {current_user['email']} attempting to update profile")
    
    update_data = user_update.dict(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields provided for update")
    
    users_db[current_user["email"]].update(update_data)
    users_db[current_user["email"]]["profile_completed"] = calculate_profile_completion(users_db[current_user["email"]])
    
    logger.info(f"User {current_user['email']} updated their profile")
    return {"message": "Profile updated successfully"}

@app.get("/admin/check", response_model=dict)
async def check_admin(user: dict = Depends(get_current_admin)):
    logger.info(f"Admin check successful for {user['email']}")
    return {"message": "Admin access verified", "user": user}

@app.get("/admin/users", response_model=dict)
async def get_all_users(user: dict = Depends(get_current_admin)):
    users = [
        {key: value for key, value in u.items() if key != "password"}
        for u in users_db.values()
    ]
    logger.info(f"Admin {user['email']} fetched all users")
    return {"users": users}

@app.post("/admin/block/{email}", response_model=dict)
async def block_user(email: str, admin: dict = Depends(get_current_admin)):
    if email not in users_db:
        logger.warning(f"Admin {admin['email']} attempted to block non-existent user {email}")
        raise HTTPException(status_code=404, detail="User not found")
    if email == admin["email"]:
        logger.warning(f"Admin {admin['email']} attempted to block themselves")
        raise HTTPException(status_code=400, detail="Cannot block yourself")
    users_db[email]["is_blocked"] = True
    logger.info(f"Admin {admin['email']} blocked user {email}")
    return {"message": f"User {email} has been blocked"}

@app.post("/admin/unblock/{email}", response_model=dict)
async def unblock_user(email: str, admin: dict = Depends(get_current_admin)):
    if email not in users_db:
        logger.warning(f"Admin {admin['email']} attempted to unblock non-existent user {email}")
        raise HTTPException(status_code=404, detail="User not found")
    if email == admin["email"]:
        logger.warning(f"Admin {admin['email']} attempted to unblock themselves")
        raise HTTPException(status_code=400, detail="Cannot unblock yourself")
    users_db[email]["is_blocked"] = False
    logger.info(f"Admin {admin['email']} unblocked user {email}")
    return {"message": f"User {email} has been unblocked"}

@app.delete("/admin/remove/{email}", response_model=dict)
async def remove_user(email: str, admin: dict = Depends(get_current_admin)):
    if email not in users_db:
        logger.warning(f"Admin {admin['email']} attempted to remove non-existent user {email}")
        raise HTTPException(status_code=404, detail="User not found")
    if email == admin["email"]:
        logger.warning(f"Admin {admin['email']} attempted to remove themselves")
        raise HTTPException(status_code=400, detail="Cannot remove yourself")
    del users_db[email]
    logger.info(f"Admin {admin['email']} removed user {email}")
    return {"message": f"User {email} has been removed"}