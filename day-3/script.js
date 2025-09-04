// Mendapatkan elemen canvas dan context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Ukuran kotak untuk snake dan makanan
const box = 10;

// Inisialisasi snake
let snake = [
    {x: 150, y: 150},
    {x: 140, y: 150},
    {x: 130, y: 150}
];

// Posisi makanan awal
let food = {
    x: Math.floor(Math.random() * (canvas.width/box)) * box,
    y: Math.floor(Math.random() * (canvas.height/box)) * box
};

// Arah pergerakan awal
let dx = box;
let dy = 0;

// Skor awal
let score = 0;

// Kecepatan game
let speed = 100;

// Game over flag
let gameOver = false;

// Fungsi untuk menggambar kotak
function drawBox(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, box, box);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(x, y, box, box);
}

// Fungsi untuk membersihkan canvas
function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

// Fungsi untuk menggambar snake
function drawSnake() {
    snake.forEach((segment, index) => {
        // Kepala ular berwarna berbeda
        const color = index === 0 ? 'darkgreen' : 'lightgreen';
        drawBox(segment.x, segment.y, color);
    });
}

// Fungsi untuk menggambar makanan
function drawFood() {
    drawBox(food.x, food.y, 'red');
}

// Fungsi untuk menggambar skor
function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}

// Fungsi untuk mengecek tabrakan
function collision(head, array) {
    for(let i = 0; i < array.length; i++) {
        if(head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

// Fungsi untuk menggerakkan snake
function moveSnake() {
    // Posisi kepala baru
    const head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };

    // Game over jika menabrak dinding
    if(head.x < 0 || head.x >= canvas.width || 
       head.y < 0 || head.y >= canvas.height ||
       collision(head, snake)) {
        gameOver = true;
        return;
    }

    // Menambahkan kepala baru
    snake.unshift(head);

    // Jika memakan makanan
    if(head.x === food.x && head.y === food.y) {
        score += 10;
        // Membuat makanan baru
        food = {
            x: Math.floor(Math.random() * (canvas.width/box)) * box,
            y: Math.floor(Math.random() * (canvas.height/box)) * box
        };
        // Tingkatkan kecepatan
        speed = Math.max(50, speed - 2);
    } else {
        // Jika tidak memakan makanan, hapus ekor
        snake.pop();
    }
}

// Event listener untuk kontrol keyboard
document.addEventListener('keydown', (event) => {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    // Mencegah snake berbalik arah
    const goingUp = dy === -box;
    const goingDown = dy === box;
    const goingRight = dx === box;
    const goingLeft = dx === -box;

    switch(event.keyCode) {
        case LEFT_KEY:
            if(!goingRight) {
                dx = -box;
                dy = 0;
            }
            break;
        case RIGHT_KEY:
            if(!goingLeft) {
                dx = box;
                dy = 0;
            }
            break;
        case UP_KEY:
            if(!goingDown) {
                dx = 0;
                dy = -box;
            }
            break;
        case DOWN_KEY:
            if(!goingUp) {
                dx = 0;
                dy = box;
            }
            break;
    }
});

// Game loop utama
function gameLoop() {
    if(gameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '40px Arial';
        ctx.fillText('Game Over!', canvas.width/2 - 100, canvas.height/2);
        ctx.font = '20px Arial';
        ctx.fillText('Final Score: ' + score, canvas.width/2 - 50, canvas.height/2 + 40);
        return;
    }

    // Clear canvas
    clearCanvas();
    
    // Gerakkan dan gambar snake
    moveSnake();
    drawSnake();
    
    // Gambar makanan dan skor
    drawFood();
    drawScore();

    // Panggil game loop lagi setelah beberapa waktu
    setTimeout(gameLoop, speed);
}

// Mulai game
gameLoop();