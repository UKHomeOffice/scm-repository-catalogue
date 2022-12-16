import { Html, Head, Main, NextScript } from "next/document";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function Document() {
  return (
    <Html lang="en" className={"govuk-template"}>
      <Head />
      <body className={"govuk-template__body"}>
        <Header />
        <div className={"govuk-width-container"}>
          <main className={"govuk-main-wrapper"} id="main-content" role="main">
            <Main />
          </main>
        </div>
        <Footer />
        <NextScript />
        {/*<script src="/javascript/govuk-frontend-4.3.0.min.js"></script>*/}
        {/*<script>window.GOVUKFrontend.initAll()</script>*/}
      </body>
    </Html>
  );
}
