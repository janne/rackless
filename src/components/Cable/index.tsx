import React, { FC } from "react";
import * as R from "ramda";
import Connector from "./Connector";
import Bezier from "./Bezier";

const CENTER = 10;

export interface Pos {
  x: number;
  y: number;
}

export type Connector = "outputs" | "inputs";

export interface Drag {
  connector: Connector;
  pos: Pos;
}

interface CableProps {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  disabled: boolean;
  drag: Drag;
  removeConnector: (id: string) => void;
  dragConnector: (id: string, connector: Connector, pos: Pos) => void;
  moveConnector: (id: string, connector: Connector, pos: Pos) => void;
}

const Cable: FC<CableProps> = ({
  id,
  x1,
  y1,
  x2,
  y2,
  drag,
  color,
  disabled,
  removeConnector,
  dragConnector,
  moveConnector
}) => {
  if (R.any((i) => isNaN(i), [x1, y1, x2, y2])) return null;

  const outX = R.prop("connector", drag) === "outputs" ? drag.pos.x : x1;
  const outY = R.prop("connector", drag) === "outputs" ? drag.pos.y : y1;
  const inX = R.prop("connector", drag) === "inputs" ? drag.pos.x : x2;
  const inY = R.prop("connector", drag) === "inputs" ? drag.pos.y : y2;

  const handleStart = () => removeConnector(id);
  const handleDrag = (connector: Connector) => (pos: Pos) =>
    dragConnector(id, connector, pos);
  const handleStop = (connector: Connector) => (pos: Pos) =>
    moveConnector(id, connector, pos);

  return (
    <>
      <Connector
        x={outX}
        y={outY}
        onStart={handleStart}
        onDrag={handleDrag("outputs")}
        onStop={handleStop("outputs")}
        disabled={disabled}
      />
      <Connector
        x={inX}
        y={inY}
        onStart={handleStart}
        onDrag={handleDrag("inputs")}
        onStop={handleStop("inputs")}
        disabled={disabled}
      />
      <Bezier
        x1={outX + CENTER}
        y1={outY + CENTER}
        x2={inX + CENTER}
        y2={inY + CENTER}
        color={color}
      />
    </>
  );
};

export default Cable;
