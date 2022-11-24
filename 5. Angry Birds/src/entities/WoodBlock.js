import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import Size from "../enums/Size.js";
import { images } from "../globals.js";
import Block from "./Block.js";

export default class WoodBlock extends Block {
	static SPRITE_MEASUREMENTS = {
		[Size.Small]: { x: 320, y: 110, width: 35, height: 70 },
		[Size.Medium]: { x: 355, y: 355, width: 35, height: 110 },
		[Size.Large]: { x: 390, y: 70, width: 35, height: 220 },
	};

	/**
	 * One WoodBlock that is used to build a pig fortress. The WoodBlock
	 * is a dynamic (i.e. non-static) Matter body meaning it is affected by the
	 * world's physics. We've set the friction high to mimic a
	 * wood WoodBlock that is not usually slippery.
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {number} size The size of the WoodBlock using the Size enum.
	 * @param {number} angle The angle of the WoodBlock in radians.
	 */
	constructor(x, y, size, angle) {
		super(x, y, size, WoodBlock.SPRITE_MEASUREMENTS[size].width, WoodBlock.SPRITE_MEASUREMENTS[size].height, angle);
		this.blockSprites = WoodBlock.generateBlockSprites();
		this.sprites = this.blockSprites;
	}

	update(dt) {
		super.update(dt);

		if (this.shouldCleanUp) {
			this.playRandomBreakSound();
		}
	}

	static generateBlockSprites() {
		return [
			new Sprite(
				images.get(ImageName.Wood),
				WoodBlock.SPRITE_MEASUREMENTS[Size.Small].x,
				WoodBlock.SPRITE_MEASUREMENTS[Size.Small].y,
				WoodBlock.SPRITE_MEASUREMENTS[Size.Small].width,
				WoodBlock.SPRITE_MEASUREMENTS[Size.Small].height
			),
			new Sprite(
				images.get(ImageName.Wood),
				WoodBlock.SPRITE_MEASUREMENTS[Size.Medium].x,
				WoodBlock.SPRITE_MEASUREMENTS[Size.Medium].y,
				WoodBlock.SPRITE_MEASUREMENTS[Size.Medium].width,
				WoodBlock.SPRITE_MEASUREMENTS[Size.Medium].height
			),
			new Sprite(
				images.get(ImageName.Wood),
				WoodBlock.SPRITE_MEASUREMENTS[Size.Large].x,
				WoodBlock.SPRITE_MEASUREMENTS[Size.Large].y,
				WoodBlock.SPRITE_MEASUREMENTS[Size.Large].width,
				WoodBlock.SPRITE_MEASUREMENTS[Size.Large].height
			),
		];
	}
}
