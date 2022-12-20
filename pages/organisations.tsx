import organisationJson from "../public/organisations.json";
import { groupBy, last } from "lodash";

import "chartjs-adapter-moment";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const COLORS: {
  [key: string]: string;
} = {
"greenkeeper": "#b5abd1",
"signed-commit-checker-beta": "#ad559f",
"slack": "#901f87",
"wip": "#decb01",
"travis-ci": "#9634dd",
"everyone-app": "#bfe28f",
"railway-app": "#719606",
"render": "#96414b",
"scm-reporting-app": "#5224dc",
"hoforms-user-activity-app": "#2036c9",
"axolo-co": "#dec8cc",
"hmpo-user-activity-app": "#5c0151",
};

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
  const orgData = groupBy(organisationApps.values, (o) => o.organisation);

  return {
    props: {
      repos,
      organisationApps,
      orgs,
      orgData,
    },
  };
}

interface OrganisationPageProps {
  repos: any;
  organisationApps: OrgApps;
  orgs: any;
  orgData: any;
}

type Props = {
  children?: React.ReactNode;
};

const GridLayout: React.FC<Props> = ({ children }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      maxWidth: "430px",
      gap: "2em",
    }}
  >
    {children}
  </div>
);

export default function Organisations({
  repos,
  organisationApps,
  orgs,
  orgData,
}: OrganisationPageProps) {
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
                <tr
                  key={org}
                  className="govuk-table__row"
                  ng-repeat="org in orgs"
                >
                  <td className="govuk-table__cell">
                    <a href="https://github.com/{{ org }}">{org}</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="govuk-heading-l">Github Installed Apps</h2>

          <GridLayout>
            {Object.keys(orgData).map((org: string) => {

              // @ts-ignore
              const appsData = groupBy(last(orgData[org]).installedApps, (yr) =>
                new Date(yr.installedAt).getUTCFullYear()
              );
              return (
                <Bar
                  style={{
                    border: "1px solid #ccc",
                  }}
                  id={org}
                  key={org}
                  options={{
                    plugins: {
                      legend: {
                        display: true,
                        position: "bottom",
                      },
                      title: {
                        display: true,
                        text: orgData[org][0].organisation,
                      },
                    },
                    responsive: true,
                    scales: {
                      x: {
                        stacked: true,
                      },
                      y: {
                        stacked: true,
                        ticks: {
                          precision: 0,
                        },
                      },
                    },
                  }}
                  data={{
                    datasets: Object.keys(appsData).flatMap((year) => {
                      return appsData[year].map((app, idx) => ({
                        label: app.app,
                        data: {
                          [year]: 1,
                        },
                        backgroundColor: COLORS[app.app],
                      }));
                    }),
                  }}
                />
              );
            })}
          </GridLayout>
        </main>
      </div>
    </>
  );
}
