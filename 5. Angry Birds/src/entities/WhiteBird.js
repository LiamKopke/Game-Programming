import Bird from "./Bird.js";
import GameEntity from "./GameEntity.js";
import { matter, keys, world } from "../globals.js";
import Animation from "../../lib/Animation.js";

const {
	Composite
} = matter;

export default class WhiteBird extends Bird {
	static SPRITE_MEASUREMENTS = [
		{ x: 410, y: 542, width: 80, height: 93 },
		{ x: 410, y: 353, width: 80, height: 93 },
		{ x: 410, y: 448, width: 80, height: 93 },
		{ x: 493, y: 353, width: 85, height: 93 },
		{ x: 667, y: 752, width: 50, height: 65 },
		{ x: 668, y: 820, width: 45, height: 57 },
	];	
	static RADIUS = 35;	

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
	constructor(x, y, queue) {		
		super(x, y, WhiteBird.RADIUS);

		this.sprites = GameEntity.generateSprites(WhiteBird.SPRITE_MEASUREMENTS);		
		this.renderOffset = { x: -45, y: -58 };
		this.hasLayed = false;
		this.animation = null;
		this.isDeflated = false;
		this.cleaningUp = false;
		this.queue = queue;
	}

	update(dt){		
		super.update(dt);	
		// Make sure hes flying, going fast enough and isnt on the ground
		if(!this.isWaiting && !this.isJumping && !this.hasLayed && !this.isOnGround() && this.body.speed > 0.5 && keys[" "]){
			this.layEgg();
		}
		if(this.hasLayed){
			this.animation.update(dt);
			this.currentFrame = this.animation.getCurrentFrame();

			if(this.animation.isDone() && !this.isDeflated){				
				this.deflate();
			}
		}	
		
		if(this.shouldCleanUp && !this.cleaningUp){
			this.cleaningUp = true;
			console.log(this.queue.birds);
			this.queue.birds.pop();
		}
	}

	layEgg(){
		this.hasLayed = true;
		this.animation = new Animation([1, 2, 3, 4], 0.05, 1);		
	}

	deflate(){		
		matter.Body.applyForce(this.body, this.body.position, { x: 0.3, y: -3 });
		this.isDeflated = true;
		this.radius = 25;
		this.renderOffset = { x: -30, y: -35 };
		const egg = new WhiteBird(this.body.position.x, this.body.position.y);
		egg.becomeEgg();
		this.queue.birds.push(egg);
	}

	becomeEgg(){		
		this.currentFrame = 5;
		this.radius = 25;
		this.renderOffset = { x: -22, y: -30 };
	}
}
