import Animation from "../../../../lib/Animation.js";
import State from "../../../../lib/State.js";
import Player from "../../../entities/Player.js";
import Direction from "../../../enums/Direction.js";
import PlayerStateName from "../../../enums/PlayerStateName.js";
import { keys } from "../../../globals.js";
import Room from "../../../objects/Room.js";

export default class PlayerCarryingWalkingState extends State {
	/**
	 * In this state, the player can move around using the
	 * directional keys. From here, the player can go idle
	 * if no keys are being pressed. The player can also throw
	 * their pot if they press enter.
	 *
	 * @param {Player} player
	 */
	constructor(player) {
		super();

		this.player = player;
		this.animation = {
			[Direction.Up]: new Animation([8, 9, 10, 11], 0.2),
			[Direction.Down]: new Animation([0, 1, 2, 3], 0.2),
			[Direction.Left]: new Animation([12, 13, 14, 15], 0.2),
			[Direction.Right]: new Animation([4, 5, 6, 7], 0.2),
		};
	}

	enter() {
		this.player.sprites = this.player.carryingSprites;
		this.player.currentAnimation = this.animation[this.player.direction];
	}

	update(dt) {
		this.handleMovement(dt);
		this.checkForThrow();
	}

	handleMovement(dt) {
		this.player.currentAnimation = this.animation[this.player.direction];
		
		// [this.player.position.x - (this.player.dimensions.x / 2), this.player.position.y - 3 * this.player.dimensions.y / 4]

		if (keys.s) {
			this.player.direction = Direction.Down;
			this.player.position.y += this.player.speed * dt;
			this.player.pot.position.y = this.player.position.y - 3 * this.player.dimensions.y / 4;

			if (this.player.position.y + this.player.dimensions.y >= Room.BOTTOM_EDGE) {
				this.player.position.y = Room.BOTTOM_EDGE - this.player.dimensions.y;
				this.player.pot.position.y = this.player.position.y - 3 * this.player.dimensions.y / 4;
			}
		}
		else if (keys.d) {
			this.player.direction = Direction.Right;
			this.player.position.x += this.player.speed * dt;
			this.player.pot.position.x = this.player.position.x - (this.player.dimensions.x / 2);			

			if (this.player.position.x + this.player.dimensions.x >= Room.RIGHT_EDGE) {
				this.player.position.x = Room.RIGHT_EDGE - this.player.dimensions.x;
				this.player.pot.position.x = this.player.position.x - (this.player.dimensions.x / 2);
			}
		}
		else if (keys.w) {
			this.player.direction = Direction.Up;
			this.player.position.y -= this.player.speed * dt;
			this.player.pot.position.y = this.player.position.y - 3 * this.player.dimensions.y / 4;

			if (this.player.position.y <= Room.TOP_EDGE - this.player.dimensions.y) {
				this.player.position.y = Room.TOP_EDGE - this.player.dimensions.y;
				this.player.pot.position.y = this.player.position.y - 3 * this.player.dimensions.y / 4;
			}
		}
		else if (keys.a) {
			this.player.direction = Direction.Left;
			this.player.position.x -= this.player.speed * dt;
			this.player.pot.position.x = this.player.position.x - (this.player.dimensions.x / 2);

			if (this.player.position.x <= Room.LEFT_EDGE) {
				this.player.position.x = Room.LEFT_EDGE;
				this.player.pot.position.x = this.player.position.x - (this.player.dimensions.x / 2);
			}
		}
		else {
			this.player.changeState(PlayerStateName.CarryingIdle);
		}
	}

	checkForThrow() {
		if (keys.Enter) {
			this.player.changeState(PlayerStateName.Throwing);
		}
	}
}
