import React from "react";
import { repeat } from "lodash";

type Props = {
  cols: number;
  children?: React.ReactNode;

  style?: object;
};

const GridLayout: React.FC<Props> = ({ children, cols, style }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: repeat("1fr ", cols),
      gap: "2em",
      paddingBottom: "1em",
      ...style,
    }}
  >
    {children}
  </div>
);

export default GridLayout;