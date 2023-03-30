addEventListener('load',function(){
    const canvas = document.getElementById('canvas1')
    const ctx = canvas.getContext('2d')
    canvas.width = 1280
    canvas.height = 720

    class Player{
        constructor(game){
            this.game = game
            this.collisionX = this.game.width *0.5
            this.collisionY = this.game.height *0.5
            this.collisionRadius = 30
            this.speedX = 0
            this.speedY = 0
            this.dx = 0
            this.dy = 0
            this.speedModifier = 4

            this.spriteWidth = 256
            this.spriteHeight = 256
            this.width = this.spriteWidth
            this.height = this.spriteHeight
            this.spriteX
            this.spriteY
            this.frameX = 0
            this.frameY = 0
            this.image = document.getElementById('bull')

        }
        draw(ctx){
            ctx.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight,
                this.spriteWidth, this.spriteHeight, this.spriteX, 
                this.spriteY, this.width, this.height)
            if(this.game.debug){
                ctx.beginPath()
                ctx.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, 2 * Math.PI)
                ctx.fill()
            }
        }
        update(){
            const angle = Math.atan2(this.game.mouse.y - this.collisionY, this.game.mouse.x - this.collisionX)
            
            if(angle < -2.74 || angle>2.74)this.frameY = 6
            else if(angle < -1.96 )this.frameY = 7
            else if(angle < -1.17 )this.frameY = 0
            else if(angle < -0.39 )this.frameY = 1
            else if(angle < 0.39 )this.frameY = 2
            else if(angle < 1.17 )this.frameY = 3
            else if(angle < 1.96 )this.frameY = 4
            else if(angle < 2.74 )this.frameY = 5



            this.dx = this.game.mouse.x - this.collisionX
            this.dy = this.game.mouse.y - this.collisionY
            const distance = Math.hypot(this.dx, this.dy)
            if(distance > this.speedModifier){
                this.speedX = this.dx/distance || 0
                this.speedY = this.dy/distance || 0  
            }else{
                this.speedX = 0
                this.speedY = 0
            }
            this.collisionX += this.speedX * this.speedModifier
            this.collisionY += this.speedY * this.speedModifier
            this.spriteX = this.collisionX - this.width * 0.5
            this.spriteY = this.collisionY - this.height * 0.5 - 100

            if(this.collisionX < this.collisionRadius) this.collisionX = this.collisionRadius
            else if(this.collisionX > this.game.width - this.collisionRadius) this.collisionX = this.game.width - this.collisionRadius
            if(this.collisionY < this.game.topMargin + this.collisionRadius) this.collisionY = this.game.topMargin + this.collisionRadius
            else if(this.collisionY > this.game.height - this.collisionRadius) this.collisionY = this.game.height - this.collisionRadius

            this.game.obstacles.forEach(obstacle => {
                let [collision,distance, sumOfRadii,dx, dy] = this.game.checkCollision(this, obstacle)
                if(collision){
                    const unitX = dx/distance
                    const unitY = dy/distance
                    this.collisionX = obstacle.collisionX + (sumOfRadii+1) * unitX
                    this.collisionY = obstacle.collisionY + (sumOfRadii+1) * unitY
                }
            })
        }
    }

    class Obstacle{
        constructor(game){
            this .game = game
            this.collisionX = Math. random() * this.game.width
            this.collisionY = Math. random() * this.game.height
            this.collisionRadius = 50
            
            this.image = document.getElementById('obstacles')
            this.spriteWidth = 250
            this.spriteHeight = 250
            this.width = this.spriteWidth
            this.height = this.spriteHeight
            this.spriteX = this.collisionX - this.width * 0.5
            this.spriteY = this.collisionY - this.height * 0.5 - 70

            this.frameX = Math.floor(Math.random() * 4)
            this.frameY = Math.floor(Math.random() * 3)
        }
        draw(context){
            context.drawImage(this.image,this.frameX * this.spriteWidth,this.frameY * this.spriteHeight,this.spriteWidth,this.spriteHeight,this.spriteX,
                this.spriteY, this.width, this.height)
            if(this.game.debug){
                context.beginPath()
                context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2)
                context. save()
                context.globalAlpha = 0.5
                context. fill()
                context. restore()
                context. stroke()
            }
        }
        update(){}
    }

    class Egg{
        constructor(game){
            this.game = game
            this.collisionRadius = 40
            this.margin = this.collisionRadius*2
            this.collisionX = this.margin + (Math. random() * (this.game.width - this.margin * 2))
            this.collisionY = this.game.topMargin + (Math. random() * (this.game.height - this.game.topMargin - this.margin))
            this.image = document.getElementById('egg')
            this.spriteWidth = 110
            this.spriteHeight = 130
            this.width = this.spriteWidth
            this.height = this.spriteHeight
            this.spriteX
            this.spriteY
        }
        draw(context){
            context.drawImage(this.image, this.spriteX, this.spriteY, this.width, this.height)
            if(this.game.debug){
                context.beginPath()
                context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2)
                context. save()
                context.globalAlpha = 0.5
                context. fill()
                context. restore()
                context. stroke()
            }
        }
        update(){
            this.spriteX = this.collisionX - this.width * 0.5
            this.spriteY = this.collisionY - this.height * 0.5 - 30
            let collisionObjects = [this.game.player, ...this.game.obstacles,...this.game.enemies]
            collisionObjects.forEach(object => {
                let [collision,distance, sumOfRadii,dx, dy] = this.game.checkCollision(this, object)
                if(collision){
                    const unitX = dx/distance
                    const unitY = dy/distance
                    this.collisionX = object.collisionX + (sumOfRadii+1) * unitX
                    this.collisionY = object.collisionY + (sumOfRadii+1) * unitY
                }
            })
        }
    }

    class Enemy{
        constructor(game){
            this.game = game
            this.collisionX = this.game.width
            this.collisionY = this.game.topMargin + (Math. random() * (this.game.height - this.game.topMargin))
            this.collisionRadius = 30
            this.speedX = Math. random() * 3 + 0.5
            this.image = document.getElementById('toad')
            this.spriteWidth = 140
            this.spriteHeight = 256
            this.width = this.spriteWidth
            this.height = this.spriteHeight
            this.spriteX 
            this.spriteY
            this.frameX = 0
            this.frameY = 0
            // this.frameX = Math.floor(Math.random() * 4)
            // this.frameY = Math.floor(Math.random() * 3)
        }
        draw(context){
            context.drawImage(this.image,this.frameX * this.spriteWidth,this.frameY * this.spriteHeight,this.spriteWidth,this.spriteHeight,this.spriteX,
                this.spriteY, this.width, this.height)
            if(this.game.debug){
                context.beginPath()
                context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2)
                context. save()
                context.globalAlpha = 0.5
                context. fill()
                context. restore()
                context. stroke()
            }
        }
        update(){
            // let dx = this.game.player.collisionX - this.collisionX
            // let dy = this.game.player.collisionY - this.collisionY
            // let distance = Math.sqrt(dx*dx + dy*dy)
            // let unitX = dx/distance
            // let unitY = dy/distance
            // this.collisionY += unitY * this.speedModifier
            this.spriteX = this.collisionX - this.width * 0.5
            this.spriteY = this.collisionY - this.height + 40
            this.collisionX -= this.speedX
            if(this.spriteX + this.width < 0){
                this.collisionX = this.game.width + Math.random()* this.game.width * 0.5
                this.collisionY = this.game.topMargin + (Math. random() * (this.game.height - this.game.topMargin))

            }
            let collisionObjects = [this.game.player, ...this.game.obstacles]
            collisionObjects.forEach(object => {
                let [collision,distance, sumOfRadii,dx, dy] = this.game.checkCollision(this, object)
                if(collision){
                    const unitX = dx/distance
                    const unitY = dy/distance
                    this.collisionX = object.collisionX + (sumOfRadii+1) * unitX
                    this.collisionY = object.collisionY + (sumOfRadii+1) * unitY
                }
            })
        }
    }

    class Game{
        constructor(canvas){
            this.canvas = canvas
            this.topMargin = 260
            this.width = this.canvas.width
            this.height = this.canvas.height
            this.player = new Player(this)
            this.fps = 70
            this.timer = 0
            this.interval = 1000/this.fps
            this.eggTimer = 0
            this.eggInterval = 500
            this.numeberOfObstacles = 6
            this.obstacles = []
            this.maxEgg = 10
            this.eggs = []
            this.enemies = []
            this.gameObjects = []
            this.mouse = {
                x: this.width*0.5,
                y: this.height*0.5,
                pressed : false
            }
            this.debug = true

            canvas.addEventListener('mousedown',(e) => {
                this.mouse.x = e.offsetX
                this.mouse.y = e.offsetY
                this.mouse.pressed = true
            })
            canvas.addEventListener('mouseup',(e) => {
                this.mouse.x = e.offsetX
                this.mouse.y = e.offsetY
                this.mouse.pressed = false
            })
            
            canvas.addEventListener('mousemove',(e) => {
                if(this.mouse.pressed){
                    this.mouse.x = e.offsetX
                    this.mouse.y = e.offsetY
                }
            })
            window.addEventListener('keydown', e => {
                if(e.key == 'd') this.debug = !this.debug
            })
        }
        render(context, deltaTime){
            if(this.timer > this.interval){
                context.clearRect(0,0, canvas.width, canvas.height)
                this.gameObjects = [this.player, ...this.obstacles, ...this.eggs, ...this.enemies]
                this.gameObjects.sort((a,b) => a.collisionY - b.collisionY)
                this.gameObjects.forEach(object => {
                    object.draw(context)
                    object.update()
                })
                this.timer = 0

            }
            this.timer += deltaTime

            if(this.eggTimer > this.eggInterval && this.eggs.length < this.maxEgg){
                this.addEgg()
                this.eggTimer = 0
            }else {
                this.eggTimer += deltaTime
            }
            
        }
        checkCollision(a,b){
            const dx = a.collisionX - b.collisionX
            const dy = a.collisionY - b.collisionY
            const distance = Math.hypot(dx, dy)
            const sumOfRadii = a.collisionRadius + b.collisionRadius
            return[(distance < sumOfRadii),distance, sumOfRadii,dx, dy]
        }

        addEgg(){
            this.eggs.push(new Egg(this))
        }
        addEnemy(){
            this.enemies.push(new Enemy(this))
        }

        init(){
            for(let i = 0; i < 3; i++){
                this.addEnemy()
                console.log(this.enemies)
            }
            let attemts = 0
            while (this.obstacles.length < this.numeberOfObstacles && attemts < 500){
                let testObstacle = new Obstacle(this)
                let overlap = false
                this.obstacles.forEach(obstacle => {
                    const dx = testObstacle.collisionX - obstacle.collisionX
                    const dy = testObstacle.collisionY - obstacle.collisionY
                    const distance = Math.hypot(dx, dy)
                    const distanceBuffer = 100
                    const sumOfRadii = testObstacle.collisionRadius + obstacle.collisionRadius + distanceBuffer
                
                    if(distance < sumOfRadii){
                        overlap = true
                    }
                })
                const margin = testObstacle.collisionRadius * 2
                if(!overlap && testObstacle.spriteX > 0 && testObstacle.spriteX < this.width-testObstacle.width && 
                    testObstacle.collisionY > this.topMargin + margin && testObstacle.collisionY < this.height - margin){
                    this.obstacles.push(testObstacle)
                } 
                attemts++

            }
        }
    }

    const game = new Game(canvas)
    game.init()
    console.log(game)

    let lastTime = 0
    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        game.render(ctx,deltaTime)
        requestAnimationFrame(animate)
    }
    animate(0)
})