import GameObject from "./GameObject.js";
import Tile from "./Tile.js";
import { images } from "../globals.js";
import ImageName from "../enums/ImageName.js";
import Sprite from "../../lib/Sprite.js";
import Vector from "../../lib/Vector.js";
import { getRandomPositiveInteger } from "../../lib/RandomNumberHelpers.js";

export default class Flagpole extends GameObject {
    static WIDTH = Tile.SIZE;
    static HEIGHT = Tile.SIZE * 3;
	static TOTAL_SPRITES = 6;
	
	constructor(dimensions, position) {
		super(dimensions, position);

		this.isCollidable = true;
		this.isSolid = true;

		this.sprites = Flagpole.generateSprites();        
		this.currentFrame = getRandomPositiveInteger(0, Flagpole.TOTAL_SPRITES - 1);
	}

	onCollision(collider) {
		if (this.wasCollided) return;
		super.onCollision(collider);
	}

	static generateSprites() {
		const sprites = [];

		for (let x = 0; x < Flagpole.TOTAL_SPRITES; x++) {
			sprites.push(new Sprite(
				images.get(ImageName.Flagpole),
				x * Flagpole.WIDTH,
				0,
				Flagpole.WIDTH,
				Flagpole.HEIGHT
			));
		}

		return sprites;
	}
}
