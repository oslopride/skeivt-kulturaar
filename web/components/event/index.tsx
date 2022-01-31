import Link from 'next/link';
import Image from 'next/image';
import styles from './event.module.css';
import { useState } from 'react';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@reach/disclosure';

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];

export type EventProps = {
  startDate: string;
  endDate: string;
  eventName: string;
  imgUrl?: string;
  organizer: string;
  address: string;
  eventLink: string;
  facebookLink?: string;
  tags: Array<string>;
};
export function Event({
  startDate: providedStartDate,
  endDate: providedEndDate,
  eventLink,
  eventName,
  imgUrl,
  organizer,
  address,
  facebookLink,
  tags,
}: EventProps) {
  const [isOpen, setIsOpen] = useState(false);
  const startDate = new Date(providedStartDate);
  const endDate = new Date(providedEndDate);
  const imageCoverMonth = MONTHS[startDate.getMonth()];
  const date = startDate.getDate();
  return (
    <div className={styles.event}>
      <div className={styles.imgContainer}>
        <time className={styles.date}>
          {date}
          <span>{imageCoverMonth}</span>
        </time>
        {imgUrl && <Image className={styles.img} src={imgUrl} alt={`Event ${''}`} layout="fill" />}
      </div>
      <div className={styles.content}>
        <span>
          <time>{startDate.toLocaleDateString()}</time>
          {' - '}
          <time>{endDate.toLocaleDateString()}</time>
        </span>
        <h3>{eventName}</h3>
        <p>
          {organizer} -{' '}
          <a href="https://google.com" target={`_gm_${eventName || 'blank'}`} rel="noreferrer">
            Google maps link
          </a>
        </p>
        <ul className={styles.tagList}>
          <li className={styles.tagList__item}>Tag</li>
          <li className={styles.tagList__item}>Tag</li>
          <li className={styles.tagList__item}>Tag</li>
          <li className={styles.tagList__item}>Tag</li>
        </ul>
        <a
          href="https://facebook.com"
          className={styles.eventLink}
          target={`_fb_${eventName || 'blank'}`}
          rel="noreferrer"
        >
          Facebook link
        </a>
        <Disclosure open={isOpen} onChange={() => setIsOpen((prev) => !prev)}>
          <DisclosurePanel>Event information</DisclosurePanel>
          <DisclosureButton className={styles.readMore}>
            {isOpen ? 'Les mindre' : 'Les mer om arrangementet'}
          </DisclosureButton>
        </Disclosure>
      </div>
    </div>
  );
}
