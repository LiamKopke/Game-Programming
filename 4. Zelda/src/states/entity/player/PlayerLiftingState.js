import Animation from "../../../../lib/Animation.js";
import State from "../../../../lib/State.js";
import Player from "../../../entities/Player.js";
import Direction from "../../../enums/Direction.js";
import PlayerStateName from "../../../enums/PlayerStateName.js";
import SoundName from "../../../enums/SoundName.js";
import { sounds } from "../../../globals.js";

export default class PlayerLiftingState extends State {
	/**
	 * In this state, the player picks up a pot in
	 * front of them.
	 *
	 * @param {Player} player
	 */
	constructor(player) {
		super();

		this.player = player;

		this.animation = {
			[Direction.Up]: new Animation([6, 7, 8], 0.1, 1),
			[Direction.Down]: new Animation([0, 1, 2], 0.1, 1),
			[Direction.Left]: new Animation([9, 10, 11], 0.1, 1),
			[Direction.Right]: new Animation([3, 4, 5], 0.1, 1),
		};
	}

	enter() {
		sounds.play(SoundName.Sword);
		this.player.sprites = this.player.liftingSprites;
		this.player.currentAnimation = this.animation[this.player.direction];
		this.setPotLiftHitbox();
	}

	exit() {
		this.player.liftHitbox.set(0, 0, 0, 0);
	}

	update() {
		// Idle once one lift animation cycle has been played.
		if (this.player.currentAnimation.isDone()) {
			this.player.currentAnimation.refresh();

			if(this.player.hasPot){
				this.player.changeState(PlayerStateName.CarryingIdle);
			}
			else{	
				this.player.changeState(PlayerStateName.Idle);
			}
		}
	}

	/**
	 * Creates a hitbox based the player's position and direction.
	 */
	 setPotLiftHitbox() {
		let hitboxX, hitboxY, hitboxWidth, hitboxHeight;

		// The magic numbers here are to adjust the hitbox offsets to make it line up with the sword animation.
		if (this.player.direction === Direction.Left) {
			hitboxWidth = this.player.dimensions.x / 2;
			hitboxHeight = this.player.dimensions.x / 2 - 2;
			hitboxX = this.player.position.x - hitboxWidth;
			hitboxY = this.player.position.y + this.player.dimensions.y;
		}
		else if (this.player.direction === Direction.Right) {
			hitboxWidth = this.player.dimensions.x / 2;
			hitboxHeight = this.player.dimensions.x / 2 - 2;
			hitboxX = this.player.position.x + this.player.dimensions.x;
			hitboxY = this.player.position.y + this.player.dimensions.y;
		}
		else if (this.player.direction === Direction.Up) {
			hitboxWidth = this.player.dimensions.x;
			hitboxHeight = this.player.dimensions.x / 2;
			hitboxX = this.player.position.x;
			hitboxY = this.player.position.y + this.player.dimensions.y / 2;
		}
		else {
			hitboxWidth = this.player.dimensions.x;
			hitboxHeight = this.player.dimensions.x / 2;
			hitboxX = this.player.position.x;
			hitboxY = this.player.position.y + this.player.dimensions.y + 4;
		}

		this.player.liftHitbox.set(hitboxX, hitboxY, hitboxWidth, hitboxHeight);
	}
}
