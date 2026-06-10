import BootScene from './scenes/BootScene.js';
import IntroScene from './scenes/IntroScene.js';
import JourneyScene from './scenes/JourneyScene.js';
import LetterScene from './scenes/LetterScene.js';
import PortalScene from './scenes/PortalScene.js';
import PuzzleScene from './scenes/PuzzleScene.js';
import EndingScene from './scenes/EndingScene.js';

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600,
        parent: 'game-container'
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false
        }
    },
    scene: [
        BootScene,
        IntroScene,
        JourneyScene,
        LetterScene,
        PortalScene,
        PuzzleScene,
        EndingScene
    ]
};

const game = new Phaser.Game(config);