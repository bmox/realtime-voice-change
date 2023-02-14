const textContainer = document.querySelector("#text-container");
const speakBtn = document.querySelector("#speak-btn");
const stopBtn = document.querySelector("#stop-btn");
const modelUrlInput = document.querySelector("#model-url");
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
let stopRecognition = false;
recognition.continuous = true;

recognition.onresult = (event) => {
const resultIndex = event.resultIndex;
const transcript = event.results[resultIndex][0].transcript;
textContainer.innerHTML = transcript;
speakText(transcript);
};

speakBtn.addEventListener("click", () => {
recognition.start();
stopRecognition = false;
speakBtn.style.backgroundColor = "red";
});

stopBtn.addEventListener("click", () => {
recognition.stop();
stopRecognition = true;
speakBtn.style.backgroundColor = "";
stopBtn.style.backgroundColor = "green";
});

function speakText(text) {
if (stopRecognition) return;
const ttsUrl = modelUrlInput.value + "run/predict";
//   console.log(ttsUrl);
fetch(ttsUrl, {
method: "POST",
headers: {
  "Content-Type": "application/json",
},
body: JSON.stringify({
  data: [text],
}),
})
.then((response) => response.json())
.then((data) => {
  const fileName = data.data[0].name;
  const fileUrl = modelUrlInput.value + "file=" + fileName;
  return fetch(fileUrl);
})
.then((response) => response.arrayBuffer())
.then((buffer) => {
  const context = new AudioContext();
  context.decodeAudioData(buffer, (audioBuffer) => {
    const source = context.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(context.destination);
    source.start();
  });
});
}