function _1(md){return(
md`# pica nelas

Can you predict the final right of Apex Legends from the first two zones?`
)}

function _state(Inputs,getRandomGame,set,$0){return(
Inputs.button("Go Next", {
  // value: { counter: 1, gameID: getRandomGame() },
  value: { counter: 1, gameID: getRandomGame()},
  reduce: function (x) {
    x.gameID = getRandomGame();
    x.counter += 1;
    set($0, false);
    return x;
  }
})
)}

function _gotogame(htl,gameID)
{
  return htl.html`<a target="_blank" rel="noopener noreferrer" href="https://apexlegendsstatus.com/algs/game/${gameID}">go to this ALGS game</a>`;}


function _score(state,played,htl,correctCounter)
{
  if (state.counter === 1 && !played) {
    return htl.html`<p class="winrate">Your score will appear here.</p>`;
  } else {
    if (played) {
      var x = state.counter;
      var winrate = Math.trunc((correctCounter / x) * 100.0).toString();
      return htl.html`<p class="winrate">You played ${x} games and got ${correctCounter} correct. Your win rate is ${winrate}%.</p>`;
    } else {
      var x = state.counter - 1;
      var winrate = Math.trunc((correctCounter / x) * 100.0).toString();
      return htl.html`<p class="winrate">You played ${x} games and got ${correctCounter} correct. Your win rate is ${winrate}%.</p>`;
    }
  }
}


function* _map(html,L,game,maps,$0,increment,$1,set)
{
  const K = 800;
  const container = html`<div style="height:${K}px;">`;
  container.correct = 0;
  yield container;

  function toMapUnit(x) {
    return (x / 16384) * K;
  }
  const map = L.map(container, {
    crs: L.CRS.Simple,
    minZoom: 0,
    zoomControl: false,
    scrollWheelZoom: false
  });
  var bounds = [
    [0, 0],
    [K, K]
  ];
  var mapimg = game[0].map === "we" ? maps.we : maps.sp;
  var image = L.imageOverlay(mapimg, bounds).addTo(map);
  map.fitBounds(bounds);

  function addCircleFromClick(lat, lng) {
    var circle = L.circle([lng, lat], {
      color: "#FCE77D",
      fillColor: "#FCE77D",
      fillOpacity: 0,
      weight: 2,
      radius: toMapUnit(321)
    }).addTo(map);
    // console.log("adding circle");
  }

  function addCircle(record) {
    var c = record.center;
    var circle = L.circle([toMapUnit(c.y), toMapUnit(c.x)], {
      color: "#F96167",
      fillColor: "#F96167",
      fillOpacity: 0,
      weight: 2, //stroke width
      radius: toMapUnit(record.radius)
    }).addTo(map);
  }

  function onMapClick(e) {
    if ($0.value) {
      return;
    }
    addCircleFromClick(e.latlng.lng, e.latlng.lat);
    // add the rest
    for (const s of game) {
      if (s.stage > 2) {
        addCircle(s);
      }
    }
    game.sort((x, y) => x.stage - y.stage);
    var lastAvailableRing = game[game.length - 1];
    var distsq =
      (toMapUnit(lastAvailableRing.center.y) - e.latlng.lat) ** 2 +
      (toMapUnit(lastAvailableRing.center.x) - e.latlng.lng) ** 2;
    var radsq = toMapUnit(lastAvailableRing.radius * 1.8) ** 2;
    // console.log(
    //   lastAvailableRing,
    //   [
    //     toMapUnit(lastAvailableRing.center.x),
    //     toMapUnit(lastAvailableRing.center.y)
    //   ],
    //   e.latlng,
    //   distsq,
    //   radsq
    // );
    if (distsq < radsq) {
      increment($1);
    }
    set($0, true);
  }

  for (const s of game) {
    if (s.stage < 3) {
      addCircle(s);
    }
  }

  map.on("click", onMapClick);
}


function _6(md){return(
md`## under the hood`
)}

function _game(circleData,gameID){return(
circleData.filter(x => x.gameID === gameID && x.stage > 0)
)}

async function _circleData(FileAttachment)
{
  var tmp = await FileAttachment("circles@1.json").json();
  // flip y values
  tmp.map(function (x){x.center.y = 16384 - x.center.y; return x;});
  return tmp;
}


async function _L(require,html)
{
  const L = await require("leaflet@1.9.3/dist/leaflet.js");
  if (!L._style) {
    const href = await require.resolve("leaflet@1/dist/leaflet.css");
    document.head.appendChild(L._style = html`<link href=${href} rel=stylesheet>`);
  }
  return L;
}


