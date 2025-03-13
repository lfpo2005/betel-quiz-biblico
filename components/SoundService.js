import { Audio } from 'expo-av';

class SoundService {
    constructor() {
        this.sounds = {};
        this.isLoaded = false;
    }

    async loadSounds() {
        if (this.isLoaded) return;

        try {
            // Create and load sound objects
            const correctSound = new Audio.Sound();
            const incorrectSound = new Audio.Sound();
            const completeSound = new Audio.Sound();

            // Load sound files
            await correctSound.loadAsync(require('../assets/sounds/correct.mp3'));
            await incorrectSound.loadAsync(require('../assets/sounds/incorrect.mp3'));
            await completeSound.loadAsync(require('../assets/sounds/complete.mp3'));

            // Store references
            this.sounds = {
                correct: correctSound,
                incorrect: incorrectSound,
                complete: completeSound,
            };

            this.isLoaded = true;
            console.log('Sound effects loaded successfully');
        } catch (error) {
            console.error('Failed to load sound effects', error);
        }
    }

    async playSound(soundName) {
        if (!this.isLoaded) {
            await this.loadSounds();
        }

        const sound = this.sounds[soundName];
        if (!sound) {
            console.warn(`Sound "${soundName}" not found`);
            return;
        }

        try {
            // Reset the sound to the beginning
            await sound.setPositionAsync(0);
            await sound.playAsync();
        } catch (error) {
            console.error(`Error playing sound "${soundName}"`, error);
        }
    }

    async unloadSounds() {
        if (!this.isLoaded) return;

        try {
            for (const sound of Object.values(this.sounds)) {
                await sound.unloadAsync();
            }
            this.isLoaded = false;
            console.log('Sound effects unloaded');
        } catch (error) {
            console.error('Error unloading sounds', error);
        }
    }
}

// Export as singleton
export default new SoundService();