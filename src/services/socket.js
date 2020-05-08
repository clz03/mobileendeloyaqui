import socketio from 'socket.io-client';

const socket = socketio('https://backendeloyaqui.herokuapp.com', {
    autoConnect: false,
});

// const socket = socketio('http://192.168.0.8:8080', {
//     autoConnect: false,
// });

function subscribeToStatusPed(subscribeFunction){
    socket.on('novo-ped', subscribeFunction);
}

function subscribeToNewAgenda(subscribeFunction){
    socket.on('novo-agenda', subscribeFunction);
}

function connect(idestab, idusuario) {
    socket.io.opts.query = { idestab, idusuario };
    socket.connect();
};
 
function disconnect(){
    if (socket.connected) {
        socket.disconnect();
    };
};

export {
    connect,
    disconnect,
    subscribeToStatusPed,
    subscribeToNewAgenda
};