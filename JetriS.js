// GLOBALS
var START = [3, 0];
var ROTATIONS = [
    [],
    [
        [[0, 1], [1, 1], [2, 1], [3, 1]],
        [[2, 0], [2, 1], [2, 2], [2, 3]],
        [[0, 2], [1, 2], [2, 2], [3, 2]],
        [[1, 0], [1, 1], [1, 2], [1, 3]]
    ],
    [
        [[1, 0], [2, 0], [1, 1], [2, 1]],
        [[1, 0], [2, 0], [1, 1], [2, 1]],
        [[1, 0], [2, 0], [1, 1], [2, 1]],
        [[1, 0], [2, 0], [1, 1], [2, 1]]
    ],
    [
        [[1, 0], [0, 1], [1, 1], [2, 1]],
        [[1, 0], [1, 1], [2, 1], [1, 2]],
        [[0, 1], [1, 1], [2, 1], [1, 2]],
        [[1, 0], [0, 1], [1, 1], [1, 2]]
    ],
    [
        [[1, 0], [2, 0], [0, 1], [1, 1]],
        [[1, 0], [1, 1], [2, 1], [2, 2]],
        [[1, 1], [2, 1], [0, 2], [1, 2]],
        [[0, 0], [0, 1], [1, 1], [1, 2]]
    ],
    [
        [[0, 0], [1, 0], [1, 1], [2, 1]],
        [[2, 0], [1, 1], [2, 1], [1, 2]],
        [[0, 1], [1, 1], [1, 2], [2, 2]],
        [[1, 0], [0, 1], [1, 1], [0, 2]]
    ],
    [
        [[0, 0], [0, 1], [1, 1], [2, 1]],
        [[1, 0], [2, 0], [1, 1], [1, 2]],
        [[0, 1], [1, 1], [2, 1], [2, 2]],
        [[1, 0], [1, 1], [0, 2], [1, 2]]
    ],
    [
        [[2, 0], [0, 1], [1, 1], [2, 1]],
        [[1, 0], [1, 1], [1, 2], [2, 2]],
        [[0, 1], [1, 1], [2, 1], [0, 2]],
        [[0, 0], [1, 0], [1, 1], [1, 2]]
    ]
]
var COLORS = [
    "#808080",  // NONE
    "#00FFFF",  // "Cyan"
    "#FFFF00",  // "Yellow"
    "#FF00FF",  // "Purple"
    "#00FF00",  // "Green"
    "#FF0000",  // "Red"
    "#0000FF",  // "Blue"
    "#FF8000"   // "Orange"
]
var PIECES = [
    "EMPTY",
    "I",
    "O",
    "T",
    "S",
    "Z",
    "J",
    "L"
]
WIDTH = 409;
HEIGHT = 900;
SQUARES_X = 10;
SQUARES_Y = 22;

