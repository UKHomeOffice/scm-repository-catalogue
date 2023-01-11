import {createContext} from "react";
import {MaturityPayload} from "../types/maturity";

const MaturityContext = createContext<MaturityPayload>({});

export default MaturityContext;