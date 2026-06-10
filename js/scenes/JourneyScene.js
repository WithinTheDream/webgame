export default class JourneyScene extends Phaser.Scene {
    constructor() {
        super('JourneyScene');
    }

    create() {
        // Lebar world diperpanjang agar jarak ingatan jauh
        this.worldWidth = 4500;
        this.physics.world.setBounds(0, 0, this.worldWidth, 600);

        // BACKGROUND TILESPRITE (Skala 0.6 agar pas & loop lancar)
        this.background = this.add.tileSprite(0, 0, this.worldWidth, 600, 'background').setOrigin(0, 0);
        this.background.tileScaleX = 0.6;
        this.background.tileScaleY = 0.6;

        // LANTAI KAYU COKELAT
        let ground = this.add.rectangle(0, 530, this.worldWidth, 70, 0x3d1f05).setOrigin(0, 0);
        this.physics.add.existing(ground, true);
        
        // Garis aksen serat kayu papan panggung yang kontrasnya pas
        let woodGraphics = this.add.graphics();
        woodGraphics.lineStyle(4, 0x261302, 0.8);
        for (let i = 0; i < this.worldWidth; i += 200) {
            woodGraphics.lineBetween(i, 545, i + 150, 545);
            woodGraphics.lineBetween(i + 50, 565, i + 250, 565);
        }

        // PLAYER
        this.player = this.physics.add.sprite(200, 350, 'player');
        this.player.setDisplaySize(155, 155); 
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, ground);

        // Kamera mengikuti player
        this.cameras.main.setBounds(0, 0, this.worldWidth, 600);
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);

        // PECAHAN MEMORY YANG FLOATING (MELAYANG ATAS BAWAH)
        this.createMemory(1200, 'memory1', 'looks like someone wanted your Instagram.');
        this.createMemory(2500, 'memory2', '(you didnt know why he was looking at you like that.)');
        this.createMemory(3700, 'memory3', 'a warm place where someone is waiting for you.');

        // CHEST FLOATING & UKURAN BESAR (140x140)
        this.chest = this.physics.add.sprite(4300, 420, 'chest');
        this.chest.setDisplaySize(140, 140);
        this.chest.body.setAllowGravity(false); 
        this.chest.body.setImmovable(true);
        
        // Efek animasi melayang (floating) untuk Chest Utama
        this.tweens.add({
            targets: this.chest,
            y: '-=25',
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Deteksi sentuhan player dengan peti
        this.physics.add.overlap(this.player, this.chest, this.reachChest, null, this);

        // Kontrol Flags
        this.isMovingLeft = false;
        this.isMovingRight = false;
        this.isPaused = true; 

        this.popupElements = [];

        // Mempersiapkan Kotak Teks Narator bertema Pink
        this.createNarrationUI();
        this.createSuperSmoothControls();

        // JALANKAN NARASI PEMBUKA
        this.triggerNarration([
            "you opened your eyes in a strange theater place.",
            "everything felt unfamiliar, yet kinda comforting.",
            "Maybe you will found something if you start to walking forward"
        ]);
    }

    // UI KOTAK DIALOG NUANSA PINK ELEGAN
    createNarrationUI() {
        this.narrationBg = this.add.rectangle(400, 110, 720, 130, 0x1f0313, 0.9).setScrollFactor(0).setDepth(300).setVisible(false);
        this.narrationBg.setStrokeStyle(3, 0xff69b4); 

        this.narrationText = this.add.text(400, 110, '', {
            fontSize: '21px',
            fontFamily: 'Georgia, serif',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: 650 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(301).setVisible(false);

        this.narrationHint = this.add.text(670, 155, 'Tap to continue >', {
            fontSize: '14px', fill: '#ff69b4', fontStyle: 'italic'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(301).setVisible(false);
    }

    triggerNarration(paragraphs, callback) {
        this.isPaused = true;
        this.player.setVelocityX(0);
        
        this.narrationBg.setVisible(true);
        this.narrationText.setVisible(true);
        this.narrationHint.setVisible(paragraphs.length > 1);

        let currentIndex = 0;
        this.narrationText.setText(paragraphs[currentIndex]);

        this.narrationBg.setInteractive();
        this.narrationBg.off('pointerdown');
        
        this.narrationBg.on('pointerdown', () => {
            currentIndex++;
            if (currentIndex < paragraphs.length) {
                this.narrationText.setText(paragraphs[currentIndex]);
                if (currentIndex === paragraphs.length - 1) {
                    this.narrationHint.setVisible(false);
                }
            } else {
                this.narrationBg.setVisible(false);
                this.narrationText.setVisible(false);
                this.narrationHint.setVisible(false);
                this.narrationBg.disableInteractive();
                this.isPaused = false;
                if (callback) callback();
            }
        });
    }

    // MEMBUAT ITEM FLOATING ATAS-BAWAH HALUS
    createMemory(x, imageKey, caption) {
        let box = this.add.rectangle(x, 440, 90, 90, 0xff69b4, 0.2).setOrigin(0.5);
        box.setStrokeStyle(2, 0xff1493);
        
        let heartText = this.add.text(x, 440, '❤', { fontSize: '38px', fill: '#ff1493' }).setOrigin(0.5);
        
        this.physics.add.existing(box, true);
        box.hasTriggered = false;

        this.tweens.add({
            targets: [box, heartText],
            y: '-=20',
            duration: 1300,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.physics.add.overlap(this.player, box, () => {
            if (!box.hasTriggered && !this.isPaused) {
                box.hasTriggered = true;
                this.tweens.killTweensOf([box, heartText]);
                box.destroy();
                heartText.destroy();
                
                let narrativeLines = [
                    "you found a floating piece of heart on the wooden stage...",
                    "it feels familiar, like the beginning of an unexpected story."
                ];

                if (imageKey === 'memory2') {
                    narrativeLines = [
                        "you keep running through the stage, hoping to find more pieces of heart.",
                        "no matter how unfamiliar this stage is, you dont look back.",
                        "and right there, another glowing piece of heart waiting for you."
                    ];
                } else if (imageKey === 'memory3') {
                    narrativeLines = [
                        "interesting.",
                        "we re almost there."
                    ];
                }

                this.triggerNarration(narrativeLines, () => {
                    this.showMemory(imageKey, caption);
                });
            }
        });
    }

    // FIX DI SINI: Mengubah Y ke 565 dan tinggi ke 70 agar menutupi seluruh strip cokelat terang secara rata
    createSuperSmoothControls() {
        this.add.rectangle(400, 565, 800, 70, 0x000000, 0.6).setScrollFactor(0).setDepth(10);
        this.add.text(150, 570, '◀ TOUCH HERE TO WALK LEFT', { fontSize: '10px', fill: '#ff69b4', fontStyle: 'bold' }).setOrigin(0.5).setScrollFactor(0).setDepth(11);
        this.add.text(650, 570, 'TOUCH HERE TO WALK RIGHT ▶ \n OR U CAN TOUCH SOMETHING ELSE INSTEAD ', { fontSize: '10px', fill: '#ff69b4', fontStyle: 'bold' }).setOrigin(0.5).setScrollFactor(0).setDepth(11);
    }

    handleContinuousInput() {
        if (this.isPaused) {
            this.isMovingLeft = false;
            this.isMovingRight = false;
            return;
        }

        let pointer = this.input.activePointer;

        if (pointer.isDown) {
            if (pointer.y < 180 && this.narrationBg.visible) return;

            if (pointer.x < 400) {
                this.isMovingLeft = true;
                this.isMovingRight = false;
            } else {
                this.isMovingRight = true;
                this.isMovingLeft = false;
            }
        } else {
            this.isMovingLeft = false;
            this.isMovingRight = false;
        }
    }

    showMemory(imageKey, captionText) {
        this.isPaused = true;
        this.player.setVelocityX(0);

        let bgOverlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.9).setScrollFactor(0).setDepth(200).setInteractive();

        let photo = this.add.image(400, 220, imageKey).setScrollFactor(0).setDepth(201);
        let scaleX = 600 / photo.width;
        let scaleY = 360 / photo.height;
        let scale = Math.min(scaleX, scaleY);
        photo.setScale(scale);

        let caption = this.add.text(400, 440, captionText, {
            fontSize: '25px', fontStyle: 'italic', color: '#ffffff', align: 'center', wordWrap: { width: 650 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(201);

        let closeBtnBg = this.add.rectangle(400, 525, 260, 55, 0xff1493).setScrollFactor(0).setDepth(202).setInteractive();
        closeBtnBg.setStrokeStyle(2, 0xffffff); 
        
        let closeBtnText = this.add.text(400, 525, 'CLOSE PHOTO', {
            fontSize: '22px', fill: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(203);

        this.popupElements.push(bgOverlay, photo, caption, closeBtnBg, closeBtnText);

        closeBtnBg.on('pointerup', (pointer, localX, localY, event) => {
            if (event) event.stopPropagation();
            this.popupElements.forEach(el => el.destroy());
            this.popupElements = [];
            this.isPaused = false;
        });
    }

    reachChest() {
        if (this.isPaused) return;
        this.isPaused = true;
        this.player.setVelocityX(0);

        let openBtn = this.add.text(400, 300, '✦ TOUCH THE SEAL ✦', {
            fontSize: '34px', backgroundColor: '#ff69b4', color: '#ffffff', padding: { x: 40, y: 20 }, fontStyle: 'bold'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(250).setInteractive();

        openBtn.on('pointerdown', () => {
            this.scene.start('LetterScene');
        });
    }

    update() {
        this.handleContinuousInput();

        if (this.isPaused) {
            this.player.setVelocityX(0);
            return;
        }

        let moveSpeed = 290;

        if (this.isMovingLeft) {
            this.player.setVelocityX(-moveSpeed);
            this.player.setFlipX(true);
        } else if (this.isMovingRight) {
            this.player.setVelocityX(moveSpeed);
            this.player.setFlipX(false);
        } else {
            this.player.setVelocityX(0);
        }
    }
}