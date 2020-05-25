var gameData;

const dataRecived = new Event("dataRecived", {bubbles:true});

function connect()
{
    var ws = new WebSocket('ws://127.0.0.1:2946/BSDataPuller');

    ws.onmessage = function(e)
    {
        gameData = JSON.parse(e.data);
        document.dispatchEvent(dataRecived);
        //console.log(e.data);
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
    "http://kofr.000webhostapp.com/apps/beatsaber/plugins/datapuller/");
}

//Run on load:
startupMessages();
connect();