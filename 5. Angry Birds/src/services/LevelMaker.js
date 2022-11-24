import GlassBlock from "../entities/GlassBlock.js";
import WoodBlock from "../entities/WoodBlock.js";
import Ground from "../entities/Ground.js";
import Pig from "../entities/Pig.js";
import BirdType from "../enums/BirdType.js";
import Size from "../enums/Size.js";
import BirdQueue from "../objects/BirdQueue.js";
import Fortress from "../objects/Fortress.js";
import Level from "../objects/Level.js";
import { CANVAS_HEIGHT } from "../globals.js";

/**
 * Encapsulates all logic to create a level
 * that contains pigs, blocks, and birds.
 */
export default class LevelMaker {
	static START_X = 1500;

	static createLevel(level = 1) {
		switch (level) {
			case 1:
				return LevelMaker.levelOne();
			case 2:
				return LevelMaker.levelTwo();
			default:
				return LevelMaker.levelThree();
		}
	}

	static levelOne() {
		const blocks = [
			new GlassBlock(LevelMaker.START_X + GlassBlock.SPRITE_MEASUREMENTS[Size.Medium].width * 0.25, CANVAS_HEIGHT - Ground.GRASS.height - GlassBlock.SPRITE_MEASUREMENTS[Size.Medium].height, Size.Medium),
			new WoodBlock(LevelMaker.START_X + WoodBlock.SPRITE_MEASUREMENTS[Size.Medium].width * 4.75, CANVAS_HEIGHT - Ground.GRASS.height - WoodBlock.SPRITE_MEASUREMENTS[Size.Medium].height, Size.Medium),
			new WoodBlock(LevelMaker.START_X + WoodBlock.SPRITE_MEASUREMENTS[Size.Medium].width * 2.5, CANVAS_HEIGHT - Ground.GRASS.height - WoodBlock.SPRITE_MEASUREMENTS[Size.Medium].height * 2, Size.Large, WoodBlock.ANGLE_HORIZONTAL),
		];

		const pigs = [
			new Pig(LevelMaker.START_X + 110, CANVAS_HEIGHT - Ground.GRASS.height),
		];

		const birdQueue = new BirdQueue([BirdType.Red, BirdType.Yellow]);

		return new Level(1, new Fortress(blocks, pigs), birdQueue);
	}

	static levelTwo() {
		const blocks = [
			new WoodBlock(LevelMaker.START_X + WoodBlock.SPRITE_MEASUREMENTS[Size.Medium].width * 0.25, CANVAS_HEIGHT - Ground.GRASS.height - WoodBlock.SPRITE_MEASUREMENTS[Size.Medium].height, Size.Medium),
			new GlassBlock(LevelMaker.START_X + GlassBlock.SPRITE_MEASUREMENTS[Size.Medium].width * 4.75, CANVAS_HEIGHT - Ground.GRASS.height - GlassBlock.SPRITE_MEASUREMENTS[Size.Medium].height, Size.Medium),
			new WoodBlock(LevelMaker.START_X + WoodBlock.SPRITE_MEASUREMENTS[Size.Medium].width * 2.5, CANVAS_HEIGHT - Ground.GRASS.height - WoodBlock.SPRITE_MEASUREMENTS[Size.Medium].height * 2, Size.Large, WoodBlock.ANGLE_HORIZONTAL),
			new WoodBlock(LevelMaker.START_X + WoodBlock.SPRITE_MEASUREMENTS[Size.Medium].width * 0.25, CANVAS_HEIGHT - Ground.GRASS.height - WoodBlock.SPRITE_MEASUREMENTS[Size.Medium].height * 2, Size.Medium),
			new WoodBlock(LevelMaker.START_X + WoodBlock.SPRITE_MEASUREMENTS[Size.Medium].width * 4.75, CANVAS_HEIGHT - Ground.GRASS.height - WoodBlock.SPRITE_MEASUREMENTS[Size.Medium].height * 2, Size.Medium),
			new GlassBlock(LevelMaker.START_X + GlassBlock.SPRITE_MEASUREMENTS[Size.Medium].width * 2.5, CANVAS_HEIGHT - Ground.GRASS.height - GlassBlock.SPRITE_MEASUREMENTS[Size.Medium].height * 3, Size.Large, WoodBlock.ANGLE_HORIZONTAL),
		];

		const pigs = [
			new Pig(LevelMaker.START_X + 110, CANVAS_HEIGHT - Ground.GRASS.height),
			new Pig(LevelMaker.START_X + 110, CANVAS_HEIGHT - Ground.GRASS.height - Pig.SPRITE_MEASUREMENTS[0].height * 3),
			new Pig(LevelMaker.START_X + 110, CANVAS_HEIGHT - Ground.GRASS.height - Pig.SPRITE_MEASUREMENTS[0].height * 5),
		];

		const birdQueue = new BirdQueue([BirdType.Red, BirdType.Yellow, BirdType.White, BirdType.Red]);

		return new Level(2, new Fortress(blocks, pigs), birdQueue);
	}

