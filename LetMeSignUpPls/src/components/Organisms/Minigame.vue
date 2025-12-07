<script>
export default {
    emits: ['addCoins'],
    props : ['myBalance'],
    data() {
        return {
            
            playerX: 200,
            bullets: [],
            enemies: [],
            enemyBullets: [],
            gameLoop: null,
            enemySpawnInterval: null,
            enemyShootInterval: null,
            difficultyInterval: null,
            gameWidth: 400,
            gameHeight: 500,
            playerWidth: 40,
            playerHeight: 40,
            bulletSpeed: 8,
            enemySpeed: 2,
            enemyBulletSpeed: 5,
            baseEnemySpeed: 2,
            spawnRate: 1500,
            difficulty: 1,
            isPlaying: false,
            gameOver: false
        }
    },
    methods: {
        startGame() {
            this.isPlaying = true
            this.gameOver = false
            // Don't reset balance on restart - keep accumulated coins
            this.bullets = []
            this.enemies = []
            this.enemyBullets = []
            this.difficulty = 1
            this.enemySpeed = this.baseEnemySpeed
            this.spawnRate = 1500
            this.playerX = this.gameWidth / 2 - this.playerWidth / 2
            
            // Game loop
            this.gameLoop = setInterval(() => {
                this.updateGame()
            }, 1000 / 60) // 60 FPS
            
            // Initial enemy spawning
            this.startEnemySpawning()
            this.startEnemyShooting()
            
            // Increase difficulty every 10 seconds
            this.difficultyInterval = setInterval(() => {
                this.increaseDifficulty()
            }, 10000)
        },
        
        stopGame() {
            this.isPlaying = false
            this.gameOver = false
            clearInterval(this.gameLoop)
            clearInterval(this.enemySpawnInterval)
            clearInterval(this.enemyShootInterval)
            clearInterval(this.difficultyInterval)
        },
        
        startEnemySpawning() {
            if (this.enemySpawnInterval) {
                clearInterval(this.enemySpawnInterval)
            }
            this.enemySpawnInterval = setInterval(() => {
                this.spawnEnemy()
            }, this.spawnRate)
        },
        
        startEnemyShooting() {
            if (this.enemyShootInterval) {
                clearInterval(this.enemyShootInterval)
            }
            this.enemyShootInterval = setInterval(() => {
                this.enemyShoot()
            }, 2500)
        },
        
        enemyShoot() {
            if (!this.isPlaying || this.enemies.length === 0 || this.gameOver) return
            
            // Random enemy shoots
            const randomEnemy = this.enemies[Math.floor(Math.random() * this.enemies.length)]
            this.enemyBullets.push({
                x: randomEnemy.x + randomEnemy.width / 2 - 2.5,
                y: randomEnemy.y + randomEnemy.height,
                width: 5,
                height: 10
            })
        },
        
        increaseDifficulty() {
            this.difficulty++
            
            // Increase enemy speed (max 2.5x original speed)
            this.enemySpeed = Math.min(this.baseEnemySpeed * 2.5, this.baseEnemySpeed + (this.difficulty - 1) * 0.3)
            
            // Decrease spawn rate (faster spawning, min 400ms)
            this.spawnRate = Math.max(400, 1500 - (this.difficulty - 1) * 150)
            
            // Restart spawning with new rate
            this.startEnemySpawning()
        },
        
        movePlayer(e) {
            if (!this.isPlaying) return
            const rect = e.currentTarget.getBoundingClientRect()
            this.playerX = Math.max(0, Math.min(e.clientX - rect.left - this.playerWidth / 2, this.gameWidth - this.playerWidth))
        },
        
        shoot() {
            if (!this.isPlaying) return
            this.bullets.push({
                x: this.playerX + this.playerWidth / 2 - 2.5,
                y: this.gameHeight - 60,
                width: 5,
                height: 15
            })
        },
        
        spawnEnemy() {
            if (!this.isPlaying) return
            const enemyWidth = 30
            
            // Spawn multiple enemies at higher difficulties
            const enemiesToSpawn = Math.min(3, Math.floor(this.difficulty / 3) + 1)
            
            for (let i = 0; i < enemiesToSpawn; i++) {
                this.enemies.push({
                    x: Math.random() * (this.gameWidth - enemyWidth),
                    y: 0 - (i * 50), // Stagger vertical spawn
                    width: enemyWidth,
                    height: 30,
                    health: 1
                })
            }
        },
        
        updateGame() {
            if (this.gameOver) return
            
            // Update player bullets
            this.bullets = this.bullets.filter(bullet => {
                bullet.y -= this.bulletSpeed
                return bullet.y > -bullet.height
            })
            
            // Update enemy bullets
            this.enemyBullets = this.enemyBullets.filter(bullet => {
                bullet.y += this.enemyBulletSpeed
                return bullet.y < this.gameHeight
            })
            
            // Update enemies
            this.enemies = this.enemies.filter(enemy => {
                enemy.y += this.enemySpeed
                // Check if enemy reached player (game over)
                if (enemy.y + enemy.height >= this.gameHeight - this.playerHeight) {
                    this.endGame()
                    return false
                }
                return enemy.y < this.gameHeight
            })
            
            // Check collisions
            this.checkCollisions()
        },
        
        checkCollisions() {
            // Check player bullets hitting enemies
            this.bullets.forEach((bullet, bulletIndex) => {
                this.enemies.forEach((enemy, enemyIndex) => {
                    if (
                        bullet.x < enemy.x + enemy.width &&
                        bullet.x + bullet.width > enemy.x &&
                        bullet.y < enemy.y + enemy.height &&
                        bullet.y + bullet.height > enemy.y
                    ) {
                        // Hit!
                        this.bullets.splice(bulletIndex, 1)
                        this.enemies.splice(enemyIndex, 1)
                        this.$emit('addCoins', 10)
                        // this.$emit('coins-updated', this.myBalance)
                    }
                })
            })
            
            // Check enemy bullets hitting player
            const playerY = this.gameHeight - this.playerHeight
            this.enemyBullets.forEach((bullet) => {
                if (
                    bullet.x < this.playerX + this.playerWidth &&
                    bullet.x + bullet.width > this.playerX &&
                    bullet.y < playerY + this.playerHeight &&
                    bullet.y + bullet.height > playerY
                ) {
                    this.endGame()
                }
            })
        },
        
        endGame() {
            this.gameOver = true
            this.isPlaying = false
            clearInterval(this.gameLoop)
            clearInterval(this.enemySpawnInterval)
            clearInterval(this.enemyShootInterval)
            clearInterval(this.difficultyInterval)
        }
    },
    
    mounted() {
        // Listen for click to shoot
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.isPlaying) {
                e.preventDefault()
                this.shoot()
            }
        })
    },
    
    beforeUnmount() {
        this.stopGame()
    }
}
</script>

