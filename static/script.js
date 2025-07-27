window.onload = function () {
  speak("Hi! I'm Dilulu, your AI buddy. What can I help you with today?");
};

function startListening() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.start();

  recognition.onresult = function (event) {
    const userText = event.results[0][0].transcript;
    document.getElementById("userText").textContent = userText;

    fetch('/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userText })
    })
      .then(res => res.json())
      .then(data => {
        const botReply = data.response;
        document.getElementById("botText").textContent = botReply;
        speak(botReply);
      });
  };

  recognition.onerror = function (err) {
    alert("Voice recognition error: " + err.error);
  };
}

function speak(text) {
  const synth = window.speechSynthesis;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';

  const voices = synth.getVoices();
  utter.voice = voices.find(v => v.name.includes("Google UK English Female")) || voices[0];

  synth.speak(utter);
}
