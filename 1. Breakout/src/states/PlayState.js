import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	keys,
	sounds,
	stateMachine,
	TILE_SIZE
} from "../globals.js";
import State from "./State.js";
import PowerUp from "../PowerUp.js";
import Ball from "../Ball.js";

const MAX_HEALTH = 3;
const MAX_KEYS = 3;
const PADDLE_UPGRADE_SCORE_0 = 50;
const PADDLE_UPGRADE_SCORE_1 = 100;
const PADDLE_UPGRADE_SCORE_2 = 200;

/**
 * Represents the state of the game in which we are actively playing;
 * player should control the paddle, with the ball actively bouncing between
 * the bricks, walls, and the paddle. If the ball goes below the paddle, then
 * the player should lose one point of health and be taken either to the Game
 * Over screen if at 0 health or the Serve screen otherwise.
 */
export default class PlayState extends State {
	constructor() {
		super();

		this.baseScore = 10;
	}

	enter(parameters) {
		this.paddle = parameters.paddle;
		this.bricks = parameters.bricks;
		this.health = parameters.health;
		this.key = parameters.key;
		this.score = parameters.score;
		this.lastUpgradeScore = parameters.lastUpgradeScore;
		this.balls = parameters.balls;
		this.userInterface = parameters.userInterface;
		this.level = parameters.level;
		this.powerups = [];
	}

	checkVictory() {
		/**
		 * The every method executes the provided callback function once for
		 * each element present in the array until it finds the one where callback
		 * returns a falsy value. If such an element is found, the every method
		 * immediately returns false. Otherwise, if callback returns a truthy value
		 * for all elements, every returns true.
		 *
		 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every
		 */
		return this.bricks.every(brick => !brick.inPlay);
	}

