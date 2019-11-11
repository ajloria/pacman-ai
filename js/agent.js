/** Hari G Kuduva, Aayush Shah, Andrew Joshua Loria
 *  Pacman AI algorithm using BFS
 */
var GAMEBOARD = [];

var getXY = function(x, y) {
  var i = Math.floor((x - BUBBLES_X_START + BUBBLES_GAP/2)/BUBBLES_GAP);
  var j = Math.floor((y - BUBBLES_Y_START + 9)/17.75);

  return {x: i, y: j}
}

var buildGameboard = function () {
  GAMEBOARD = [];
  for(var i = 0; i < 26; i++) {
    GAMEBOARD.push([]);
    for(var j = 0; j < 29; j++) {
      GAMEBOARD[i].push({
        bubble: false,
        superBubble: false,
        inky: false,
        pinky: false,
        blinky: false,
        clyde: false,
        pacman: false,
        eaten: false,
        last: null
      });
    }
  }


  for(var i = 0; i < BUBBLES_ARRAY.length; i++) {
    var bubbleParams = BUBBLES_ARRAY[i].split( ";" );
    var y = parseInt(bubbleParams[1]) - 1;
    var x = parseInt(bubbleParams[2]) - 1;
    var type = bubbleParams[3];
    var eaten = parseInt(bubbleParams[4]);
    if (type === "b") {
      GAMEBOARD[x][y].bubble = true;
    } else {
      GAMEBOARD[x][y].superBubble = true;
    }
    if(eaten === 0) {
      GAMEBOARD[x][y].eaten = false;
    } else {
      GAMEBOARD[x][y].eaten = true;
    }
  }

  for(var i = 0; i < 26; i++) {
    for(var j = 0; j < 29; j++) {
      if(!GAMEBOARD[i][j].bubble && !GAMEBOARD[i][j].superBubble){
          GAMEBOARD[i][j] = null;
      }
    }
  }

  for(var i = 0; i < 26; i++) {
    for(var j = 0; j < 29; j++) {
      if((i === 0 && (j === 13)) ||
      (i === 1 && (j === 13)) ||
      (i === 2 && (j === 13)) ||
      (i === 3 && (j === 13)) ||
      (i === 4 && (j === 13)) ||
      (i === 6 && (j === 13)) ||
      (i === 7 && (j === 13)) ||
      (i === 8 && (j >= 10 && j <= 18)) ||
      (i === 9 && (j === 10 || j === 16)) ||
      (i === 10 && (j === 10 || j === 16)) ||
      (i === 11 && (((j >= 8) && (j <= 10)) || j === 16)) ||
      (i === 12 && (j === 10 || j === 16)) ||
      (i === 13 && (j === 10 || j === 16)) ||
      (i === 14 && (((j >= 8) && (j <= 10)) || j === 16)) ||
      (i === 15 && (j === 10 || j === 16)) ||
      (i === 16 && (j === 10 || j === 16)) ||
      (i === 17 && (j >= 10 && j <= 18)) ||
      (i === 18 && (j === 13)) ||
      (i === 19 && (j === 13)) ||
      (i === 21 && (j === 13)) ||
      (i === 22 && (j === 13)) ||
      (i === 23 && (j === 13)) ||
      (i === 24 && (j === 13)) ||
      (i === 25 && (j === 13)))  {
        GAMEBOARD[i][j] = {
          bubble: false,
          superBubble: false,
          inky: false,
          pinky: false,
          blinky: false,
          clyde: false,
          pacman: false,
          eaten: false
        };
      }
    }
  }

  var p = getXY(GHOST_INKY_POSITION_X,GHOST_INKY_POSITION_Y);
  
  if(p && GAMEBOARD[p.x] && GAMEBOARD[p.x][p.y] && p.x >= 0 && p.x < 26) GAMEBOARD[p.x][p.y].inky = true;
    p = getXY(GHOST_PINKY_POSITION_X,GHOST_PINKY_POSITION_Y);
    if(p && GAMEBOARD[p.x] && GAMEBOARD[p.x][p.y] && p.x >= 0 && p.x < 26) GAMEBOARD[p.x][p.y].pinky = true;
    p = getXY(GHOST_BLINKY_POSITION_X,GHOST_BLINKY_POSITION_Y);
    if(p && GAMEBOARD[p.x] && GAMEBOARD[p.x][p.y] && p.x >= 0 && p.x < 26) GAMEBOARD[p.x][p.y].blinky = true;
    p = getXY(GHOST_CLYDE_POSITION_X,GHOST_CLYDE_POSITION_Y);
    if(p && GAMEBOARD[p.x] && GAMEBOARD[p.x][p.y] && p.x >= 0 && p.x < 26) GAMEBOARD[p.x][p.y].clyde = true;
    p = getXY(PACMAN_POSITION_X, PACMAN_POSITION_Y);
    if(p && GAMEBOARD[p.x] && GAMEBOARD[p.x][p.y] && p.x >= 0 && p.x < 26) GAMEBOARD[p.x][p.y].pacman = true;
  
};

