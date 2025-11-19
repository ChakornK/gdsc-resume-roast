import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";
import Icon from "@mdi/react";

export const Paginator = ({
  n,
  current,
  setCurrent,
}: {
  n: number;
  current: number;
  setCurrent: (i: number) => void;
}) => {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => setCurrent(Math.max(0, current - 1))}
        className="disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
        disabled={current === 0}
      >
        <Icon path={mdiChevronLeft} size="1em" />
      </button>
      {Array.from({ length: n }, (_, i) => i).map((i) => (
        <button
          key={i}
          className={`w-8 h-8 rounded-full cursor-pointer ${
            i === current ? "bg-primary text-on-primary" : ""
          }`}
          onClick={() => setCurrent(i)}
          disabled={i === current}
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={() => setCurrent(Math.min(n - 1, current + 1))}
        className="disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
        disabled={current === n - 1}
      >
        <Icon path={mdiChevronRight} size="1em" />
      </button>
    </div>
  );
};
