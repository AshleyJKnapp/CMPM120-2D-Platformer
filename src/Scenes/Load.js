class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        playerX = game.config.width/4;

        this.load.setPath("./assets/");

        // -- Load Gem Sprite --
        this.load.image("gemImg", "tile_0067.png");

        // -- Load characters spritesheet --
        this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");

        // -- Load tilemap information --
        // mono
        this.load.image("tilemap_tiles_mono", "monochrome_tilemap_transparent_packed.png");                         // Packed tilemap
        this.load.tilemapTiledJSON("platform-lv-1-mono", "lv-1-mono.tmj");   // Tilemap in JSON

        // color
        this.load.image("tilemap_tiles_color", "tilemap_packed.png");                         // Packed tilemap
        this.load.tilemapTiledJSON("platform-lv-1-color", "lv-1-color.tmj");   // Tilemap in JSON

    }

    create() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "tile_",
                start: 0,
                end: 1,
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0000.png" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0001.png" }
            ],
        });

        // ...and pass to the next Scene
        this.scene.start("Lv1Scene");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}