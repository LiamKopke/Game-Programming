import BodyType from "../enums/BodyType.js";
import Circle from "./Circle.js";
import GameEntity from "./GameEntity.js";
import Timer from "../../lib/Timer.js";

export default class Pig extends Circle {
	static SPRITE_MEASUREMENTS = [			
		{ x: 733, y: 856, width: 48, height: 46 },
		{ x: 987, y: 744, width: 48, height: 46 },			
		{ x: 733, y: 904, width: 48, height: 46 },
	];
	static RADIUS = 20;

	/**
	 * A pig that sits smugly in its fortress.
	 * The pig is a dynamic (i.e. non-static) Matter body meaning it is affected
	 * by the world's physics. We've set the density to a value
	 * higher than the block's density so that the pig can knock
	 * blocks over. We've also given the pig a medium restitution
	 * value so that it is somewhat bouncy.
	 *
	 * @see https://brm.io/matter-js/docs/classes/Body.html#property_density
	 * @see https://brm.io/matter-js/docs/classes/Body.html#property_restitution
	 * @see https://brm.io/matter-js/docs/classes/Body.html#property_collisionFilter
	 *
	 * @param {number} x
	 * @param {number} y
	 */
	constructor(x, y) {
		super(x, y, Pig.RADIUS, {
			label: BodyType.Pig,
			density: 0.0015,
			restitution: 0.5,
		});

		this.sprites = GameEntity.generateSprites(Pig.SPRITE_MEASUREMENTS);
		this.currentFrame = 0;
		this.renderOffset = { x: -24, y: -23 };
		this.health = 3;
		this.isInvulnerable = false;
		this.timer = new Timer();
	}

	update(dt){
		super.update(dt);
		this.timer.update(dt);		
	}

	damage(dmg){
		if(!this.isInvulnerable){
			this.isInvulnerable = true;
			this.timer.waitAsync(1).then(()=>{
				this.isInvulnerable = false;
			})
			this.health -= dmg;
			this.currentFrame = Math.max(this.health, 0);
			console.log("h: " + this.health);
			console.log("f: " + this.currentFrame);
		}
	}

	isDead(){
		return this.health <= 0;
	}
}
