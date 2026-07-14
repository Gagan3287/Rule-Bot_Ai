# ─── Stage 1: Build dependencies ────────────────────────────────────────────
FROM python:3.11-slim AS builder

WORKDIR /app

# Install only build-time system deps (no libpq needed – SQLite only)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python deps into a prefix so we can copy them cleanly
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# ─── Stage 2: Lean runtime image ─────────────────────────────────────────────
FROM python:3.11-slim

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /install /usr/local

# Copy application source (exclude __pycache__ via .dockerignore)
COPY . .

# Expose FastAPI port
EXPOSE 8000

# Run with uvicorn (single worker is fine for SQLite)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
