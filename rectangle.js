

export default class Rectangle {
    constructor(boxElement, level) {
        this.boxBoard = boxElement;
        this.colors = ['primary', 'danger', 'warning']
        this.curlevel = level;
        this.rectanglesElement = document.getElementsByClassName('rectangle');
        this.reset();
    }
    set level(num) {
        this.curlevel = num;
    }

    get level() {
        return this.curlevel;
    }
    reset(length = 20) {
        length = length + this.level * 10;
        while (this.rectanglesElement[0] !== undefined) {
            this.rectanglesElement[0].remove()
        }

        for (let i = 0; i < length; i++) {
            const div = document.createElement('div');
            div.className = 'rectangle';
            div.style.opacity = 1;
            this.randomColor(div);
            this.boxBoard.append(div);
        }

    }
    randomColor(rectangle) {
        rectangle.classList.add(this.colors[Math.floor(Math.random() * 3)])
    }
    isDelete(index) {
        if (this.rectanglesElement[index].classList.contains('warning')) {
            this.rectanglesElement[index].classList.remove('warning');
            this.rectanglesElement[index].classList.add('danger');
        } else if (this.rectanglesElement[index].classList.contains('danger')) {
            this.rectanglesElement[index].classList.remove('danger');
            this.rectanglesElement[index].classList.add('primary');
        } else {
            this.delete(index)
        }
    }
    delete(index) {
        this.rectanglesElement[index].style.opacity = 0;
    }
    isClean() {

        let isAllClean = true;
        for (let i = 0; i < this.rectanglesElement.length; i++) {
            if (Number(this.rectanglesElement[i].style.opacity) === 1) {
                isAllClean = false;
            }
        }
        return isAllClean
    }
}