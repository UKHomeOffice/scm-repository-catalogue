import organisationJson from "../public/organisations.json";

interface OrgApps {
  values: {
    organisation: string;
    installedApps: { app: string; installedAt: string }[];
    total: number;
    lastUpdatedAt: number;
  }[];
}

export async function getStaticProps() {
  const res = await fetch(
    "https://ukhomeoffice.github.io/scm-repository-catalogue/repos.json"
  );
  const repos = await res.json();

  const distinctOrgs = repos.reduce((res: any, curr: any, _: any) => {
    return res.add(curr.owner);
  }, new Set());

  const orgs = Array.from(distinctOrgs.values()).sort();

  const { organisationApps } = organisationJson;

  return {
    props: {
      repos,
      organisationApps,
      orgs,
    },
  };
}

export default function Organisations({
  repos,
  organisationApps,
  orgs,
}: {
  repos: any;
  organisationApps: OrgApps;
  orgs: any;
}) {
  return (
    <>
      <div className="govuk-width-container ">
        <main
          className="govuk-main-wrapper "
          id="main-content"
          role="main"
          ng-controller="OrgController"
        >
          <h1 className="govuk-heading-xl">Organisations</h1>
          <table className="govuk-table" ng-if="repos">
            <thead className="govuk-table__head">
              <tr>
                <th scope="col" className="govuk-table__header">
                  Organisation name
                </th>
              </tr>
            </thead>
            <tbody className="govuk-table__body">
              {orgs.map((org: string) => (
                <tr key={org} className="govuk-table__row">
                  <td className="govuk-table__cell">
                    <a href={`https://github.com/${org}`}>{org}</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2 className="govuk-heading-l">Github Installed Apps</h2>
          <div style={{ width: "800px" }}>
            <canvas id="orgCanvas"></canvas>
          </div>
          <br />
          <table className="govuk-table">
            <thead className="govuk-table__head">
              <th scope="col" className="govuk-table__header">
                <a>Organisation</a>
              </th>
              <th scope="col" className="govuk-table__header">
                <a>Total Installed Apps</a>
              </th>
            </thead>
            <tbody className="govuk-table__body">
              <tr className="govuk-table__row">
                <td className="govuk-table__cell">
                  {
                    organisationApps.values[organisationApps.values.length - 1]
                      .organisation
                  }
                </td>
                <td className="govuk-table__cell">
                  {
                    organisationApps.values[organisationApps.values.length - 1]
                      .total
                  }
                </td>
              </tr>
            </tbody>
          </table>
          <h2 className="govuk-heading-l">Apps</h2>
          <table className="govuk-table">
            <thead className="govuk-table__head">
              <th scope="col" className="govuk-table__header">
                <a>#</a>
              </th>
              <th scope="col" className="govuk-table__header">
                <a>Apps</a>
              </th>
              <th scope="col" className="govuk-table__header">
                <a>Installed At</a>
              </th>
            </thead>

            {/*<tbody className="govuk-table__body" ng-repeat="value in organisationApps.values | limitTo: -1">*/}
            {/*<tr className="govuk-table__row" ng-repeat="installedApp in value.installedApps">*/}
            {/*  <td className="govuk-table__cell">{{$index + 1}}</td>*/}
            {/*  <td className="govuk-table__cell">{{installedApp.app}}</td>*/}
            {/*  <td className="govuk-table__cell">{{installedApp.installedAt | date : "dd/MM/yyyy" }}</td>*/}
            {/*</tr>*/}
            {/*</tbody>*/}
          </table>
          <p className="govuk-body">
            Table Last Updated:{" "}
            <span>
              {new Date(
                organisationApps.values[
                  organisationApps.values.length - 1
                ].lastUpdatedAt
              ).toLocaleDateString()}
            </span>
          </p>
        </main>
      </div>
    </>
  );
}
