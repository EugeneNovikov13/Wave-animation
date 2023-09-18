class Animation {
    #animationInterval
    #topCurrentElems
    #bottomCurrentElems
    #currentStep
    #currentColorIndex
    #NODES_NUMBER
    #SEGMENT_SIZE
    constructor(container) {
        this.container = container;
        this.topRhombus = null;
        this.bottomRhombus = null;

        this.#NODES_NUMBER = 14;
        this.#SEGMENT_SIZE = 5;

        this.TOP_COORDS = [-10, -20, -10, 10, 0];
        this.BOTTOM_COORDS = [10, 20, 10, -10, 0];

        this.ANIMATION_COLORS = ['linear-gradient(0deg, #8D150E, #8D150E)', 'linear-gradient(0deg, #F0D070, #F0D070)', 'transparent'];

        this.#animationInterval = null;
        this.#topCurrentElems = [];
        this.#bottomCurrentElems = [];
        this.#currentStep = 0;
        this.#currentColorIndex = 0;
    }
    renderLines() {
        const animationTopLine = document.createElement('div');
        animationTopLine.classList.add('animation-line', 'top');

        const animationBottomLine = document.createElement('div');
        animationBottomLine.classList.add('animation-line', 'bottom');

        this.#renderRhombus(animationTopLine);
        this.#renderRhombus(animationBottomLine);

        this.container.append(animationTopLine, animationBottomLine);

        this.topRhombus = Array(...document.querySelectorAll('.animation-line.top .rhombus'));
        this.bottomRhombus = Array(...document.querySelectorAll('.animation-line.bottom .rhombus'));
    }

    #renderRhombus(node) {
        for (let i = 0; i < this.#NODES_NUMBER; i++) {
            const rhombus = document.createElement('div');
            rhombus.classList.add('rhombus');
            node.append(rhombus);
        }
    }

    startAnimation() {
        this.renderLines();
        this.#animationInterval = setInterval(() => {
            //выбираем группу элементов для изменения
            this.#topCurrentElems = this.#selectSegments(this.topRhombus, this.#currentStep);
            this.#bottomCurrentElems = this.#selectSegments(this.bottomRhombus, this.#currentStep);

            //запускаем "волну"
            this.#changeCoords(this.#topCurrentElems, this.TOP_COORDS);
            this.#changeCoords(this.#bottomCurrentElems, this.BOTTOM_COORDS);

            //изменяем цвет очередного элемента
            if (this.#currentStep < this.#NODES_NUMBER) {
                this.#changeColor(this.topRhombus[this.#currentStep], this.#currentColorIndex);
                this.#changeColor(this.bottomRhombus[this.#currentStep], this.#currentColorIndex);
            }

            //инкрементируем циклические переменные
            [this.#currentStep, this.#currentColorIndex] = this.#incrementationVar(this.#currentStep, this.#currentColorIndex);
        }, 150)
    }
    stopAnimation() {
        clearInterval(this.#animationInterval);
        this.#topCurrentElems = [];
        this.#bottomCurrentElems = [];
        this.#currentStep = 0;
        this.#currentColorIndex = 0;
        this.#resetNodeList(this.topRhombus);
        this.#resetNodeList(this.bottomRhombus);
        this.container.innerHTML = '';
    }
    #changeCoords(segment, coords) {
        segment.reverse().forEach((el, ind) => {
            if (this.#currentStep < this.#NODES_NUMBER - 1) el.style.top = `${coords[ind]}px`;
            else el.style.top = `${coords.slice(coords.length - this.#topCurrentElems.length)[ind]}px`;
        })
    }
    #selectSegments(nodeList, step) {
        return step < this.#SEGMENT_SIZE ? nodeList.slice(0, step + 2) : nodeList.slice(step - this.#SEGMENT_SIZE + 2, step + 2);
    }
    #changeColor(node, colorInd) {
        node.style.background = this.ANIMATION_COLORS[colorInd];
    }
    #resetNodeList(nodeList) {
        nodeList.forEach(node => {
            this.#changeColor(node, 2);
            this.#changeCoords([node], [0]);
        });
    }
    #incrementationVar(step, colorInd) {
        step++;
        if (step === this.#NODES_NUMBER + 3) {
            step = 0;
            colorInd++;
            if (colorInd === this.ANIMATION_COLORS.length) colorInd = 0;
        }
        return [step, colorInd];
    }
}

const animationWrapper = document.querySelector('.animation');
const startButton = document.querySelector('.start-button');
const animation = new Animation(animationWrapper);

const animationSwitcher = () => {
    if (startButton.textContent === 'START') {
        startButton.textContent = 'STOP';
        animation.startAnimation();
        return;
    }

    startButton.textContent = 'START';
    animation.stopAnimation();
}

startButton.addEventListener('click', animationSwitcher);
