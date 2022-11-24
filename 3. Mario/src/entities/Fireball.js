import Entity from "./Entity.js";
import Tile from "../objects/Tile.js";
import { images, sounds, timer } from "../globals.js";
import ImageName from "../enums/ImageName.js";
import Sprite from "../../lib/Sprite.js";
import Vector from "../../lib/Vector.js";
import Animation from "../../lib/Animation.js";
import StateMachine from "../../lib/StateMachine.js";
import FireballStateName from "../enums/FireballStateName.js";
import FireballState from "../states/entity/fireball/FireballState.js";

export default class Fireball extends Entity {
	static WIDTH = Tile.SIZE;
	static HEIGHT = Tile.SIZE;
    static SPRITES_WIDTH = 4;
    static SPRITES_HEIGHT = 6;

	/**
	 * A collectible item that the player can consume to gain points.
	 *
	 * @param {Vector} dimensions
	 * @param {Vector} position
	 */
	 constructor(dimensions, position, velocityLimit, level, direction) {
		super(dimensions, position, velocityLimit, level);

		this.sprites = Fireball.generateSprites();

		this.stateMachine = new StateMachine();
		this.stateMachine.add(FireballStateName.Fireball, new FireballState(this, direction));
		this.changeState(FireballStateName.Fireball);
	}

	static generateSprites() {
		const sprites = [];

		for (let y = 0; y < Fireball.SPRITES_HEIGHT; y++) {
			for (let x = 0; x < Fireball.SPRITES_WIDTH; x++) {
					sprites.push(new Sprite(
						images.get(ImageName.Fireball),
						x * Fireball.WIDTH,
						y * Fireball.HEIGHT,
						Fireball.WIDTH,
						Fireball.HEIGHT
				));
			}
		}

		return sprites;
	}
}
