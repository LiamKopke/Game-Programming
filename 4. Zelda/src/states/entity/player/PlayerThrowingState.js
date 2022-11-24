import Animation from "../../../../lib/Animation.js";
import State from "../../../../lib/State.js";
import Player from "../../../entities/Player.js";
import Direction from "../../../enums/Direction.js";
import PlayerStateName from "../../../enums/PlayerStateName.js";
import SoundName from "../../../enums/SoundName.js";
import { sounds, timer } from "../../../globals.js";
import Tile from "../../../objects/Tile.js";

export default class PlayerThrowingState extends State {
	/**
	 * In this state, the player throws the pot in the direction they are facing.
     * This creates a moving hitbox that will damage enemies.
	 *
	 * @param {Player} player
	 */
	constructor(player) {
		super();

		this.player = player;

		this.animation = {
			[Direction.Up]: new Animation([8, 7, 6], 0.1, 1),
			[Direction.Down]: new Animation([2, 1, 0], 0.1, 1),
			[Direction.Left]: new Animation([11, 10, 9], 0.1, 1),
			[Direction.Right]: new Animation([5, 4, 3], 0.1, 1),
		};
	}

	enter() {
		sounds.play(SoundName.Sword);
		this.player.sprites = this.player.throwingSprites;
		this.player.currentAnimation = this.animation[this.player.direction];
	}

	exit() {
	}

	update() {
		// Idle once one sword swing animation cycle has been played.
		if (this.player.currentAnimation.isDone()) {
			this.player.currentAnimation.refresh();
			this.player.hasPot = false;
			this.player.changeState(PlayerStateName.Idle);			
		}	

        // TODO: Throw the pot in the direction they are facing after half of the animation is done.
		if(this.player.currentAnimation.currentFrame == 1){
			this.player.pot.isCollidable = true;

			let pot = this.player.pot;
			pot.isThrown = true;

			switch(this.player.direction){
				case Direction.Up:
					timer.addTask(() => {
						if(!pot.isBroken){
							pot.position.y--;
						}
					}, 0.1, 0.5, () => {
						pot.break();
					});
					break;
				case Direction.Down:
					timer.addTask(() => {
						if(!pot.isBroken){
							pot.position.y++;
						}
					}, 0.1, 0.5, () => {
						pot.break();
					});
					break;
				case Direction.Left:
					timer.addTask(() => {
						if(!pot.isBroken){
							pot.position.x--;
						}
					}, 0.1, 0.5, () => {
						pot.break();
					});
					break;
				case Direction.Right:
					timer.addTask(() => {
						if(!pot.isBroken){
							pot.position.x++;
						}
					}, 0.1, 0.5, () => {
						pot.break();
					});
					break;
			}
		}

	}
}
