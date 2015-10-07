### What
This is a JavaScript powered game of connect the dots. When a box has all of its borders selected, you get a point. The game is over when all of the boxes have been filled in. Whoever has the most points wins.

### How
- Built with:
  - JavaScript
  - Sass/Compass

### Why
I wanted a fun, challenging project to continue to challenge myself as I learn JavaScript. I decided to make a game out of the old "connect the dots" game that so many people have played with their siblings on long road trips. It's basically a lot of divs laid out in a grid, with "sensor divs" on top of the grid. There is more documentation in app.js

### Known Issues
- The turn will advance to the next player if you click on a already selected line.
- I believe the game incorrectly announces the winner, always choosing either the last or first player. I have to double check and fix it soon.
- The game is still a little rough, the code needs refactoring, and the design needs improvements.
- Not very responsive.