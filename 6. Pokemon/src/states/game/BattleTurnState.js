import State from "../../../lib/State.js";
import SoundName from "../../enums/SoundName.js";
import { CANVAS_HEIGHT, sounds, stateStack, timer } from "../../globals.js";
import Pokemon from "../../entities/Pokemon.js";
import BattleMenuState from "./BattleMenuState.js";
import BattleMessageState from "./BattleMessageState.js";
import BattleState from "./BattleState.js";
import DialogueState from "./DialogueState.js";
import { oneInXChance } from "../../../lib/RandomNumberHelpers.js";
import Panel from "../../user-interface/elements/Panel.js";

export default class BattleTurnState extends State {
	/**
	 * When Pokemon attack each other, this state takes
	 * care of lowering their health and reflecting the
	 * changes in the UI. If the Player is victorious,
	 * the Pokemon is awarded with experience based on the
	 * opponent Pokemon's stats.
	 *
	 * @param {BattleState} battleState
	 */
	constructor(battleState) {
		super();

		this.battleState = battleState;
		this.playerPokemon = battleState.playerPokemon;
		this.opponentPokemon = battleState.opponentPokemon;

		// Determine the order of attack based on the Pokemons' speed.
		if (this.playerPokemon.speed > this.opponentPokemon.speed) {
			this.firstPokemon = this.playerPokemon;
			this.secondPokemon = this.opponentPokemon;
		}
		else if (this.playerPokemon.speed < this.opponentPokemon.speed) {
			this.firstPokemon = this.opponentPokemon;
			this.secondPokemon = this.playerPokemon;
		}
		else if (oneInXChance(2)) {
			this.firstPokemon = this.playerPokemon;
			this.secondPokemon = this.opponentPokemon;
		}
		else {
			this.firstPokemon = this.opponentPokemon;
			this.secondPokemon = this.playerPokemon;
		}
	}

	enter() {
		this.attack(this.firstPokemon, this.secondPokemon, () => {
			if (this.checkBattleEnded()) {
				stateStack.pop();
				return;
			}

			this.attack(this.secondPokemon, this.firstPokemon, () => {
				if (this.checkBattleEnded()) {
					stateStack.pop();
					return;
				}

				stateStack.pop();
				stateStack.push(new BattleMenuState(this.battleState));
			});
		});
	}

	update() {
		this.battleState.update();
	}

	/**
	 * Animate the attacking Pokemon and deal damage to the defending Pokemon.
	 * Move the attacker forward and back quickly to indicate an attack motion.
	 *
	 * @param {Pokemon} attacker
	 * @param {Pokemon} defender
	 * @param {function} callback
	 */
	attack(attacker, defender, callback) {
		stateStack.push(new BattleMessageState(`${attacker.name} attacked ${defender.name}!`, 0.5, () => {
			timer.tween(
				attacker.position,
				['x', 'y'],
				[attacker.attackPosition.x, attacker.attackPosition.y],
				0.1,
				() => {
					timer.tween(
						attacker.position,
						['x', 'y'],
						[attacker.battlePosition.x, attacker.battlePosition.y],
						0.1,
						() => this.inflictDamage(attacker, defender, callback));
				});
		}));
	}

	/**
	 * Flash the defender to indicate they were attacked.
	 * When finished, decrease the defender's health bar.
	 */
	inflictDamage(attacker, defender, callback) {
		sounds.play(SoundName.BattleDamage);

		const action = () => {
			defender.alpha = defender.alpha === 1 ? 0.5 : 1;
		};
		const interval = 0.05;
		const duration = 0.5;

		timer.addTask(action, interval, duration, () => {
			defender.alpha = 1;

			attacker.inflictDamage(defender);

			let p = defender.currentHealth / defender.health;

			if(defender === this.playerPokemon){
				timer.tween(this.battleState.playerPanel.hpBar.whiteRect,
					['x', 'w'],
					[this.battleState.playerPanel.hpBar.position.x + ((this.battleState.playerPanel.hpBar.dimensions.x - 4) * p), 
					this.battleState.playerPanel.hpBar.dimensions.x - (((this.battleState.playerPanel.hpBar.dimensions.x - 4) * p))],
					1,
					() => {
						callback();
					});		
			}
			else{
				timer.tween(this.battleState.opponentPanel.hpBar.whiteRect,
					['x', 'w'],
					[this.battleState.opponentPanel.hpBar.position.x + ((this.battleState.opponentPanel.hpBar.dimensions.x - 4) * p), 
					this.battleState.opponentPanel.hpBar.dimensions.x - (((this.battleState.opponentPanel.hpBar.dimensions.x - 4) * p))],
					1,
					() => {
						callback();
					});
			}

				
		});
	}

