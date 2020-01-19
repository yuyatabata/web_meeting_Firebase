require('dotenv').config();

var firebaseConfig = {
    apiKey: console.log(process.env.apiKey),
    authDomain: "chatapp-351cd.firebaseapp.com",
    databaseURL: "https://chatapp-351cd.firebaseio.com",
    projectId: "chatapp-351cd",
    storageBucket: "chatapp-351cd.appspot.com",
    messagingSenderId: "262820390736",
    appId: "1:262820390736:web:07f0a3df3be46ef2d0ee55",
    measurementId: "G-J6TBPXGG2P"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

//時間を取得する関数
function time() {
var date = new Date();
var hh =  ("0"+date.getHours()).slice(-2);
var min = ("0"+date.getMinutes()).slice(-2);
var sec = ("0"+date.getSeconds()).slice(-2);

var time = hh + ":" + min + ":" + sec;
return time;
}

//音声認識処理
const speech = new webkitSpeechRecognition();
speech.lang = 'ja-JP'

const join = document.getElementById('join');
const content = document.getElementById('content');

join.addEventListener('click', function(){
    room = document.getElementById('join-room').value;
    speech.start();
    text();
})

const endcall = document.getElementById('end-call');
endcall.addEventListener('click',function(){
    location.reload();
})

//Msg送信準備
const newPostRef = firebase.database();
let room = 'room1';

const username = document.getElementById("username");
const output = document.getElementById("output");

//Msg受信処理
function text(){
    newPostRef.ref(room).on("child_added",function(data){
        const v = data.val();
        const k = data.key;
        let str = "";

        str += '<div id=""+ k +"" class="msg_main ">';
        str += '<div class="msg_left">';
        str += '<div class=""><img src="img/icon_person.png" alt="" class="icon '+ v.username +'" width="30"></div>';
        str += '<div class="msg">';
        str += '<div class = "name">'+ v.username + '</div>';
        str += '<div class = "text">' + v.text + '</div>';
        str += '</div>';
        str += '</div>';
        str += '<div class="msg_right">';
        str += '<div class = "time">'+ v.time + '</div>';
        str += '</div>';
        str += '</div>';
        output.innerHTML += str;

        $("#output").scrollTop( $("#output")[0].scrollHeight);
    });
}

speech.onresult = 
function(e) {
    speech.stop();
    if(e.results[0].isFinal){
    var autotext = e.results[0][0].transcript
    console.log(e);
    console.log(autotext);

    newPostRef.ref(room).push({
        username:username.value,
        text: autotext,
        time: time()
    });
    }
}
speech.onend = () => {
speech.start()
};