const CHOICES_CONTAINER_CLASSNAME = 'upwork-custom-image-slider-choices-container';
const IMAGE_CONTAINER_CLASSNAME = 'upwork-custom-image-slider-images-container';
const IMAGE_SLIDER_CLASSNAME = 'upwork-custom-image-slider';

class QualtricsImageSlider {
    constructor(containerId, config) {
        // Pull configuration
        this.config = config;
        this.currentQuestionChoices = config.currentQuestionInfo.Choices;

        // Initialize Slider
        this.container = document.getElementById(containerId);
        this.images = this.container.getElementsByClassName(IMAGE_CONTAINER_CLASSNAME)[0];
        this.initialize(this.container);
    }

    initialize(container) {
        var choicesContainer = this.generateChoicesContainer();
        var slider = this.generateSlider(choicesContainer);

        this.choicesContainer = choicesContainer;
        this.slider = slider;

        container.appendChild(choicesContainer);
        container.appendChild(slider);
    }

    generateSlider(choicesContainer) {
        let questionChoices = this.currentQuestionChoices;

        const numChoices = Object.keys(questionChoices).length;
        const middleIndex = Math.floor((numChoices - 1)/2);

        var slider = document.createElement('input');
        slider.setAttribute('class', IMAGE_SLIDER_CLASSNAME);
        slider.setAttribute('type', 'range');
        slider.setAttribute('min', 0);
        slider.setAttribute('max', numChoices - 1);
        slider.setAttribute('value', middleIndex);

        let index = parseInt(slider.value);
        let sliderMin = parseInt(slider.min);
        let sliderMax = parseInt(slider.max);

        if (!this.config.hideExtremes) {
            choicesContainer.children[0].innerHTML = this.config.leftExtremeText
                ? this.config.leftExtremeText
                : questionChoices[sliderMin + 1].Text;

            choicesContainer.children[2].innerHTML = this.config.rightExtremeText
                ? this.config.rightExtremeText
                : questionChoices[sliderMax + 1].Text;
        }

        choicesContainer.children[1].innerHTML = this.config.hideCurrentSelection
            ? ''
            : questionChoices[index + 1].Text;

        this.images.children[index].style.display = 'block';
        this.config.engineInstance.setChoiceValue(index + 1, true);

        let instance = this;
        slider.oninput = function() {
            let selectedIndex = parseInt(this.value);
            let selectedChoiceId = selectedIndex + 1;

            instance.config.engineInstance.setChoiceValue(selectedChoiceId, true);
            
            // Hide all images, show only selected
            Array.from(instance.images.children).forEach(image => image.style.display = 'none');
            instance.images.children[selectedIndex].style.display = 'block';

            // Set Active Choice Text
            if (!instance.config.hideCurrentSelection)
                choicesContainer.children[1].innerHTML = questionChoices[selectedIndex + 1].Text;
        }

        return slider;
    }

    generateChoicesContainer() {
        let choicesContainer = document.createElement('div');
        choicesContainer.setAttribute('class', CHOICES_CONTAINER_CLASSNAME);

        for (let i = 0; i < 3; ++i) {
            var newDiv = document.createElement('div');
            choicesContainer.appendChild(newDiv);
        }

        return choicesContainer;
    }
}

global.QualtricsImageSlider = QualtricsImageSlider;
