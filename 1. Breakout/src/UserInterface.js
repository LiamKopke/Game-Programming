import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	images
} from "./globals.js";
import SpriteManager from "./SpriteManager.js";

export default class UserInterface {
	/**
	 * A helper class to draw the UI so that it can be used in many states.
	 *
	 * @param {Number} health
	 * @param {Number} score
	 * @param {Number} level
	 */
	constructor(health, score, key, level) {
		this.health = health;
		this.score = score;
		this.key = key;
		this.level = level;
	}

	update(health, score, key, level = this.level) {
		this.health = health;
		this.score = score;
		this.key = key;
		this.level = level;
	}

	render() {
		images.background.render(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		// Renders the current level at the top left.
		context.save();
		context.font = "10px Joystix";
		context.fillStyle = "white";
		context.fillText(`Level: ${this.level}`, 10, 20);
		context.restore();

		/*
			Renders hearts based on how much health the player has. First renders
			full hearts, then empty hearts for however much health we're missing.
		*/
		let healthX = CANVAS_WIDTH - 130;
		let keyX = CANVAS_WIDTH - 130;
		const heartSprites = SpriteManager.generateHeartSprites();

		// Render health left.
		for (let i = 0; i < this.health; i++) {
			heartSprites[0].render(healthX, 12);
			healthX = healthX + 11;
		}

		// Render missing health.
		for (let i = 0; i < 3 - this.health; i++) {
			heartSprites[1].render(healthX, 12);
			healthX = healthX + 11;
		}

		// Render the keys
		const keySprites = SpriteManager.generateKeySprites();

		// Render Keys left.
		for (let i = 0; i < this.key; i++) {
			keySprites[0].render(keyX, 24);
			keyX = keyX + 11;
		}

		// Render missing keys.
		for (let i = 0; i < 3 - this.key; i++) {
			keySprites[1].render(keyX, 24);
			keyX = keyX + 11;
		}

		/*
			Renders the player's score at the top right, with left-side padding
			for the score number.
		*/
		context.save();
		context.font = "10px Joystix";
		context.fillStyle = "white";
		context.fillText(`Score:`, CANVAS_WIDTH - 85, 20);
		context.textAlign = 'right';
		context.fillText(`${this.score}`, CANVAS_WIDTH - 10, 20);

		// Renders if the player has a key
		context.restore();
	}
}
