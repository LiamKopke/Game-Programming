import { SoundName, StateName } from "../enums.js";
import {
	context,
	keys,
	sounds,
	stateMachine,
	timer,
} from "../globals.js";
import { roundedRectangle } from "../../lib/DrawingHelpers.js";
import State from "../../lib/State.js";
import Board from "../objects/Board.js";
import Tile from "../objects/Tile.js";
import { TilePattern } from "../enums.js";

export default class PlayState extends State {
	constructor() {
		super();

		// Position in the grid which we're currently highlighting.
		this.cursor = { boardX: 0, boardY: 0 };

		// Tile we're currently highlighting (preparing to swap).
		this.selectedTile = null;

		this.level = 1;

		// Increases as the player makes matches.
		this.score = 0;

		// Score we have to reach to get to the next level.
		this.scoreGoal = 250;

		// How much score will be incremented by per match tile.
		this.baseScore = 5;

		// How much scoreGoal will be scaled by per level.
		this.scoreGoalScale = 1.25;

		/**
		 * The timer will countdown and the player must try and
		 * reach the scoreGoal before time runs out. The timer
		 * is reset when entering a new level.
		 */
		this.maxTimer = 60; //TODO
		this.timer = this.maxTimer;

		// Hints
		this.hints = 3;
	}

	enter(parameters) {
		this.board = parameters.board;
		this.score = parameters.score;
		this.level = parameters.level;
		this.scene = parameters.scene;
		this.timer = this.maxTimer;
		this.hints = parameters.hints;
		this.scoreGoal *= Math.floor(this.level * this.scoreGoalScale);

		this.startTimer();
	}

	exit() {
		timer.clear();
		sounds.pause(SoundName.Music3);
	}

	update(dt) {
		this.scene.update(dt);
		this.checkGameOver();
		this.checkVictory();
		this.updateCursor();

		// If we've pressed enter, select or deselect the currently highlighted tile.
		if (keys.Enter) {
			keys.Enter = false;

			this.selectTile();
		}

		// Hint: If h key is pressed, display a possible combination
		if (keys.h) {
			keys.h = false;

			if(this.hints > 0){
				this.hints--;
				this.displayHint();
			}
		}

		timer.update(dt);
	}

	render() {
		this.scene.render();
		this.board.render();

		if (this.selectedTile) {
			this.renderSelectedTile();
		}
		

		this.renderHint();

		this.renderCursor();
		this.renderUserInterface();
	}

	updateCursor() {
		let x = this.cursor.boardX;
		let y = this.cursor.boardY;

		if (keys.w) {
			keys.w = false;
			y = Math.max(0, y - 1);
			sounds.play(SoundName.Select);
		}
		else if (keys.s) {
			keys.s = false;
			y = Math.min(Board.SIZE - 1, y + 1);
			sounds.play(SoundName.Select);
		}
		else if (keys.a) {
			keys.a = false;
			x = Math.max(0, x - 1);
			sounds.play(SoundName.Select);
		}
		else if (keys.d) {
			keys.d = false;
			x = Math.min(Board.SIZE - 1, x + 1);
			sounds.play(SoundName.Select);
		}

		this.cursor.boardX = x;
		this.cursor.boardY = y;
	}

	selectTile() {
		const highlightedTile = this.board.tiles[this.cursor.boardY][this.cursor.boardX];

		/**
		 * The `?.` syntax is called "optional chaining" which allows you to check
		 * a property on an object even if that object is `null` at the time.
		 *
		 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
		 */
		const tileDistance = Math.abs(this.selectedTile?.boardX - highlightedTile.boardX) + Math.abs(this.selectedTile?.boardY - highlightedTile.boardY);

		// If nothing is selected, select current tile.
		if (!this.selectedTile) {
			this.selectedTile = highlightedTile;
		}
		// Remove highlight if already selected.
		else if (this.selectedTile === highlightedTile) {
			this.selectedTile = null;
		}
		/**
		 * If the difference between X and Y combined of this selected
		 * tile vs the previous is not equal to 1, also remove highlight.
		 */
		else if (tileDistance > 1) {
			sounds.play(SoundName.Error);
			this.selectedTile = null;
		}
		// Otherwise, do the swap, and check for matches.
		else {
			this.swapTiles(highlightedTile);
		}
	}

