import Link from "next/link";

export default function Convergence() {
  return (
    <>
      <div className="govuk-width-container">
        <main
          className="govuk-main-wrapper "
          id="main-content"
          role="main"
          ng-controller="ReposController"
        >
          <h1 className="govuk-heading-xl">SCM Convergence</h1>

          <p className="govuk-body" ng-if="repos">
            Currently 9.3% of repositories are open sourced.
          </p>
          <table className="govuk-table" ng-if="repos">
            <thead className="govuk-table__head">
              <tr>
                <th scope="col" className="govuk-table__header">
                  <a ng-click="sortType = 'owner'; sortReverse = !sortReverse">
                    SCM Solution
                  </a>
                </th>
                <th scope="col" className="govuk-table__header">
                  <a ng-click="sortType = 'name'; sortReverse = !sortReverse">
                    Repository Count
                  </a>
                </th>
              </tr>
            </thead>
            <tbody className="govuk-table__body">
              <tr
                className="govuk-table__row"
                ng-repeat="repo in repos | orderBy:sortType:sortReverse"
              >
                <td className="govuk-table__cell">
                  <Link href="/">GitHub Public</Link>
                </td>
                <td className="govuk-table__cell">1288</td>
              </tr>
              <tr
                className="govuk-table__row"
                ng-repeat="repo in repos | orderBy:sortType:sortReverse"
              >
                <td className="govuk-table__cell">GitHub Private</td>
                <td className="govuk-table__cell">144</td>
              </tr>
              <tr
                className="govuk-table__row"
                ng-repeat="repo in repos | orderBy:sortType:sortReverse"
              >
                <td className="govuk-table__cell">ACP GitLab</td>
                <td className="govuk-table__cell">4731</td>
              </tr>
              <tr
                className="govuk-table__row"
                ng-repeat="repo in repos | orderBy:sortType:sortReverse"
              >
                <td className="govuk-table__cell">EBSA Bitbucket</td>
                <td className="govuk-table__cell">7715</td>
              </tr>
              <tr
                className="govuk-table__row"
                ng-repeat="repo in repos | orderBy:sortType:sortReverse"
              >
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
