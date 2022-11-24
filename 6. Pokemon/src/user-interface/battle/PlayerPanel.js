import Colour from "../../enums/Colour.js";
import { context } from "../../globals.js";
import Pokemon from "../../entities/Pokemon.js";
import UserInterfaceElement from "../UserInterfaceElement.js";
import Panel from "../elements/Panel.js";
import ProgressBar from "../elements/ProgressBar.js";

export default class BattlePlayerPanel extends Panel {
	/**
	 * The Panel displayed beside the Player's Pokemon
	 * during battle that displays their name, health,
	 * level and experience.
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @param {number} height
	 * @param {Pokemon} pokemon
	 * @param {object} options Options for the super Panel.
	 */
	constructor(x, y, width, height, pokemon, options = {}) {
		super(x, y, width, height, options);

		this.pokemon = pokemon;
		this.hpBar = new ProgressBar(x + 0.25, y + 1.1, {percentage: this.pokemon.currentHealth / this.pokemon.health * 100});
		this.xpBar = new ProgressBar(x + 0.25, y + 2.55, {isXp: true, percentage: (this.pokemon.currentExperience - this.pokemon.levelExperience) / (this.pokemon.targetExperience - this.pokemon.levelExperience) * 100});
	}

	render() {
		super.render();

		this.renderStatistics();
		this.hpBar.changeProgress(this.pokemon.currentHealth / this.pokemon.health * 100);
		this.xpBar.changeProgress((this.pokemon.currentExperience - this.pokemon.levelExperience) / (this.pokemon.targetExperience - this.pokemon.levelExperience) * 100);
		this.hpBar.render();
		this.xpBar.render();
	}

	/**
	 * All the magic number offsets here are to
	 * arrange all the pieces nicely in the space.
	 */
	renderStatistics() {
		context.save();
		context.textBaseline = 'top';
		context.fillStyle = Colour.Black;
		context.font = `${UserInterfaceElement.FONT_SIZE}px ${UserInterfaceElement.FONT_FAMILY}`;
		context.fillText(
			this.pokemon.name.toUpperCase(),
			this.position.x + 15,
			this.position.y + 12
		);
		context.textAlign = 'right';
		context.fillText(
			`Lv${this.pokemon.level}`,
			this.position.x + this.dimensions.x - 10,
			this.position.y + 12
		);		
		context.fillText(
			`${this.pokemon.getHealthMeter()}`,
			this.position.x + this.dimensions.x - 10,
			this.position.y + this.dimensions.y - 25
		);
		context.restore();
	}
}
