import styles from "./Card.module.css";
import Image from "next/image";
import starSvg from "./star.svg";
import forkSvg from "./fork.svg";
import communitySvg from "./community.svg";
import Link from "next/link";
import { Tooltip } from "react-tooltip";

interface RepoCardProps {
  repo: {
    name: string;
    owner: string;
    description: string;
    visibility: string;
    license?: {
      name?: string;
    };
    language?: string;
    stargazersCount: number;
    openIssuesCount: number;
    forksCount: number;
    updatedAt: string;
    pushedAt: string;
    communityProfile?: {
      health_percentage: number;
    };
  };
}

const Card: React.FC<RepoCardProps> = ({ repo }) => (
  <div className={styles.card}>
    <div className={styles.org}>{repo.owner}</div>
    <Link href={`https://github.com/${repo.owner}/${repo.name}`}>
      <h2>{repo.name}</h2>
    </Link>

    <div className={styles.container}>
      <div className={styles.labels}>
        {repo.language && (
          <>
            <div id={`${repo.owner}-${repo.name}-language`}>
              {repo.language}
            </div>
            <Tooltip
              anchorId={`${repo.owner}-${repo.name}-language`}
              content="Language"
              place="top"
            />
          </>
        )}

        <div id={`${repo.owner}-${repo.name}-visibility`}>
          {repo.visibility}
        </div>
        <Tooltip
          anchorId={`${repo.owner}-${repo.name}-visibility`}
          content="Visibility"
          place="top"
        />

        {repo.license && (
          <>
            <div id={`${repo.owner}-${repo.name}-license`}>
              {repo.license.name}
            </div>
            <Tooltip
              anchorId={`${repo.owner}-${repo.name}-license`}
              content="License"
              place="top"
            />
          </>
        )}
      </div>

      <div className={styles.stats}>
        <div id={`${repo.owner}-${repo.name}-stars`}>
          <Image width={10} height={10} src={starSvg} alt={"Number of stars"} />{" "}
          {repo.stargazersCount}
        </div>
        <Tooltip
          anchorId={`${repo.owner}-${repo.name}-stars`}
          content="Number of stars"
          place="top"
        />

        <div id={`${repo.owner}-${repo.name}-forks`}>
          <Image width={10} height={10} src={forkSvg} alt={"Number of forks"} />
          {repo.forksCount}
        </div>
        <Tooltip
          anchorId={`${repo.owner}-${repo.name}-forks`}
          content="Number of forks"
          place="top"
        />

        <div id={`${repo.owner}-${repo.name}-community`}>
          <Image
            width={10}
            height={10}
            src={communitySvg}
            alt={"Community profile score"}
          />
          {`${repo.communityProfile?.health_percentage || 0}%`}
        </div>
        <Tooltip
          anchorId={`${repo.owner}-${repo.name}-community`}
          content="Community standards"
          place="top"
        />
      </div>
    </div>
  </div>
);

export default Card;
