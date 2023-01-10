import Link from "next/link";
import { partition } from "lodash";
import Header from "../components/Header";

export async function getStaticProps() {
  const res = await fetch(
    "https://ukhomeoffice.github.io/scm-repository-catalogue/repos.json"
  );
  const repos = await res.json();

  const [publicR, privateR] = partition(repos, { visibility: "public" });
  return {
    props: {
      githubPublic: publicR.length,
      githubPrivate: privateR.length,
    },
  };
}

interface ConvergenceProps {
  githubPublic: number;
  githubPrivate: number;

  acpGitlab: number;
  ebsaBitbucket: number;
  lecpGitlab: number;
}

export default function Convergence({
  githubPublic,
  githubPrivate,
  acpGitlab = 4731,
  ebsaBitbucket = 7715,
  lecpGitlab = 0,
}: ConvergenceProps) {
  return (
    <>
      <Header />
      <div className={"govuk-width-container"}>
        <main className={"govuk-main-wrapper"} id="main-content" role="main">
          <h1 className="govuk-heading-xl">SCM Convergence</h1>

          <p className="govuk-body">
            Currently{" "}
            {(
              (githubPublic /
                (githubPublic +
                  githubPrivate +
                  acpGitlab +
                  ebsaBitbucket +
                  lecpGitlab)) *
              100
            ).toFixed(2)}
            % of repositories are open sourced.
          </p>

          <p className="govuk-body">
            Currently{" "}
            {((githubPublic / (githubPublic + githubPrivate)) * 100).toFixed(2)}
            % of repositories on GitHub are open sourced.
          </p>
          <table className="govuk-table">
            <thead className="govuk-table__head">
              <tr>
                <th scope="col" className="govuk-table__header">
                  <a>SCM Solution</a>
                </th>
                <th scope="col" className="govuk-table__header">
                  <a>Repository Count</a>
                </th>
              </tr>
            </thead>
            <tbody className="govuk-table__body">
              <tr className="govuk-table__row">
                <td className="govuk-table__cell">
                  <Link href="/">GitHub Public</Link>
                </td>
                <td className="govuk-table__cell">{githubPublic}</td>
              </tr>
              <tr className="govuk-table__row">
                <td className="govuk-table__cell">GitHub Private</td>
                <td className="govuk-table__cell">{githubPrivate}</td>
              </tr>
              <tr className="govuk-table__row">
                <td className="govuk-table__cell">ACP GitLab</td>
                <td className="govuk-table__cell">4731</td>
              </tr>
              <tr className="govuk-table__row">
                <td className="govuk-table__cell">EBSA Bitbucket</td>
                <td className="govuk-table__cell">7715</td>
              </tr>
              <tr className="govuk-table__row">
                <td className="govuk-table__cell">LECP GitLab</td>
                <td className="govuk-table__cell">0</td>
              </tr>
            </tbody>
          </table>
        </main>
      </div>
    </>
  );
}