<template>
    <div class="game-wrapper d-flex flex-column align-items-center gap-3 p-4 rounded-3 border border-2">
        <div class="game-header d-flex justify-content-between align-items-center w-100 gap-3" style="max-width: 400px;">
            <div class="balance fs-4 fw-bold">💰 Coins: {{ myBalance }}</div>
            <div v-if="isPlaying" class="difficulty fs-5 fw-bold text-light-purple pulse-glow">⚡ Level: {{ difficulty }}</div>
            <button v-if="!isPlaying" @click="startGame" class="btn btn-success fw-bold">Start Game</button>
            <button v-else @click="stopGame" class="btn btn-danger fw-bold">Stop Game</button>
        </div>
        
        <div 
            class="game-container position-relative rounded-3 border border-3"
            :style="{ width: gameWidth + 'px', height: gameHeight + 'px' }"
            @mousemove="movePlayer"
            @click="shoot"
        >
            <!-- Player -->
            <div 
                class="player position-absolute d-flex align-items-center justify-content-center fs-1" 
                :style="{ 
                    left: playerX + 'px', 
                    bottom: '20px',
                    width: playerWidth + 'px',
                    height: playerHeight + 'px'
                }"
            >
                🚀
            </div>
            
            <!-- Bullets -->
            <div 
                v-for="(bullet, index) in bullets" 
                :key="'bullet-' + index"
                class="bullet position-absolute rounded-2"
                :style="{ 
                    left: bullet.x + 'px', 
                    top: bullet.y + 'px',
                    width: bullet.width + 'px',
                    height: bullet.height + 'px'
                }"
            ></div>
            
            <!-- Enemies -->
            <div 
                v-for="(enemy, index) in enemies" 
                :key="'enemy-' + index"
                class="enemy position-absolute d-flex align-items-center justify-content-center enemy-float"
                :style="{ 
                    left: enemy.x + 'px', 
                    top: enemy.y + 'px',
                    width: enemy.width + 'px',
                    height: enemy.height + 'px',
                    fontSize: '1.5rem'
                }"
            >
                👾
            </div>
            
            <!-- Enemy Bullets -->
            <div 
                v-for="(bullet, index) in enemyBullets" 
                :key="'enemy-bullet-' + index"
                class="enemy-bullet position-absolute rounded-2"
                :style="{ 
                    left: bullet.x + 'px', 
                    top: bullet.y + 'px',
                    width: bullet.width + 'px',
                    height: bullet.height + 'px'
                }"
            ></div>
            
            <!-- Game Over Message -->
            <div v-if="gameOver" class="game-over position-absolute top-50 start-50 translate-middle text-center text-white rounded-3 border border-3 p-4 pulse-red" style="z-index: 10;">
                <h2 class="mb-3 fs-1">💀 GAME OVER 💀</h2>
                <p class="text-light-purple fs-5 mb-4">Final Score: {{ myBalance }} coins</p>
                <button @click="startGame" class="btn btn-primary fw-bold">Try Again</button>
            </div>
            
            <!-- Instructions -->
            <div v-if="!isPlaying" class="instructions position-absolute top-50 start-50 translate-middle text-center text-white rounded-3 border border-2 p-4">
                <p class="text-light-purple mb-2">Click to shoot!</p>
                <p class="text-light-purple mb-2">Press SPACE or click to fire</p>
                <p class="text-light-purple mb-0">Move mouse to control</p>
            </div>
        </div>
    </div>
