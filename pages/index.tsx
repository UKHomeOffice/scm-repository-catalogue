import Head from "next/head";
import { ChangeEvent, useEffect, useState } from "react";
import { filter, get, sortBy, debounce } from "lodash";
import Card from "../components/Card";
import repos from "../public/repos.json";
import starSvg from "../components/Card/star.svg";
import forkSvg from "../components/Card/fork.svg";
import communitySvg from "../components/Card/community.svg";
import GridLayout from "../components/GridLayout";
export async function getStaticProps() {
  // const res = await fetch(
  //   "https://ukhomeoffice.github.io/scm-repository-catalogue/repos.json"
  // );
  // const repos = await res.json();
  return {
    props: {
      repos: repos,
    },
  };
}

export default function Index({ repos }: { repos: any }) {
  const [filtered, setFiltered] = useState({ search: "" });
  const [sorted, setSorted] = useState({ field: "owner", ascending: true });
  const [repositories, setRepositories] = useState(repos);

  useEffect(() => {
    const newList = filter(repos, function (r: any) {
      return (
        r.name.toLowerCase().includes(filtered.search.toLowerCase()) ||
        r.description?.toLowerCase().includes(filtered.search.toLowerCase()) ||
        r.language?.toLowerCase().includes(filtered.search.toLowerCase()) ||
        r.owner.toLowerCase().includes(filtered.search.toLowerCase())
      );
    });

    const sortedList = sortBy(newList, (r) => get(r, sorted.field));
    if (!sorted.ascending) {
      sortedList.reverse();
    }

    setRepositories(sortedList);
  }, [filtered, sorted, repos]);

  const handleSortFieldChanged = (e: ChangeEvent) => {
    e.preventDefault();
    // @ts-ignore
    const field = e.target.value;
    setSorted({ field, ascending: sorted.ascending });
  };

  const handleSortDirectionChanged = (e: ChangeEvent) => {
    e.preventDefault();
    // @ts-ignore
    const ascending = e.target.value == "ascending";
    setSorted({ field: sorted.field, ascending });
  };

  return (
    <>
      <Head>
        <title>Home Office GitHub Repository Catalogue</title>
        <meta name="description" content="Generated by create next app" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" content="#0b0c0c" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link rel="icon" href="/favicon.ico" />

        <link
          rel="shortcut icon"
          sizes="16x16 32x32 48x48"
          href="/assets/images/favicon.ico"
          type="image/x-icon"
        />
        <link
          rel="mask-icon"
          href="/assets/images/govuk-mask-icon.svg"
          color="#0b0c0c"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/assets/images/govuk-apple-touch-icon-180x180.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="167x167"
          href="/assets/images/govuk-apple-touch-icon-167x167.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/assets/images/govuk-apple-touch-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          href="/assets/images/govuk-apple-touch-icon.png"
        />
      </Head>

      <h1 className={"govuk-heading-xl"}>GitHub Repository Catalogue</h1>

      {!repositories && (
        <p className={"govuk-body"}>
          LOADING... Page can take a while to render
        </p>
      )}
      {repositories && (
        <p className={"govuk-body"}>
          Currently showing {repositories.length} repositories
        </p>
      )}

      <div className="govuk-form-group">
        <label className="govuk-label">Search for repository name:</label>
        <input
          className="govuk-input govuk-!-width-one-half"
          onChange={debounce(
            (e) => setFiltered({ search: e.target.value }),
            500,
            { maxWait: 1000 }
          )}
        />

        <div style={{ paddingTop: 10 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 20,
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                }}
              >
                <label className="govuk-label" htmlFor="sort">
                  Sort by
                </label>
              </div>
              <div>
                <select
                  onChange={(e) => handleSortFieldChanged(e)}
                  className="govuk-select"
                  id="sort"
                  name="sort"
                  defaultValue="owner"
                >
                  <option value="owner">Organisation</option>
                  <option value="name">Name</option>
                  <option value="description">Description</option>
                  <option value="visibility">Visibility</option>
                  <option value="license.name">License</option>
                  <option value="language">Language</option>
                  <option value="stargazersCount">Stars</option>
                  <option value="forksCount">Forks</option>
                  <option value="updatedAt">Last updated</option>
                  <option value="pushedAt">Last commit</option>
                </select>
              </div>
            </div>
            <div>
              <div>
                <label className="govuk-label" htmlFor="sort">
                  Direction
                </label>
              </div>
              <div>
                <select
                  onChange={(e) => handleSortDirectionChanged(e)}
                  className="govuk-select"
                  id="sort"
                  name="sort"
                  defaultValue="ascending"
                >
                  <option value="ascending">Ascending</option>
                  <option value="descending">Descending</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <GridLayout cols={3}>
        {repositories.map((r: any) => (
          <Card
            key={`${r.owner}-${r.name}`}
            title={r.name}
            titleLinkUrl={`https://github.com/${r.owner}/${r.name}`}
            subtitle={r.owner}
            tags={[
              {
                name: "language",
                value: r.language,
                tooltipLabel: "Language",
              },
              {
                name: "visibility",
                value: r.visibility,
                tooltipLabel: "Visibility",
              },
              {
                name: "license",
                value: get(r, "license.name"),
                tooltipLabel: "License",
              },
            ]}
            indicators={[
              {
                name: "stars",
                tooltipLabel: "Number of stars",
                value: r.stargazersCount,
                imageSrc: starSvg,
              },
              {
                name: "forks",
                tooltipLabel: "Number of forks",
                value: r.forksCount,
                imageSrc: forkSvg,
              },
              {
                name: "community",
                tooltipLabel: "Community standards",
                value: get(r, "communityProfile.health_percentage"),
                imageSrc: communitySvg,
              },
            ]}
          />
        ))}
      </GridLayout>
    </>
  );
}
