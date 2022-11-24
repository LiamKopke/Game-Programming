import { images, TILE_SIZE } from "./globals.js";
import Sprite from "./Sprite.js";

/**
 * This class is responsible for holding the functions to "cut up"
 * the sprite sheet into various quads that we'll need to render.
 */
export default class SpriteManager {
	/**
	 * Retrieves all sizes of paddle sprites from the sprite sheet.
	 *
	 * @returns An array of paddle sprites.
	 */
	static generatePaddleSprites() {
		const x = 0;
		let y = TILE_SIZE * 4;
		const sprites = [];

		for (let i = 0; i < 4; i++) {
			sprites.push(new Sprite(images.spriteSheet, x, y, TILE_SIZE * 2, TILE_SIZE)); // Small
			sprites.push(new Sprite(images.spriteSheet, x + TILE_SIZE * 2, y, TILE_SIZE * 4, TILE_SIZE)); // Medium
			sprites.push(new Sprite(images.spriteSheet, x + TILE_SIZE * 6, y, TILE_SIZE * 6, TILE_SIZE)); // Large
			sprites.push(new Sprite(images.spriteSheet, x, y + TILE_SIZE, TILE_SIZE * 8, TILE_SIZE)); // Huge

			y += TILE_SIZE * 2;
		}

		return sprites;
	}

	/**
	 * Retrieves all ball sprites from the sprite sheet.
	 *
	 * @returns An array of ball sprites.
	 */
	static generateBallSprites() {
		let x = TILE_SIZE * 6;
		let y = TILE_SIZE * 3;
		const sprites = [];

		for (let i = 0; i < 3; i++) {
			sprites.push(new Sprite(images.spriteSheet, x, y, TILE_SIZE / 2, TILE_SIZE / 2));
			x += TILE_SIZE / 2;
		}

		x = TILE_SIZE * 6;
		y = TILE_SIZE * 3 + TILE_SIZE / 2;

		for (let i = 0; i < 2; i++) {
			sprites.push(new Sprite(images.spriteSheet, x, y, TILE_SIZE / 2, TILE_SIZE / 2));
			x += TILE_SIZE / 2;
		}

		return sprites;
	}

	/**
	 * Retrieves all brick sprites from the sprite sheet.
	 *
	 * @returns An array of brick sprites.
	 */
	static generateBrickSprites() {
		let x = 0;
		let y = 0;
		const sprites = [];

		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 6; j++) {
				sprites.push(new Sprite(images.spriteSheet, x, y, TILE_SIZE * 2, TILE_SIZE));
				x += TILE_SIZE * 2;
			}

			x = 0;
			y += TILE_SIZE;
		}

		sprites.splice(21, 2);

		sprites.push(new Sprite(images.spriteSheet, TILE_SIZE * 10, TILE_SIZE * 3, TILE_SIZE * 2, TILE_SIZE));

		return sprites;
	}

	/**
	 * Retrieves all brick sprites from the sprite sheet.
	 *
	 * @returns An array of brick sprites.
	 */
	static generateHeartSprites() {
		let x = TILE_SIZE * 8;
		let y = TILE_SIZE * 3;
		const sprites = [];

		for (let i = 0; i < 2; i++) {
			sprites.push(new Sprite(images.spriteSheet, x, y, 10, 9));
			x += 10;
		}

		return sprites;
	}

	/**
	 * Retrieves all arrow sprites from the sprite sheet.
	 *
	 * @returns An array of arrow sprites.
	 */
	static generateArrowSprites() {
		const sprites = [];

		sprites.push(new Sprite(images.arrows, 0, 0, 24, 24));
		sprites.push(new Sprite(images.arrows, 24, 0, 24, 24));

		return sprites;
	}

	/**
	 * Retrieves all power up sprites from the sprite sheet.
	 *
	 * @returns An array of powerup sprites.
	 */
	static generatePowerUpSprites(){
		const sprites = [];

		// Key power up
		sprites.push(new Sprite(images.spriteSheet, TILE_SIZE * 9, TILE_SIZE * 12, TILE_SIZE, TILE_SIZE));

		// Gain a heart power up
		sprites.push(new Sprite(images.spriteSheet, TILE_SIZE * 2, TILE_SIZE * 12, TILE_SIZE, TILE_SIZE));

		// Triple Ball power up
		sprites.push(new Sprite(images.spriteSheet, TILE_SIZE * 3, TILE_SIZE * 12, TILE_SIZE, TILE_SIZE));

		return sprites;
	}

	/**
	 * Retrieves all key sprites from the sprite sheet.
	 *
	 * @returns An array of key sprites.
	 */
	static generateKeySprites() {
		let x = TILE_SIZE * 8;
		let y = TILE_SIZE * 3 + 9;
		const sprites = [];

		for (let i = 0; i < 2; i++) {
			sprites.push(new Sprite(images.spriteSheet, x, y, 10, 5));
			x += 10;
		}

		return sprites;
	}

}
