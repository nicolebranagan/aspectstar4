declare var require: any 

import Controls from '../interfaces/Controls';
import Master from '../interfaces/Master';
import Runner from '../interfaces/Runner';
const FontFaceObserver = require('fontfaceobserver');

enum TextBoxState {
    OPENING,
    OPEN,
};

const TEXT_BOX_WIDTH = 398;
const TEXT_BOX_HEIGHT = 99;

const DEFAULT_TITLE_STYLE = new PIXI.TextStyle({
    fontFamily: 'chicago',
    fontSize: 16,
    fontWeight: '100',
    fill: 'white'
});

const DEFAULT_TEXT_STYLE = new PIXI.TextStyle({
    fontFamily: 'chicago',
    fontSize: 14,
    fontWeight: '100',
    fill: 0xEEEEFF,
    dropShadow: true,
    dropShadowColor: 0x000000,
    dropShadowAlpha: 0.7,
    dropShadowDistance: 2,
});

export default class TextBox implements Runner {
    public drawables : PIXI.Container;
    private master : Master;
    private graphics : PIXI.Graphics;
    private state : TextBoxState = TextBoxState.OPENING;
    private openingHeight : number = 0;

    constructor(master : Master) {
        this.master = master;
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
        this.graphics.lineStyle(1, 0x777777);
        this.graphics.beginFill(0x001177);
        this.graphics.drawRect(0, 0, width, height);
        this.graphics.endFill();
    }

    drawChildTextBox(name : string) {
        const metrics = PIXI.TextMetrics.measureText(name, DEFAULT_TITLE_STYLE);
        this.graphics.lineStyle(1, 0x777777);
        this.graphics.beginFill(0x000022);
        this.graphics.drawRoundedRect(0, -10, metrics.width+32, 24, 14);
        this.graphics.endFill();
        const nameText = new PIXI.Text(name, DEFAULT_TITLE_STYLE);
        nameText.x = 16;
        nameText.y = 118;
        this.drawables.addChild(nameText)
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
        this.resetGraphics();
        this.drawTextBox(TEXT_BOX_HEIGHT, TEXT_BOX_WIDTH);
        this.drawChildTextBox('Nicole');
        const text = new PIXI.Text('Welcome to Aspect Star 4!\nChoosing fonts is hard...\nSome more newlines...\nSo hard for it, honey\nSo hard for it, honey', DEFAULT_TEXT_STYLE);
        text.x = 8;
        text.y = 140;
        this.drawables.addChild(text)
    }

    respond(controls : Controls) : void {
        if (this.state === TextBoxState.OPEN) {
            if (controls.ButtonA || controls.ButtonB) {
                controls.release();
                this.master.removeRunner(this);
            }
        }
    }

    update() { }
}
