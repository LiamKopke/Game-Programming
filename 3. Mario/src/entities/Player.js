import Entity from "./Entity.js";
import Sprite from "../../lib/Sprite.js";
import StateMachine from "../../lib/StateMachine.js";
import Vector from "../../lib/Vector.js";
import Tile from "../objects/Tile.js";
import Direction from "../enums/Direction.js";
import ImageName from "../enums/ImageName.js";
import SoundName from "../enums/SoundName.js";
import PlayerStateName from "../enums/PlayerStateName.js";
import { images, keys, sounds, CANVAS_HEIGHT } from "../globals.js";
import Level from "../objects/Level.js";
import PlayerFallingState from "../states/entity/player/PlayerFallingState.js";
import PlayerIdleState from "../states/entity/player/PlayerIdleState.js";
import PlayerJumpingState from "../states/entity/player/PlayerJumpingState.js";
import PlayerWalkingState from "../states/entity/player/PlayerWalkingState.js";
import PlayerDyingState from "../states/entity/player/PlayerDyingState.js";
import GameObject from "../objects/GameObject.js";
import Fireball from "../entities/Fireball.js";

export default class Player extends Entity {
	static WIDTH = 16;
	static HEIGHT = 20;
	static TOTAL_SPRITES = 11;
	static VELOCITY_LIMIT = 100;

	/**
	 * The hero character the player controls in the map.
	 * Has the ability to jump and will collide into tiles
	 * that are collidable.
	 *
	 * @param {Vector} dimensions The height and width of the player.
	 * @param {Vector} position The x and y coordinates of the player.
	 * @param {Vector} velocityLimit The maximum speed of the player.
	 * @param {Level} level The level that the player lives in.
	 */
	constructor(dimensions, position, velocityLimit, level) {
		super(dimensions, position, velocityLimit, level);

		this.gravityForce = new Vector(0, 1000);
		this.speedScalar = 5;
		this.frictionScalar = 0.9;

		this.jumpForce = new Vector(0, -350);

		this.sprites = Player.generateSprites();

		this.stateMachine = new StateMachine();		
		this.stateMachine.add(PlayerStateName.Walking, new PlayerWalkingState(this));
		this.stateMachine.add(PlayerStateName.Jumping, new PlayerJumpingState(this));
		this.stateMachine.add(PlayerStateName.Dying, new PlayerDyingState(this));
		this.stateMachine.add(PlayerStateName.Idle, new PlayerIdleState(this));
		this.stateMachine.add(PlayerStateName.Falling, new PlayerFallingState(this));

		this.changeState(PlayerStateName.Falling);

		this.score = 0;
		this.isBig = false;
		this.isFire = false;
		this.isStar = false;
		this.shootAgain = true;
		this.jumpHeight = 0;
	}

	/**
	 * Loops through the character sprite sheet and
	 * retrieves each sprite's location in the sheet.
	 *
	 * @returns The array of sprite objects.
	 */
	static generateSprites() {
		const sprites = [];

		for (let i = 0; i < Player.TOTAL_SPRITES; i++) {
			sprites.push(new Sprite(
				images.get(ImageName.Character),
				i * Player.WIDTH,
				0,
				Player.WIDTH,
				Player.HEIGHT,
			));
		}

		return sprites;
	}

	static generateBigSprites() {
		const sprites = [];

		for (let i = 0; i < Player.TOTAL_SPRITES; i++) {
			sprites.push(new Sprite(
				images.get(ImageName.CharacterBig),
				i * Player.WIDTH,
				0,
				Player.WIDTH,
				Player.HEIGHT * 1.2,
			));
		}

		return sprites;
	}

	static generateFireSprites() {
		const sprites = [];

		for (let i = 0; i < Player.TOTAL_SPRITES; i++) {
			sprites.push(new Sprite(
				images.get(ImageName.CharacterPink),
				i * Player.WIDTH,
				0,
				Player.WIDTH,
				Player.HEIGHT,
			));
		}

		return sprites;
	}

	static generateStarSprites() {
		const sprites = [];

		for (let i = 0; i < Player.TOTAL_SPRITES; i++) {
			sprites.push(new Sprite(
				images.get(ImageName.CharacterBlue),
				i * Player.WIDTH,
				0,
				Player.WIDTH,
				Player.HEIGHT,
			));
		}

		return sprites;
	}

	shootFireball(){		
		const fb = new Fireball(
			new Vector(Tile.SIZE, Tile.SIZE),
			new Vector(this.position.x, this.position.y),
			new Vector(100, 0),
			this.level, 
			this.direction
		);

		this.level.entities.push(fb);
	}

	moveLeft() {
		this.direction = Direction.Left;
		this.velocity.x = Math.max(this.velocity.x - this.speedScalar * this.frictionScalar, -this.velocityLimit.x);
		
	}

	sprintLeft(){
		this.direction = Direction.Left;
		this.velocity.x = Math.max(this.velocity.x - this.speedScalar * this.frictionScalar - 50, -this.velocityLimit.x - 50);
	}

	moveRight() {
		this.direction = Direction.Right;
		this.velocity.x = Math.min(this.velocity.x + this.speedScalar * this.frictionScalar, this.velocityLimit.x);		
	}

	sprintRight(){
		this.direction = Direction.Right;
		this.velocity.x = Math.min(this.velocity.x + this.speedScalar * this.frictionScalar + 50, this.velocityLimit.x + 50);
	}

