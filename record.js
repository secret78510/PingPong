
export default class Record {
    constructor(recordElement, recordListElement) {
        this.record = recordElement;
        this.recordListElement = recordListElement;
        this.maxLength = 5;
        this.recordItems = JSON.parse(window.localStorage.getItem('recordItems')) || [];
        this.reset();
    }

    addRecordItem(index, score) {
        const li = document.createElement('li');
        const indexElement = document.createElement('div');
        const scoreElement = document.createElement('div');
        indexElement.textContent = index + '.';
        scoreElement.textContent = score;
        li.append(indexElement);
        li.append(scoreElement)
        this.recordListElement.append(li)

    }

    show() {
        this.record.classList.remove('close');
    }
    hide() {
        this.record.classList.add('close');
    }
    reset() {
        this.recordItems = JSON.parse(window.localStorage.getItem('recordItems')) || [];
        while (this.recordListElement.children.length !== 0) {
            this.recordListElement.children[0].remove();
        }
    }

    update(score) {
        const arr = [...this.recordItems];
        arr.push(score);
        arr.sort((a, b) => b - a);

        while (arr.length > this.maxLength) {
            arr.pop();
        }

        for (let i = 0; i < arr.length; i++) {
            this.addRecordItem(i + 1, arr[i])
        }
        window.localStorage.setItem('recordItems', JSON.stringify(arr));
    }
}