function drawRect(i,j) {
  var ctx = PACMAN_CANVAS_CONTEXT;
  var ygap = 17.75;
  var x = BUBBLES_X_START + i*BUBBLES_GAP - BUBBLES_GAP/2;
  var y = BUBBLES_Y_START + j*ygap- 9;
  var w = BUBBLES_GAP;
  var h = ygap;

  if (GAMEBOARD[i] === undefined) {undefined;}
  if(GAMEBOARD[i][j]){
    ctx.strokeStyle = "green";
    ctx.rect(x,y,w,h);
    ctx.stroke();
  }
}

function drawDebug() {
  for(var i = 0; i < 26; i++) {
    for(var j = 0; j < 29; j++) {
      drawRect(i,j);
    }
  }
}

function selectMove() {
    buildGameboard();
    if (!PACMAN_DEAD && !GAMEOVER) { // make sure the game is running
      let dest = getDestination();
      let xyPacman = getXY(PACMAN_POSITION_X, PACMAN_POSITION_Y);
      movePacman(SEARCH(getXY(PACMAN_POSITION_X, PACMAN_POSITION_Y), dest));
    }
};

function getDestination() {
    let superBubble = [];
    let smallBubble = [];
    for (let i = 0 ; i < GAMEBOARD.length; i++) {
      for (let j = 0; j < GAMEBOARD[i].length; j++) {
        if (GAMEBOARD[i] !== undefined && GAMEBOARD[i] !== null 
              && GAMEBOARD[i][j] !== undefined && GAMEBOARD[i][j] !== null) {
          if (GAMEBOARD[i][j].superBubble && !GAMEBOARD[i][j].eaten) {
            superBubble.push({x: i, y: j});
          } else if (GAMEBOARD[i][j].bubble && !GAMEBOARD[i][j].eaten) {
            smallBubble.push({x: i, y: j});
          }
        }
      }
    }

    let distances = [];
    const pacmanPos = getXY(PACMAN_POSITION_X, PACMAN_POSITION_Y);
    let min;
    const recentlyAteSuperBubble = GHOST_CLYDE_AFFRAID_TIMER !== null || 
    GHOST_INKY_AFFRAID_TIMER !== null || GHOST_BLINKY_AFFRAID_TIMER !== null ||
    GHOST_PINKY_AFFRAID_TIMER !== null;

    if (superBubble.length > 0 && !recentlyAteSuperBubble) { //prioritize super bubbles
      for (let i = 0; i < superBubble.length; i++) {
        distances.push({dist: Math.sqrt(Math.pow(pacmanPos.y - superBubble[i].y, 2) 
        + Math.pow(pacmanPos.x - superBubble[i].x, 2)), bubblePos: superBubble[i]});
      }
      min = distances[0];
      for (let i = 1; i < distances.length; i++) {
        if (distances[i].dist < min.dist) {
          min = distances[i];
        }
      }
    } else { 
      for (let i = 0; i < smallBubble.length; i++) {
        distances.push({dist: Math.sqrt(Math.pow(pacmanPos.y - smallBubble[i].y, 2) 
          + Math.pow(pacmanPos.x - smallBubble[i].x, 2)), bubblePos: smallBubble[i]});
      }
      min = distances[0];
      for (let i = 1; i < distances.length; i++) {
          if (distances[i].dist < min.dist) {
            min = distances[i];
          }
      }
    }
    if (min !== undefined) {
      return min.bubblePos;
    }
}

function SEARCH(start, end) {
  let queue = [], found = false, result;
  queue.push(start);
  let count = 0;
  while (!found) {
    let current = queue.shift();
    if (current === undefined || end === undefined) {
      if (canMovePacman(PACMAN_DIRECTION)) {return PACMAN_DIRECTION;}
      else if (canMovePacman(getReverseDirection(PACMAN_DIRECTION))) { return getReverseDirection(PACMAN_DIRECTION) }
      for (let i = 1; i < 5; i ++) {
        if (canMovePacman(i)) {return i;}
      }
    }
    if (current.x === end.x && current.y === end.y) {
      found = true;
      result = backTrack(end, start).direction;
    } else {
      let neighbors = getValidNeighbors(current);
      for (let i = 0; i < neighbors.length; i++) {
        queue.push(neighbors[i]);
        count++;
      }
    }
  }
  return result;
}

