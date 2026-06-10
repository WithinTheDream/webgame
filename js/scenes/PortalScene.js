export default class PortalScene extends Phaser.Scene {

    constructor() {
        super('PortalScene');
    }

    create() {

        // Background
        this.add.image(400, 300, 'background')
            .setDisplaySize(800, 600)
            .setTint(0x444488);

        // Dark overlay
        this.add.rectangle(
            400,
            300,
            800,
            600,
            0x000000,
            0.55
        );

        // Portal
        this.portal = this.add.image(
            400,
            90,
            'portal'
        )
        .setScale(1);

        // Floating animation
        this.tweens.add({
            targets: this.portal,
            scale: 1.3,
            duration: 1200,
            yoyo: true,
            repeat: -1
        });

        // Title
        this.add.text(
            400,
            220,
            'Secret Portal',
            {
                fontSize: '32px',
                color: '#ffffff'
            }
        ).setOrigin(0.5);

        // Subtitle
        this.add.text(
            400,
            260,
            'Enter the password',
            {
                fontSize: '18px',
                color: '#dddddd'
            }
        ).setOrigin(0.5);

        this.add.rectangle(
            400,
            305,
            250,
            50,
            0xffffff,
            0.15
        ).setStrokeStyle(2, 0xffffff);

        this.passwordInput = '';

        this.passwordDisplay = this.add.text(
            400,
            305,
            '• • • • • • • •',
            {
                fontSize: '22px',
                color: '#ffffff'
            }
        ).setOrigin(0.5);

        this.statusText = this.add.text(
            400,
            355,
            '',
            {
                fontSize: '16px',
                color: '#ff6666'
            }
        ).setOrigin(0.5);

        this.createNumpad();
    }

    createNumpad() {

    const keys = [
        '1', '2', '3',
        '4', '5', '6',
        '7', '8', '9',
        'DEL', '0', 'OK'
    ];

    const startX = 310;
    const startY = 390;

    const spacingX = 90;
    const spacingY = 50;

    keys.forEach((key, index) => {

        let col = index % 3;
        let row = Math.floor(index / 3);

        let x = startX + col * spacingX;
        let y = startY + row * spacingY;

        let btn = this.add.rectangle(
            x,
            y,
            70,
            38,
            0xffffff,
            0.15
        )
        .setStrokeStyle(1, 0xffffff)
        .setInteractive();

        this.add.text(
            x,
            y,
            key,
            {
                fontSize: '16px',
                color: '#ffffff'
            }
        ).setOrigin(0.5);

        btn.on('pointerdown', () => {

            btn.setFillStyle(0xffffff, 0.35);

            this.handleKeyPress(
                key === 'OK'
                    ? 'ENTER'
                    : key
            );

        });

        btn.on('pointerup', () => {
            btn.setFillStyle(0xffffff, 0.15);
        });

        btn.on('pointerout', () => {
            btn.setFillStyle(0xffffff, 0.15);
        });

    });

}

    handleKeyPress(key) {

        if (key === 'DEL') {

            this.passwordInput =
                this.passwordInput.slice(0, -1);

        }
        else if (key === 'ENTER') {

            this.checkPassword();
            return;

        }
        else {

            if (this.passwordInput.length < 8) {
                this.passwordInput += key;
            }

        }

        let masked =
            '● '.repeat(this.passwordInput.length);

        this.passwordDisplay.setText(
            masked || '• • • • • • • •'
        );
    }

    checkPassword() {

        if (this.passwordInput === '05052005') {

            this.statusText
                .setText('Access Granted')
                .setFill('#7CFF7C');

            this.time.delayedCall(1500, () => {

                this.scene.start('PuzzleScene');

            });

        }
        else {

            this.statusText
                .setText('Wrong Password')
                .setFill('#FF7A7A');

            this.passwordInput = '';

            this.passwordDisplay.setText(
                '• • • • • • • •'
            );

        }

    }

}