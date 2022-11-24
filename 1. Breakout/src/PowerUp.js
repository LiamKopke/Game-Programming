import SpriteManager from "./SpriteManager.js";
import { getRandomNegativeNumber, getRandomNumber, getRandomPositiveNumber } from "./utils.js";
import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	sounds,
	TILE_SIZE
} from "./globals.js";
import Vector from "./Vector.js";

export default class PowerUp {
    constructor(x, y, type) {
        this.width = TILE_SIZE;
        this.height = TILE_SIZE;
        this.x = x;
        this.y = y;
        this.sprites = SpriteManager.generatePowerUpSprites();
        this.position = new Vector(x, y);
		this.velocity = new Vector(0, getRandomNegativeNumber(10, 20));
		this.acceleration = new Vector(0, 0);
		this.gravity = new Vector(0, 100);
		this.isAlive = true;
        this.type = type;
		this.applyForce(this.gravity);
    }

    applyForce(force) {
		this.acceleration.add(force);
	}

	

	didCollide(target) {
		/**
		 * First, check to see if the left edge of either is
		 * farther to the right than the right edge of the other.
		 * Then check to see if the bottom edge of either is
		 * higher than the top edge of the other.
		 */
		if (this.position.x + this.width >= target.x
			&& this.position.x <= target.x + target.width
			&& this.position.y + this.height >= target.y
			&& this.position.y <= target.y + target.height) {
			return true;
		}

		// If the above isn't true, they're overlapping.
		return false;
	}

	/**
	 * Updates the velocity and position of the particle.
	 * as well as decrements the life value over time.
	 */
	update(dt) {
		this.velocity.add(this.acceleration, dt);
		this.position.add(this.velocity, dt);

        if(this.position.y > CANVAS_HEIGHT) {
            this.isAlive = false;
        }
	}

	/**
	 * Draws the particle to the screen based on its position, radius, and type.
	 * The opacity/alpha for the particle is determined by its remaining life.
	 * The smaller the life value gets, the more transparent the particle will be.
	 */
	render() {
        this.sprites[this.type].render(this.position.x, this.position.y);
	}
}