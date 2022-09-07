const signalingUrl = 'wss://ayame-labo.shiguredo.app/signaling';
let roomId = 'ayame-web-sdk-sample';
let clientId = null;
let videoCodec = null;
let audioCodec = null;
let signalingKey = null;

function onChangeVideoCodec() {
  videoCodec = document.getElementById("video-codec").value;
  if (videoCodec == 'none')
  {
    videoCodec = null;
  }
}
// query string から roomId, clientId を取得するヘルパー
function parseQueryString() {
  const qs = window.Qs;
  if (window.location.search.length > 0)
  {
    var params = qs.parse(window.location.search.substr(1));
    if (params.roomId)
    {
      roomId = params.roomId;
    }
    if (params.clientId)
    {
      clientId = params.clientId;
    }
    if (params.signalingKey)
    {
      signalingKey = params.signalingKey;
    }
  }
}


parseQueryString();


const options = Ayame.defaultOptions;
options.clientId = clientId ? clientId : options.clientId;
if (signalingKey)
{
  options.signalingKey = signalingKey;
}
console.log("clientId is ", options.clientId)
console.log("signalingKey is ", options.signalingKey)
options.video.direction = 'recvonly';
options.audio.direction = 'recvonly';
const remoteVideo = document.querySelector('#remote-video');
let conn;
const disconnect = () => {
  if (conn)
  {
    conn.disconnect();
  }
}
const startConn = async () => {
  options.video.codec = videoCodec;
  conn = Ayame.connection(signalingUrl, roomId, options, true);
  await conn.connect(null);
  conn.on('open', ({ authzMetadata }) => console.log(authzMetadata));
  conn.on('disconnect', (e) => {
    console.log(e);
    remoteVideo.srcObject = null;
  });
  conn.on('addstream', (e) => {
    remoteVideo.srcObject = e.stream;
  });
};
