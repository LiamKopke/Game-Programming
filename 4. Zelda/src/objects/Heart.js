import GameObject from "./GameObject.js";
import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images, context, DEBUG } from "../globals.js";
import Vector from "../../lib/Vector.js";
import Player from "../entities/Player.js";
import Tile from "./Tile.js";

export default class Heart extends GameObject {
    static HEIGHT = Tile.TILE_SIZE;
    static WIDTH = Tile.TILE_SIZE;    

	/**
	 * A toggle that the player can hit to open the dungeon doors.
	 *
	 * @param {Vector} dimensions
	 * @param {Vector} position
	 */
	constructor(dimensions, position) {
		super(dimensions, position);

		this.isConsumable = true;

		this.sprites = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.Hearts),
			Heart.WIDTH,
			Heart.HEIGHT
		);
		this.currentFrame = 4;
	}

    render(offset = { x: 0, y: 0 }) {
		const x = this.position.x + offset.x;
		const y = this.position.y + offset.y;

		this.sprites[this.currentFrame].render(Math.floor(x), Math.floor(y), new Vector(0.5, 0.5));

		if (DEBUG) {
			this.hitbox.render(context);
		}
	}

	onConsume(consumer) {
        if(this.wasConsumed)
            return;
        if (consumer instanceof Player) {     
            if(consumer.health != consumer.totalHealth){
                super.onConsume(consumer);
                consumer.heal(2);
            }  
        }
	}
}
