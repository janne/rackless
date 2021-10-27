import React, { FC } from "react";
import spinner from "./spinner.gif";

const styles = {
  loader: {
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute" as const,
    height: "100%",
    top: 0,
    left: 0,
    right: 0,
    background: "rgba(0, 0, 0, 0.9)"
  }
};

const Loader: FC = () => (
  <div style={styles.loader}>
    <img src={spinner} alt="Spinner" width="200" height="200" />
  </div>
);

export default Loader;
