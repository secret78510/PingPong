import Ball from './ball.js'
import Paddle from './paddle.js';
import Record from './record.js';
import Rectangle from './rectangle.js'

let level = 1;
const maxLevel = 3;
const mp3 = document.querySelector('.mp3');
const start = document.querySelector('.start');
const round = document.querySelector('.round');

const ball = new Ball(document.querySelector(".ball"), { rate: 0.4 });
const paddle = new Paddle(document.querySelector(".paddle"));
const rectangles = new Rectangle(document.querySelector(".box"), level);
const record = new Record(
    document.querySelector(".record"),
    document.querySelector(".record ol")
)
const box = document.querySelector(".box");
const again = document.querySelector(".again");
const score = document.querySelector('.score span');
let touchStartX = 0;


function updateView() {

    ball.update(rectangles, score, paddle);
    paddle.update();
    if (rectangles.isClean()) {
        //等同關卡才彈出紀錄版
        if (level === maxLevel) {
            record.update(score.textContent);
            record.show();
        } else {
            level += 1;
            roundChange(level);
            rectangles.level = level;
            rectangles.reset();
            ball.reset();
            window.requestAnimationFrame(updateView);
        }
        //是否出界
    } else if (ball.isOutOfBounds) {
        record.update(score.textContent);
        record.show();
    } else {
        window.requestAnimationFrame(updateView);
    }
}


window.addEventListener('load', function () {
    const box = document.querySelector(".box");
    rectangles.reset();
    paddle.reset(box);
})

window.addEventListener('mousemove', function (e) {
    const boxBounding = box.getBoundingClientRect();
    const paddleHalfWidth = paddle.clientWidth / 2;
    const paddleBounding = paddle.boundingRect();

    if (boxBounding.left >= e.clientX - paddleHalfWidth) {
        paddle.x = 0;
        //計算右邊邊界所以border不用乘2
    } else if (boxBounding.right - box.clientLeft <= e.clientX + paddleHalfWidth) {
        paddle.x = boxBounding.width - paddleBounding.width - box.clientLeft * 2;
    } else {
        //winodw的推移 - 球的左邊 - 船槳的一半 - box的邊線
        paddle.x = e.clientX - boxBounding.left - paddleHalfWidth - box.clientLeft;
    }
    //用百分比算 拖拉視窗不會跑掉
    paddle.updatePercent(box);
})


window.addEventListener('touchstart', function (e) {
    touchStartX = e.targetTouches[0].clientX;
})

window.addEventListener('touchmove', function (e) {
    const boxBounding = box.getBoundingClientRect();
    const moveDistance = boxBounding.width / 100 * 2;
    //不使用paddle.x 而是使用DOM因為多拉視窗 吃到DOM會更新
    const paddleElement = document.querySelector(".paddle");
    if (touchStartX >= e.targetTouches[0].clientX) {
        paddle.x = isOutBound(Number(paddleElement.offsetLeft) - moveDistance);
        touchStartX = e.targetTouches[0].clientX;
    } else {
        paddle.x = isOutBound(Number(paddleElement.offsetLeft) + moveDistance);
        touchStartX = e.targetTouches[0].clientX;
    }
    paddle.updatePercent(box);
})

window.addEventListener('keydown', function (e) {
    const boxBounding = box.getBoundingClientRect();
    const moveDistance = boxBounding.width / 100 * 10;
    const paddleElement = document.querySelector(".paddle");
    if (e.key === 'ArrowLeft') {
        paddle.x = isOutBound(Number(paddleElement.offsetLeft) - moveDistance);
    } else if (e.key === 'ArrowRight') {
        paddle.x = isOutBound(Number(paddleElement.offsetLeft) + moveDistance);
    }
    paddle.updatePercent(box);
})

again.addEventListener('click', function () {
    reset();
})

start.addEventListener('click', function () {
    start.classList.add('close');
    reset();
})

function isOutBound(move) {
    const boxBounding = box.getBoundingClientRect();
    const paddleBounding = paddle.boundingRect();
    if (move <= 0) {
        return 0
        //因寬度計算border要*2
    } else if (move + paddleBounding.width >= boxBounding.width - box.clientLeft * 2) {
        return boxBounding.width - paddleBounding.width - box.clientLeft * 2;
    } else {
        return move
    }
}


function reset() {
    const box = document.querySelector(".box");
    level = 1;
    roundChange(level);
    record.hide();
    rectangles.level = level;
    record.reset();
    ball.reset();
    rectangles.reset();
    paddle.reset(box);
    score.textContent = '0';
    updateView();
    mp3.load();
    mp3.play();
    round.textContent = 'First Round';
}

function roundChange(level = 1) {
    switch (level) {
        case 1:
            round.textContent = 'First Round';
            break
        case 2:
            round.textContent = 'Second Round';
            break
        case 3:
            round.textContent = 'Third Round';
            break
        default:
            round.textContent = 'First Round';
            break
    }
}