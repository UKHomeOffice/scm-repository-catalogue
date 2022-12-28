import enterpriseJson from "../public/enterprise.json";
import dormantUsersJson from "../public/dormantusers.json";
import "chartjs-adapter-moment";
import { enGB } from "date-fns/locale";
import { Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, TimeScale, Title, Tooltip } from "chart.js";
import { Line } from "react-chartjs-2";

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

  // TODO: No america
  const { licence } = enterpriseJson;
  const licenceLastUpdate = new Date(licence.values[licence.values.length - 1].lastUpdatedAt).toLocaleDateString();
  const { dormantUsers } = dormantUsersJson;
  const dormantUsersLastUpdate = new Date(dormantUsers.values[dormantUsers.values.length - 1].lastUpdatedAt).toLocaleDateString();

  return {
    props: {
      licence,
      licenceLastUpdate,
      dormantUsers,
      dormantUsersLastUpdate
    }
  };
}

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

          <h3 className="govuk-heading-m">Admin Contact</h3>
          <div>
            <p className="govuk-body">tooling@homeoffice.gov.uk</p>
          </div>

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

          <table className="govuk-table">
            <thead className="govuk-table__head">
            <tr>
              <th scope="col" className="govuk-table__header">
                <a>Licence Usage</a>
              </th>
              <th scope="col" className="govuk-table__header">
                <a>Number of licences</a>
              </th>
            </tr>
            </thead>
            <tbody className="govuk-table__body">
            <tr className="govuk-table__row">
              <td className="govuk-table__cell">Total Purchased licences</td>
              <td className="govuk-table__cell">
                {licence.values[licence.values.length - 1].total}
              </td>
            </tr>
            <tr className="govuk-table__row">
              <td className="govuk-table__cell">Available licences</td>
              <td className="govuk-table__cell">
                {licence.values[licence.values.length - 1].available}
              </td>
            </tr>
            <tr className="govuk-table__row">
              <td className="govuk-table__cell">Used licences</td>
              <td className="govuk-table__cell">
                {licence.values[licence.values.length - 1].used}
              </td>
            </tr>
            </tbody>
          </table>

          <p className="govuk-body">
            {`Table Last Updated: ${licenceLastUpdate}`}
          </p>

          <h2 className="govuk-heading-l">Dormant Users</h2>
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
          <table className="govuk-table">
            <thead className="govuk-table__head">
            <tr>
              <th scope="col" className="govuk-table__header">
                <a>User Type</a>
              </th>
              <th scope="col" className="govuk-table__header">
                <a>Total</a>
              </th>
            </tr>
            </thead>
            <tbody className="govuk-table__body">
            <tr className="govuk-table__row">
              <td className="govuk-table__cell">Collaborators</td>
              <td className="govuk-table__cell">
                {
                  dormantUsers.values[dormantUsers.values.length - 1]
                    .collaborators
                }
              </td>
            </tr>
            <tr className="govuk-table__row">
              <td className="govuk-table__cell">Outside Collaborators</td>
              <td className="govuk-table__cell">
                {
                  dormantUsers.values[dormantUsers.values.length - 1]
                    .outsidecollaborators
                }
              </td>
            </tr>
            <tr className="govuk-table__row">
              <td className="govuk-table__cell">Total Dormant Users</td>
              <td className="govuk-table__cell">
                {dormantUsers.values[dormantUsers.values.length - 1].total}
              </td>
            </tr>
            </tbody>
          </table>

          <p className="govuk-body">
            {`Table Last Updated: ${dormantUsersLastUpdate} `}
          </p>
        </main>
      </div>
    </>
  );
}
