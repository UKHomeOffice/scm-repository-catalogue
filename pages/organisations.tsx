import organisationJson from "../public/organisations.json";
import packagesJson from "../public/organisations-packages.json";
import appColoursJson from "../public/apps-colour.json";
import { groupBy, last, capitalize, repeat, isEmpty } from "lodash";
import Image from "next/image";

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
import React from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Card from "../components/Card";

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
} = appColoursJson;

const PACKAGE_TYPES = [
  "npm",
  "maven",
  "rubygems",
  "docker",
  "nuget",
  "container",
];

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

  const distinctOrgs: Set<string> = repos.reduce(
    (res: any, curr: any, _: any) => {
      return res.add(curr.owner);
    },
    new Set()
  );

  const orgs: string[] = Array.from(distinctOrgs.values()).sort();
  const { organisationApps } = organisationJson;
  let orgData = groupBy(organisationApps.values, (o) => o.organisation);

  const orgType = groupBy(
    packagesJson["organisationPackages"]["values"],
    (o) => o.organisation
  );

  for (let org of orgs) {
    // @ts-ignore
    orgData[org][0]["packages"] = groupBy(
      orgType[org][0]["packages"],
      (p) => p.packageType
    );
  }

  return {
    props: {
      repos,
      organisationApps,
      orgs,
      orgData,
      PACKAGE_TYPES,
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
      ...style,
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
        <h2 className="govuk-heading-l">Maturity</h2>

        <h3 className="govuk-heading-m">Current</h3>
        <div className="maturity-stats-container">
          <div className="maturity-stat maturity-level-2">
            <div className="maturity-stat-value">46%</div>
            <div className="maturity-stat-name">Multiple Owners</div>
          </div>
          <div className="maturity-stat maturity-level-2">
            <div className="maturity-stat-value">37%</div>
            <div className="maturity-stat-name">Use Teams</div>
          </div>
          <div className="maturity-stat maturity-level-4">
            <div className="maturity-stat-value">70%</div>
            <div className="maturity-stat-name">Open source packages</div>
          </div>
        </div>

        <h3 className="govuk-heading-m">Target</h3>
        <div className="maturity-stats-container">
          <div className="maturity-stat maturity-level-5">
            <div className="maturity-stat-value">80%</div>
            <div className="maturity-stat-name">Multiple Owners</div>
          </div>
          <div className="maturity-stat maturity-level-5">
            <div className="maturity-stat-value">86%</div>
            <div className="maturity-stat-name">Use Teams</div>
          </div>
          <div className="maturity-stat maturity-level-5">
            <div className="maturity-stat-value">100%</div>
            <div className="maturity-stat-name">Open source packages</div>
          </div>
        </div>

        <h1 className="govuk-heading-l">Organisations</h1>

        <GridLayout cols={3}>
          {orgs.map((org: string) => (
            <Card
              title={org}
              titleLinkUrl={`https://github.com/${org}`}
              indicators={PACKAGE_TYPES.map((pType) => ({
                name: pType,
                value: orgData[org][0].packages[pType]?.length || "0",
                imageSrc: `/scm-repository-catalogue/assets/images/${pType}.png`,
                tooltipLabel: capitalize(pType),
              }))}
            />
          ))}
        </GridLayout>
        <h2 className="govuk-heading-l">Github Installed Apps</h2>

        <GridLayout cols={2} style={{ maxWidth: "430px" }}>
          {Object.keys(orgData).map((org: string) => {
            // @ts-ignore
            const appsData = groupBy(last(orgData[org]).installedApps, (yr) =>
              new Date(yr.installedAt).getUTCFullYear()
            );

            return isEmpty(appsData) ? null : (
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
      </div>
    </>
  );
}
