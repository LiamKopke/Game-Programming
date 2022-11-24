import { keys, timer } from "../../../globals.js";
import Direction from "../../../enums/Direction.js";
import PlayerStateName from "../../../enums/PlayerStateName.js";
import State from "../../../../lib/State.js";
import Animation from "../../../../lib/Animation.js";
import Player from "../../../entities/Player.js";

export default class PlayerWalkingState extends State {
	/**
	 * In this state, the player is on the ground and moving
	 * either left or right. From here, the player can go idle
	 * if nothing is being pressed and there is no X velocity.
	 * The player can fall if there is no collisions below them,
	 * and they can jump if they hit spacebar.
	 *
	 * @param {Player} player
	 */
	constructor(player) {
		super();

		this.player = player;
		this.animation = new Animation([9, 10], 0.2);
	}

	enter() {
		this.player.currentAnimation = this.animation;
	}

	update(dt) {		
		this.player.checkLeftCollisions();
		this.player.checkRightCollisions();
		this.player.checkEntityCollisions();

		const collisionObjects = this.player.checkObjectCollisions();

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

		if (!keys.a && !keys.d && Math.abs(this.player.velocity.x) === 0) {
			this.player.changeState(PlayerStateName.Idle);
		}
		else if (collisionObjects.length === 0 && !this.isTileCollisionBelow()) {
			this.player.changeState(PlayerStateName.Falling);
		}
		else if (keys.a && !keys.l) {
			this.player.moveLeft();
		}
		else if (keys.a && keys.l){
			this.player.sprintLeft();
		}
		else if (keys.d && !keys.l) {
			this.player.moveRight();
		}
		else if (keys.d && keys.l){
			this.player.sprintRight();			
		}
		else {
			this.player.stop();
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
