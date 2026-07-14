from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import List, Optional

# --- Authentication Schemas ---

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters")

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: str
    email: EmailStr
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class TokenData(BaseModel):
    user_id: Optional[str] = None
    role: Optional[str] = None

# --- Chat Messages Schemas ---

class ChatMessageCreate(BaseModel):
    text: str

class ChatMessageOut(BaseModel):
    id: str
    session_id: str
    sender: str
    text: str
    intent_matched: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# --- Chat Sessions Schemas ---

class ChatSessionCreate(BaseModel):
    title: str

class ChatSessionOut(BaseModel):
    id: str
    user_id: str
    title: str
    created_at: datetime
    messages: List[ChatMessageOut] = []

    class Config:
        from_attributes = True

class ChatSessionBrief(BaseModel):
    id: str
    title: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- Chatbot Engine Schemas ---

class MessageRequest(BaseModel):
    text: str

class MessageResponse(BaseModel):
    text: str
    intent: str

# --- Analytics Schemas ---

class TopQuestion(BaseModel):
    question: str
    count: int

class DailyChatCount(BaseModel):
    date: str
    count: int

class AnalyticsOut(BaseModel):
    total_users: int
    total_chats: int
    unknown_count: int = 0
    avg_per_session: float = 0.0
    most_asked_questions: List[TopQuestion]
    daily_chats: List[DailyChatCount]