//METHODS
function newPiece(id) {
    id = id;
    var piece = {
        id: id,
        x:  START[0],
        y:  START[1],
        rotation:   0
    }
    return piece;
}
// For adding a piece directly to the board
function addPiece(grid, piece) {
    for (var i = 0; i < 4; ++i) {
        grid[piece.x + ROTATIONS[piece.id][piece.rotation][i][0]][piece.y + ROTATIONS[piece.id][piece.rotation][i][1]] = piece.id;
    }
}
function render(canvas, grid, piece, next, ghost, hold, score) {
    var lost = false;
    var ctx = canvas.getContext("2d");
    // Render Clear
    ctx.fillStyle = "#F0F0F0";
    ctx.fillRect(0, 0, 2*WIDTH, HEIGHT);
    // Draw filled squares
    for (var i = 0; i < SQUARES_X; ++i) {
        for (var j = 0; j < SQUARES_Y; ++j) {
            if (grid[i][j] != 0) {
                if (j < 2) {
                    lost = true;
                }
                ctx.fillStyle = COLORS[grid[i][j]];
                ctx.fillRect(i*WIDTH/SQUARES_X, j*HEIGHT/SQUARES_Y, 
                            WIDTH/SQUARES_X, HEIGHT/SQUARES_Y);
            }
        }
    }
    // Draw current piece
    ctx.fillStyle = COLORS[piece.id];
    for (var i = 0; i < 4; ++i) {
        ctx.fillRect((piece.x + ROTATIONS[piece.id][piece.rotation][i][0]) * WIDTH/SQUARES_X,
                    (piece.y + ROTATIONS[piece.id][piece.rotation][i][1]) * HEIGHT/SQUARES_Y,
                    WIDTH/SQUARES_X, HEIGHT/SQUARES_Y);
    }
    // Draw ghost piece
    ctx.globalAlpha = 0.30;
    ctx.fillStyle = COLORS[ghost.id];
    for (var i = 0; i < 4; ++i) {
        ctx.fillRect((ghost.x + ROTATIONS[ghost.id][ghost.rotation][i][0]) * WIDTH/SQUARES_X,
                    (ghost.y + ROTATIONS[ghost.id][ghost.rotation][i][1]) * HEIGHT/SQUARES_Y,
                    WIDTH/SQUARES_X, HEIGHT/SQUARES_Y);
    }
    ctx.globalAlpha = 1.0;

    // Draw grid
    ctx.fillStyle = "#000000";
    // Vertical  Lines
    for (var i = 0; i < SQUARES_X+1; ++i) {
        ctx.moveTo(i*WIDTH/SQUARES_X, 0);
        ctx.lineTo(i*WIDTH/SQUARES_X, HEIGHT);
        ctx.stroke();
    }
    // Horizontal  Lines
    for (var i = 0; i < SQUARES_Y+1; ++i) {
        ctx.moveTo(0, i*HEIGHT/SQUARES_Y);
        ctx.lineTo(WIDTH, i*HEIGHT/SQUARES_Y);
        ctx.stroke();
    }

    // Other side of screen
    ctx.font="40px Arial";
    ctx.textAlign="center";
    // Next Piece
    ctx.strokeRect(WIDTH+53, 75, 303, 75);
    ctx.fillStyle = "#000000";
    ctx.fillText("NEXT", WIDTH+53+303/2, 75+75*3/4);
    ctx.strokeRect(WIDTH+53, 75, 303, 200);
    if (next != null) {
        ctx.fillStyle = COLORS[next.id];
        for (var i = 0; i < 4; ++i) {
            ctx.fillRect((next.x + ROTATIONS[next.id][next.rotation][i][0]) * WIDTH/SQUARES_X,
                        (next.y + ROTATIONS[next.id][next.rotation][i][1]) * HEIGHT/SQUARES_Y,
                        WIDTH/SQUARES_X, HEIGHT/SQUARES_Y);
        }
    }
    // Hold Piece
    ctx.strokeRect(WIDTH+53, 325, 303, 75);
    ctx.fillStyle = "#000000";
    ctx.fillText("HOLD", WIDTH+53+303/2, 325+75*3/4);
    ctx.strokeRect(WIDTH+53, 325, 303, 200);
    if (hold != null) {
        ctx.fillStyle = COLORS[hold.id];
        for (var i = 0; i < 4; ++i) {
            ctx.fillRect((hold.x + ROTATIONS[hold.id][hold.rotation][i][0]) * WIDTH/SQUARES_X,
                        (hold.y + ROTATIONS[hold.id][hold.rotation][i][1]) * HEIGHT/SQUARES_Y,
                        WIDTH/SQUARES_X, HEIGHT/SQUARES_Y);
        }
    }
    // Score
    ctx.strokeRect(WIDTH+53, 575, 303, 75);
    ctx.fillStyle = "#000000";
    ctx.fillText("SCORE", WIDTH+53+303/2, 575+75*3/4);
    ctx.strokeRect(WIDTH+53, 575, 303, 200);
    ctx.fillText(score, WIDTH+53+303/2, 575+75+75*3/4);

    // Game Over
    if (lost) {
        ctx.fillStyle = "#A0A0A0";
        ctx.fillRect(WIDTH/2, HEIGHT/3, WIDTH, HEIGHT/3);
        ctx.fillStyle = "#000000";
        ctx.strokeRect(WIDTH/2, HEIGHT/3, WIDTH, HEIGHT/3);
        ctx.fillText("Game Over", WIDTH, HEIGHT/2);
        ctx.fillText(score, WIDTH, HEIGHT/2 + 50);
    }

    // FPS Counter
    ++fps;
}
function clearLines(grid) {
    // Placeholder for now so addition of level is simpler later
    var lvl = 1;
    var lines = 0;
    // Flags for each row
    var flags = new Array(SQUARES_Y);
    // Check each line, and lower flag if empty found
    for (var j = 0; j < SQUARES_Y; ++j) {
        // Ensure flag is raised to begin
        flags[j] = true;
        for (var i = 0; i < SQUARES_X; ++i) {
            if (grid[i][j] == 0) {
                flags[j] = false;
                break;
            }
        }
    }
    // Eliminate filled rows
    for (var j = 0; j < SQUARES_Y; ++j) {
        if (flags[j] == true) {
            for (var i = 0; i < SQUARES_X; ++i) {
                grid[i][j] = 0;
            }
            //Shift all above down
            for (var i = 0; i < SQUARES_X; ++i) {
                for (var k = j; k > 0; --k) {
                    grid[i][k] = grid[i][k-1]
                }
            }
        }
    }
    // Scoring by number of true flags
    for (var j = 0; j < SQUARES_Y; ++j) {
        if (flags[j]) ++lines;
    }
    if (lines == 1) {
        return 100*lvl;
    }
    if (lines == 2) {
        return 300*lvl;
    }
    if (lines == 3) {
        return 500*lvl;
    }
    if (lines == 4) {
        return 800*lvl;
    }
    return 0;
}
function gravity(grid, piece) {
    // Find current height of current rotation
    var bottom = 0;
    for (var i = 0; i < 4; ++i) {
        if (bottom < ROTATIONS[piece.id][piece.rotation][i][1]) {
            bottom = ROTATIONS[piece.id][piece.rotation][i][1];
        }
    }
    ++bottom;
    // Lock piece if collision
    var occupied = false;
    // With floor
    if (piece.y >= SQUARES_Y - bottom) {
        occupied = true;
    }
    // With other piece
    // Determine if piece where I will shift down into
    for (var i = 0; i < 4; ++i) {
        if (grid[piece.x + ROTATIONS[piece.id][piece.rotation][i][0]][piece.y + ROTATIONS[piece.id][piece.rotation][i][1] + 1] != 0) {
            occupied = true;
            break;
        }
    }
    // Shift piece down if able
    if (occupied == false) {
        piece.y += 1;
        return true;
    }
    return false;
}
function newBag() {
    var ids = [];
    while (ids.length < 7) {
        var rand = Math.floor(Math.random()*7)+1;
        if (ids.indexOf(rand) < 0) {
            ids.push(rand);
        }
    }
    var bag = [];
    for (var i = 0; i < 7; ++i) {
        bag.push(newPiece(ids.pop()));
    }
    return bag;
}

