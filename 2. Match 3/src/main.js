/**
 * Match-3-6
 * The "Polish" Update
 *
 * Original Lua by: Colton Ogden (cogden@cs50.harvard.edu)
 * Adapted to JS by: Vikram Singh (vikram.singh@johnabbott.qc.ca)
 *
 * Match-3 has taken several forms over the years, with its roots in games
 * like Tetris in the 80s. Bejeweled, in 2001, is probably the most recognized
 * version of this game, as well as Candy Crush from 2012, though all these
 * games owe Shariki, a DOS game from 1994, for their inspiration.
 * The goal of the game is to match any three tiles of the same pattern by
 * swapping any two adjacent tiles; when three or more tiles match in a line,
 * those tiles add to the player's score and are removed from play, with new
 * tiles coming from the ceiling to replace them.
 *
 * As per previous projects, we'll be adopting a retro, NES-quality aesthetic.
 *
 * Credit for graphics:
 * @see https://opengameart.org/users/buch
 *
 * Credit for music:
 * @see http://freemusicarchive.org/music/RoccoW/
 *
 * Cool texture generator, used for background:
 * @see http://cpetry.github.io/TextureGenerator-Online/
 */

import { StateName } from "./enums.js";
import Game from "../lib/Game.js";
import GameOverState from "./states/GameOverState.js";
import {
	canvas,
	context,
	fonts,
	keys,
	images,
	sounds,
	stateMachine,
	CANVAS_WIDTH,
	CANVAS_HEIGHT,
} from "./globals.js";
import LevelTransitionState from "./states/LevelTransitionState.js";
import PlayState from "./states/PlayState.js";
import TitleScreenState from "./states/TitleScreenState.js";

// Set the dimensions of the play area.
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.setAttribute('tabindex', '1'); // Allows the canvas to have user input.

// Now that the canvas element has been prepared, we can add it to the DOM.
document.body.appendChild(canvas);

// Fetch the asset definitions from config.json.
const {
	sounds: soundDefinitions,
	images: imageDefinitions,
	fonts: fontDefinitions,
	// @ts-ignore
} = await fetch('./src/config.json').then((response) => response.json());

// Load all the assets from their definitions.
sounds.load(soundDefinitions);
images.load(imageDefinitions);
fonts.load(fontDefinitions);

// Add all the states to the state machine.
stateMachine.add(StateName.GameOver, new GameOverState());
stateMachine.add(StateName.LevelTransition, new LevelTransitionState());
stateMachine.add(StateName.Play, new PlayState());
stateMachine.add(StateName.TitleScreen, new TitleScreenState());

// Add event listeners for player input.
canvas.addEventListener('keydown', event => {
	keys[event.key] = true;
});

canvas.addEventListener('keyup', event => {
	keys[event.key] = false;
});

const game = new Game(stateMachine, context, CANVAS_WIDTH, CANVAS_HEIGHT);

game.start();

// Focus the canvas so that the player doesn't have to click on it.
canvas.focus();
