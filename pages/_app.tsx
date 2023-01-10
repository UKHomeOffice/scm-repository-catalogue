import "../public/stylesheets/govuk-frontend-ie8-4.3.0.min.css";
import "../public/stylesheets/govuk-frontend-4.3.0.min.css";
import "../public/stylesheets/overrides.css";
import "react-tooltip/dist/react-tooltip.css";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
