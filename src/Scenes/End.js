class End extends Phaser.Scene {
    constructor() {
        super("endScene");
    }

    preload() {
    }

    create() {
        // console.log(game.config.width)
        this.endTxt = this.add.text(game.config.width/3, game.config.height/3, "Level Complete!", {
            fontFamily: "'Freeman'",
            fontSize: 75,
            align: "center",
            stroke: '#444444',
            strokeThickness: 8
            // fixedWidth: 400,
            // fixedHeight: 50
        });

        this.replayTxt = this.add.text(400, 500, "Press space to replay", {
            fontFamily: "'Freeman'",
            fontSize: 75,
            align: "center",
            stroke: '#444444',
            strokeThickness: 8
            // fixedWidth: 400,
            // fixedHeight: 50
        });

        //if spacebar then switch
        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start("Lv1Scene");
        }, this);
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}