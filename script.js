let activeUser = "";

/* THEME TOGGLE */

function toggleTheme(){

document.body.classList.toggle("light");

let btn = document.getElementById("themeToggle");

if(document.body.classList.contains("light")){
btn.innerHTML = "☀";
}else{
btn.innerHTML = "🌙";
}

}

/* OPEN CHAT */

function openChat(name){
activeUser = name;
chatHeader.innerText = name;
loadMessages();
}

/* TIME */

function getTime(){
let d = new Date();
return d.getHours()+":"+("0"+d.getMinutes()).slice(-2);
}

/* SEND MESSAGE */

function sendMsg(){
let text = msg.value.trim();
if(!text || !activeUser) return;

saveMessage(text,"sent");
msg.value="";

showTyping();

setTimeout(()=>{
saveMessage("Nice 🙂","received");
hideTyping();
},1500);
}

/* SAVE MESSAGE */

function saveMessage(text,type){

let data = JSON.parse(localStorage.getItem(activeUser)) || [];

data.push({text,type,time:getTime()});

localStorage.setItem(activeUser,JSON.stringify(data));

loadMessages();

document.getElementById("last-"+activeUser).innerText = text;
}

/* LOAD MESSAGE */

function loadMessages(){

messages.innerHTML="";

let data = JSON.parse(localStorage.getItem(activeUser)) || [];

data.forEach(m=>{
let div = document.createElement("div");
div.className="message "+m.type;
div.innerHTML=m.text+"<div style='font-size:10px'>"+m.time+"</div>";
messages.appendChild(div);
});

messages.scrollTop = messages.scrollHeight;
}

/* CLEAR CHAT */

function clearChat(){
if(!activeUser) return;
localStorage.removeItem(activeUser);
loadMessages();
document.getElementById("last-"+activeUser).innerText="Tap to start chat";
}

/* SEARCH */

function searchChat(val){
document.querySelectorAll(".chat").forEach(chat=>{
chat.style.display =
chat.dataset.name.includes(val.toLowerCase()) ? "flex" : "none";
});
}

/* EMOJI */

function toggleEmoji(){
emojiPanel.style.display =
emojiPanel.style.display === "block" ? "none" : "block";
}

emojiPanel.addEventListener("click",e=>{
msg.value += e.target.innerText;
});

/* TYPING */

function showTyping(){
typing.innerText = "typing...";
}

function hideTyping(){
typing.innerText = "";
}

/* IMAGE */

function sendImage(){
let file = imageInput.files[0];
let reader = new FileReader();

reader.onload = function(){
saveMessage("<img src='"+reader.result+"' width='150'>","sent");
};

reader.readAsDataURL(file);
}

/* VOICE */

let mediaRecorder;

function startRecording(){

navigator.mediaDevices.getUserMedia({audio:true})
.then(stream=>{
mediaRecorder = new MediaRecorder(stream);
mediaRecorder.start();

mediaRecorder.ondataavailable = e=>{
let audioURL = URL.createObjectURL(e.data);
saveMessage("<audio controls src='"+audioURL+"'></audio>","sent");
};
});
}

/* ENTER SEND */

msg.addEventListener("keypress",e=>{
if(e.key==="Enter") sendMsg();
});