from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from mangum import Mangum

app = FastAPI(title="Abhinav Mehra Portfolio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ContactForm(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str


@app.get("/api")
def root():
    return {"status": "ok", "message": "Portfolio API is running."}


@app.post("/api/contact")
async def contact(form: ContactForm):
    if not all([form.name, form.email, form.subject, form.message]):
        raise HTTPException(status_code=400, detail="All fields are required.")

    # TODO: plug in email service (e.g. SendGrid, Resend) or store in DB
    print(f"[CONTACT] From: {form.name} <{form.email}> | Subject: {form.subject}")

    return {"success": True, "message": "Message received. Thank you!"}


# Vercel serverless handler
handler = Mangum(app)
