export default class PuzzleScene extends Phaser.Scene {
    constructor() {
        super('PuzzleScene');
    }

    create() {
        this.add.text(400, 30, 'Rebuild the Memory', { fontSize: '28px', fill: '#fff' }).setOrigin(0.5);
        this.progressText = this.add.text(400, 70, 'Pieces placed: 0 / 9', { fontSize: '20px', fill: '#aaa' }).setOrigin(0.5);

        this.createPuzzlePieces();

        this.piecesPlaced = 0;
        this.boardStartX = 250;
        this.boardStartY = 150;
        this.pieceSize = 100; // Resize pieces to fit board comfortably

        // Create Grid visual
        let grid = this.add.grid(this.boardStartX + 150, this.boardStartY + 150, 300, 300, 100, 100, 0x000000, 0, 0xffffff, 0.2);

        this.pieces = [];
        let positions = [];

        // Generate drop zones and prepare pieces
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                let x = this.boardStartX + col * this.pieceSize + this.pieceSize / 2;
                let y = this.boardStartY + row * this.pieceSize + this.pieceSize / 2;
                positions.push({ x, y, id: `${row}_${col}` });
            }
        }

        Phaser.Utils.Array.Shuffle(positions); // Acak posisi awal

        let index = 0;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                let id = `${row}_${col}`;
                let startPos = positions[index];
                
                // Spread pieces randomly at the bottom or sides
                let spawnX = Phaser.Math.Between(50, 750);
                let spawnY = Phaser.Math.Between(480, 580);

                let piece = this.add.image(spawnX, spawnY, `piece_${id}`).setInteractive({ draggable: true });
                piece.setDisplaySize(this.pieceSize, this.pieceSize);
                piece.correctId = id;
                piece.isPlaced = false;

                // Hitung posisi benar
                piece.targetX = this.boardStartX + col * this.pieceSize + this.pieceSize / 2;
                piece.targetY = this.boardStartY + row * this.pieceSize + this.pieceSize / 2;

                this.pieces.push(piece);
                index++;
            }
        }

        // Drag events
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if (gameObject.isPlaced) return;
            gameObject.setDepth(10);
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragend', (pointer, gameObject) => {
            if (gameObject.isPlaced) return;
            gameObject.setDepth(1);

            // Cek apakah dekat dengan posisi benar (toleransi 30 pixel)
            let dist = Phaser.Math.Distance.Between(gameObject.x, gameObject.y, gameObject.targetX, gameObject.targetY);
            if (dist < 30) {
                gameObject.x = gameObject.targetX;
                gameObject.y = gameObject.targetY;
                gameObject.isPlaced = true;
                gameObject.disableInteractive();
                this.piecesPlaced++;
                this.progressText.setText(`Pieces placed: ${this.piecesPlaced} / 9`);

                if (this.piecesPlaced === 9) {
                    this.puzzleComplete();
                }
            }
        });
    }

    createPuzzlePieces() {
        const srcImage = this.textures.get('biceps').getSourceImage();
        if (!srcImage) return;

        const pWidth = srcImage.width / 3;
        const pHeight = srcImage.height / 3;

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const canvas = document.createElement('canvas');
                canvas.width = pWidth;
                canvas.height = pHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(srcImage, col * pWidth, row * pHeight, pWidth, pHeight, 0, 0, pWidth, pHeight);

                const key = `piece_${row}_${col}`;
                if (this.textures.exists(key)) this.textures.remove(key);
                this.textures.addCanvas(key, canvas);
            }
        }
    }

    puzzleComplete() {
        // Confetti effect
        let particles = this.add.particles(0, 0, 'player', {
            x: 400, y: -50,
            speed: { min: 100, max: 300 },
            angle: { min: 0, max: 360 },
            gravityY: 200,
            scale: { start: 0.2, end: 0 },
            lifespan: 2000,
            quantity: 50,
            tint: [0xff0000, 0x00ff00, 0x0000ff, 0xffff00]
        });

        this.time.delayedCall(2500, () => {
            let btn = this.add.text(400, 520, 'Continue', {
                fontSize: '28px', backgroundColor: '#ff1493', padding: { x: 20, y: 10 }
            }).setOrigin(0.5).setInteractive();

            btn.on('pointerdown', () => {
                this.scene.start('EndingScene');
            });
        });
    }
}