	checkBattleEnded() {
		if (this.playerPokemon.currentHealth <= 0) {
			this.processDefeat();
			return true;
		}
		else if (this.opponentPokemon.currentHealth <= 0) {
			this.processVictory();
			return true;
		}

		return false;
	}

	/**
	 * Tween the Player Pokemon off the bottom of the screen.
	 * Fade out and transition back to the PlayState.
	 */
	processDefeat() {
		sounds.play(SoundName.PokemonFaint);
		timer.tween(this.playerPokemon.position, ['y'], [CANVAS_HEIGHT], 0.2, () => {
			stateStack.push(new BattleMessageState(`${this.playerPokemon.name} fainted!`, 0, () => this.battleState.exitBattle()));
		});
	}

	/**
	 * Tween the Opponent Pokemon off the bottom of the screen.
	 * Process experience gained by the Player Pokemon.
	 */
	processVictory() {
		sounds.play(SoundName.PokemonFaint);
		timer.tween(this.opponentPokemon.position, ['y'], [CANVAS_HEIGHT], 0.4, () => {
			sounds.stop(SoundName.BattleLoop);
			sounds.play(SoundName.BattleVictory);
			stateStack.push(new BattleMessageState('You won!', 0, () => this.processExperience()));
		});
	}

	processExperience() {
		const experience = this.playerPokemon.calculateExperienceToAward(this.opponentPokemon);
		const message = `${this.playerPokemon.name} earned ${experience} experience points!`;


		stateStack.push(new BattleMessageState(message, 1.5, () => this.processLevelUp(experience)));
	}

	processLevelUp(experience) {
		this.playerPokemon.currentExperience += experience;

		let p = ((this.playerPokemon.currentExperience - this.playerPokemon.levelExperience) / (this.playerPokemon.targetExperience - this.playerPokemon.levelExperience) * 100) % 100;

		// Level up if we've gone over the experience threshold.
		if (this.playerPokemon.currentExperience < this.playerPokemon.targetExperience) {
			// tween position.x and dimensions.x value to end
			timer.tween(this.battleState.playerPanel.xpBar.whiteRect,
				['x', 'w'],
				[this.battleState.playerPanel.xpBar.position.x + ((this.battleState.playerPanel.xpBar.dimensions.x - 4) * p / 100), 
				this.battleState.playerPanel.xpBar.dimensions.x - (((this.battleState.playerPanel.xpBar.dimensions.x - 4) * p / 100))],
				2,
				() => {	
					this.battleState.exitBattle();
					return;
				}
			);
		}
		else{
			timer.tween(this.battleState.playerPanel.xpBar.whiteRect,
				['x', 'w'],
				[this.battleState.playerPanel.xpBar.position.x + this.battleState.playerPanel.xpBar.dimensions.x,
				0],
				1,
				() => {
					this.battleState.playerPanel.xpBar.whiteRect.x = this.battleState.playerPanel.xpBar.position.x + 2;
					this.battleState.playerPanel.xpBar.whiteRect.w = this.battleState.playerPanel.xpBar.dimensions.x - 4;
					timer.wait(0.2, () => {
						timer.tween(this.battleState.playerPanel.xpBar.whiteRect,
							['x', 'w'],
							[this.battleState.playerPanel.xpBar.position.x + ((this.battleState.playerPanel.xpBar.dimensions.x - 4) * p / 100), 
							this.battleState.playerPanel.xpBar.dimensions.x - (((this.battleState.playerPanel.xpBar.dimensions.x - 4) * p / 100))],
							2,
							() => {							
								sounds.play(SoundName.ExperienceFull);
	
								let oldHealth = this.playerPokemon.health;
								let oldAttack = this.playerPokemon.attack;
								let oldDefense = this.playerPokemon.defense;
								let oldSpeed = this.playerPokemon.speed;
								this.playerPokemon.levelUp();
						
								stateStack.push(new BattleMessageState(`${this.playerPokemon.name} grew to LV. ${this.playerPokemon.level}!`, 0, () => {
									stateStack.push(new DialogueState(`Health: ${oldHealth} > ${this.playerPokemon.health}
									Attack: ${oldAttack} > ${this.playerPokemon.attack}
									Defense: ${oldDefense} > ${this.playerPokemon.defense}
									Speed: ${oldSpeed} > ${this.playerPokemon.speed}`, Panel.LVL_UP, () => {
										this.battleState.exitBattle();
									}));
								}));	
							})
						});	
					})	
		}
	}
}
