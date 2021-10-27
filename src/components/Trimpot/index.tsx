import React, { ForwardRefRenderFunction } from "react";
import * as R from "ramda";
import { DraggableCore, DraggableEventHandler } from "react-draggable";
import background from "./background.svg";

const CONTROL_DEGREES = 270;

interface TrimpotProps {
  id: string;
  width: number;
  range: Range;
  name: string;
  value: number;
  setValue: (id: string, name: string, value: number) => void;
}

const Trimpot: ForwardRefRenderFunction<HTMLDivElement, TrimpotProps> = (
  { id, width = 36, range, name, value, setValue },
  ref
) => {
  const currentValue = R.isNil(value) ? (R.isNil(range) ? 0.5 : 0) : value;

  const styles = {
    content: { cursor: "pointer" }
  };

  const dragHandler: DraggableEventHandler = (e, data) => {
    setValue(
      id,
      name,
      R.clamp(
        R.isNil(range) ? 0 : -1,
        1,
        currentValue + (data.deltaX - data.deltaY) / 300
      )
    );
    e.preventDefault();
  };

  const dblClickHandler = () => setValue(id, name, R.isNil(range) ? 0.5 : 0);

  return (
    <div
      className="draggable"
      style={styles.content}
      onDoubleClick={dblClickHandler}
      ref={ref}
    >
      <DraggableCore onDrag={dragHandler}>
        <img
          draggable={false}
          src={background}
          style={{
            width,
            transform: `rotate(${
              R.isNil(range)
                ? (currentValue - 0.5) * CONTROL_DEGREES
                : currentValue * (CONTROL_DEGREES / 2)
            }deg)`
          }}
          alt="Trimpot"
        />
      </DraggableCore>
    </div>
  );
};

export default React.forwardRef(Trimpot);
