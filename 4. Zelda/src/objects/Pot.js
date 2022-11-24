import GameObject from "./GameObject.js";
import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images, timer, DEBUG, context, sounds} from "../globals.js";
import Vector from "../../lib/Vector.js";
import SoundName from "../enums/SoundName.js";
import Tile from "./Tile.js";
import Hitbox from "../../lib/Hitbox.js";

export default class Pot extends GameObject {
	static WIDTH = Tile.TILE_SIZE * 2;
	static HEIGHT = Tile.TILE_SIZE * 2;  
    static HITBOX_WIDTH = 8;
    static HITBOX_HEIGHT = 8;  

	/**
	 * A toggle that the player can hit to open the dungeon doors.
	 *
	 * @param {Vector} dimensions
	 * @param {Vector} position
	 */
	constructor(dimensions, position) {
		super(dimensions, position);		

        this.isCollidable = true;
		this.isSolid = true;
        this.isThrown = false;
        this.isBroken = false;

		this.sprites = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.Pots),
			Pot.WIDTH,
			Pot.HEIGHT
		);
		this.currentFrame = 0;

        this.hitboxOffsets = new Hitbox(0, Pot.HEIGHT, 0, -Pot.HEIGHT + 6);
        this.hitbox = new Hitbox(
			this.position.x + this.hitboxOffsets.position.x + (3 * Tile.TILE_SIZE / 4),
			this.position.y + this.hitboxOffsets.position.y - (Tile.TILE_SIZE / 2),
			this.dimensions.x / 4,
			this.dimensions.y + this.hitboxOffsets.dimensions.y,
		);
	}

    update(dt){
        this.hitbox.set(
			this.position.x + this.hitboxOffsets.position.x + (3 * Tile.TILE_SIZE / 4),
			this.position.y + this.hitboxOffsets.position.y - (Tile.TILE_SIZE / 2),
			this.dimensions.x / 4,
			this.dimensions.y + this.hitboxOffsets.dimensions.y,
		);
    }

    render(offset = {x: 0, y: 0}){          
        if(this.wasConsumed)
            return;

        const x = this.position.x + offset.x;
		const y = this.position.y + offset.y;

		this.sprites[Math.floor(this.currentFrame)].render(Math.floor(x), Math.floor(y));

		if (DEBUG) {
			this.hitbox.render(context);
		}
    }

    break(){
        this.isSolid = false;
        this.isCollidable = false;
        this.isBroken = true;          
        
        sounds.play(SoundName.Shatter);      

        timer.tween(this, ['currentFrame'], [3], 0.5, () => {
            this.wasConsumed = true;
        });
    }
}