	displayHint(){
		const tiles = this.board.tiles;
		for(let y = 0; y < tiles.length; y++) {
			for(let x = 0; x < tiles[y].length; x++) {
				const hTile = tiles[y][x];
				const tileAbove = tiles[y - 1]?.[x];
				const tileBelow = tiles[y + 1]?.[x];
				const tileLeft = tiles[y][x - 1];
				const tileRight = tiles[y][x + 1];

				if(tileAbove && this.checkMatch(hTile, tileAbove)){
					this.saveHint(hTile, tileAbove);
					return;
				}
				else if(tileBelow && this.checkMatch(hTile, tileBelow)){
					this.saveHint(hTile, tileBelow);
					return;
				}
				else if(tileLeft && this.checkMatch(hTile, tileLeft)){
					this.saveHint(hTile, tileLeft);
					return;
				}
				else if(tileRight && this.checkMatch(hTile, tileRight)){
					this.saveHint(hTile, tileRight);
					return;
				}
			}
		}

	}

	
	checkMatch(tile1, tile2){
		// Make a new board with same values to swap on so that nothing is affected on play board
		const newBoard = new Board();
		newBoard.tiles = this.board.tiles.map(row => row.map(tile => new Tile(tile.x, tile.y, tile.colour, tile.pattern, tile.sprites)));

		// Swap the two tiles on the new board		
		newBoard.tiles[tile1.boardY][tile1.boardX] = tile2;
		newBoard.tiles[tile2.boardY][tile2.boardX] = tile1;

		// Check for matches on the new board
		newBoard.calculateMatches();

		// return if there are any matches
		return newBoard.matches.length > 0;
	}
	// Draw a rounded rectangle around both of the tiles	
	saveHint(tile1, tile2){
		console.log("hint:");
		console.log(tile1);
		console.log(tile2);
		// Find where to start drawing the rectangle (closest to left and top)
		const x = Math.min(tile1.x, tile2.x) + this.board.x;
		const y = Math.min(tile1.y, tile2.y) + this.board.y;

		// Find the width and height of the rectangle
		const width = Math.abs(tile1.x - tile2.x) + Tile.SIZE;
		const height = Math.abs(tile1.y - tile2.y) + Tile.SIZE;

		this.hintx = x;
		this.hinty = y;
		this.hintwidth = width;
		this.hintheight = height;
	}

	renderHint(){
		if(this.hintx){
			context.save();			
			context.strokeStyle = 'lime';
			context.lineWidth = 4;

			roundedRectangle(
				context,
				this.hintx,
				this.hinty,
				this.hintwidth,
				this.hintheight
			);
			context.restore();
		}		
	}

	async swapTiles(highlightedTile) {
		await this.board.swapTiles(this.selectedTile, highlightedTile);
		let tile1 = this.selectedTile;			
		this.selectedTile = null;
		await this.calculateMatches(tile1, highlightedTile);	
	}

	renderSelectedTile() {
		context.save();
		context.fillStyle = 'rgb(255, 255, 255, 0.5)';
		roundedRectangle(
			context,
			this.selectedTile.x + this.board.x,
			this.selectedTile.y + this.board.y,
			Tile.SIZE,
			Tile.SIZE,
			10,
			true,
			false,
		);
		context.restore();
	}

	renderCursor() {
		context.save();
		context.strokeStyle = 'white';
		context.lineWidth = 4;

		// Use board position * Tile.SIZE so that the cursor doesn't get tweened during a swap.
		roundedRectangle(
			context,
			this.cursor.boardX * Tile.SIZE + this.board.x,
			this.cursor.boardY * Tile.SIZE + this.board.y,
			Tile.SIZE,
			Tile.SIZE,
		);
		context.restore();
	}

