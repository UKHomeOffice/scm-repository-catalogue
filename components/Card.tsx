import styles from "./Card.module.css"
import Image from "next/image";
import starSvg from "./star.svg";
import forkSvg from "./fork.svg";
import Link from "next/link";

interface RepoCardProps {
  repo: {
    name: string;
    owner: string;
    description: string;
    visibility: string;
    license?: {
      name?: string;
    }
    language?: string
    stargazersCount: number
    openIssuesCount: number
    forksCount: number
    updatedAt: string
    pushedAt: string
  }

}


const Card: React.FC<RepoCardProps> = ({repo}) => (<div className={styles.card}>
  <div className={styles.org}>{repo.owner}</div>
  <Link href={`https://github.com/${repo.owner}/${repo.name}`}><h2>{repo.name}</h2></Link>

  <div className={styles.container}>

  <div className={styles.labels}>
    {repo.language && (<div>{repo.language}</div>) }

  <div>{repo.visibility}</div>

  {repo.license && (
    <div>{repo.license.name}</div>
  )}
  </div>


  <div className={styles.stats}>
    <Image width={10} height={10} src={starSvg} alt={"Number of stars"} /> {repo.stargazersCount}
    <Image width={10} height={10} src={forkSvg} alt={"Number of forks"} />{repo.forksCount}
  </div>
  </div>


</div>);

export default Card;