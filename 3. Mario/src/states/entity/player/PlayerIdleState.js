import Animation from "../../../../lib/Animation.js";
import State from "../../../../lib/State.js";
import Player from "../../../entities/Player.js";
import Direction from "../../../enums/Direction.js";
import PlayerStateName from "../../../enums/PlayerStateName.js";
import { keys, timer } from "../../../globals.js";

export default class PlayerIdleState extends State {
	/**
	 * In this state, the player is stationary unless
	 * left or right are pressed, or if there is no
	 * collision below.
	 *
	 * @param {Player} player
	 */
	constructor(player) {
		super();

		this.player = player;
		this.animation = new Animation([0], 1);
	}

	enter() {
		this.player.currentAnimation = this.animation;
	}

	update() {
		this.player.checkLeftCollisions();
		this.player.checkRightCollisions();
		this.player.checkEntityCollisions();

		const collisionObjects = this.player.checkObjectCollisions();

		if (collisionObjects.length === 0 && !this.isTileCollisionBelow()) {
			this.player.changeState(PlayerStateName.Falling);
		}		
		if (keys.a || keys.d || keys.A || keys.D) {
			this.player.changeState(PlayerStateName.Walking);
		}

		if (keys[' ']) {
			this.player.jumpHeight += 35;
			let maxJumpHeight = 400;
			if(keys.l){
				maxJumpHeight = 500;
			}
			if(this.player.jumpHeight > maxJumpHeight){
				this.player.changeState(PlayerStateName.Jumping);
			}			
		}
		else{
			if(this.player.jumpHeight > 0){
				this.player.changeState(PlayerStateName.Jumping);
			}
		}
		
		if(keys.e && this.player.shootAgain && this.player.isFire){
			this.player.shootFireball();
			keys.e = false;
			this.player.shootAgain = false;
			timer.wait(1, () => { this.player.shootAgain = true });
		}
	}

	isTileCollisionBelow() {
		return this.player.didCollideWithTiles([Direction.BottomLeft, Direction.BottomRight]);
	}
}
