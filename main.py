import os

import streamlit as st
from dotenv import load_dotenv
from mistralai.client import Mistral

load_dotenv()

MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY", "")
MISTRAL_MODEL = "mistral-small-latest"

st.set_page_config(page_title="Task Manager IA", layout="centered")

if "tasks" not in st.session_state:
    st.session_state.tasks = []  # list of {"text": str, "done": bool}

if "chat_history" not in st.session_state:
    st.session_state.chat_history = []  # list of {"role": str, "content": str}


def add_task(text):
    text = text.strip()
    if text:
        st.session_state.tasks.append({"text": text, "done": False})


def delete_task(index):
    st.session_state.tasks.pop(index)


def transcribe_from_microphone():
    import speech_recognition as sr

    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        audio = recognizer.listen(source, timeout=5, phrase_time_limit=10)
    return recognizer.recognize_google(audio, language="fr-FR")


def ask_mistral(question):
    client = Mistral(api_key=MISTRAL_API_KEY)
    response = client.chat.complete(
        model=MISTRAL_MODEL,
        messages=[{"role": "user", "content": question}],
    )
    return response.choices[0].message.content


st.title("Task Manager IA")

st.header("Tâches")

with st.form("add_task_form", clear_on_submit=True):
    col1, col2 = st.columns([4, 1])
    new_task = col1.text_input("Nouvelle tâche", label_visibility="collapsed")
    submitted = col2.form_submit_button("Ajouter")
    if submitted:
        add_task(new_task)

if st.button("🎤 Dicter une tâche"):
    try:
        text = transcribe_from_microphone()
        add_task(text)
        st.success(f"Ajouté : {text}")
    except Exception as e:
        st.error(f"Échec de la dictée : {e}")

for i, task in enumerate(st.session_state.tasks):
    col1, col2 = st.columns([5, 1])
    done = col1.checkbox(task["text"], value=task["done"], key=f"task_{i}")
    st.session_state.tasks[i]["done"] = done
    if col2.button("🗑️", key=f"delete_{i}"):
        delete_task(i)
        st.rerun()

st.divider()

st.header("Assistant IA")

for message in st.session_state.chat_history:
    st.chat_message(message["role"]).write(message["content"])

question = st.chat_input("Demande de l'aide pour gérer tes tâches...")
if question:
    st.session_state.chat_history.append({"role": "user", "content": question})
    st.chat_message("user").write(question)

    if not MISTRAL_API_KEY:
        answer = "MISTRAL_API_KEY manquante. Configure-la dans le fichier .env."
    else:
        try:
            answer = ask_mistral(question)
        except Exception as e:
            answer = f"Erreur API Mistral : {e}"

    st.session_state.chat_history.append({"role": "assistant", "content": answer})
    st.chat_message("assistant").write(answer)
