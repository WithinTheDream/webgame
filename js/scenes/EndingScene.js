export default class EndingScene extends Phaser.Scene {
    constructor() {
        super('EndingScene');
    }

    create() {
        let bg = this.add.image(400, 300, 'biceps');
        // scale to fit exactly gracefully
        let scale = Math.max(800 / bg.width, 600 / bg.height);
        bg.setScale(scale).setAlpha(0.3); // Gelapkan sedikit agar teks terbaca

        // Full biceps photo inside a beautiful frame
        let finalPhoto = this.add.image(400, 200, 'biceps');
        let pScale = Math.min(300 / finalPhoto.width, 300 / finalPhoto.height);
        finalPhoto.setScale(pScale);

        let style = { fontSize: '24px', fill: '#fff', fontStyle: 'italic', align: 'center' };
        
       this.add.text(
    400,
    380,
    "congratulations.",
    style
).setOrigin(0.5);

this.add.text(
    400,
    420,
    "you made it all the way here.",
    style
).setOrigin(0.5);

this.add.text(
    400,
    460,
    "as promised, heres the secret reward.",
    style
).setOrigin(0.5);

this.add.text(
    400,
    500,
    "and yes, its just my arms heh.",
    {
        fontSize: '26px',
        fill: '#ffb6c1',
        fontStyle: 'bold'
    }
).setOrigin(0.5);

        let playBtn = this.add.text(400, 560, 'play Again', {
            fontSize: '20px', backgroundColor: '#333', padding: { x: 15, y: 8 }
        }).setOrigin(0.5).setInteractive();

        playBtn.on('pointerdown', () => {
            this.scene.start('IntroScene');
        });
    }
}