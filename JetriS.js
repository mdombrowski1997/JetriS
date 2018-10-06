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
        [[1, 0], [1, 1], [1, 2], [0, 2]]
    ],
    [
        [[2, 0], [0, 1], [1, 1], [2, 1]],
        [[1, 0], [2, 0], [1, 1], [1, 2]],
        [[0, 1], [1, 1], [2, 1], [0, 2]],
        [[0, 0], [1, 0], [1, 1], [1, 2]]
    ]
]
var COLORS = [
    "#FFFFFF",  // NONE
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
    var piece = {
        id: id,
        x:  START[0],
        y:  START[1],
        rotation:   0
    }
    return piece;
}
// For adding a piece directly to the board
// PURELY DEBUGGING?
function addPiece(grid, piece) {
    for (var i = 0; i < 4; ++i) {
        grid[piece.x + ROTATIONS[piece.id][piece.rotation][i][0]][piece.y + ROTATIONS[piece.id][piece.rotation][i][1]] = piece.id;
    }
}
function render(canvas, grid, piece) {
    var ctx = canvas.getContext("2d");
    // Draw filled squares
    for (var i = 0; i < SQUARES_X; ++i) {
        for (var j = 0; j < SQUARES_Y; ++j) {
            ctx.fillStyle = COLORS[grid[i][j]];
            ctx.fillRect(i*WIDTH/SQUARES_X, j*HEIGHT/SQUARES_Y, 
                        WIDTH/SQUARES_X, HEIGHT/SQUARES_Y);
        }
    }
    // Draw current piece
    for (var i = 0; i < 4; ++i) {
        ctx.fillStyle = COLORS[piece.id];
        ctx.fillRect((piece.x + ROTATIONS[piece.id][piece.rotation][i][0]) * WIDTH/SQUARES_X,
                    (piece.y + ROTATIONS[piece.id][piece.rotation][i][1]) * HEIGHT/SQUARES_Y,
                    WIDTH/SQUARES_X, HEIGHT/SQUARES_Y);
    }

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
var cur = newPiece(Math.floor(Math.random()*7)+1);
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
        // TODO: Kick
        case "z":
            if (cur.rotation == 0) {
                cur.rotation = 3;
            }
            else {
                cur.rotation -= 1;
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
            break;
        // Down Arrow soft drops
        case "ArrowDown":
            cur.y += 1;
            break;
        default:
            return;
    }
});

// LOOP
;(function() {
    function main() {
        window.requestAnimationFrame(main);
        if (gravity(board, cur) == false) {
            addPiece(board, cur);
            cur = newPiece(Math.floor(Math.random()*7)+1);
        }
        render(canvas, board, cur);
    };
    main();
})();
