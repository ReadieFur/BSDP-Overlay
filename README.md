# BSDP-Overlay
A BeatSaber overlay I have created for my [DataPuller](https://github.com/kOFReadie/DataPuller/releases) mod.
This overlay is easy to use, just add the [Overlay](http://u-readie.global-gaming.co/bsdp-overlay/) to your recording/streaming software of choice as a browser source (If my website becomes unavaliable for some reason then the overlay can be accessed [here](https://kofreadie.github.io/BSDP-Overlay/overlay/) on GitHub. HOWEVER you will not be able to use this for multi-pc setups when using the GitHub pages version). (Make sure you have the [DataPuller](https://github.com/kOFReadie/DataPuller/releases) mod installed).

## Preview:
<img src="./previews/overlay.png" width="720">

## Options:
Here is an example of how to use these parameters in the URL: `.../bsdp-overlay/default/?debug&flipHori&hideModifiersHealth&overlayForeground=255,120,0&ip=192.168.1.197&scale=0.9`  
The first parameter must start with a queston mark `?` and every other parameter after that must start with an and symbol `&`. It dosen't matter which order you put them in.

### IP:
- `ip=*`: Use this parameter if you have the mod setup to send the data over a different IP (Currently for LAN use only)

### UI Scale:
- `scale=*`: changes the scale of the UI, the site was designed for 1080p.

### Colours:
`overlayForeground=R,G,B`: Changes the colour of the foreground elements such as text.  
`overlayBackground=R,G,B`: Changes the colour of the background elements.  
`overlayAlt=R,G,B`: Changes the colour of the third colour used for the background of the health and disabled modifiers.  

### Element Visibility:
Changes the visibility of the three main elements on the overlay.
- `hideStats`: Hides the map stats.  
  <img src="./previews/stats.png" width="480">
- `hideMapDetails`: Hides the map details.  
  <img src="./previews/mapDetails.png" width="480">
- `hideModifiersHealth`: Hides the modifiers and health.  
  <img src="./previews/modifiersAndHealth.png" height="256">

### Element Position:
- `flipHori`: Moves the song information to the right and the modifiers/health to the left.
- `flipVerti`: Places the map information at the top.

### Hide when inactive:
- `hideInactive`: Hides the UI when BeatSaber is closed.

### An example of mixed URL parameters:  
<img src="./previews/scale=1.1&flipHori&FlipVert&hideModifiersHealth.png" width="512">

## Upcoming changes:
I plan to create an overlay editor, similar to WIX where you can drag and drop elements onto the page, you will be able to customise the fonts and designs etc, at first it may be a little janky but I hope to work on it an improve it a lot over time.