# BeatSaber-Overlay
A BeatSaber overlay I have created for my [DataPuller](https://github.com/kOFReadie/DataPuller/releases) mod.
This overlay is easy to use, just open the [Overlay](http://kofreadie.globalgamingco.org) and add the URL to your recording/streaming software of choice (Make sure you have the [DataPuller](https://github.com/kOFReadie/DataPuller/releases) mod installed).

## Options
### scale:
changes the scale of the UI, the site was designed for 1080p recording/streaming.
E.G. scale=0.8

### beatmapInfo/stats/rightBar Vis:
Changes the visibility of the three main elements on the overlay (adding this parameter will hide the element).
E.G. beatmapVis

### ip=
Use this parameter if you have the mod setup to send the data over a different port (Currently for LAN use only)
E.G. ip=192.168.1.197

### moveBSR:
Adding this parameter will move the 'previous BSR' element back to where it was in the old overlay.

### flip:
Moves the song information to the right and the modifiers/health to the left.

### top:
Places the map information at the top, combine this with `flip` to have the overlay in the top right of the screen.

### hideInactive:
Hides the UI when BeatSaber is closed.