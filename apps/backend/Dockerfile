FROM python:3.10-slim

WORKDIR /app

COPY . .

# If you have requirements.txt, create it with project dependencies: pip freeze > requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