	stop() {
		if (Math.abs(this.velocity.x) > 0) {
			this.velocity.x *= this.frictionScalar;
		}

		if (Math.abs(this.velocity.x) < 0.1) {
			this.velocity.x = 0;
		}
	}

	/**
	 * Restrict the player from:
	 *   1. Going off the left edge of the map.
	 *   2. Overlapping with collidable tiles on the left.
	 *   3. Overlapping with collidable solid game objects on the left.
	 */
	checkLeftCollisions() {
		if (this.position.x < 0) {
			this.velocity.x = 0;
			this.position.x = 0;
		}
		else if (this.didCollideWithTiles([Direction.LeftBottom, Direction.LeftTop])) {
			const tileLeftTop = this.getTilesByDirection([Direction.LeftTop])[0];
			this.velocity.x = 0;

			if (tileLeftTop) {
				this.position.x = tileLeftTop.position.x * tileLeftTop.dimensions.x + tileLeftTop.dimensions.x - 1;
			}
		}
		else {
			const collisionObjects = this.checkObjectCollisions();

			if (collisionObjects.length > 0 && collisionObjects[0].getEntityCollisionDirection(this) === Direction.Right) {
				this.velocity.x = 0;
				this.position.x = collisionObjects[0].position.x + collisionObjects[0].dimensions.x - 1;
			}
		}
	}

	/**
	 * Restrict the player from:
	 *   1. Going off the right edge of the map.
	 *   2. Overlapping with collidable tiles on the right.
	 *   3. Overlapping with collidable solid game objects on the right.
	 */
	checkRightCollisions() {
		if (this.position.x > this.level.tilemap.canvasDimensions.x - this.dimensions.x) {
			this.velocity.x = 0;
			this.position.x = this.level.tilemap.canvasDimensions.x - this.dimensions.x;
		}
		else if (this.didCollideWithTiles([Direction.RightBottom, Direction.RightTop])) {
			const tileRightTop = this.getTilesByDirection([Direction.RightTop])[0];
			this.velocity.x = 0;

			if (tileRightTop) {
				this.position.x = tileRightTop.position.x * tileRightTop.dimensions.x - this.dimensions.x;
			}
		}
		else {
			const collisionObjects = this.checkObjectCollisions();

			if (collisionObjects.length > 0 && collisionObjects[0].getEntityCollisionDirection(this) === Direction.Left) {
				this.velocity.x = 0;
				this.position.x = collisionObjects[0].position.x - this.dimensions.x;
			}
		}
	}

	/**
	 * Check if we've collided with any entities and die if so.
	 *
	 * @param {Entity} entity
	 */
	onEntityCollision(entity) {
		if (!entity.isDead) {
			if(entity instanceof Fireball){
				return;
			}
			if(this.isBig || this.isFire){
				this.normal();
			}
			else if(this.isStar){
				entity.isDead = true;
				return;
			}
			else{			
				sounds.play(SoundName.Death);
				this.changeState(PlayerStateName.Dying);
			}
		}
	}

	/**
	 * Loops through all the entities in the current level and checks
	 * if the player collided with any of them. If so, run onCollision().
	 * If no onCollision() function was passed, use the one from this class.
	 *
	 * @param {function} onCollision What should happen when the collision occurs.
	 * @returns The collision objects returned by onCollision().
	 */
	checkEntityCollisions(onCollision = entity => this.onEntityCollision(entity)) {
		this.level.entities.forEach((entity) => {
			if (this === entity) {
				return;
			}

			if (entity.didCollideWithEntity(this)) {
				onCollision(entity);
			}
		});
	}

	/**
	 * Collects the object if the game object is solid or collidable.
	 * Fires onConsume() if the game object is consumable.
	 *
	 * @param {GameObject} object
	 * @returns All solid and collidable game objects that were collided with.
	 */
	onObjectCollision(object) {
		const collisionObjects = [];

		if (object.isSolid || object.isCollidable) {
			collisionObjects.push(object);
		}
		else if (object.isConsumable) {
			object.onConsume(this);
		}

		return collisionObjects;
	}

	/**
	 * Loops through all the game objects in the current level and checks
	 * if the player collided with any of them. If so, run onCollision().
	 * If no onCollision() function was passed, use the one from this class.
	 *
	 * @param {function} onCollision What should happen when the collision occurs.
	 * @returns The collision objects returned by onCollision().
	 */
	checkObjectCollisions(onCollision = object => this.onObjectCollision(object)) {
		let collisionObjects = [];

		this.level.objects.forEach((object) => {
			if (object.didCollideWithEntity(this)) {
				collisionObjects = onCollision(object);
			}
		});

		return collisionObjects;
	}

	normal(){
		this.isFire = false;
		this.isStar = false;
		this.makeSmall();
		this.sprites = Player.generateSprites();
	}

	mushroom(){		
		if(!this.isBig){
			this.position.y -= 4;
			this.dimensions = new Vector(Tile.SIZE, 24);
		}
		this.isBig = true;
		this.isFire = false;
		this.isStar = false;
		this.sprites = Player.generateBigSprites();
	}	

	flower(){
		this.makeSmall();
		this.isFire = true;
		this.isStar = false;
		this.sprites = Player.generateFireSprites();
	}

	star(){
		this.makeSmall();
		this.isStar = true;
		this.isFire = false;
		this.sprites = Player.generateStarSprites();
	}

	makeSmall(){
		this.dimensions = new Vector(Tile.SIZE, 20);
		this.isBig = false;
	}
}