import { animate, stagger } from 'animejs';

export const animateHero = (titleRef, ctaRef) => {
  if (titleRef.current) {
    animate(titleRef.current, {
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 800,
      ease: 'outExpo',
      delay: 200
    });
  }
  if (ctaRef.current) {
     animate(ctaRef.current.children, {
      scale: [0.9, 1],
      opacity: [0, 1],
      duration: 600,
      ease: 'outBack',
      delay: stagger(150, {start: 400})
    });
  }
};

export const animateButtonHover = (target) => {
  animate(target, {
    scale: 1.05,
    duration: 300,
    ease: 'outElastic(1, .8)'
  });
};

export const animateButtonLeave = (target) => {
  animate(target, {
    scale: 1,
    duration: 300,
    ease: 'outElastic(1, .8)'
  });
};

export const animateCardHover = (cardTarget, imageTarget) => {
    animate(cardTarget, {
        translateY: -5,
        boxShadow: '0 25px 50px rgba(15, 23, 42, 0.12)',
        duration: 300,
        ease: 'outExpo'
    });
    if (imageTarget) {
        animate(imageTarget, {
            scale: 1.05,
            duration: 400,
            ease: 'outQuad'
        });
    }
};

export const animateCardLeave = (cardTarget, imageTarget) => {
    animate(cardTarget, {
        translateY: 0,
        boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08)',
        duration: 300,
        ease: 'outExpo'
    });
    if (imageTarget) {
        animate(imageTarget, {
            scale: 1,
            duration: 400,
            ease: 'outQuad'
        });
    }
};

export const animateInputFocus = (target) => {
    animate(target, {
        scale: 1.01,
        borderColor: '#4e6e81',
        duration: 300,
        ease: 'outQuad'
    });
};

export const animateInputBlur = (target) => {
    animate(target, {
        scale: 1,
        borderColor: '#e5ded6',
        duration: 300,
        ease: 'outQuad'
    });
};

export const animateCountUp = (targets) => {
  animate(targets, {
    innerHTML: function(el) {
       return [0, el.getAttribute('data-value') || el.innerHTML];
    },
    round: 1,
    duration: 2000,
    ease: 'outExpo'
  });
};