async function _maps(FileAttachment)
{
  return {
    we: await FileAttachment("mp_rr_desertlands_mu3.jpg").image(),
    sp: await FileAttachment("mp_rr_tropic_island_mu1.jpg").image()
  };
}


function _correctCounter(htl)
{
  const element = htl.html`<div id="#correct-counter"></div>`;
  element.value = 0;
  return element;
}


function _played(htl)
{
  const element = htl.html`<div id="#played"></div>`;
  element.value = false;
  return element;
}


function _set(Event){return(
function set(input, value) {
  input.value = value;
  input.dispatchEvent(new Event("input", {bubbles: true}));
}
)}

function _increment(Event){return(
function increment(input) {
  input.value++;
  input.dispatchEvent(new Event("input", {bubbles: true}));
}
)}

function _getRandomGame(circleData){return(
function(){
  let gameIDs = [
    // Função que pega os mapas com base no quadrante
    ...new Set(circleData.filter((x) => x.stage === 5 
    // && x.center.x > 12000 // Eixo horizontal
    // && x.center.y < 7000 // Eixo vertical
    )
    .map((x) => x.gameID))
  ];
  console.log(gameIDs)
  let i = Math.floor(Math.random() * gameIDs.length);
  return gameIDs[i];
}
)}

function _gameID(state){return(
state.gameID
)}

function _ns(Inputs){return(
Inputs.text().classList[0]
)}

function _style(html,ns){return(
html`<style>
.${ns} button {
  background-color: #1F2428;
  border: none;
  color: white;
  padding: 10px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 18px;
}

.${ns} div label {
  background-color: #f4f4f4;
  padding: 1.25rem 0.5rem;
  border-radius: 0.5rem;
}

.${ns} div label:hover,
.${ns} div label:active,
.${ns} div label:focus {
  background-color: #cdecff;
}
</style>`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["mp_rr_tropic_island_mu1.jpg", {url: new URL("./files/2ea1e229ce738138f4004e18a2d1274f295610f6899bd95444e31f72d57073aff5bb6f122aa26ab5c331815abe2e81349afce6ad2d163aa4cfc7444108e648ca.jpeg", import.meta.url), mimeType: "image/jpeg", toString}],
    ["mp_rr_desertlands_mu3.jpg", {url: new URL("./files/46fca8b35bb45b24311c386f5d1e813b70bc5ce21f5b95323d07220be67c6cd8bb419b304e0eb3ea59497ef46de986adea469cf59e1539df14de829f0f13837f.jpeg", import.meta.url), mimeType: "image/jpeg", toString}],
    ["circles@1.json", {url: new URL("./files/9e4fc54054954dc7fe2e7718027ce0000f58ee79cdb5a451f411a0699a7dad5bb0ed4f567b2d1d99a8936bf5a3b6d367ae59615e5ec83f2cd19ad07c43767811.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof state")).define("viewof state", ["Inputs","getRandomGame","set","viewof played"], _state);
  main.variable(observer("state")).define("state", ["Generators", "viewof state"], (G, _) => G.input(_));
  main.variable(observer("gotogame")).define("gotogame", ["htl","gameID"], _gotogame);
  main.variable(observer("score")).define("score", ["state","played","htl","correctCounter"], _score);
  main.variable(observer("map")).define("map", ["html","L","game","maps","viewof played","increment","viewof correctCounter","set"], _map);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer("game")).define("game", ["circleData","gameID"], _game);
  main.variable(observer("circleData")).define("circleData", ["FileAttachment"], _circleData);
  main.variable(observer("L")).define("L", ["require","html"], _L);
  main.variable(observer("maps")).define("maps", ["FileAttachment"], _maps);
  main.variable(observer("viewof correctCounter")).define("viewof correctCounter", ["htl"], _correctCounter);
  main.variable(observer("correctCounter")).define("correctCounter", ["Generators", "viewof correctCounter"], (G, _) => G.input(_));
  main.variable(observer("viewof played")).define("viewof played", ["htl"], _played);
  main.variable(observer("played")).define("played", ["Generators", "viewof played"], (G, _) => G.input(_));
  main.variable(observer("set")).define("set", ["Event"], _set);
  main.variable(observer("increment")).define("increment", ["Event"], _increment);
  main.variable(observer("getRandomGame")).define("getRandomGame", ["circleData"], _getRandomGame);
  main.variable(observer("gameID")).define("gameID", ["state"], _gameID);
  main.variable(observer("ns")).define("ns", ["Inputs"], _ns);
  main.variable(observer("style")).define("style", ["html","ns"], _style);
  return main;
}
