import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import Size from "../enums/Size.js";
import { images } from "../globals.js";
import Block from "./Block.js";

export default class GlassBlock extends Block {
	static SPRITE_MEASUREMENTS = {
		[Size.Small]: { x: 390, y: 0, width: 35, height: 70 },
		[Size.Medium]: { x: 355, y: 105, width: 35, height: 110 },
		[Size.Large]: { x: 390, y: 70, width: 35, height: 220 },
	};

	/**
	 * One GlassBlock that is used to build a pig fortress. The GlassBlock
	 * is a dynamic (i.e. non-static) Matter body meaning it is affected by the
	 * world's physics. We've set the friction high to mimic a
	 * wood GlassBlock that is not usually slippery.
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {number} size The size of the GlassBlock using the Size enum.
	 * @param {number} angle The angle of the GlassBlock in radians.
	 */
	constructor(x, y, size, angle) {
		super(x, y, size, GlassBlock.SPRITE_MEASUREMENTS[size].width, GlassBlock.SPRITE_MEASUREMENTS[size].height, angle);
		this.blockSprites = GlassBlock.generateBlockSprites();
		this.sprites = this.blockSprites;
		this.body.damageThreshold = this.body.mass * 5;
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
				images.get(ImageName.Glass),
				GlassBlock.SPRITE_MEASUREMENTS[Size.Small].x,
				GlassBlock.SPRITE_MEASUREMENTS[Size.Small].y,
				GlassBlock.SPRITE_MEASUREMENTS[Size.Small].width,
				GlassBlock.SPRITE_MEASUREMENTS[Size.Small].height
			),
			new Sprite(
				images.get(ImageName.Glass),
				GlassBlock.SPRITE_MEASUREMENTS[Size.Medium].x,
				GlassBlock.SPRITE_MEASUREMENTS[Size.Medium].y,
				GlassBlock.SPRITE_MEASUREMENTS[Size.Medium].width,
				GlassBlock.SPRITE_MEASUREMENTS[Size.Medium].height
			),
			new Sprite(
				images.get(ImageName.Glass),
				GlassBlock.SPRITE_MEASUREMENTS[Size.Large].x,
				GlassBlock.SPRITE_MEASUREMENTS[Size.Large].y,
				GlassBlock.SPRITE_MEASUREMENTS[Size.Large].width,
				GlassBlock.SPRITE_MEASUREMENTS[Size.Large].height
			),
		];
	}
}