	update(dt) {
		// Pause Logic
		if (this.paused) {
			if (keys.p) {
				keys.p = false;
				this.paused = false;
				sounds.pause.play();
			}
			else {
				return;
			}
		}
		else if (keys.p) {
			keys.p = false;
			this.paused = true;
			sounds.pause.play();
			return;
		}

		/*
			Handles ball collisions
		*/
		this.balls.forEach((ball) => {
			if (ball.didCollide(this.paddle)) {
				// Flip y velocity and reset position to on top of the paddle.
				ball.dy *= -1;
				ball.y = CANVAS_HEIGHT - TILE_SIZE * 2 - TILE_SIZE / 2;
	
				// Vary the angle of the ball depending on where it hit the paddle.
				ball.handlePaddleCollision(this.paddle);
	
				sounds.paddleHit.play();
			}
		})
		

		/*
			handles breaking bricks
			handles spawning powerups
			handles score
		*/
		let lockedBricks = this.bricks.some(brick => brick.isLocked);
		this.bricks.forEach((brick) => {
			this.balls.forEach((ball) => {
				if (brick.inPlay && ball.didCollide(brick)) {
					if(!brick.isLocked || this.key > 0){
						this.score += this.baseScore * (brick.tier + 1);
						this.userInterface.update(this.health, this.score, this.key, this.level);
					}

					// Paddle Grow and Shrink logic					
					let upgradeScore = 1000000;
					switch(this.paddle.size){
						case 0:
							upgradeScore = PADDLE_UPGRADE_SCORE_0 + this.lastUpgradeScore;
							break;
						case 1:
							upgradeScore = PADDLE_UPGRADE_SCORE_1 + this.lastUpgradeScore;
							break;
						case 2:
							upgradeScore = PADDLE_UPGRADE_SCORE_2 + this.lastUpgradeScore;
							break;
					}	

					
					if(this.score >= upgradeScore){

						this.paddle.grow();
						this.lastUpgradeScore = this.score;
					}



					// Call the brick's hit function, which removes it from play.
					// Figure out key logic
					let powerup = null;
					if(this.key > 0){
						powerup = brick.hit(lockedBricks, true);
						if(brick.isLocked){
							this.key--;
						}
						this.userInterface.update(this.health, this.score, this.key, this.level);
					}
					else{
						powerup = brick.hit(lockedBricks, false);
					}
					

					if(powerup !== null){
						this.powerups.push(powerup);
					}
					

					ball.handleBrickCollision(brick);
				}
			})	
		});


		/*
			Checks for victory
		*/

		if (this.checkVictory()) {
			sounds.victory.play();

			stateMachine.change('victory', {
				level: this.level,
				paddle: this.paddle,
				health: this.health,
				score: this.score,
				key: this.key,
				lastUpgradeScore: this.lastUpgradeScore,
				key: 0, // Reset key count after each level
				balls: [new Ball()], // Reset ball count after each level
				userInterface: this.userInterface,
			});
		}


		/* 
			Handles the powerup logic
		*/
		this.powerups.forEach((powerup) => {
			if(powerup != undefined){
				
			if (powerup.isAlive && powerup.didCollide(this.paddle)) 
				{
					switch(powerup.type){
						case 0:
							// Key
							if(this.key < MAX_KEYS){
								this.key++;
							}
							break;
						case 1:
							// Extra Life			
							if(this.health < MAX_HEALTH){
								this.health++;
							}
							break;
						case 2:
							// Extra Balls		

							// Add two extra balls from the paddle
							let ball1 = new Ball();
							ball1.x = this.paddle.x + this.paddle.width / 2;
							ball1.y = this.paddle.y;

							let ball2 = new Ball();
							ball2.x = this.paddle.x + this.paddle.width / 2;
							ball2.y = this.paddle.y;

							this.balls.push(ball1);
							this.balls.push(ball2);
							break;
						default: 
							break;						
					}

					this.userInterface.update(this.health, this.score, this.key, this.level);				
					powerup.isAlive = false;				
				}
			}
			else{
				this.powerups.pop();
			}
		});


		/*
			Paddle Shrink logic
			Life lose logic
			Makes balls that fall of not alive
		*/

		this.balls.forEach((ball) => {			
			if (ball.didFall()) {	
				// Lose life if last ball
				if(this.balls.length <= 1){					
					// Paddle Shrink
					this.paddle.shrink();
					this.lastUpgradeScore = this.score;
					this.health--;
					this.userInterface.update(this.health, this.score, this.key, this.level);
					sounds.hurt.play();
				}
				// Kill off that ball
				ball.isAlive = false;
			}
		})		

		this.balls = this.balls.filter((ball) => ball.isAlive);
				
		// Check if dead
		if (this.health === 0) {
			stateMachine.change('game-over', {
				score: this.score,
			});

		}
		else if (this.balls.length === 0) {
			stateMachine.change('serve', {
				paddle: this.paddle,
				balls: [new Ball()],
				bricks: this.bricks,
				health: this.health,
				lastUpgradeScore: this.lastUpgradeScore,
				score: this.score,
				key: this.key,
				userInterface: this.userInterface,
				level: this.level,
			});
		}
		
		// Gets rid of non alive balls and powerups
		this.powerups = this.powerups.filter((powerup) => powerup.isAlive);

		// Updates the paddles, balls, paddles, bricks and powerups.
		this.paddle.update(dt);
		this.balls.forEach((ball) => {
			ball.update(dt);
		});
		this.bricks.forEach((brick) => {
			brick.update(dt);
		});	
		this.powerups.forEach((powerup) => {
			powerup.update(dt);
		});
	}

	render() {
		this.userInterface.render();
		this.paddle.render();

		this.balls.forEach((ball) => {
			ball.render();
		});

		this.bricks.forEach((brick) => {
			brick.render();
		});
		
		this.powerups.forEach((powerup) => {
			powerup.render();
		});

		if (this.paused) {
			context.save();
			context.font = "50px Joystix";
			context.fillStyle = "white";
			context.textBaseline = 'middle';
			context.textAlign = 'center';
			context.fillText(`⏸`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.5);
			context.restore();
		}
	}
}
