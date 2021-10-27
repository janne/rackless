import React from "react";
import * as R from "ramda";
import Plate from "../../containers/Plate";
import Socket from "../../containers/Socket";
import Trimpot from "../Trimpot";
import Switch from "../Switch";
import * as moduleTypes from "../../modules";

const Wrapper = ({ x, y, children }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y
    }}
  >
    {children}
  </div>
);

const Module = ({ id, instrument, data, setValue }) => {
  const { col, row, type, values = [] } = data;
  const moduleType = moduleTypes[type];
  const { background, controls = [], inputs = [], outputs = [] } = moduleType;

  return (
    <Plate col={col} row={row} moduleId={id} background={background}>
      {R.values(
        R.mapObjIndexed((params, name) => {
          const { Component, x, y } = params;
          if (Component) {
            const props = R.propOr({}, "props", instrument);
            return (
              <Wrapper x={x} y={y} key={`control-${name}`}>
                <Component
                  id={id}
                  name={name}
                  value={values[name]}
                  setValue={setValue}
                  {...params}
                  {...props}
                />
              </Wrapper>
            );
          }
          if (R.is(Array, params.range)) {
            return (
              <Wrapper x={x} y={y} key={`control-${name}`}>
                <Switch
                  {...params}
                  id={id}
                  name={name}
                  value={values[name]}
                  setValue={setValue}
                />
              </Wrapper>
            );
          }
          return (
            <Wrapper x={x} y={y} key={`control-${name}`}>
              <Trimpot
                {...params}
                id={id}
                name={name}
                value={values[name]}
                setValue={setValue}
              />
            </Wrapper>
          );
        }, controls)
      )}

      {R.values(
        R.mapObjIndexed(
          (params, name) => (
            <Socket
              moduleId={id}
              direction="inputs"
              key={`input-${name}`}
              socketId={name}
              {...params}
            />
          ),
          inputs
        )
      )}

      {R.values(
        R.mapObjIndexed(
          (params, name) => (
            <Socket
              moduleId={id}
              direction="outputs"
              key={`output-${name}`}
              socketId={name}
              {...params}
            />
          ),
          outputs
        )
      )}
    </Plate>
  );
};

export default Module;
