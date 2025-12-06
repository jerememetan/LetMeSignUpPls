<script>
export default {
    emits: ['coins-updated'],
    data() {
        return {
            myBalance: 0,
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
            }, 2000)
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
                        this.myBalance += 10
                        this.$emit('coins-updated', this.myBalance)
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
    <div class="game-wrapper">
        <div class="game-header">
            <div class="balance">💰 Coins: {{ myBalance }}</div>
            <div v-if="isPlaying" class="difficulty">⚡ Level: {{ difficulty }}</div>
            <button v-if="!isPlaying" @click="startGame" class="btn btn-success">Start Game</button>
            <button v-else @click="stopGame" class="btn btn-danger">Stop Game</button>
        </div>
        
        <div 
            class="game-container" 
            :style="{ width: gameWidth + 'px', height: gameHeight + 'px' }"
            @mousemove="movePlayer"
            @click="shoot"
        >
            <!-- Player -->
            <div 
                class="player" 
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
                class="bullet"
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
                class="enemy"
                :style="{ 
                    left: enemy.x + 'px', 
                    top: enemy.y + 'px',
                    width: enemy.width + 'px',
                    height: enemy.height + 'px'
                }"
            >
                👾
            </div>
            
            <!-- Enemy Bullets -->
            <div 
                v-for="(bullet, index) in enemyBullets" 
                :key="'enemy-bullet-' + index"
                class="enemy-bullet"
                :style="{ 
                    left: bullet.x + 'px', 
                    top: bullet.y + 'px',
                    width: bullet.width + 'px',
                    height: bullet.height + 'px'
                }"
            ></div>
            
            <!-- Game Over Message -->
            <div v-if="gameOver" class="game-over">
                <h2>💀 GAME OVER 💀</h2>
                <p>Final Score: {{ myBalance }} coins</p>
                <button @click="startGame" class="btn btn-primary">Try Again</button>
            </div>
            
            <!-- Instructions -->
            <div v-if="!isPlaying" class="instructions">
                <p>Click to shoot!</p>
                <p>Press SPACE or click to fire</p>
                <p>Move mouse to control</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.game-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    padding: 20px;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 15px;
    border: 2px solid var(--theme-purple);
}

.game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 400px;
    gap: 20px;
}

.balance {
    font-size: 1.5rem;
    font-weight: bold;
    color: gold;
}

.difficulty {
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--theme-purple-light);
    animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
    0%, 100% { text-shadow: 0 0 5px var(--theme-purple); }
    50% { text-shadow: 0 0 15px var(--theme-purple), 0 0 25px var(--theme-purple-light); }
}

.game-container {
    position: relative;
    background: linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 100%);
    border: 3px solid var(--theme-purple);
    border-radius: 10px;
    cursor: crosshair;
    overflow: hidden;
}

.player {
    position: absolute;
    font-size: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: left 0.05s linear;
}

.bullet {
    position: absolute;
    background: linear-gradient(180deg, #ffff00, #ff6600);
    border-radius: 3px;
    box-shadow: 0 0 10px rgba(255, 255, 0, 0.8);
}

.enemy-bullet {
    position: absolute;
    background: linear-gradient(180deg, #ff0000, #8B0000);
    border-radius: 3px;
    box-shadow: 0 0 10px rgba(255, 0, 0, 0.8);
}

.game-over {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: white;
    background: rgba(0, 0, 0, 0.9);
    padding: 30px 40px;
    border-radius: 15px;
    border: 3px solid #ff0000;
    z-index: 10;
    animation: pulse-red 2s ease-in-out infinite;
}

.game-over h2 {
    margin: 0 0 15px 0;
    color: #ff0000;
    font-size: 2rem;
    text-shadow: 0 0 10px rgba(255, 0, 0, 0.8);
}

.game-over p {
    margin: 10px 0 20px 0;
    color: var(--theme-purple-light);
    font-size: 1.2rem;
}

@keyframes pulse-red {
    0%, 100% { 
        box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
        border-color: #ff0000;
    }
    50% { 
        box-shadow: 0 0 40px rgba(255, 0, 0, 0.8);
        border-color: #ff4444;
    }
}

.enemy {
    position: absolute;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: enemyFloat 1s ease-in-out infinite;
}

@keyframes enemyFloat {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(5px); }
}

.instructions {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: white;
    background: rgba(0, 0, 0, 0.7);
    padding: 20px;
    border-radius: 10px;
    border: 2px solid var(--theme-purple-light);
}

.instructions p {
    margin: 5px 0;
    color: var(--theme-purple-light);
}

.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-success {
    background: linear-gradient(90deg, #28a745, #20c997);
    color: white;
}

.btn-danger {
    background: linear-gradient(90deg, #dc3545, #c82333);
    color: white;
}

.btn:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(138, 43, 226, 0.5);
}
</style>