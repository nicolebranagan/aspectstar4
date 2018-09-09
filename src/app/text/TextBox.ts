import Master from '../interfaces/Master';
import GenericRunner from "../system/GenericRunner";

enum TextBoxState {
    OPENING,
    OPEN,
};

const TEXT_BOX_HEIGHT = 398;
const TEXT_BOX_WIDTH = 99;

export default class TextBox extends GenericRunner {
    private graphics : PIXI.Graphics
    private state : TextBoxState = TextBoxState.OPENING;
    private openingHeight : number = 0;

    constructor(master : Master) {
        super(master);

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
        this.graphics.drawRect(0, 0, height, width);
        this.graphics.endFill();
    }

    openTextBox() {
        this.openingHeight++;
        this.drawTextBox(this.openingHeight, TEXT_BOX_WIDTH);
        if (this.openingHeight === TEXT_BOX_HEIGHT) {
            this.state = TextBoxState.OPEN;
        } else {
            setTimeout(this.openTextBox, 5);
        }
    }

    update() { }
}
