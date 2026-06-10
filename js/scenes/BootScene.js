export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Loading bar graphics
        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);

        let width = this.cameras.main.width;
        let height = this.cameras.main.height;
        let loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading our memories...',
            style: { font: '20px monospace', fill: '#ffffff' }
        }).setOrigin(0.5, 0.5);

        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xff69b4, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        });

        // LOAD AUDIO BGM
        this.load.audio('bgm', 'assets/bgm.mp3');

        // Load assets
        this.load.image('player', 'assets/player.png');
        this.load.image('memory1', 'assets/memory1.png');
        this.load.image('memory2', 'assets/memory2.png');
        this.load.image('memory3', 'assets/memory3.png');
        this.load.image('biceps', 'assets/biceps.jpeg');
        this.load.image('chest', 'assets/chest.png');
        this.load.image('portal', 'assets/portal.png');
        this.load.image('background', 'assets/background.png');
    }

    create() {
        this.generateDummyAssets();
        this.scene.start('IntroScene');
    }

    generateDummyAssets() {
        const createDummy = (key, width, height, color) => {
            if (!this.textures.exists(key) || this.textures.get(key).key === '__MISSING') {
                let g = this.make.graphics({x:0, y:0}, false);
                g.fillStyle(color, 1);
                g.fillRect(0, 0, width, height);
                g.generateTexture(key, width, height);
            }
        };

        createDummy('player', 50, 80, 0xff0000);
        createDummy('memory1', 400, 300, 0x555555);
        createDummy('memory2', 400, 300, 0x555555);
        createDummy('memory3', 400, 300, 0x555555);
        createDummy('biceps', 600, 600, 0x8B4513);
        createDummy('chest', 60, 60, 0xFFD700);
        createDummy('portal', 80, 150, 0x8A2BE2);
        createDummy('background', 800, 600, 0x1a0f00); // Diubah ke warna gelap basic kayu
    }
}