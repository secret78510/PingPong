

export default class Ball {

    constructor(ballElement, config) {
        this.ball = ballElement;
        this.offsetX = 1;
        this.offsetY = 1;
        this.tmpBallBounding = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        };
        this.rate = config.rate ?? 0.2;
        this.gameBoard = ballElement.parentElement;
        this.isOutOfBounds = false;
        this.reset();
    }
    get x() {
        return getComputedStyle(this.ball).getPropertyValue('--x');
    }
    set x(pos) {
        this.ball.style.setProperty('--x', pos);
    }
    get y() {
        return getComputedStyle(this.ball).getPropertyValue('--y');
    }
    set y(pos) {
        this.ball.style.setProperty('--y', pos);
    }
    reset() {
        this.x = '50%';
        this.y = '50%';
        //1往左2往右
        this.offsetX = Math.ceil(Math.random() * 2) === 1 ? 1 : -1;
        this.offsetY = -1;
        this.isOutOfBounds = false;
    }

    isCollisionDeg(rectangleBounding) {
        const ballBounding = this.ball.getBoundingClientRect();
        //誤差正常很小可能只有0.00X 避免出錯多個0.05
        if (
            ballBounding.top <= this.tmpBallBounding.top &&
            ballBounding.left <= this.tmpBallBounding.left &&
            Math.abs(ballBounding.top - rectangleBounding.bottom) < 0.05 &&
            Math.abs(ballBounding.left - rectangleBounding.right) < 0.05
        ) {
            return true
        } else if (
            ballBounding.top <= this.tmpBallBounding.top &&
            ballBounding.right >= this.tmpBallBounding.right &&
            Math.abs(ballBounding.top - rectangleBounding.bottom) < 0.05 &&
            Math.abs(ballBounding.right - rectangleBounding.left) < 0.05
        ) {
            return true
        }
        else if (
            ballBounding.bottom >= this.tmpBallBounding.bottom &&
            ballBounding.left <= this.tmpBallBounding.left &&
            Math.abs(ballBounding.bottom - rectangleBounding.top) < 0.05 &&
            Math.abs(ballBounding.left - rectangleBounding.right) < 0.05
        ) {
            return true
        }
        else if (
            ballBounding.bottom >= this.tmpBallBounding.bottom &&
            ballBounding.right >= this.tmpBallBounding.right &&
            Math.abs(ballBounding.bottom - rectangleBounding.top) < 0.05 &&
            Math.abs(ballBounding.right - rectangleBounding.left) < 0.05
        ) {
            return true
        }
        return false
    }
    isCollision(rectA, rectB) {
        return (
            Math.floor(rectA.left) <= Math.floor(rectB.right) &&
            Math.floor(rectA.right) >= Math.floor(rectB.left) &&
            Math.floor(rectA.top) <= Math.floor(rectB.bottom) &&
            Math.floor(rectA.bottom) >= Math.floor(rectB.top)
        )
    }
    isCollisionPaddingDeg(paddleBounding, moveDistance) {
        const ballBounding = this.ball.getBoundingClientRect();

        //只需判斷左上來撞左角跟右上來撞右角
        if (
            ballBounding.top >= this.tmpBallBounding.top &&
            ballBounding.left >= this.tmpBallBounding.left &&
            ballBounding.bottom - paddleBounding.top < moveDistance &&
            Math.abs(ballBounding.right - paddleBounding.left) < 0.05
        ) {
            return true
        } else if (
            ballBounding.top >= this.tmpBallBounding.top &&
            ballBounding.right <= this.tmpBallBounding.right &&
            ballBounding.bottom - paddleBounding.top < moveDistance &&
            Math.abs(ballBounding.left - paddleBounding.right) < 0.05
        ) {
            return true
        }
        return false
    }
    update(rectangles, score, paddle) {
        const ballBounding = this.ball.getBoundingClientRect();
        const rectanglesElement = rectangles.rectanglesElement;
        const paddleBounding = paddle.boundingRect();
        let collisionOneDegIndex = -1;
        let isOffsetX = false;
        let isOffsetY = false;
        //是否碰到船槳
        if (this.isCollision(ballBounding, paddleBounding)) {
            const moveDistance = Math.abs(this.tmpBallBounding.top - ballBounding.top);

            if (this.isCollisionPaddingDeg(paddleBounding, moveDistance)) {
                this.offsetX *= -1;
                this.offsetY *= -1;
                //超出的距離小於每次移動距離 往上方移動
            } else if (ballBounding.bottom - paddleBounding.top <= moveDistance) {
                this.offsetY = 1;
            } else if (Math.abs(ballBounding.right - paddleBounding.left) < Math.abs(ballBounding.left - paddleBounding.right)) {
                this.offsetX = 1;
            } else {
                this.offsetX = -1;
            }

        }
        //是否出界外
        if (Math.floor(ballBounding.top) >= Math.floor(this.gameBoard.getBoundingClientRect().bottom)) {
            this.isOutOfBounds = true
        }
        //是否撞到邊界
        if (Math.floor(ballBounding.right) >= Math.floor(this.gameBoard.getBoundingClientRect().right - this.gameBoard.clientLeft)) {
            this.offsetX *= -1;
        }
        if (Math.floor(ballBounding.left) <= Math.floor(this.gameBoard.getBoundingClientRect().left + this.gameBoard.clientLeft)) {
            this.offsetX *= -1;
        }
        if (Math.floor(ballBounding.top) <= Math.floor(this.gameBoard.getBoundingClientRect().top + this.gameBoard.clientTop)) {
            this.offsetY *= -1;
        }
        // //測試用
        // if (Math.floor(ballBounding.bottom) >= Math.floor(this.gameBoard.getBoundingClientRect().bottom)) {
        //     this.offsetY *= -1;
        // }

        //是否撞到磚塊
        for (let i = 0; i < rectanglesElement.length; i++) {
            if (Number(rectanglesElement[i].style.opacity) === 0) { continue }
            const rectanglesBounding = rectanglesElement[i].getBoundingClientRect();
            const moveDistance = Math.abs(this.tmpBallBounding.top - ballBounding.top);
            //是否碰到
            if (this.isCollision(ballBounding, rectanglesBounding)) {
                //球撞到角會如果旁邊有方塊 先跳過這輪並記住索引
                if (this.isCollisionDeg(rectanglesBounding)) {
                    collisionOneDegIndex = i;
                    continue
                }

                //撞到左還右邊 一次最多消兩個 不然會有bug
                if (
                    Math.floor(ballBounding.left) === Math.floor(rectanglesBounding.right) &&
                    ballBounding.left <= this.tmpBallBounding.left && !isOffsetX
                    ||
                    Math.floor(ballBounding.right) === Math.floor(rectanglesBounding.left) &&
                    ballBounding.right >= this.tmpBallBounding.right && !isOffsetX
                ) {
                    this.offsetX *= -1;
                    isOffsetX = true;
                    rectangles.isDelete(i);
                    score.textContent = Number(score.textContent) + 1000;
                }

                //下方
                if (
                    Math.floor(ballBounding.top) === Math.floor(rectanglesBounding.bottom) &&
                    ballBounding.bottom <= this.tmpBallBounding.bottom && !isOffsetY
                ) {
                    this.offsetY = -1;
                    isOffsetY = true;
                    rectangles.isDelete(i);
                    score.textContent = Number(score.textContent) + 1000;
                }
                //上方
                if (
                    ballBounding.bottom > rectanglesBounding.top &&
                    ballBounding.bottom - rectanglesBounding.top <= moveDistance &&
                    ballBounding.top >= this.tmpBallBounding.top && !isOffsetY
                ) {
                    this.offsetY = 1;
                    isOffsetY = true;
                    rectangles.isDelete(i);
                    score.textContent = Number(score.textContent) + 1000;
                }

            }
        }
        //當X跟Y都沒移動代表角旁邊沒有方塊
        if (collisionOneDegIndex !== -1 && !isOffsetX && !isOffsetY) {
            this.offsetX *= -1;
            this.offsetY *= -1;
            rectangles.isDelete(collisionOneDegIndex);
        }
        //球的前一次參數
        this.tmpBallBounding = {
            left: this.ball.getBoundingClientRect().left,
            right: this.ball.getBoundingClientRect().right,
            top: this.ball.getBoundingClientRect().top,
            bottom: this.ball.getBoundingClientRect().bottom,
        };

        //更新
        this.x = (this.x.slice(0, -1) - this.offsetX) + '%';
        this.y = (this.y.slice(0, -1) - this.offsetY) + '%';
    }
}

