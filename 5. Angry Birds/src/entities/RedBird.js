import Bird from "./Bird.js";
import GameEntity from "./GameEntity.js";

export default class RedBird extends Bird {
	static SPRITE_MEASUREMENTS = [
		{ x: 903, y: 798, width: 45, height: 45 },
	];	
	static RADIUS = 20;

	/**
	 * A bird that will be launched at the pig fortress. The bird is a
	 * dynamic (i.e. non-static) Matter body meaning it is affected by
	 * the world's physics. We've given the bird a high restitution value
	 * so that it is bouncy. The label will help us manage this body later.
	 * The collision filter ensures that birds cannot collide with eachother.
	 * We've set the density to a value higher than the block's default density
	 * of 0.001 so that the bird can actually knock blocks over.
	 *
	 * @see https://brm.io/matter-js/docs/classes/Body.html#property_restitution
	 * @see https://brm.io/matter-js/docs/classes/Body.html#property_label
	 * @see https://brm.io/matter-js/docs/classes/Body.html#property_collisionFilter
	 * @see https://brm.io/matter-js/docs/classes/Body.html#property_density
	 *
	 * @param {number} x
	 * @param {number} y
	 */
	constructor(x, y) {
		super(x, y, RedBird.RADIUS);

		this.sprites = GameEntity.generateSprites(RedBird.SPRITE_MEASUREMENTS);
		this.renderOffset = { x: -25, y: -23 };
	}
}
