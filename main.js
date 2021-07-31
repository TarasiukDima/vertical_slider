document.addEventListener('DOMContentLoaded', () => {
    'use strict'

    class SimpleSlider {
        constructor(classContainer) {
            this.slider = document.querySelector(classContainer);
            this.sliderBtns = this.slider.querySelector('.slider__buttons');
            this.leftSlider = this.slider.querySelector('.left__slider');
            this.rigthSlider = this.slider.querySelector('.right__slider');
            this.activeSlide = 0;
            this.length = this.leftSlider.querySelectorAll('.slider__item').length;
            this.startX = 0;
            this.startY = 0;
            this.endX = 0;
            this.endY = 0;

            this.init = this.init.bind(this);
            this._listenerBtnsParrent = this._listenerBtnsParrent.bind(this);
            this._listenerKeyPress = this._listenerKeyPress.bind(this);
            this._listenerMouseSwipe = this._listenerMouseSwipe.bind(this);
            this._swipeDirection = this._swipeDirection.bind(this);
            this._changeSlide = this._changeSlide.bind(this);
        }

        // init simple slider
        init() {
            this.leftSlider.style.top = `-${ 100 * (this.length - 1) }vh`;

            this._listenerBtnsParrent()
            this._listenerKeyPress()
            this._listenerMouseSwipe()
        }

        // listener for slider btn
        _listenerBtnsParrent() {
            this.sliderBtns.addEventListener('click', (e) => {
                let target = e.target;

                if (target.classList.contains('prev__btn')) {
                    this._changeSlide('prev')

                } else if (target.classList.contains('next__btn')) {
                    this._changeSlide('next')
                }
            })
        }

        // listener for key press
        _listenerKeyPress() {
            document.addEventListener('keydown', (e) => {
                if (e.code === 'ArrowUp') {
                    this._changeSlide('next');
                } else if (e.code === 'ArrowDown') {
                    this._changeSlide('prev');
                }
            })
        }

        // listener for swipe
        _listenerMouseSwipe() {
            this.slider.addEventListener('mousedown', (e) => {
                this.startX = e.clientX;
                this.startY = e.clientY;
            });

            this.slider.addEventListener('mousemove', (e) => {
                this.endX = e.clientX;
                this.endY = e.clientY;
            });

            this.slider.addEventListener('mouseup', this._swipeDirection);
        }

        // defenition swipe direction
        _swipeDirection() {
            const xDiff = this.endX - this.startX;
            const yDiff = this.endY - this.startY;

            if (xDiff === 0 || yDiff === 0) return;

            if (Math.abs(xDiff) < Math.abs(yDiff)) {
                if (yDiff > 0) {
                    //down
                    this._changeSlide('prev');
                } else {
                    //up
                    this._changeSlide('next');
                }
            }

            // reset values
            this.startX = 0;
            this.startY = 0;
            this.endX = 0;
            this.endY = 0;
        }

        // change active slide
        _changeSlide(param = 'next') {
            let heightContainer = this.slider.getBoundingClientRect().height;

            if (param === 'prev') {
                this.activeSlide--;
                this.activeSlide < 0
                    ? this.activeSlide = this.length - 1
                    : null;

            } else if (param === 'next') {
                this.activeSlide++;

                this.activeSlide > this.length - 1
                    ? this.activeSlide = 0
                    : null;
            }

            this.leftSlider.style.transform = `translateY(${this.activeSlide * heightContainer}px)`;
            this.rigthSlider.style.transform = `translateY(-${this.activeSlide * heightContainer}px)`;
        }
    }

    const slider = new SimpleSlider('.slider__container');
    slider.init();
})