	renderUserInterface() {
		context.fillStyle = 'rgb(56, 56, 56, 0.9)';
		roundedRectangle(
			context,
			50,
			this.board.y,
			225,
			Board.SIZE * Tile.SIZE,
			5,
			true,
			false,
		);

		context.fillStyle = 'white';
		context.font = '25px Joystix';
		context.textAlign = 'left';
		context.fillText(`Level:`, 70, this.board.y + 35);
		context.fillText(`Score:`, 70, this.board.y + 85);
		context.fillText(`Goal:`, 70, this.board.y + 135);
		context.fillText(`Hints:`, 70, this.board.y + 185);		
		context.fillText(`Timer:`, 70, this.board.y + 235);
		context.textAlign = 'right';
		context.fillText(`${this.level}`, 250, this.board.y + 35);
		context.fillText(`${this.score}`, 250, this.board.y + 85);
		context.fillText(`${this.scoreGoal}`, 250, this.board.y + 135);
		context.fillText(`${this.hints}`, 250, this.board.y + 185);
		context.fillText(`${this.timer}`, 250, this.board.y + 235);
	}


	/**
	 * Calculates whether any matches were found on the board and tweens the needed
	 * tiles to their new destinations if so. Also removes tiles from the board that
	 * have matched and replaces them with new randomized tiles, deferring most of this
	 * to the Board class.
	 */
	async calculateMatches(tile1 = null, tile2 = null) {
		// Get all matches for the current board.
		this.board.calculateMatches();

		// If no matches, then no need to proceed with the function.
		if (this.board.matches.length === 0) {		
			await this.board.swapTiles(tile1, tile2);
			return;
		}

		// Get rid of hint
		this.hintx = null;
		this.hinty = null;
		this.hintwidth = null;
		this.hintheight = null;

		// Add two seconds to the timer and make sure it will keep going until it reaches 0
		this.board.matches.forEach((match) => {
			this.timer++;
		})

		this.calculateScore();

		// Remove any matches from the board to create empty spaces.
		this.board.removeMatches();

		await this.placeNewTiles();

		/**
		 * Recursively call function in case new matches have been created
		 * as a result of falling blocks once new blocks have finished falling.
		 */
		await this.calculateMatches();
	}

	calculateScore() {		
		this.board.matches.forEach((match) => {
			match.forEach((tile) => {
				if(tile.calculated === false){
					if(tile.pattern === TilePattern.Star){
						// Star would get 15k points and break early levels
						this.score += Math.pow(this.baseScore, this.level);
					}
					else{
						// Scaled per level for easier end game
						this.score += Math.pow(this.baseScore, tile.pattern + 1) * this.level;						
					}
				}					
				tile.calculated = true;	
			});
		})
	};

	async placeNewTiles() {
		// Get an array with tween values for tiles that should now fall as a result of the removal.
		const tilesToFall = this.board.getFallingTiles();

		// Tween all the falling blocks simultaneously.
		await Promise.all(tilesToFall.map((tile) => {
			timer.tweenAsync(tile.tile, tile.parameters, tile.endValues, 0.1);
		}));

		// Get an array with tween values for tiles that should replace the removed tiles.
		const newTiles = this.board.getNewTiles();

		// Tween the new tiles falling one by one for a more interesting animation.
		for (const tile of newTiles) {
			await timer.tweenAsync(tile.tile, tile.parameters, tile.endValues, 0.02);
		}
	}

	startTimer(time = Number.MAX_SAFE_INTEGER) {
		// Decrement the timer every second.
		timer.addTask(() => {
			this.timer--;

			if (this.timer <= 5) {
				sounds.play(SoundName.Clock);
			}
		}, 1, time);
	}

	checkVictory() {
		if (this.score < this.scoreGoal) {
			return;
		}

		sounds.play(SoundName.NextLevel);

		stateMachine.change(StateName.LevelTransition, {
			level: this.level + 1,
			score: this.score,
			scene: this.scene,
		});
	}

	checkGameOver() {
		if (this.timer > 0) {
			return;
		}
		timer.clear();

		sounds.play(SoundName.GameOver);

		stateMachine.change(StateName.GameOver, {
			score: this.score,
			scene: this.scene,
		});
	}
}