function backTrack(end, start) {
  let previousCord = GAMEBOARD[end.x][end.y].last, oneAway = false;
  let toSend = {direction: -1, distance: 0};
  let count = 0;
  if (getIsClose(end, start)) {return {direction: getDirection(start, end), distance: 0};}
  while(!oneAway && previousCord !== null) {
    const x = previousCord.x;
    const y = previousCord.y
    
    if ((GAMEBOARD[x][y].last === null||GAMEBOARD[x][y].last.x === start.x) && GAMEBOARD[x][y].last.y === start.y) {
      oneAway = true;
    } else {
      previousCord = GAMEBOARD[x][y].last;
      count++;
    }
  }
  if (previousCord === null) {
    return {direction: getDirection(start, end), distance: 0};
  }
  return {direction: getDirection(start, previousCord), distance: count};
}

function getIsClose(end, start) {
  const equals = start.y === end.y && start.x === end.x;
  const N = start.y+1 === end.y && start.x === end.x;
  const S = start.y-1 === end.y && start.x === end.x;
  const E = start.x+1 === end.x && start.y === end.y;
  const W = start.x-1 === end.x && start.y === end.y;
  return N || S || E || W || equals;
}

function getDirection(start, previousCord) {
  /* 1. Right 2. Down 3. Left 4. Up*/
  if (start.x + 1 === previousCord.x && start.y === previousCord.y) {
    return 1;
  } else if (start.x - 1 === previousCord.x && start.y === previousCord.y) {
    return 3;
  } else if (start.x === previousCord.x && start.y + 1 === previousCord.y) {
    return 2;
  } else {
    if (start.x === previousCord.x && start.y === previousCord.y) {
      return PACMAN_DIRECTION;
    } else {
      return 4;
    }
  }
}

function getReverseDirection(direction) {
  if (direction === 1) {
    return 3;
  } else if (direction === 2) {
    return 4;
  } else if (direction === 3) {
    return 1;
  } else {
    return 2;
  }
}

function getValidNeighbors(position) {
  let toSend = [];
  if (position.x !== 25 && GAMEBOARD[position.x + 1][position.y]!== null &&
     GAMEBOARD[position.x + 1][position.y]!== undefined &&
      GAMEBOARD[position.x + 1][position.y].last === null && 
        noGhost(position.x + 1,position.y) && noGhost(position.x+1, position.y+1) && noGhost(position.x+1, position.y-1)) {
    GAMEBOARD[position.x + 1][position.y].last = position;
    toSend.push({x: position.x + 1, y: position.y});
  }
  if (position.x !== 0 && GAMEBOARD[position.x - 1][position.y]!== null &&
     GAMEBOARD[position.x - 1][position.y]!== undefined &&
     GAMEBOARD[position.x - 1][position.y].last === null && 
     noGhost(position.x - 1,position.y) && noGhost(position.x-1, position.y+1) && noGhost(position.x-1, position.y-1)) {
    GAMEBOARD[position.x - 1][position.y].last = position;
    toSend.push({x: position.x - 1, y: position.y});
  }
  if (position.y !== 28 && GAMEBOARD[position.x][position.y + 1]!== null &&
     GAMEBOARD[position.x][position.y + 1]!== undefined &&
     GAMEBOARD[position.x][position.y + 1].last === null && 
     noGhost(position.x,position.y + 1) && noGhost(position.x+1, position.y+1) && noGhost(position.x-1, position.y+1)) {
    GAMEBOARD[position.x][position.y + 1].last = position;
    toSend.push({x: position.x, y: position.y + 1});
  }
  if (position.y !== 0 && GAMEBOARD[position.x][position.y - 1]!== null && 
    GAMEBOARD[position.x][position.y - 1]!== undefined &&
      GAMEBOARD[position.x][position.y - 1].last === null && 
      noGhost(position.x,position.y -1) && noGhost(position.x+1, position.y-1) && noGhost(position.x+1, position.y-1)) {
    GAMEBOARD[position.x][position.y - 1].last = position;
    toSend.push({x: position.x , y: position.y - 1});
  }
  return toSend;
}

function noGhost(x, y) {
  if (GAMEBOARD[x] === null || GAMEBOARD[x] === undefined || GAMEBOARD[x][y] === null || GAMEBOARD[x][y] === undefined) {
    return true;
  } 

  
  let variables = GAMEBOARD[x][y];
  let clydeThere = variables.clyde;
  let inkyThere = variables.inky;
  let blinkyThere = variables.blinky;
  let pinkyThere = variables.pinky;
  let clydeAffraid = GHOST_CLYDE_AFFRAID_TIMER !== null;
  let inkyAffraid = GHOST_INKY_AFFRAID_TIMER !== null;
  let blinkyAffraid = GHOST_BLINKY_AFFRAID_TIMER !== null;
  let pinkyAffraid = GHOST_PINKY_AFFRAID_TIMER !== null;
  if (clydeThere) {
    return clydeAffraid;
  } else if (inkyThere) {
    return inkyAffraid;
  } else if (blinkyThere) {
    return blinkyAffraid;
  } else if (pinkyThere) {
    return pinkyAffraid;
  }
  return true;

  
}
setInterval(drawDebug, 1000/3);
