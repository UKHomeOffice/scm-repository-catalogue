import { Html, Head, Main, NextScript } from "next/document";
import Footer from "../components/Footer";

export default function Document() {
  return (
    <Html lang="en" className={"govuk-template"}>
      <Head />
      <body className={"govuk-template__body"}>
        <Main />
        <Footer />
        <NextScript />
        {/*<script src="/javascript/govuk-frontend-4.3.0.min.js"></script>*/}
        {/*<script>window.GOVUKFrontend.initAll()</script>*/}
      </body>
    </Html>
  );
}
