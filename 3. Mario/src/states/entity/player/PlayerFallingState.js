import { CANVAS_HEIGHT, keys, timer } from "../../../globals.js";
import Direction from "../../../enums/Direction.js";
import PlayerStateName from "../../../enums/PlayerStateName.js";
import State from "../../../../lib/State.js";
import Animation from "../../../../lib/Animation.js";
import Player from "../../../entities/Player.js";

export default class PlayerFallingState extends State {
	/**
	 * In this state, the player is travelling down towards the ground.
	 * Once they hit the ground, they are either idle if X velocity is zero,
	 * or walking if left or right are being pressed.
	 *
	 * @param {Player} player
	 */
	constructor(player) {
		super();

		this.player = player;
		this.animation = new Animation([2], 1);
	}

	enter() {
		this.player.currentAnimation = this.animation;
	}

	update(dt) {
		this.player.velocity.add(this.player.gravityForce, dt);
		this.player.checkEntityCollisions(entity => this.onEntityCollision(entity));
		this.player.checkObjectCollisions(object => this.onObjectCollision(object));

		if (this.player.position.y > CANVAS_HEIGHT) {
			this.player.isDead = true;
		}

		if (this.isTileCollisionBelowRight() || this.isTileCollisionBelowLeft()) {
			this.onTileCollision();
		}
		else if (keys.a && !keys.l) {
			this.player.moveLeft();
			this.player.checkRightCollisions();
		}
		else if (keys.a && keys.l){
			this.player.sprintLeft();
			this.player.checkRightCollisions();
		}
		else if (keys.d && !keys.l) {
			this.player.moveRight();
			this.player.checkRightCollisions();
		}
		else if (keys.d && keys.l){
			this.player.sprintRight();			
			this.player.checkRightCollisions();
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

	isTileCollisionBelowRight() {
		const tilesToCheck = this.player.getTilesByDirection([Direction.RightBottom, Direction.RightTop]);
		const doTilesExist = tilesToCheck.every((tile) => tile != undefined);

		return doTilesExist && tilesToCheck[0].isCollidable() && !tilesToCheck[1].isCollidable();
	}

	isTileCollisionBelowLeft() {
		const tilesToCheck = this.player.getTilesByDirection([Direction.LeftBottom, Direction.LeftTop]);
		const doTilesExist = tilesToCheck.every((tile) => tile != undefined);

		return doTilesExist && tilesToCheck[0].isCollidable() && !tilesToCheck[1].isCollidable();
	}

	onTileCollision() {
		const tileBottomRight = this.player.getTilesByDirection([Direction.BottomRight])[0];

		if (tileBottomRight) {
			this.player.position.y = tileBottomRight.position.y * tileBottomRight.dimensions.x - this.player.dimensions.y;
			this.player.velocity.y = 0;
		}

		// If we get a collision beneath us, go into either walking or idle.
		if (keys.a || keys.d || Math.abs(this.player.velocity.x) > 0) {
			this.player.changeState(PlayerStateName.Walking);
		}
		else {
			this.player.changeState(PlayerStateName.Idle);
		}
	}

	onEntityCollision(entity) {
		if (!entity.isDead) {
			this.player.velocity.y = this.player.jumpForce.y / 2;
			entity.isDead = true;
		}
	}

	onObjectCollision(object) {
		if (object.isSolid && object.getEntityCollisionDirection(this.player) === Direction.Up) {
			this.player.position.y = object.position.y - this.player.dimensions.y;
			this.player.velocity.y = 0;

			if (keys.a || keys.d || Math.abs(this.player.velocity.x) > 0) {
				this.player.changeState(PlayerStateName.Walking);
			}
			else {
				this.player.changeState(PlayerStateName.Idle);
			}
		}
		else if (object.isConsumable) {
			object.onConsume(this.player);
		}
	}
}
