

export default class Paddle {
    constructor(paddleElement) {
        this.paddle = paddleElement;
        this.width = paddleElement.clientWitdh;
        this.offsetX = 0;
        this.percent = 50;
    }
    boundingRect() {
        return this.paddle.getBoundingClientRect();
    }
    reset(box) {
        const boxBounding = box.getBoundingClientRect();
        const paddleHalfWidthPercent = (this.boundingRect().width / 2) / (boxBounding.width - box.clientLeft * 2) * 100;
        const paddleCenter = 50 - paddleHalfWidthPercent;
        this.paddle.style.left = paddleCenter + '%';
        this.percent = paddleCenter;
    }
    get clientWidth() {
        return this.paddle.clientWidth
    }
    set x(pos) {
        this.offsetX = pos;
    }
    get x() {
        return this.offsetX
    }
    updatePercent(box) {
        const boxBounding = box.getBoundingClientRect();
        this.percent = Number(this.x) / (boxBounding.width - box.clientLeft * 2) * 100;
    }

    update() {
        this.width = this.paddle.clientWidth;
        this.paddle.style.left = this.percent + '%';
    }
}