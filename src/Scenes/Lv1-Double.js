class Lv1Double extends Phaser.Scene {
    constructor() {
        super("Lv1Scene");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 500;
        this.DRAG = 700;    // DRAG < ACCELERATION = icy slide
        // this.physics.world.gravity.y = 1000;
        this.physics.world.gravity.y = 2000;
        this.JUMP_VELOCITY = -800;
        // this.JUMP_VELOCITY = -1000;
        this.isColor = true;
    }

    create() {
        // Create a new tilemap game object which uses 16x16 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        this.monoMap = this.add.tilemap("platform-lv-1-mono", 16, 16, 60, 20);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.monoTileset = this.monoMap.addTilesetImage("1-bit", "tilemap_tiles_mono");

        // Create a layer
        this.monoGroundLayer = this.monoMap.createLayer("MonoGround", this.monoTileset, 0, 0);
        this.monoGroundLayer.setScale(2.8);
        this.monoDecorLayer = this.monoMap.createLayer("MonoDecor", this.monoTileset, 0, 0);
        this.monoDecorLayer.setScale(2.8);

        // Make it collidable
        this.monoGroundLayer.setCollisionByProperty({
            collides: true
        });

        // Set collisions for platforms you can pass through underneath
        this.monoGroundLayer.forEachTile((tile) => {
            if (tile.properties.underCollides) {
              tile.setCollision(false, false, true, false);
            }
        })
  

        // COLOR VER
        this.colorMap = this.add.tilemap("platform-lv-1-color", 18, 18, 60, 20);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.colorTileset = this.colorMap.addTilesetImage("color-set", "tilemap_tiles_color");

        // Create a layer
        this.colorGroundLayer = this.colorMap.createLayer("ColorGround", this.colorTileset, 0, 0);
        this.colorGroundLayer.setScale(2.5);
        this.colorDecorLayer = this.colorMap.createLayer("ColorDecor", this.colorTileset, 0, 0);
        this.colorDecorLayer.setScale(2.5);

        // Make it collidable
        this.colorGroundLayer.setCollisionByProperty({
            collides: true
        });

        
        // set up player avatar
        my.sprite.player = this.physics.add.sprite(playerX, playerY, "platformer_characters", "tile_0000.png").setScale(SCALE)
        my.sprite.player.body.setVelocityX(playerVeloX);
        my.sprite.player.body.setVelocityY(playerVeloY);
        my.sprite.player.setCollideWorldBounds(true);

        // Enable collision handling
        this.monoCollider = this.physics.add.collider(my.sprite.player, this.monoGroundLayer);
        
        this.colorCollider = this.physics.add.collider(my.sprite.player, this.colorGroundLayer);
        this.physics.world.setBounds(0, 0, 900*3, 320*2.81);

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);



        // Set up camera
        // this.cameras.main.setBounds(0, 0, this.groundLayer.widthInPixels/2, this.groundLayer.heightInPixels);
        this.cameras.main.setBounds(0, 0, 900*3, 320*2.81);
        // this.cameras.main.setBounds(0, 0, 900, 900);
        this.cameras.main.setZoom(1.5);
        // this.cameras.main.setScroll();
        // this.cameras.main.centerOn(my.sprite.player.x, my.sprite.player.y);
        // setLerp

        // mono initially off
        this.monoCollider.active = false;
        this.monoGroundLayer.setAlpha(0);
        this.monoDecorLayer.setAlpha(0);

        
        // Scene Switch (assigned to Space key)
        this.input.keyboard.on('keydown-SPACE', () => {
            if(this.isColor){
                console.log("Switch to mono");
                this.isColor = false;
                this.colorCollider.active = false;
                this.colorGroundLayer.setAlpha(0);
                this.colorDecorLayer.setAlpha(0);

                this.monoCollider.active = true;
                this.monoGroundLayer.setAlpha(1);
                this.monoDecorLayer.setAlpha(1);

            } else {
                console.log("Switch to color");
                this.isColor = true;
                this.colorCollider.active = true;
                this.colorGroundLayer.setAlpha(1);
                this.colorDecorLayer.setAlpha(1);

                this.monoCollider.active = false;
                this.monoGroundLayer.setAlpha(0);
                this.monoDecorLayer.setAlpha(0);


            }
        }, this);

        // Scene Switch Testing (assigned to V key)
        this.input.keyboard.on('keydown-V', () => {
            console.log("Switch to double");
            this.scene.start("colorLv1Scene");
        }, this);

    }

    update() {
        playerX = my.sprite.player.x;
        playerY = my.sprite.player.y;
        playerVeloX = my.sprite.player.body.velocity.x;
        playerVeloY = my.sprite.player.body.velocity.y;
        // console.log("Acceleration: "+my.sprite.player.body.accelerationX);
        this.cameras.main.centerOn(my.sprite.player.x, my.sprite.player.y);
        if(cursors.left.isDown) {
            // TODO: have the player accelerate to the left
            // if (my.sprite.player.body.accelerationX > 0){
            //     my.sprite.player.body.setAccelerationX(0);
            // }
            // my.sprite.player.body.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.body.setVelocityX(-this.ACCELERATION);
            
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);

        } else if(cursors.right.isDown) {
            // TODO: have the player accelerate to the right
            // if acceleration is - then set to 0
            // if (my.sprite.player.body.accelerationX < 0){
            //     my.sprite.player.body.setAccelerationX(0);
            // }
            my.sprite.player.body.setVelocityX(this.ACCELERATION);

            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);

        } else {
            // TODO: set acceleration to 0 and have DRAG take over
            my.sprite.player.body.setAccelerationX(0);
            // my.sprite.player.body.setDragX(this.DRAG);
            my.sprite.player.body.setDragX(5000);

            my.sprite.player.anims.play('idle');
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }
        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            // TODO: set a Y velocity to have the player "jump" upwards (negative Y direction)
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);

        }
    }
}