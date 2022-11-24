import GameObject from "./GameObject.js";
import Coin from "./Coin.js";
import Flower from "./Flower.js";
import Mushroom from "./Mushroom.js";
import Star from "./Star.js";
import Sprite from "../../lib/Sprite.js";
import Tile from "./Tile.js";
import ImageName from "../enums/ImageName.js";
import SoundName from "../enums/SoundName.js";
import { images, sounds, timer } from "../globals.js";
import Vector from "../../lib/Vector.js";

export default class Block extends GameObject {
	static WIDTH = Tile.SIZE;
	static HEIGHT = Tile.SIZE;
	static TOTAL_SPRITES = 5;
	static NOT_HIT = 1;
	static HIT = 4;

	/**
	 * A "box" that the player can hit from beneath to reveal a coin.
	 *
	 * @param {Vector} dimensions
	 * @param {Vector} position
	 */
	constructor(dimensions, position) {
		super(dimensions, position);

		this.isCollidable = true;
		this.isSolid = true;

		this.sprites = Block.generateSprites();
		this.currentFrame = Block.NOT_HIT;
	}

	static generateSprites() {
		const sprites = [];

		for (let y = 0; y < Block.TOTAL_SPRITES; y++) {
			sprites.push(new Sprite(
				images.get(ImageName.Blocks),
				0,
				y * Block.HEIGHT,
				Block.WIDTH,
				Block.HEIGHT
			));
		}

		return sprites;
	}

	onCollision(collider) {
		if (this.wasCollided) {
			sounds.play(SoundName.EmptyBlock);
			return;
		}

		super.onCollision(collider);

		// 10% chance for each powerup, then rest is coin
		let random = Math.random() * 100;
		let consumable;
		if(random < 100){ // TODO: reset to -> // 15% chance of powerup
			random = Math.random() * 100;
			if(random < 33){
				consumable = new Mushroom(
					new Vector(Mushroom.WIDTH, Mushroom.HEIGHT),
					new Vector(this.position.x, this.position.y)
				);
			}
			else if(random < 66){
				consumable = new Flower(
					new Vector(Flower.WIDTH, Flower.HEIGHT),
					new Vector(this.position.x, this.position.y)
				);
			}
			else{
				consumable = new Star(
					new Vector(Star.WIDTH, Star.HEIGHT),
					new Vector(this.position.x, this.position.y)
				);
			}
		}
		else{
			consumable = new Coin(
				new Vector(Coin.WIDTH, Coin.HEIGHT),
				new Vector(this.position.x, this.position.y)
			);
		}	

		// Make the block move up and down.
		timer.tween(this.position, ['y'], [this.position.y - 5], 0.1, () => {
			timer.tween(this.position, ['y'], [this.position.y + 5], 0.1);
		});

		// Make the consumable move up from the block and play a sound.
		timer.tween(consumable.position, ['y'], [this.position.y - 16], 0.1);
		sounds.play(SoundName.Reveal);

		/**
		 * Since we want the coin to appear like it's coming out of the block,
		 * We add the coin to the beginning of the objects array. This way,
		 * when the objects are rendered, the coins will be rendered first,
		 * and the blocks will be rendered after.
		 */
		collider.level.objects.unshift(consumable);

		this.currentFrame = Block.HIT;
	}
}