	static levelThree() {
		const blocks = [
			new GlassBlock(LevelMaker.START_X + GlassBlock.SPRITE_MEASUREMENTS[Size.Medium].width * 0.25, CANVAS_HEIGHT - Ground.GRASS.height - GlassBlock.SPRITE_MEASUREMENTS[Size.Medium].height, Size.Medium),
			new GlassBlock(LevelMaker.START_X + GlassBlock.SPRITE_MEASUREMENTS[Size.Medium].width * 4.75, CANVAS_HEIGHT - Ground.GRASS.height - GlassBlock.SPRITE_MEASUREMENTS[Size.Medium].height, Size.Medium),
			new GlassBlock(LevelMaker.START_X + GlassBlock.SPRITE_MEASUREMENTS[Size.Medium].width * 2.5, CANVAS_HEIGHT - Ground.GRASS.height - GlassBlock.SPRITE_MEASUREMENTS[Size.Medium].height * 2, Size.Large, GlassBlock.ANGLE_HORIZONTAL),
			new WoodBlock(LevelMaker.START_X + WoodBlock.SPRITE_MEASUREMENTS[Size.Medium].width * 0.25, CANVAS_HEIGHT - Ground.GRASS.height - WoodBlock.SPRITE_MEASUREMENTS[Size.Medium].height * 2, Size.Medium),
			new WoodBlock(LevelMaker.START_X + WoodBlock.SPRITE_MEASUREMENTS[Size.Medium].width * 4.75, CANVAS_HEIGHT - Ground.GRASS.height - WoodBlock.SPRITE_MEASUREMENTS[Size.Medium].height * 2, Size.Medium),
			new WoodBlock(LevelMaker.START_X + WoodBlock.SPRITE_MEASUREMENTS[Size.Medium].width * 2.5, CANVAS_HEIGHT - Ground.GRASS.height - WoodBlock.SPRITE_MEASUREMENTS[Size.Medium].height * 3, Size.Large, WoodBlock.ANGLE_HORIZONTAL),
			new WoodBlock(LevelMaker.START_X - 100, CANVAS_HEIGHT - Ground.GRASS.height - WoodBlock.SPRITE_MEASUREMENTS[Size.Medium].height, Size.Large, WoodBlock.ANGLE_RIGHT_DIAGONAL),
			new WoodBlock(LevelMaker.START_X + WoodBlock.SPRITE_MEASUREMENTS[Size.Medium].width * 8, CANVAS_HEIGHT - Ground.GRASS.height - WoodBlock.SPRITE_MEASUREMENTS[Size.Medium].height, Size.Large, WoodBlock.ANGLE_LEFT_DIAGONAL),
		];

		const pigs = [
			new Pig(LevelMaker.START_X - 30, CANVAS_HEIGHT - Ground.GRASS.height),
			new Pig(LevelMaker.START_X + 110, CANVAS_HEIGHT - Ground.GRASS.height),
			new Pig(LevelMaker.START_X + 250, CANVAS_HEIGHT - Ground.GRASS.height),
			new Pig(LevelMaker.START_X + 110, CANVAS_HEIGHT - Ground.GRASS.height - Pig.SPRITE_MEASUREMENTS[0].height * 3),
			new Pig(LevelMaker.START_X + 110, CANVAS_HEIGHT - Ground.GRASS.height - Pig.SPRITE_MEASUREMENTS[0].height * 5),
		];

		const birdQueue = new BirdQueue([BirdType.White, BirdType.Yellow, BirdType.White, BirdType.Red, BirdType.Yellow, BirdType.Red]);

		return new Level(3, new Fortress(blocks, pigs), birdQueue);
	}
}