// START OF MAIN
// Initialize canvas
var canvas = document.getElementById("JetriS");
var ctx = canvas.getContext("2d");
// Underlying gameboard is 10x22 array of indeces
var board = new Array(SQUARES_X);
for (var i = 0; i < SQUARES_X; ++i) {
    board[i] = new Array(SQUARES_Y);
    for (var j = 0; j < SQUARES_Y; ++j) {
        board[i][j] = 0;
    }
}
// Currently controlled piece
var bag = newBag();
var cur = bag.pop();
cur.x = START[0];
cur.y = START[1];
var next = bag.pop();
next.x = (WIDTH + 53 - 45 + 303/2)*SQUARES_X/WIDTH;
next.y = (75 + 50 + 75/2)*SQUARES_Y/HEIGHT;
var ghost = newPiece(cur.id);
var hold = null;
var held = false;
var score = 0;
var fps = 0;
// Keypress events
window.addEventListener("keydown", function(event) {
    switch (event.key) {
        // Left Arrow moves
        case "ArrowLeft":
            var lEdge = 4;
            for (var i = 0; i < 4; ++i) {
                if (lEdge > ROTATIONS[cur.id][cur.rotation][i][0]) {
                    lEdge = ROTATIONS[cur.id][cur.rotation][i][0];
                }
            }
            if (cur.x + lEdge > 0) {
                cur.x -= 1;
            }
            break;
        // Right Arrow moves
        case "ArrowRight":
            var rEdge = 0;
            for (var i = 0; i < 4; ++i) {
                if (rEdge < ROTATIONS[cur.id][cur.rotation][i][0]) {
                    rEdge = ROTATIONS[cur.id][cur.rotation][i][0];
                }
            }
            if (cur.x + ++rEdge < SQUARES_X) {
                cur.x += 1;
            }
            break;
        // z rotates left
        case "z":
            if (cur.rotation == 0) {
                cur.rotation = 3;
            }
            else {
                cur.rotation -= 1;
            }
            var tmp = [];
            for (var i = 0; i < 4; ++i) {
                tmp.push(ROTATIONS[cur.id][cur.rotation][i][0]);
            }
            while (cur.x + Math.max(...tmp)  >= SQUARES_X) {
                --cur.x;
            }
            while (cur.x < 0) {
                ++cur.x;
            }
            break;
        // x rotates right
        case "x":
            if (cur.rotation == 3) {
                cur.rotation = 0;
            }
            else {
                cur.rotation += 1;
            }
            var tmp = [];
            for (var i = 0; i < 4; ++i) {
                tmp.push(ROTATIONS[cur.id][cur.rotation][i][0]);
            }
            while (cur.x + Math.max(...tmp)  >= SQUARES_X) {
                --cur.x;
            }
            while (cur.x < 0) {
                ++cur.x;
            }
            break;
        // Down Arrow soft drops
        case "ArrowDown":
            cur.y += 1;
            score += 1;
            break;
        // Space hard drops
        case " ":
            score += 2*(SQUARES_Y - cur.y);
            cur.y = ghost.y;
            break;
        // Shift holds piece
        case "Shift":
            if (!held) {
                if (hold != null) {
                    var tmp = hold;
                    hold = cur;
                    cur = tmp;
                }
                else {
                    hold = cur;
                    cur = next;
                    next = bag.pop();
                    next.x = (WIDTH + 53 - 45 + 303/2)*SQUARES_X/WIDTH;
                    next.y = (75 + 50 + 75/2)*SQUARES_Y/HEIGHT;
                    if (bag.length < 1) {
                        bag = newBag();
                    }
                }
                hold.x = (WIDTH + 53 - 45 + 303/2)*SQUARES_X/WIDTH;
                hold.y = (325 + 50 + 75/2)*SQUARES_Y/HEIGHT;
                cur.x = START[0];
                cur.y = START[1];
                ghost.id = cur.id;
                held = true;
            }
            break;
        // All else do nothing
        default:
            return;
    }
});
setInterval(function() {
    console.log(fps);
    fps = 0;
}, 1000);

// LOOP
;(function() {
    function main() {
        window.requestAnimationFrame(main);
        if (gravity(board, cur) == false) {
            addPiece(board, cur);
            cur = next;
            ghost = newPiece(cur.id);
            cur.x = START[0];
            cur.y = START[1];
            next = bag.pop();
            next.x = (WIDTH + 53 - 45 + 303/2)*SQUARES_X/WIDTH;
            next.y = (75 + 50 + 75/2)*SQUARES_Y/HEIGHT;
            if (bag.length < 1) {
                bag = newBag();
            }
            held = false;
        }
        // TETRIS!!! (Hopefully)
        score += clearLines(board);
        // Track current with ghost piece on the floor
        ghost.rotation = cur.rotation;
        ghost.x = cur.x;
        ghost.y = cur.y;
        while (gravity(board, ghost));
        // Draw
        render(canvas, board, cur, next, ghost, hold, score);
    };
    main();
})();
