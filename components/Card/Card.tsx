import styles from "./Card.module.css";
import Image from "next/image";

import Link from "next/link";
import { Tooltip } from "react-tooltip";
import React from "react";

interface Indicator {
  name: string;

  tooltipLabel: string;
  imageSrc: string;

  imageSize?: number;
  value: string;
}

interface Tag {
  name: string;

  tooltipLabel: string;
  value: string;
}

interface CardContentProps {
  title: string;
  titleLinkUrl?: string;
  subtitle?: string;

  maturity: number;

  tags?: Tag[];

  indicators?: Indicator[];
}

const whichColour = (score: number) : string => {
  let result = "";

  if (score >= 70) {
    result = "green";
  } else if (score > 30) {
    result = "amber";
  } else if (score <= 30) {
    result = "red";
  }

  return result;
}

const colours : { [key: string]: string } = {
  "red": "#ffc5c1",
  "amber": "#ffd891",
  "green": "#d6ffd6",
}

const Card: React.FC<CardContentProps> = ({
  title,
  titleLinkUrl,
  subtitle,
  tags,
  indicators,
  maturity,
}) => (
  <div className={styles.card} style={{ backgroundColor: colours[whichColour(maturity)]}}>
    {subtitle && <div className={styles.org}>{subtitle}</div>}
    {titleLinkUrl ? (
      <Link href={titleLinkUrl}>
        <h2>{title}</h2>
      </Link>
    ) : (
      <h2>{title}</h2>
    )}

    <div className={styles.container}>
      <div className={styles.labels}>
        {tags?.map((tag) => (
          <React.Fragment key={`${subtitle}-${title}-${tag.name}`}>
            {tag.value && (
              <>
                <div id={`${subtitle}-${title}-${tag.name}`}>{tag.value}</div>
                <Tooltip
                  anchorId={`${subtitle}-${title}-${tag.name}`}
                  content={`${tag.tooltipLabel}`}
                  place="top"
                />
              </>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className={styles.indicators}>
        {indicators?.map((indicator) => (
          <React.Fragment key={`${subtitle}-${title}-${indicator.name}`}>
            <div id={`${subtitle}-${title}-${indicator.name}`}>
              <Image
                width={indicator.imageSize || 10}
                height={indicator.imageSize || 10}
                src={indicator.imageSrc}
                alt={indicator.tooltipLabel}
              />{" "}
              {indicator.value}
            </div>
            <Tooltip
              anchorId={`${subtitle}-${title}-${indicator.name}`}
              content={`${indicator.tooltipLabel}`}
              place="top"
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  </div>
);

export default Card;
