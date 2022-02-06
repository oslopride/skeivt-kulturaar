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
  imgUrl?: string | null;
  organizer: string;
  address?: string;
  eventLink?: string;
  digitalLink?: string;
  tags: Array<string>;
  info?: string;
  county?: string;
  ageLimit?: number;
  ticketPrice?: number;
};
export function Event({
  startDate: providedStartDate,
  endDate: providedEndDate,
  eventLink,
  digitalLink,
  eventName,
  imgUrl,
  organizer,
  address,
  tags,
  info,
  county,
  ageLimit,
  ticketPrice,
}: EventProps) {
  const [isOpen, setIsOpen] = useState(false);
  const startDate = new Date(providedStartDate);
  const endDate = new Date(providedEndDate);
  const imageStartCoverMonth = MONTHS[startDate.getMonth()];
  const startDay = startDate.getDate();
  const imageEndCoverMonth = MONTHS[endDate.getMonth()];
  const endDay = endDate.getDate();
  const isSameEndDay = imageStartCoverMonth === imageEndCoverMonth && startDay === endDay;
  const startDateFormatted = format(startDate, `d MMM yy 'kl.' kk.mm`, { locale: nb });
  const endDateFormatted = isSameEndDay
    ? format(endDate, `kk.mm`, { locale: nb })
    : format(endDate, `d MMM yy 'kl.' kk.mm`, { locale: nb });
  return (
    <div className={styles.event}>
      <div className={styles.imgContainer}>
        <time className={`${imgUrl ? styles.imgDate : styles.date} ${isSameEndDay ? '' : styles.diffDate}`}>
          <span>
            {startDay}
            {isSameEndDay ? null : `-${endDay}`}
          </span>
          <span>
            {imageStartCoverMonth}
            {isSameEndDay ? null : `-${imageEndCoverMonth}`}
          </span>
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
          <DisclosurePanel className={styles.info}>
            <div className={styles.infoContainer}>
              <span>Arrangør:</span>
              <span>{organizer}</span>
            </div>
            <div className={styles.infoContainer}>
              <span>Aldersgrense:</span>
              <span>{ageLimit ? ageLimit : 'Ingen'}</span>
            </div>
            <div className={styles.infoContainer}>
              <span>Billettpris:</span>
              <span>{ticketPrice ? `${ticketPrice},-` : 'Gratis'}</span>
            </div>
            {digitalLink && (
              <div className={styles.infoContainer}>
                <span>Digitalt:</span>
                <span>
                  <a href={digitalLink}>Lenke til digitalt arrangement</a>
                </span>
              </div>
            )}
            <div className={styles.infoContainer}>
              <span>Om arrangementet:</span>
              <span>{info}</span>
            </div>
          </DisclosurePanel>
          <DisclosureButton className={styles.readMore}>
            {isOpen ? 'Les mindre' : 'Les mer om arrangementet +'}
          </DisclosureButton>
        </Disclosure>
      </div>
    </div>
  );
}
