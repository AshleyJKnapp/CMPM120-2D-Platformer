class Lv1Double extends Phaser.Scene {
    constructor() {
        super("Lv1Scene");
    }

    init() {
        // variables and settings
        gemPts = 0;
        this.ACCELERATION = 500;
        this.DRAG = 700;    // DRAG < ACCELERATION = icy slide
        // this.physics.world.gravity.y = 1000;
        this.physics.world.gravity.y = 2000;
        this.JUMP_VELOCITY = -800;
        // this.JUMP_VELOCITY = -1000;
        this.isColor = true;
    }

    create() {
        // ------= MONO =------
        // Create a new tilemap game object which uses 16x16 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        this.monoMap = this.add.tilemap("platform-lv-1-mono", 16, 16, 60, 20);

        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.monoTileset = this.monoMap.addTilesetImage("1-bit", "tilemap_tiles_mono");
        this.inputTileset = this.monoMap.addTilesetImage("input-set", "tilemap_tiles_input");

        // Create layers
        this.monoGroundLayer = this.monoMap.createLayer("MonoGround", this.monoTileset, 0, 0);
        this.monoGroundLayer.setScale(2.81);
        this.monoDecorLayer = this.monoMap.createLayer("MonoDecor", this.monoTileset, 0, 0);
        this.monoDecorLayer.setScale(2.81);
        // Keep this active always since its the same on both mono and color
        this.inputLayer = this.monoMap.createLayer("Input", this.inputTileset, 0, 0);
        this.inputLayer.setScale(2.81);

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
  

        // ------= COLOR =------
        this.colorMap = this.add.tilemap("platform-lv-1-color", 18, 18, 60, 20);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.colorTileset = this.colorMap.addTilesetImage("color-set", "tilemap_tiles_color");

        // Create layers
        this.colorGroundLayer = this.colorMap.createLayer("ColorGround", this.colorTileset, 0, 0);
        this.colorGroundLayer.setScale(2.5);
        this.colorDecorLayer = this.colorMap.createLayer("ColorDecor", this.colorTileset, 0, 0);
        this.colorDecorLayer.setScale(2.5);

        // Make it collidable
        this.colorGroundLayer.setCollisionByProperty({
            collides: true
        });

        // -- Gems --
        my.sprite.colorGems = this.colorMap.createFromObjects("ColorGem", {
            name: "Gem",
            key: "colorGemImg",
            id: 67
        });
        my.sprite.colorGems.forEach(gem => {
            gem.x *= 2.5;
            gem.y *= 2.5;
            gem.setScale(2.5);
        });
        // Do Monogems relying off of colorgems so they use the same exact placement
        my.sprite.monoGems = this.colorMap.createFromObjects("ColorGem", {
            name: "Gem",
            key: "monoGemImg",
            id: 67
        });
        my.sprite.monoGems.forEach(gem => {
            gem.x *= 2.5;
            gem.y *= 2.5;
            gem.setScale(2.5);
            gem.visible = false;
        });
        
        // Enable collision of gems
        //color
        this.physics.world.enable(my.sprite.colorGems, Phaser.Physics.Arcade.STATIC_BODY);
        this.colorGemGroup = this.add.group(my.sprite.colorGems);
        //mono
        this.physics.world.enable(my.sprite.monoGems, Phaser.Physics.Arcade.STATIC_BODY);
        this.monoGemGroup = this.add.group(my.sprite.monoGems);

        // End Goal Collision
        my.sprite.endFlag = this.monoMap.createFromObjects("EndGoal", {
            name: "End"
        });
        my.sprite.endFlag.forEach(gem => {
            gem.x *= 2.81;
            gem.y *= 2.81;
            gem.setScale(1);
            gem.visible = false;
        });
        this.physics.world.enable(my.sprite.endFlag, Phaser.Physics.Arcade.STATIC_BODY);
        this.endFlagGroup = this.add.group(my.sprite.endFlag);

        // ------= Player Avatar =------
        my.sprite.player = this.physics.add.sprite(game.config.width/4, 700, "platformer_characters", "tile_0000.png").setScale(SCALE)
        my.sprite.player.setCollideWorldBounds(true);

        // Enable collision handling
        this.monoCollider = this.physics.add.collider(my.sprite.player, this.monoGroundLayer);
        this.colorCollider = this.physics.add.collider(my.sprite.player, this.colorGroundLayer);
        this.physics.world.setBounds(0, 0, 900*3, 320*2.81);
        // Color Gem collision
        this.physics.add.overlap(my.sprite.player, this.colorGemGroup, (obj1, obj2) => {
            obj2.destroy(); // remove coin on overlap
            gemPts++;
        });
        // Mono Gem collision
        this.physics.add.overlap(my.sprite.player, this.monoGemGroup, (obj1, obj2) => {
            obj2.destroy(); // remove coin on overlap
        });
        // only one set of gems adds to score because both are always active
        // End Goal
        this.physics.add.overlap(my.sprite.player, this.endFlagGroup, (obj1, obj2) => {
            // console.log("end game");
            this.scene.start("endScene");
        });


        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        // --------== GUI Text ==---------
        this.scoreTxt = this.add.text(90, 10, "0/4", {
            fontFamily: "'Freeman'",
            fontSize: 75,
            align: "right",
            stroke: '#444444',
            strokeThickness: 8
            // fixedWidth: 400,
            // fixedHeight: 50
        });
        this.colorGemTxt = this.add.sprite(50, 55, "colorGemImg");
        this.colorGemTxt.scale = 4;
        this.monoGemTxt = this.add.sprite(50, 55, "monoGemImg");
        this.monoGemTxt.scale = 4;
        this.monoGemTxt.visible = false;


        // Set up camera
        this.cameras.main.setBounds(0, 0, 900*3, 320*2.81);
        this.cameras.main.setZoom(1.5);
        let uiElems = [this.colorGemTxt, this.monoGemTxt, this.scoreTxt];
        this.cameras.main.ignore(uiElems)
        // Set up UI camera
        this.cameras.ui = this.cameras.add(0, 0, 900*3, 320*2.81);
        // let gameElems = [my.sprite.player, this.monoGroundLayer, this.monoDecorLayer, this.monoGemGroup, this.colorGroundLayer, this.colorDecorLayer, this.colorGemGroup, this.inputLayer];
        let gameElems = [my.sprite.player, this.monoGroundLayer, this.monoDecorLayer, this.monoGemGroup, this.colorGroundLayer, this.colorDecorLayer, this.colorGemGroup, this.inputLayer, this.physics.world.debugGraphic]; // Debug version
        this.cameras.ui.ignore(gameElems);

        
        
        // Set Mono to be initially off
        this.monoCollider.active = false;
        this.monoGroundLayer.setAlpha(0);
        this.monoDecorLayer.setAlpha(0);
        this.cameras.main.setBackgroundColor(0x6dcbe8);

        // Scene Switch (assigned to Space key)
        this.input.keyboard.on('keydown-SPACE', () => {
            if(this.isColor){
                // console.log("Switch to mono");
                this.cameras.main.setBackgroundColor(0x080f1c);
                this.isColor = false;
                this.colorCollider.active = false;
                this.colorGroundLayer.setAlpha(0);
                this.colorDecorLayer.setAlpha(0);
                this.colorGemTxt.visible = false;

                this.monoCollider.active = true;
                this.monoGroundLayer.setAlpha(1);
                this.monoDecorLayer.setAlpha(1);
                this.monoGemTxt.visible = true;

                my.sprite.colorGems.forEach(gem => {
                    gem.visible = false;
                });
                my.sprite.monoGems.forEach(gem => {
                    gem.visible = true;
                });

            } else {
                // console.log("Switch to color");
                this.cameras.main.setBackgroundColor(0x6dcbe8);
                this.isColor = true;
                this.colorCollider.active = true;
                this.colorGroundLayer.setAlpha(1);
                this.colorDecorLayer.setAlpha(1);
                this.colorGemTxt.visible = true;

                this.monoCollider.active = false;
                this.monoGroundLayer.setAlpha(0);
                this.monoDecorLayer.setAlpha(0);
                this.monoGemTxt.visible = false;

                my.sprite.colorGems.forEach(gem => {
                    gem.visible = true;
                });
                my.sprite.monoGems.forEach(gem => {
                    gem.visible = false;
                });

            }
        }, this);        

    }

    update() {
        this.scoreTxt.setText(gemPts+"/4");
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