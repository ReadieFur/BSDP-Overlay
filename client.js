var gameData;

const dataRecived = new Event("dataRecived", {bubbles:true});

function connect()
{
    const urlParams = new URLSearchParams(location.search);
    const IP = urlParams.has("ip") ? urlParams.get("ip") : "127.0.0.1";
    if (urlParams.has("ip") && !urlParams.has("redirect"))
    {window.location.href = "http://readie.globalgamingco.org?redirect=true&" + window.location.href.split('?')[1];}

    var ws = new WebSocket('ws://' + IP + ':2946/BSDataPuller');

    ws.onmessage = function(e)
    {
        console.log(e.data)
        gameData = JSON.parse(e.data);
        document.dispatchEvent(dataRecived);
        console.log(e.data);
    }
  
    ws.onclose = function(e)
    {
        validConnection = false;
        console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
        setTimeout(function()
        {
          connect();
        }, 1000);
    };
}

function startupMessages()
{
    console.log("If you don't have the BSDataPuller mod then download the latest relaese from here and place it in your BS mods folder: " +
    "https://github.com/kOFReadie/DataPuller/releases");
}

//Run on load:
startupMessages();
connect();