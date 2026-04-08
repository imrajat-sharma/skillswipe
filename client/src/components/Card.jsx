import clsx from "clsx";

export const Card = ({ className, children, hover = false, ...props }) => {
  return (
    <div
      className={clsx(
        "surface-card",
        hover && "surface-card--hover cursor-pointer",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
