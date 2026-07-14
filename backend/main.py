from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from typing import List, Optional

from database import engine, Base, get_db
from models import User, ChatSession, ChatMessage
from schemas import (
    UserCreate, UserLogin, Token, UserOut,
    ChatSessionOut, ChatSessionBrief, ChatMessageOut, ChatMessageCreate,
    MessageResponse, AnalyticsOut, TopQuestion, DailyChatCount
)
from auth import (
    get_password_hash, verify_password, create_access_token,
    get_current_user, get_admin_user
)
from engine import RuleEngine

# ── Bootstrap tables ──────────────────────────────────────────────────────────
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="RuleBot – Intelligent Rule-Based Chatbot API",
    description="""
## RuleBot API  
A deterministic NLP chatbot demonstrating Rule-Based Artificial Intelligence.  
No LLMs, no ML models – purely **keyword matching + regex + pattern rules**.

### AI Techniques Used
- **If-Else logic** for exact phrase matching
- **Keyword Detection** for intent clustering
- **Regular Expressions** for flexible pattern matching
- **Confidence Scoring** – highest-score rule wins

### Endpoints
- `POST /auth/register` – register new user
- `POST /auth/login` – authenticate and receive JWT
- `POST /chat` – send message, receive intent-matched response
- `GET /history` – list all chat sessions
- `GET /history/{id}` – session detail with messages
- `DELETE /history/{id}` – remove a session
- `GET /analytics` – admin dashboard data (admin role required)
""",
    version="2.0.0",
    contact={"name": "CodSoft AI Internship Task 1"},
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ═════════════════════════════════════════════════════════════════════════════
#  Auth Endpoints
# ═════════════════════════════════════════════════════════════════════════════

@app.post("/auth/register", response_model=Token, status_code=status.HTTP_201_CREATED,
          tags=["Authentication"], summary="Register a new user")
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new account. The **first registered user** automatically gets the **admin** role."""
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    role = "admin" if db.query(User).count() == 0 else "user"
    new_user = User(
        email=user_data.email,
        password_hash=get_password_hash(user_data.password),
        role=role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token(data={"sub": new_user.id, "role": new_user.role})
    return {"access_token": token, "token_type": "bearer", "user": new_user}


@app.post("/auth/login", response_model=Token,
          tags=["Authentication"], summary="Login with email and password")
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect email or password",
                            headers={"WWW-Authenticate": "Bearer"})
    token = create_access_token(data={"sub": user.id, "role": user.role})
    return {"access_token": token, "token_type": "bearer", "user": user}


@app.get("/auth/me", response_model=UserOut,
         tags=["Authentication"], summary="Get current user profile")
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


# ═════════════════════════════════════════════════════════════════════════════
#  Chat Endpoints
# ═════════════════════════════════════════════════════════════════════════════

@app.post("/chat", response_model=List[ChatMessageOut],
          tags=["Chat"], summary="Send a message and receive a rule-matched response")
def chat(
    chat_req: ChatMessageCreate,
    session_id: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Processes the user message through the **Rule Engine**:
    1. Normalize & clean text
    2. Score all intent rules by confidence
    3. Return highest-confidence response
    4. Persist both user message and bot reply to the database
    """
    # Resolve or create a session
    session = None
    if session_id:
        session = db.query(ChatSession).filter(
            ChatSession.id == session_id,
            ChatSession.user_id == current_user.id
        ).first()

    if not session:
        title = chat_req.text[:40] + "…" if len(chat_req.text) > 40 else chat_req.text
        session = ChatSession(user_id=current_user.id, title=title)
        db.add(session)
        db.commit()
        db.refresh(session)

    # Run rule engine
    intent, bot_text = RuleEngine.match_intent(chat_req.text)

    # Persist user message
    user_msg = ChatMessage(
        session_id=session.id, sender="user",
        text=chat_req.text, intent_matched=intent
    )
    # Persist bot reply
    bot_msg = ChatMessage(
        session_id=session.id, sender="bot",
        text=bot_text, intent_matched=intent
    )
    db.add(user_msg)
    db.add(bot_msg)
    db.commit()
    db.refresh(user_msg)
    db.refresh(bot_msg)

    return [user_msg, bot_msg]


