from flask import Flask, request, render_template, jsonify
from dotenv import load_dotenv
import openai
import os

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)

# In-memory chat history (last 5 messages)
chat_history = []

@app.route("/")
def home():
    return render_template("chat.html")

@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json()
    user_input = data.get("message")

    chat_history.append({"role": "user", "content": user_input})

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are Dilulu, a playful and smart voice AI who answers in a friendly tone. Always be warm and helpful."}
        ] + chat_history[-5:]
    )

    bot_reply = response['choices'][0]['message']['content']
    chat_history.append({"role": "assistant", "content": bot_reply})

    return jsonify({"response": bot_reply})

@app.route("/history")
def history():
    return jsonify(chat_history)

if __name__ == "__main__":
    app.run(debug=True)
