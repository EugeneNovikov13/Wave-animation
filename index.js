class SearchAnimation {
    #searchAnimationInterval
    #topCurrentElems
    #bottomCurrentElems
    #currentStep
    #currentColorIndex
    constructor(topRhombusNodeList, bottomRhombusNodeList) {
        this.topRhombus = Array(...topRhombusNodeList);
        this.bottomRhombus = Array(...bottomRhombusNodeList);

        this.TOP_COORDS = [-10, -20, -10, 10, 0];
        this.BOTTOM_COORDS = [10, 20, 10, -10, 0];

        this.SEARCH_ANIMATION_COLORS = ['linear-gradient(0deg, #8D150E, #8D150E)', 'linear-gradient(0deg, #F0D070, #F0D070)', 'transparent'];

        this.#searchAnimationInterval = null;
        this.#topCurrentElems = [];
        this.#bottomCurrentElems = [];
        this.#currentStep = 0;
        this.#currentColorIndex = 0;
    }
    startAnimation() {
        this.#searchAnimationInterval = setInterval(() => {
            //выбираем группу элементов для изменения
            this.#topCurrentElems = this.#selectSegments(this.topRhombus, this.#currentStep);
            this.#bottomCurrentElems = this.#selectSegments(this.bottomRhombus, this.#currentStep);

            //запускаем "волну"
            this.#changeCoords(this.#topCurrentElems, this.TOP_COORDS);
            this.#changeCoords(this.#bottomCurrentElems, this.BOTTOM_COORDS);

            //изменяем цвет очередного элемента
            if (this.#currentStep < 14) {
                this.#changeColor(this.topRhombus[this.#currentStep], this.#currentColorIndex);
                this.#changeColor(this.bottomRhombus[this.#currentStep], this.#currentColorIndex);
            }

            //инкрементируем циклические переменные
            [this.#currentStep, this.#currentColorIndex] = this.#incrementationVar(this.#currentStep, this.#currentColorIndex);
        }, 150)
    }
    stopAnimation() {
        clearInterval(this.#searchAnimationInterval);
        this.#topCurrentElems = [];
        this.#bottomCurrentElems = [];
        this.#currentStep = 0;
        this.#currentColorIndex = 0;
        this.#resetNodeList(this.topRhombus);
        this.#resetNodeList(this.bottomRhombus);
    }
    #changeCoords(segment, coords) {
        segment.reverse().forEach((el, ind) => {
            if (this.#currentStep < 13) el.style.top = `${coords[ind]}px`;
            else el.style.top = `${coords.slice(coords.length - this.#topCurrentElems.length)[ind]}px`;
        })
    }
    #selectSegments(nodeList, step) {
        return step < 5 ? nodeList.slice(0, step + 2) : nodeList.slice(step - 3, step + 2);
    }
    #changeColor(node, colorInd) {
        node.style.background = this.SEARCH_ANIMATION_COLORS[colorInd];
    }
    #resetNodeList(nodeList) {
        nodeList.forEach(node => {
            this.#changeColor(node, 2);
            this.#changeCoords([node], [0]);
        });
    }
    #incrementationVar(step, colorInd) {
        step++;
        if (step === 17) {
            step = 0;
            colorInd++;
            if (colorInd === 3) colorInd = 0;
        }
        return [step, colorInd];
    }
}

const searchAnimation = new SearchAnimation(document.querySelectorAll('.search-animation_top-line .search-animation__rhomb'),
    document.querySelectorAll('.search-animation_bottom-line .search-animation__rhomb'));
searchAnimation.startAnimation();