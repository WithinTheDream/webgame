export default class LetterScene extends Phaser.Scene {
    constructor() {
        super('LetterScene');
    }

    create() {
        // Background Plum/Pink Gelap Romantis
        this.add.rectangle(400, 300, 800, 600, 0x1f0313);
        
        // Kertas Surat Pop-up Minimalis
        this.add.rectangle(400, 300, 720, 520, 0xfff0f5).setStrokeStyle(2, 0xffb6c1);

        let letterContent = 
            "for aisha,\n\n" +
            "thank you for making it this far, yes i know we r not even dating yet, yes we havent even met in person, " +
            "and it feels like i suddenly appeared in your life and be this close to you, but " +
            "i meant it, i meant everything ive said, and i still remember the things we've talked about and the promises we made.\n\n" +
            "and here i want to say sorry.. because i know sometimes i can be little cliny, i overthink things, and " +
            "i get jealous easily than i should, and sometimes i worry about the things that probably dont have to worrying about, " +
            "but thats me. i dont meant to control or presure you and yes i know im not even your bf, but i hope you can like this side of me too. thank youu \n\n";

        this.letterTextDisplay = this.add.text(75, 75, letterContent, {
            fontSize: '19px',
            fontFamily: 'Georgia, serif',
            color: '#3a0521',
            wordWrap: { width: 650 },
            lineSpacing: 7
        });

        // UI BUTTON BARU: Super Sederhana & Clean (Hanya Teks Interaktif)
        let actionBtn = this.add.text(400, 520, 'continue ➔', {
            fontSize: '20px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fill: '#ff1493',
            fontStyle: 'bold'
        }).setOrigin(0.5).setInteractive();

        // Efek hover sederhana saat disentuh
        actionBtn.on('pointerover', () => actionBtn.setStyle({ fill: '#ff69b4' }));
        actionBtn.on('pointerout', () => actionBtn.setStyle({ fill: '#ff1493' }));

        actionBtn.on('pointerup', () => {
            this.scene.start('PortalScene');
        });
    }
}