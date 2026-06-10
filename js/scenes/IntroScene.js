export default class IntroScene extends Phaser.Scene {
    constructor() {
        super('IntroScene');
    }

    create() {
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;

        // 1. UBAH BACKGROUND MENJADI PINK ROMANTIS MINIMALIS (Sesuai tema baru)
        this.cameras.main.setBackgroundColor('#fff5f7');

        // Tambihan aksen dekorasi hati soft di latar belakang menu utama agar manis
        this.add.text(width / 2, height / 2, '❤', { fontSize: '240px', fill: '#ffe4e1' }).setOrigin(0.5).setAlpha(0.6);

        // Judul Game bertema Soft Modern Pink
        this.add.text(width / 2, height / 2 - 80, 'for my aisha', {
            fontSize: '46px',
            fontFamily: 'Georgia, serif',
            color: '#ff69b4',
            fontStyle: 'bold',
            letterSpacing: 2
        }).setOrigin(0.5);

        // Subtitle kecil puitis di bawah judul
        this.add.text(width / 2, height / 2 - 10, 'small gift from me', {
            fontSize: '16px',
            fontFamily: 'Arial',
            fill: '#ffb6c1',
            fontStyle: 'italic'
        }).setOrigin(0.5);

        // 2. BUTTON 'START JOURNEY' YANG LEBIH SEDERHANA & MINIMALIS (Tanpa background kaku)
        let startBtn = this.add.text(width / 2, height / 2 + 100, '[ START ]', {
            fontSize: '24px',
            fontFamily: 'Courier New, monospace',
            fill: '#ff1493',
            fontStyle: 'bold'
        }).setOrigin(0.5).setInteractive();

        // Efek transisi sederhana saat tombol disentuh/hover
        startBtn.on('pointerover', () => startBtn.setStyle({ fill: '#ff69b4' }));
        startBtn.on('pointerout', () => startBtn.setStyle({ fill: '#ff1493' }));

        startBtn.on('pointerdown', () => {
            // MAIN MUSIK: Tetap aktif di sini karena aman dari blokir browser
            if (!this.sound.get('bgm')) {
                let music = this.sound.add('bgm', { loop: true, volume: 0.4 });
                music.play();
            }
            
            // JALUR BENAR: Masuk ke JourneyScene (Panggung Utama) setelah klik start
            this.scene.start('JourneyScene');
        });
    }
}