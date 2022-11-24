import GameObject from "./GameObject.js";
import Tile from "./Tile.js";
import { images, sounds } from "../globals.js";
import ImageName from "../enums/ImageName.js";
import SoundName from "../enums/SoundName.js";
import Animation from "../../lib/Animation.js";
import Sprite from "../../lib/Sprite.js";
import Vector from "../../lib/Vector.js";

export default class Powerup extends GameObject {
	static WIDTH = Tile.SIZE;
	static HEIGHT = Tile.SIZE;
    static TOTAL_SPRITES = 3;
    static POINTS = 50;

	/**
	 * A collectible item that the player can consume to gain points.
	 *
	 * @param {Vector} dimensions
	 * @param {Vector} position
	 */
	constructor(dimensions, position) {
		super(dimensions, position);

		this.isConsumable = true;

		this.sprites = Powerup.generateSprites();
	}

	onConsume(player) {
		super.onConsume(player);
		sounds.play(SoundName.PickUp);
		this.cleanUp = true;
	}

	static generateSprites() {
		const sprites = [];

		for (let y = 0; y < Powerup.TOTAL_SPRITES; y++) {
			sprites.push(new Sprite(
				images.get(ImageName.Powerups),
				0,
				y * Powerup.HEIGHT,
				Powerup.WIDTH,
				Powerup.HEIGHT
			));
		}

		return sprites;
	}
}