# ═════════════════════════════════════════════════════════════════════════════
#  History Endpoints
# ═════════════════════════════════════════════════════════════════════════════

@app.get("/history", response_model=List[ChatSessionBrief],
         tags=["History"], summary="List all chat sessions for current user")
def get_history(current_user: User = Depends(get_current_user),
                db: Session = Depends(get_db)):
    return db.query(ChatSession).filter(
        ChatSession.user_id == current_user.id
    ).order_by(ChatSession.created_at.desc()).all()


@app.get("/history/{id}", response_model=ChatSessionOut,
         tags=["History"], summary="Get messages in a specific session")
def get_session(id: str, current_user: User = Depends(get_current_user),
                db: Session = Depends(get_db)):
    session = db.query(ChatSession).filter(
        ChatSession.id == id, ChatSession.user_id == current_user.id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session


@app.delete("/history/{id}", status_code=204,
            tags=["History"], summary="Delete a chat session and all its messages")
def delete_session(id: str, current_user: User = Depends(get_current_user),
                   db: Session = Depends(get_db)):
    session = db.query(ChatSession).filter(
        ChatSession.id == id, ChatSession.user_id == current_user.id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    db.delete(session)
    db.commit()


# ═════════════════════════════════════════════════════════════════════════════
#  Analytics Endpoint (Admin Only)
# ═════════════════════════════════════════════════════════════════════════════

@app.get("/analytics", response_model=AnalyticsOut,
         tags=["Analytics"], summary="Admin dashboard – chat and intent statistics")
def get_analytics(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """
    Returns aggregated statistics for the admin dashboard:
    - Total registered users
    - Total chat sessions
    - Unknown query count (queries matched to 'Unknown' intent)
    - Average messages per session
    - Top 10 intents by frequency
    - Daily user-query counts for the past 7 days
    """
    total_users  = db.query(User).count()
    total_chats  = db.query(ChatSession).count()
    total_msgs   = db.query(ChatMessage).filter(ChatMessage.sender == "user").count()

    # Unknown query count
    unknown_count = db.query(ChatMessage).filter(
        ChatMessage.sender == "user",
        ChatMessage.intent_matched == "Unknown"
    ).count()

    # Average messages per session
    avg_per_session = round(total_msgs / total_chats, 1) if total_chats > 0 else 0.0

    # Most-matched intents
    intent_groups = db.query(
        ChatMessage.intent_matched,
        func.count(ChatMessage.id).label("cnt")
    ).filter(
        ChatMessage.sender == "user"
    ).group_by(ChatMessage.intent_matched).order_by(
        func.count(ChatMessage.id).desc()
    ).limit(10).all()

    most_asked = [
        TopQuestion(question=intent or "General/Other", count=cnt)
        for intent, cnt in intent_groups
    ]

    # Daily chat counts – last 7 days
    daily_chats = []
    today = datetime.utcnow().date()
    for i in range(6, -1, -1):
        day   = today - timedelta(days=i)
        start = datetime.combine(day, datetime.min.time())
        end   = datetime.combine(day, datetime.max.time())
        count = db.query(ChatMessage).filter(
            ChatMessage.sender == "user",
            ChatMessage.created_at >= start,
            ChatMessage.created_at <= end
        ).count()
        daily_chats.append(DailyChatCount(date=day.strftime("%Y-%m-%d"), count=count))

    return AnalyticsOut(
        total_users=total_users,
        total_chats=total_chats,
        unknown_count=unknown_count,
        avg_per_session=avg_per_session,
        most_asked_questions=most_asked,
        daily_chats=daily_chats
    )
