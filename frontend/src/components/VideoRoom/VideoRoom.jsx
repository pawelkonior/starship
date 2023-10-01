import './style.css';
import {Peer} from 'peerjs';
import {Button, Container, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import DrawingOverlay from "../Overlay/DrawingOverlay.jsx";
import axios from "axios";

const peer = new Peer();
let myId = null;

let currentCall;


peer.on("open", function (id) {
    myId = id;
});



function isWebcam(mediaStream) {
    let response = false;
    mediaStream.getTracks().forEach(function (track) {
        console.log("Track Kind: " + track.kind);
        console.log("Track Label: " + track.label);

        if (track.kind === "audio") {
            response = true;
        }
    });

    return response;
}

peer.on("call", (call) => {
    if (confirm(`Accept call from ${call.peer}?`)) {
        // grab the camera and mic
        navigator.mediaDevices
            .getUserMedia({video: true, audio: true})
            .then((stream) => {
                // play the local preview
                document.querySelector("#local-video").srcObject = stream;
                document.querySelector("#local-video").play();// answer the call
                call.answer(stream);// save the close function
                currentCall = call;// change to the video view
                document.querySelector("#menu").style.display = "none";
                document.querySelector("#live").style.display = "block";
                call.on("stream", (remoteStream) => {
                    // when we receive the remote stream, play it
                        document.getElementById("remote-video").srcObject = remoteStream;
                        document.getElementById("remote-video").play();

                });
            })
            .catch((err) => {
                console.log("Failed to get local stream:", err);
            });
    } else {
        // user rejected the call, close it
        call.close();
    }
});

function endCall() {
    // Go back to the menu
    document.querySelector("#menu").style.display = "block";
    document.querySelector("#live").style.display = "none";// If there is no current call, return
    if (!currentCall) return;// Close the call, and reset the function
    try {
        currentCall.close();
    } catch {
    }
    currentCall = undefined;
}

async function shareScreen() {
    // Go back to the menu
    await navigator.mediaDevices.getDisplayMedia()
        .then((stream) => {
            document.getElementById("remote-video").srcObject = stream;
            document.getElementById("remote-video").play();
            const peerId = document.querySelector("input").value;
            const call = peer.call(peerId, stream);
            call.on("stream", (stream) => {

                    document.getElementById("remote-video").srcObject = stream;
                    document.getElementById("remote-video").play();

            })
            document.getElementById('share-screen').style('display: none')
        })
}

function VideoRoom() {
    const [drawingEnabled, setDrawingEnabled] = useState(false);
    const [isFirst, setIsFirst] = useState(false);
    const [peerId, setPeerId] = useState(null);

async function tryToJoin(yourId){
    return await axios.get('/api/v1/peer_connection/');
}

async function sendPeerId() {
    axios.post('/api/v1/peer_connection/', {
        "peer_id": myId
    })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}

    useEffect(() => {
        tryToJoin().then((response) => {
            (!!response.data.peerid) ? setPeerId(response.data.peerid) : setIsFirst(true)
        });
    }, []);

    async function callUser() {
        // get the id entered by the user
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });// switch to the video call and play the camera preview
        document.getElementById("menu").style.display = "none";
        document.getElementById("live").style.display = "block";
        document.getElementById("local-video").srcObject = stream;
        document.getElementById("local-video").play();// make the call
        const call = peer.call(peerId, stream);
        call.on("stream", (stream) => {
            document.getElementById("remote-video").srcObject = stream;
            document.getElementById("remote-video").play();

        });
        call.on("data", (stream) => {
            document.getElementById("remote-video").srcObject = stream;
            document.getElementById("remote-video").play();
        });
        call.on("error", (err) => {
            console.log(err);
        });
        call.on('close', () => {
            endCall()
        })// save the close function
        currentCall = call;
    }

    if(isFirst){
        sendPeerId();
    } else {
        callUser();
    }

    return (
        <Container>
            <DrawingOverlay drawingEnabled={drawingEnabled} setDrawingEnabled={setDrawingEnabled}/>
            <div id="menu">
                {isFirst ? (
                    <Typography>
                        Poczekaj, aż inni dołączą do spotkania
                    </Typography>) : (
                    <Typography>
                        Kurs rozpoczęty, poczekaj...
                    </Typography>)

                }
            </div>
            <div id="live">
                <video id="remote-video"></video>
                <video id="local-video" muted="true"></video>
                <div id="btns">
                    <Button variant="outlined" sx={{display: drawingEnabled ? "none" : "block"}} id="draw" onClick={()=> {
                        setDrawingEnabled(!drawingEnabled)
                    }}>
                        Rysuj
                    </Button>
                    <Button variant="outlined" color="warning" id="end-call" onClick={endCall}>End Call</Button>
                    <Button variant="outlined" color="success" id="share-screen" onClick={shareScreen}>Share screen</Button>
                </div>
            </div>
        </Container>
    );
}

export default VideoRoom;
