//import './rangetouch.js'

const CHOICES_CONTAINER_CLASSNAME = 'upwork-custom-image-slider-choices-container';
const CHOICE_BASE_CLASSNAME = 'upwork-custom-image-slider-choice-';
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

        // event handlers
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
        
        slider.ontouchstart = set;
        slider.ontouchmove = set;
        slider.ontouchend = set;

        return slider;
    }

    generateChoicesContainer() {
        let choicesContainer = document.createElement('div');
        choicesContainer.setAttribute('class', CHOICES_CONTAINER_CLASSNAME);

        const childPositions = ['left', 'middle', 'right'];

        childPositions.forEach(position => {
            let childClass = CHOICE_BASE_CLASSNAME + position;
            let newDiv = document.createElement('div');
            newDiv.setAttribute('class', childClass);
            choicesContainer.appendChild(newDiv);
        });

        return choicesContainer;
    }
}

// Get the number of decimal places
function getDecimalPlaces(value) {
  var match = ('' + value).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);

  if (!match) {
    return 0;
  }

  return Math.max(
    0,
    // Number of digits right of decimal point.
    (match[1] ? match[1].length : 0) -
    // Adjust for scientific notation.
    (match[2] ? +match[2] : 0)
  );
}

// Round to the nearest step
function round(number, step) {
  if (step < 1) {
    var places = getDecimalPlaces(step);
    return parseFloat(number.toFixed(places));
  }
  return (Math.round(number / step) * step);
}

// Get the value based on touch position
function get(event) {
  var input = event.target;
  var touch = event.changedTouches[0];
  var min = parseFloat(input.getAttribute('min')) || 0;
  var max = parseFloat(input.getAttribute('max')) || 100;
  var step = parseFloat(input.getAttribute('step')) || 1;
  var delta = max - min;

  // Calculate percentage
  var percent;
  var clientRect = input.getBoundingClientRect();
  var thumbWidth = (((100 / clientRect.width) * (15/ 2)) / 100);

  // Determine left percentage
  percent = ((100 / clientRect.width) * (touch.clientX - clientRect.left));

  // Don't allow outside bounds
  if (percent < 0) {
    percent = 0;
  } else if (percent > 100) {
    percent = 100;
  }

  // Factor in the thumb offset
  if (percent < 50) {
    percent -= ((100 - (percent * 2)) * thumbWidth);
  } else if (percent > 50) {
    percent += (((percent - 50) * 2) * thumbWidth);
  }

  // Find the closest step to the mouse position
  return min + round(delta * (percent / 100), step);
}

// Update range value based on position
function set(event) {
  // If not enabled, bail
  if (event.target.type !== 'range') {
    return;
  }

  // Prevent text highlight on iOS
  event.preventDefault();

  // Set value
  event.target.value = get(event);

  // Trigger input event
  trigger(event.target, (event.type === 'touchend' ? 'change' : 'input'));
}

// Trigger event
function trigger(element, type, properties) {
  // Bail if no element
  if (!element || !type) {
    return;
  }

  // Create CustomEvent constructor
  var CustomEvent;
  if (typeof window.CustomEvent === 'function') {
    CustomEvent = window.CustomEvent;
  } else {
    // Polyfill CustomEvent
    // https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
    CustomEvent = function(event, params) {
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined
      };
      var custom = document.createEvent('CustomEvent');
      custom.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return custom;
    };
    CustomEvent.prototype = window.Event.prototype;
  }

  // Create and dispatch the event
  var event = new CustomEvent(type, {
    bubbles: true,
    detail: properties
  });

  // Dispatch the event
  element.dispatchEvent(event);
}

global.QualtricsImageSlider = QualtricsImageSlider;
