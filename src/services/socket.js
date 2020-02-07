import socketio from 'socket.io-client';

const socket = socketio('http://localhost:8080', {
    autoConnect: false,
});

function connect(idestab) {
    socket.io.opts.query = { idestab };
    socket.connect();

    socket.on('message', text => {
        console.log(text);
    });
};
 
function disconnect(){
    if (socket.connected) {
        socket.disconnect();
    };
};

export {
    connect,
    disconnect
};