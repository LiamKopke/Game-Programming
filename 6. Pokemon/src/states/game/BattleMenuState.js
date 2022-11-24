import State from "../../../lib/State.js";
import { getRandomPositiveInteger } from "../../../lib/RandomNumberHelpers.js";
import { stateStack } from "../../globals.js";
import Menu from "../../user-interface/elements/Menu.js";
import BattleMessageState from "./BattleMessageState.js";
import BattleState from "./BattleState.js";
import BattleTurnState from "./BattleTurnState.js";

export default class BattleMenuState extends State {
	static MENU_OPTIONS = {
		Fight: "FIGHT",
		Run: "RUN",
	}

	/**
	 * Represents the menu during the battle that the Player can choose an action from.
	 *
	 * @param {BattleState} battleState
	 */
	constructor(battleState) {
		super();

		this.battleState = battleState;

		const items = [
			{ text: BattleMenuState.MENU_OPTIONS.Fight, onSelect: () => this.fight() },
			{ text: BattleMenuState.MENU_OPTIONS.Run, onSelect: () => this.run() },
		];

		this.battleMenu = new Menu(
			Menu.BATTLE_MENU.x,
			Menu.BATTLE_MENU.y,
			Menu.BATTLE_MENU.width,
			Menu.BATTLE_MENU.height,
			items,
		);
	}

	update() {
		this.battleMenu.update();
		this.battleState.update();
	}

	render() {
		this.battleMenu.render();
	}

	fight() {
		stateStack.pop();
		stateStack.push(new BattleTurnState(this.battleState));
	}

	run() {
		let rand = getRandomPositiveInteger(1, 100);
		let possible = false;
		if(this.battleState.opponentPokemon.health > this.battleState.playerPokemon.health) {
			if(rand < 50)
				possible = true;
		}
		else{
			if(rand < 80)
				possible = true;
		}
		if(possible){
			stateStack.push(new BattleMessageState(`You got away safely!`, 0, () =>{
				stateStack.pop();
				this.battleState.exitBattle();
			}));
		}
		else{
			stateStack.push(new BattleMessageState(`You could not get away`, 2));
		}	
	}
}
