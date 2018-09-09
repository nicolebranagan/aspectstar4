import Controls from '../interfaces/Controls';
import Master from '../interfaces/Master';
import Runner from '../interfaces/Runner';

enum TextBoxState {
    OPENING,
    OPEN,
};

const TEXT_BOX_WIDTH = 398;
const TEXT_BOX_HEIGHT = 99;

const DEFAULT_TEXT_STYLE = new PIXI.TextStyle({
    fontFamily: 'digitalDisco',
    fontSize: 16,
    fontWeight: '100',
    fill: 'white'
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

    drawTextBox(height : number, width : number) {
        this.graphics.lineStyle(1, 0x777777);
        this.graphics.beginFill(0x001177);
        this.graphics.drawRect(0, 0, width, height);
        this.graphics.endFill();
    }

    openTextBox() {
        this.openingHeight++;
        this.drawTextBox(this.openingHeight, TEXT_BOX_WIDTH);
        if (this.openingHeight === TEXT_BOX_HEIGHT) {
            this.state = TextBoxState.OPEN;
            this.drawText();
        } else {
            setTimeout(this.openTextBox, 1);
        }
    }

    drawText() {
        const text = new PIXI.Text('Welcome to Aspect Star 4!\nChoosing fonts is hard...', DEFAULT_TEXT_STYLE);
        text.x = 32 + 5;
        text.y = 130;
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
