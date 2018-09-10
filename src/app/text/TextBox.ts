declare var require: any 

import Controls from '../interfaces/Controls';
import Master from '../interfaces/Master';
import Runner from '../interfaces/Runner';
import Interaction from '../interfaces/Interaction';
const FontFaceObserver = require('fontfaceobserver');
import { DEFAULT_TEXT_STYLE, DEFAULT_TITLE_STYLE, CustomFonts } from './Fonts';

enum TextBoxState {
    OPENING,
    OPEN,
};

const TEXT_BOX_WIDTH = 398;
const TEXT_BOX_HEIGHT = 99;

export default class TextBox implements Runner {
    public drawables : PIXI.Container;
    private master : Master;
    private graphics : PIXI.Graphics;
    private state : TextBoxState = TextBoxState.OPENING;
    private openingHeight : number = 0;
    private interaction : Interaction;
    private marker : number = 0;

    constructor(master : Master, interaction : Interaction) {
        this.master = master;
        this.interaction = interaction;
        this.drawables = new PIXI.Container();

        this.graphics = new PIXI.Graphics();
        this.graphics.x = 1;
        this.graphics.y = 125;
        this.graphics.width = TEXT_BOX_WIDTH;
        this.graphics.height = TEXT_BOX_HEIGHT;
        this.drawables.addChild(this.graphics);
        this.drawTextBox(0, TEXT_BOX_WIDTH);

        this.openTextBox = this.openTextBox.bind(this);
        this.openTextBox();
    }

    resetGraphics() {
        if (this.graphics) {
            this.drawables.removeChild(this.graphics);
        }
        this.graphics = new PIXI.Graphics();
        this.graphics.x = 1;
        this.graphics.y = 125;
        this.graphics.width = TEXT_BOX_WIDTH;
        this.graphics.height = TEXT_BOX_HEIGHT;
        this.drawables.addChild(this.graphics);
    }

    drawTextBox(height : number, width : number) {
        this.graphics.lineStyle(1, 0x750020);
        this.graphics.beginFill(0xCD0055);
        this.graphics.drawRect(0, 0, width, height);
        this.graphics.endFill();
    }

    drawChildTextBox(name : string) {
        const metrics = PIXI.TextMetrics.measureText(name, DEFAULT_TITLE_STYLE);
        this.graphics.lineStyle(1, 0x777777);
        this.graphics.beginFill(0x000022);
        this.graphics.drawRoundedRect(0, -10, (2*metrics.width)+32, 24, 14);
        this.graphics.endFill();
        const nameText = new PIXI.Text(name, DEFAULT_TITLE_STYLE);
        nameText.x = 16;
        nameText.y = 117;
        this.drawables.addChild(nameText)
        nameText.scale.x = 2;
        nameText.scale.y = 2;
    }

    openTextBox() {
        this.openingHeight++;
        this.drawTextBox(this.openingHeight, TEXT_BOX_WIDTH);
        if (this.openingHeight === TEXT_BOX_HEIGHT) {
            this.state = TextBoxState.OPEN;
            const observer = new FontFaceObserver(DEFAULT_TEXT_STYLE.fontFamily);
            observer.load().then(() => this.drawText())
        } else {
            setTimeout(this.openTextBox, 1);
        }
    }

    drawText() {
        const child = this.interaction[this.marker];
        const font = child.font ? CustomFonts[child.font] : DEFAULT_TEXT_STYLE;
        this.resetGraphics();
        this.drawTextBox(TEXT_BOX_HEIGHT, TEXT_BOX_WIDTH);
        this.drawChildTextBox(child.name);
        const text = new PIXI.Text(child.text, font);
        text.x = 8;
        text.y = 140;
        text.scale.x = 2;
        text.scale.y = 2;
        this.drawables.addChild(text)
    }

    respond(controls : Controls) : void {
        if (this.state === TextBoxState.OPEN) {
            if (controls.ButtonA || controls.ButtonB) {
                this.marker++;
                controls.release();
                if (this.marker === this.interaction.length) {
                    this.master.removeRunner(this);
                } else {
                    this.drawText();
                }
            }
        }
    }

    update() { }
}
