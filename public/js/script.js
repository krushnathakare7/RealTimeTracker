const socket = io();

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position) => {
        const {latitude, longitude} = position.coords;
        socket.emit("send-location" , {latitude, longitude});
    }, (err) => {
        console.error(err)
    }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,

    });
}

let map = L.map('map').setView([0,0], 10);
L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" ,{
    attribution : "OpenStreetMap"
}).addTo(map)

let marker = {}

socket.on("receive-location", (data) => {
    const {id, latitude, longitude} = data;
    map.setView([latitude,longitude], 15);
    if(marker[id]){
        marker[id].setLatLng([latitude,longitude]);
    }else {
        marker[id] = L.marker([latitude,longitude]).addTo(map);
    }
});

socket.on("user-disconnected", (id) => {
    if(marker[id]){
        map.removeLayer(marker[id]);
        delete marker[id];
    }
})

