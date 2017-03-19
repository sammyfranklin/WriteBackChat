(function(){
    console.log("Chatting");
    let channelSocket = io('http://localhost:8000/channel');
    let friendSocket = io('http://localhost:8000/friend');

    let room = id;

    channelSocket.on('connect', function(){
        console.log("Heello?");
        channelSocket.emit('room', room);
    });

    let messageForm = document.getElementById('messageForm');
    let input = document.getElementById('input');
    let messages = document.getElementById('messages');

    messageForm.addEventListener('submit', function(evt){
        evt.preventDefault();
        let value = input.value;
        console.log(value);
        if(value.charAt(0) === '/') {
            channelSocket.emit('broadcast message', value.substring(1));
        } else {
            channelSocket.emit('message', value, room);
        }
        input.value = '';
    });

    channelSocket.on('message', function(msg) {
        console.log("Received message", msg);
        let myMessage = document.createElement('LI');
        myMessage.appendChild(document.createTextNode(msg));
        messages.appendChild(myMessage);
    });
})();