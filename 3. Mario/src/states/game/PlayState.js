import Camera from "../../../lib/Camera.js";
import State from "../../../lib/State.js";
import Vector from "../../../lib/Vector.js";
import { roundedRectangle } from "../../../lib/DrawingHelpers.js";
import GameStateName from "../../enums/GameStateName.js";
import SoundName from "../../enums/SoundName.js";
import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	sounds,
	stateMachine
} from "../../globals.js";
import LevelMaker from "../../services/LevelMaker.js";
import Flagpole from "../../objects/Flagpole.js";
import Snail from "../../entities/Snail.js";
import Player from "../../entities/Player.js";
import Fireball from "../../entities/Fireball.js";

export default class PlayState extends State {
	constructor() {
		super();
	}

	enter(parameters) {
		this.level = parameters.level;
		this.player = parameters.player;

		this.camera = new Camera(
			this.player,
			this.level.tilemap.canvasDimensions,
			new Vector(CANVAS_WIDTH, CANVAS_HEIGHT),
		);

		this.level.addEntity(this.player);
		this.level.addCamera(this.camera);

		sounds.play(SoundName.Music);
	}

	exit() {
		sounds.stop(SoundName.Music);
	}

	update(dt) {
		this.level.update(dt);
		this.camera.update();

		// Check if fireball kills anything
		const fireballs = this.level.entities.some(entity => entity instanceof Fireball);
		// If we do have fireballs
		if (fireballs) {
			// Check if fireball kills anything
			this.level.entities.forEach(entity => {
				if (entity instanceof Fireball) {
					// Keep the fireball
					let fireball = entity;
					// Loop over all snails
					this.level.entities.forEach(entity => {
						if (entity instanceof Snail) {
							let snail = entity;

							// If snail and fireball collide, then kill em both
							if (!fireball.isDead && fireball.didCollideWithEntity(snail)) {
								fireball.isDead = true;
								snail.isDead = true;
							}
						}
					});
				}
			});
		}

		// Check if there are any snails left
		const snails = this.level.entities.some((entities) => entities instanceof Snail);

		// Check if the flagpole already exists
		const flagpole = this.level.objects.some((object) => object instanceof Flagpole);

		// If there are no snails and no flagpole, then spawn a flagpole
		if(!snails && !flagpole){
			// Start location of flagpole to see if solid ground
			let flagX = this.player.position.x + 32;
			let flagY = 0;

			// Make sure that flagpole is within the bounds of the level
			if(flagX > this.level.tilemap.canvasDimensions.x){
				flagX = this.player.position.x - 32;
			}

			let flagTile;

			// Loops from top to bottom, then goes left.
			// Since it starts from the top, then it will pick the top tile
			while(flagX > 0){
				try{
					flagTile = this.level.tilemap.pointToTile(flagX, flagY);
					if(flagTile.isCollidable()){
						break;
					}
				}
				catch(e){
				}		
				
				flagY += 16;

				// Reset y and decrement x so that it goes left
				if(flagY > this.level.tilemap.canvasDimensions.y){
					flagX -= 16;
					flagY = 0;
				}			
			}

			flagTile = this.level.tilemap.pointToTile(flagX, flagY);	
			// Now that a valid tile is selected, add the flagpole to the level
			this.level.addObject(new Flagpole(new Vector(Flagpole.WIDTH, Flagpole.HEIGHT), new Vector(flagTile.position.x * 16, flagTile.position.y * 16 - 48)));
		}

		// Check if level is over
		// Goes over all objects, if one of them is a flagpole and is consumed, then make new level
		this.level.objects.forEach(object => {
			// if the object is a flagpole, then make new level
			if(object instanceof Flagpole){
				// Check collision
				if(object.didCollideWithEntity(this.player)){	
					this.level.entities = [];
					this.level.objects = [];
					let score = this.player.score;

					this.level = LevelMaker.generateLevel();

					this.player = new Player(
						new Vector(Player.WIDTH, Player.HEIGHT),
						new Vector(Player.WIDTH, 0),
						new Vector(Player.VELOCITY_LIMIT, Player.VELOCITY_LIMIT),
						this.level,
					);
					this.player.score = score;

					LevelMaker.generateSnails(this.level, this.player);

					this.camera = new Camera(
						this.player,
						this.level.tilemap.canvasDimensions,
						new Vector(CANVAS_WIDTH, CANVAS_HEIGHT),
					);
			
					this.level.addEntity(this.player);
					this.level.addCamera(this.camera);
				}
			}
		});
		

		if (this.player.isDead) {
			stateMachine.change(GameStateName.TitleScreen);
		}
	}

	render() {
		this.renderViewport();
		this.renderScore();
	}

	renderViewport() {
		context.save();
		context.translate(-this.camera.position.x, this.camera.position.y);
		this.level.render();
		context.restore();
	}

	renderScore() {
		context.save();
		context.fillStyle = 'rgb(255, 255, 255, 0.5)';
		roundedRectangle(context, 10, 10, 160, 30, 10, true, false);
		context.fillStyle = 'navy';
		context.font = '16px Joystix';
		context.textAlign = 'left';
		context.fillText(`Score:`, 20, 30);
		context.textAlign = 'right';
		context.fillText(`${String(this.player.score).padStart(5, '0')}`, 160, 30);
		context.restore();
	}
}
