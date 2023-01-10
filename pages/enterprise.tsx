import enterpriseJson from "../public/enterprise.json";
import dormantUsersJson from "../public/dormantusers.json";
import "chartjs-adapter-moment";
import { enGB } from "date-fns/locale";
import { last, repeat } from "lodash";

import { Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, TimeScale, Title, Tooltip } from "chart.js";
import { Line } from "react-chartjs-2";
import Card from "../components/Card";
import React from "react";

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Licence {
  values: {
    used: number;
    available: number;
    total: number;
    lastUpdatedAt: number;
  }[];
}

interface DormantUsers {
  values: {
    collaborators: number;
    outsidecollaborators: number;
    total: number;
    lastUpdatedAt: number;
  }[];
}
export async function getStaticProps() {
  const { licence } = enterpriseJson;
  // @ts-ignore
  const licenceLastUpdate = new Date(last(licence.values).lastUpdatedAt).toLocaleDateString("en-GB");
  const { dormantUsers } = dormantUsersJson;
  // @ts-ignore
  const dormantUsersLastUpdate = new Date(last(dormantUsers.values).lastUpdatedAt).toLocaleDateString("en-GB");

  return {
    props: {
      licence,
      licenceLastUpdate,
      dormantUsers,
      dormantUsersLastUpdate
    }
  };
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
      ...style
    }}
  >
    {children}
  </div>
);

export default function Enterprise({
                                     licence,
                                     licenceLastUpdate,
                                     dormantUsers,
                                     dormantUsersLastUpdate
                                   }: {
  licence: Licence;
  dormantUsers: DormantUsers;
  licenceLastUpdate: any;
  dormantUsersLastUpdate: any;
}) {
  return (
    <>
      <div className="govuk-width-container ">
        <main className="govuk-main-wrapper " id="main-content" role="main">
          <h1 className="govuk-heading-xl">Enterprise</h1>

          <h2 className="govuk-heading-l">Maturity</h2>

          <h3 className="govuk-heading-m">Current</h3>
          <div className="maturity-stats-container">
            <div className="maturity-stat maturity-level-1">
              <div className="maturity-stat-value">20%</div>
              <div className="maturity-stat-name">Enterprise Policies</div>
            </div>

            <div className="maturity-stat maturity-level-1">
              <div className="maturity-stat-value">20%</div>
              <div className="maturity-stat-name">Minimise Organisations</div>
            </div>

            <div className="maturity-stat maturity-level-1">
              <div className="maturity-stat-value">20%</div>
              <div className="maturity-stat-name">User-owned repos</div>
            </div>

            <div className="maturity-stat maturity-level-2">
              <div className="maturity-stat-value">40%</div>
              <div className="maturity-stat-name">Licence management</div>
            </div>
          </div>

          <h3 className="govuk-heading-m">Target</h3>
          <div className="maturity-stats-container">
            <div className="maturity-stat maturity-level-4">
              <div className="maturity-stat-value">80%</div>
              <div className="maturity-stat-name">Enterprise Policies</div>
            </div>

            <div className="maturity-stat maturity-level-5">
              <div className="maturity-stat-value">100%</div>
              <div className="maturity-stat-name">Minimise Organisations</div>
            </div>

            <div className="maturity-stat maturity-level-3">
              <div className="maturity-stat-value">60%</div>
              <div className="maturity-stat-name">User-owned repos</div>
            </div>

            <div className="maturity-stat maturity-level-5">
              <div className="maturity-stat-value">100%</div>
              <div className="maturity-stat-name">Licence management</div>
            </div>
          </div>
          <h2 className="govuk-heading-l">License Usage</h2>
          <GridLayout cols={3}>
            <Card
              title={`Total Licences: ${licence.values[licence.values.length - 1].total}`}
            />
            <Card
              title={`Available Licences: ${licence.values[licence.values.length - 1].available}`}
            />
            <Card
              title={`Used Licences: ${licence.values[licence.values.length - 1].used}`}
            />
          </GridLayout>
          <div style={{ width: "800px" }}>
            <Line
              options={{
                scales: {
                  x: {
                    type: "time",
                    min: new Date().getTime() - 12096e5,
                    max: new Date().getTime() + 8.64e7,
                    adapters: {
                      date: {
                        locale: enGB
                      }
                    }
                  },
                  y: {
                    min: 0
                  }
                }
              }}
              data={{
                labels: licence.values.map((row) => row.lastUpdatedAt),
                datasets: [
                  {
                    label: "Available",
                    data: licence.values.map((row) => row.available),
                    borderColor: "#FF6384"
                  },
                  {
                    label: "Used",
                    data: licence.values.map((row) => row.used),
                    borderColor: "#00FF00"
                  },
                  {
                    label: "Total",
                    data: licence.values.map((row) => row.total),
                    borderColor: "#0000FF"
                  }
                ]
              }}
            />
          </div>
          <p className="govuk-body">
            {`Table Last Updated: ${licenceLastUpdate}`}
          </p>

          <h2 className="govuk-heading-l">Dormant Users</h2>
          <GridLayout cols={3}>
            <Card
              title={`Collaborators: ${
                dormantUsers.values[dormantUsers.values.length - 1]
                  .collaborators
              }`}
            />
            <Card
              title={`Outside Collaborators: ${
                dormantUsers.values[dormantUsers.values.length - 1]
                  .outsidecollaborators
              }`}
            />
            <Card
              title={`Dormant Users: ${
                dormantUsers.values[dormantUsers.values.length - 1]
                  .total
              }`}
            />
          </GridLayout>

          <div style={{ width: "800px" }}>
            <Line
              id={"dormantUsers"}
              options={{
                scales: {
                  x: {
                    type: "time",
                    min: new Date().getTime() - 12096e5,
                    max: new Date().getTime() + 8.64e7,
                    adapters: {
                      date: {
                        locale: enGB
                      }
                    }
                  },
                  y: {
                    min: 0
                  }
                }
              }}
              data={{
                labels: dormantUsers.values.map((row) => row.lastUpdatedAt),
                datasets: [
                  {
                    label: "Collaborators",
                    data: dormantUsers.values.map((row) => row.collaborators),
                    borderColor: "#FF6384"
                  },
                  {
                    label: "Outside Collaborators",
                    data: dormantUsers.values.map(
                      (row) => row.outsidecollaborators
                    ),
                    borderColor: "#00FF00"
                  },
                  {
                    label: "Total Collaborators",
                    data: dormantUsers.values.map((row) => row.total),
                    borderColor: "#0000FF"
                  }
                ]
              }}
            />
          </div>

          <p className="govuk-body">
            {`Table Last Updated: ${dormantUsersLastUpdate}`}

          </p>
        </main>
      </div>
    </>
  );
}
