import ReactLoading from 'react-loading';
import classNames from 'classnames';
import { createElement, useRef } from 'react';
import './style.module.scss';

export const Button = (props) => {
  const {
    children,
    variant = 'contained',
    color = 'primary',
    size = 'lg',
    className,
    isLoading,
    as = 'button',
    onClick,
    ...otherProps
  } = props;
  const rippleRef = useRef(null);

  const handleClick = (e) => {
    e.stopPropagation();
    if (rippleRef?.current) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple-element');
      rippleRef.current.innerHTML = '';
      rippleRef.current.appendChild(ripple);

      const diameter = Math.max(e.currentTarget.clientWidth, e.currentTarget.clientHeight);
      ripple.style.width = ripple.style.height = `${diameter}px`;
      const rect = e.currentTarget.getBoundingClientRect();
      const left = e.clientX - rect.left - diameter / 2;
      const top = e.clientY - rect.top - diameter / 2;
      ripple.style.left = `${left}px`;
      ripple.style.top = `${top}px`;
      ripple.style.transitionDuration = '225ms';
      setTimeout(() => {
        ripple.remove();
      }, 300);
    }
    if(onClick) {
      onClick(e);
    }
  };

  const renderChildren = (
    <>
      <span className="ripple-box" ref={rippleRef} />
      <div className='relative flex justify-center items-center text-center w-full h-full'>
        {isLoading ? (
          <div className='loading'>
            <ReactLoading
              type="spinningBubbles"
              color="currentColor"
              width="1em"
              height="1em"
            />
          </div>
        ) : (
          children
        )}
      </div>
    </>
  );

  return createElement(
    as,
    {
      className: classNames('btn', className, {
        [`btn-${color} btn-${color}-${variant}`]: variant !== 'text',
        [`btn-${size}`]: size,
        [variant]: variant,
        'cursor-not-allowed': isLoading
      }),
      onClick: handleClick,
      ...otherProps,
    },
    renderChildren
  );
};
