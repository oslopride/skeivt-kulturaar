import Image from 'next/image';
import styles from './event.module.css';
import { useState } from 'react';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@reach/disclosure';
import { format } from 'date-fns';
import nb from 'date-fns/locale/nb';

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];

export type EventProps = {
  startDate: string;
  endDate: string;
  eventName: string;
  imgUrl?: string;
  organizer: string;
  address?: string;
  eventLink?: string;
  tags: Array<string>;
  info?: string;
  county?: string;
};
export function Event({
  startDate: providedStartDate,
  endDate: providedEndDate,
  eventLink,
  eventName,
  imgUrl,
  organizer,
  address,
  tags,
  info,
  county,
}: EventProps) {
  const [isOpen, setIsOpen] = useState(false);
  const startDate = new Date(providedStartDate);
  const endDate = new Date(providedEndDate);
  const imageCoverMonth = MONTHS[startDate.getMonth()];
  const date = startDate.getDate();
  const startDateFormatted = format(startDate, 'EEEE kk.mm', { locale: nb });
  const endDateFormatted = format(endDate, 'kk.mm', { locale: nb });
  return (
    <div className={styles.event}>
      <div className={styles.imgContainer}>
        <time className={imgUrl ? styles.imgDate : styles.date}>
          {date}
          <span>{imageCoverMonth}</span>
        </time>
        {imgUrl && <Image className={styles.img} src={imgUrl} alt={`Event ${''}`} layout="fill" />}
      </div>
      <div className={styles.content}>
        <span>
          <time>{startDateFormatted}</time>
          {' - '}
          <time>{endDateFormatted}</time>
        </span>
        <h3>{eventName}</h3>
        <p>{address && `${address}, ${county}`}</p>
        <ul className={styles.tagList}>
          {tags.map((tag) => (
            <li key={tag} className={styles.tagList__item}>
              {tag}
            </li>
          ))}
        </ul>
        {eventLink && (
          <a href={eventLink} className={styles.eventLink} target={`_${eventName || 'blank'}`} rel="noreferrer">
            Gå til arrangement
          </a>
        )}
        <Disclosure open={isOpen} onChange={() => setIsOpen((prev) => !prev)}>
          <DisclosurePanel className={styles.info}>{info}</DisclosurePanel>
          <DisclosureButton className={styles.readMore}>
            {isOpen ? 'Les mindre' : 'Les mer om arrangementet +'}
          </DisclosureButton>
        </Disclosure>
      </div>
    </div>
  );
}