</template>
<style scoped>
.game-wrapper {
    background: var(--theme-dark-card-bg);
    border-color: var(--theme-purple) !important;
}

.balance {
    color: var(--theme-gold);
}

.difficulty {
    animation: pulse-glow 2s ease-in-out infinite;
}

.pulse-glow {
    animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
    0%, 100% { text-shadow: 0 0 5px var(--theme-purple); }
    50% { text-shadow: 0 0 15px var(--theme-purple), 0 0 25px var(--theme-purple-light); }
}

.game-container {
    background: var(--gradient-game-bg);
    border-color: var(--theme-purple) !important;
    cursor: crosshair;
    overflow: hidden;
}

.player {
    transition: left 0.05s linear;
}

.bullet {
    background: var(--gradient-bullet);
    box-shadow: 0 0 10px var(--theme-yellow-rgba-80);
}

.enemy-bullet {
    background: var(--gradient-enemy-bullet);
    box-shadow: 0 0 10px var(--theme-red-rgba-80);
}

.game-over {
    background: var(--theme-dark-overlay);
    border-color: var(--theme-red) !important;
}

.game-over h2 {
    color: var(--theme-red);
    text-shadow: 0 0 10px var(--theme-red-rgba-80);
}

.pulse-red {
    animation: pulse-red 2s ease-in-out infinite;
}

@keyframes pulse-red {
    0%, 100% { 
        box-shadow: 0 0 20px var(--theme-red-rgba-50);
        border-color: var(--theme-red) !important;
    }
    50% { 
        box-shadow: 0 0 40px var(--theme-red-rgba-80);
        border-color: var(--theme-red) !important;
    }
}

.enemy-float {
    animation: enemyFloat 1s ease-in-out infinite;
}

@keyframes enemyFloat {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(5px); }
}

.instructions {
    background: var(--theme-dark-card-bg);
    border-color: var(--theme-purple-light) !important;
}

.btn-success {
    background: var(--gradient-success);
}

.btn-danger {
    background: var(--gradient-danger);
}

.btn:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 15px var(--theme-purple-rgba-50);
}
</style>
