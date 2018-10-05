import Character from "./Character";
import Point from '../../system/Point';
import { LevelOptions } from "../Level";

export default class Victory extends Character {
    constructor(point : Point, interactionKey : string) {
        super(point, 1, interactionKey, true);
    }

    activate(levelOptions : LevelOptions) {
        if (this.interaction) {
            levelOptions.setInteraction(this.interaction);
        }
        this.spoken = true;
        this.timer = 0;
    }

    deactivate(levelOptions : LevelOptions) {
        levelOptions.win(true);
    }
};
