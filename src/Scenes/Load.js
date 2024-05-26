class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // -- Load characters spritesheet --
        // from https://kenney.nl/assets/1-bit-platformer-pack
        this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");

        // -- Load tilemap information --
        // mono
        // from https://kenney.nl/assets/1-bit-platformer-pack
        this.load.image("tilemap_tiles_mono", "monochrome_tilemap_transparent_packed.png");                         // Packed tilemap
        this.load.image("tilemap_tiles_input", "tilemap_white_packed.png");                         // Packed tilemap
        this.load.tilemapTiledJSON("platform-lv-1-mono", "lv-1-mono.tmj");   // Tilemap in JSON

        // color
        // from https://kenney.nl/assets/pixel-platformer
        this.load.image("tilemap_tiles_color", "tilemap_packed.png");                         // Packed tilemap
        this.load.tilemapTiledJSON("platform-lv-1-color", "lv-1-color.tmj");   // Tilemap in JSON

        
        // gem sprites
        this.load.image("colorGemImg", "tile_0067.png");
        this.load.image("monoGemImg", "tile_0082.png");

        // particles
        // From https://kenney.nl/assets/particle-pack
        this.load.image("stepDust1", "smoke_04.png");

        // -- Audio --
        // from https://kenney.nl/assets/impact-sounds
        this.load.audio("collectSFX", "impactCollect.ogg");
        this.load.audio("stepSFX", "impactFootstep.ogg");
        // from https://kenney.nl/assets/music-jingles
        this.load.audio("finishSFX", "jinglesComplete.ogg");
        // from https://kenney.nl/assets/digital-audio
        this.load.audio("jumpSFX", "phaserJump.ogg");
        this.load.audio("switchSFX", "pepSound3.ogg");
        // BGM from https://freesound.org/people/code_box/sounds/653811/
        this.load.audio("BGM", "bgm.wav");
    }

    create() {
        // BGM done here because we don't want it to start playing again when restarting the game scene
        this.bgMusic = this.sound.add("BGM");
        this.bgMusic.loop = true;
        this.bgMusic.play();

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
        // this.scene.start("endScene");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}