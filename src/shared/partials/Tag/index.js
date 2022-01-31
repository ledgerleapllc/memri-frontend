import classNames from "classnames"

export const Tag = ({ tag, active, ...otherProps }) => {
  return (
    <div
      {...otherProps}
      className={
        classNames('cursor-pointer border px-2 py-1 rounded-lg text-xs', {
          'border border-transparent bg-primary text-white': active,
          'border border-primary px-2 py-1 rounded-lg text-xs text-primary': !active,
        })
      }
    >
      {tag}
    </div>
  );
}