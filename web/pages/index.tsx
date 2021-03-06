import Link from 'next/link';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import sanity, { urlFor } from '../sanity';
import { MultiSelect } from '@mantine/core';
import { DateRangePicker } from '@mantine/dates';

import styles from '../styles/event-list.module.css';

import { Event } from '../components/event';
import Layout from '../components/layout';
import { PublicSanityEvent } from '../types/sanity';
import SEO from '../components/seo';
import { useState } from 'react';

export type EventProps = Omit<PublicSanityEvent, 'image' | 'eventDates'> & {
  _id: string;
  image: string | null;
  eventStart: string;
  eventEnd: string;
};

export default function EventList({
  image,
  title,
  subTitle,
  events,
  ctaText,
  ctaButton,
  ctaHeader,
  metaImage,
  metaTitle,
  metaDescription,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [dateFilter, setDateFilter] = useState<[Date | null, Date | null]>([null, null]);
  const [county, setCounty] = useState<string[]>([]);
  const [type, setType] = useState<string[]>([]);
  const [filter, setFilter] = useState<string[]>([]);
  return (
    <Layout image={image} title={title} subTitle={subTitle}>
      <SEO image={metaImage} title={metaTitle} description={metaDescription} />
      <div className={styles.filterGroup}>
        <MultiSelect
          className={styles.filter}
          data={[
            'Oslo',
            'Viken',
            'Rogaland',
            'Møre og Romsdal',
            'Nordland',
            'Innlandet',
            'Vestfold og Telemark',
            'Agder',
            'Vestland',
            'Trøndelag',
            'Troms og Finnmark',
          ]}
          clearable
          value={county}
          onChange={setCounty}
          placeholder={'Velg fylke'}
        />
        <MultiSelect
          className={styles.filter}
          data={[
            'Musikk',
            'Dans',
            'Teater',
            'Drag',
            'Film',
            'Litteratur / Poesi',
            'Samtale / Debatt',
            'Workshop',
            'Andre kunstformer',
            'Pride',
          ]}
          clearable
          value={type}
          onChange={setType}
          placeholder={'Velg type'}
        />
        <MultiSelect
          className={styles.filter}
          data={['Universelt utformet', 'Tegnespråktolk', 'WC', 'Rusfritt']}
          clearable
          value={filter}
          onChange={setFilter}
          placeholder={'Velg filter'}
        />
        <DateRangePicker
          className={styles.filter}
          placeholder="Velg dato"
          value={dateFilter}
          onChange={setDateFilter}
        />
      </div>
      <ol className={styles.eventList}>
        {events
          .filter((event) => {
            const today = new Date();
            const eventStart = new Date(event.eventStart);
            const eventEnd = new Date(event.eventEnd);

            //Only filter based on date and not time
            eventStart.setHours(0, 0, 0, 0);
            eventEnd.setHours(0, 0, 0, 0);

            let relevantEvent = true;

            if (dateFilter[0] && dateFilter[1]) {
              relevantEvent = eventStart >= dateFilter[0] && eventStart <= dateFilter[1];
              relevantEvent = relevantEvent || (eventEnd <= dateFilter[1] && eventEnd >= dateFilter[0]);
            }

            relevantEvent = relevantEvent && today <= eventEnd;
            return relevantEvent;
          })
          .filter((event) => {
            if (!county) {
              return false;
            }
            return county.length === 0 || county.includes(event.county);
          })
          .filter((event) => {
            if (!event.eventTypes && type.length > 0) {
              return false;
            }
            return type.length === 0 || event.eventTypes.some((eventType) => type.includes(eventType));
          })
          .filter((event) => {
            if (!event.eventFilters && filter.length > 0) {
              return false;
            }
            return filter.length === 0 || event.eventFilters.some((eventFilter) => filter.includes(eventFilter));
          })
          .map((event, index) => {
            return (
              <li key={`${event._id}-${index}`}>
                <Event
                  startDate={event.eventStart}
                  endDate={event.eventEnd}
                  address={event.address}
                  eventLink={event.eventLink || event.digitalEventUrl}
                  digitalLink={event.digitalEventUrl}
                  eventName={event.eventName}
                  organizer={event.eventOrganizer}
                  imgUrl={event.image}
                  info={event.eventDescription}
                  county={event.county}
                  ageLimit={event.ageLimit}
                  ticketPrice={event.ticketPrice}
                  filters={event.eventFilters}
                  types={event.eventTypes}
                />
              </li>
            );
          })}
      </ol>

      <section className={styles.footer}>
        <h2>{ctaHeader}</h2>
        <p>{ctaText}</p>
        <Link href="/submit">{ctaButton}</Link>
      </section>
    </Layout>
  );
}

export type EventListProps = {
  image: string | null;
  title: string | null;
  subTitle: string | null;
  events: Array<EventProps>;
  ctaText: string;
  ctaButton: string;
  ctaHeader: string;
  metaTitle: string;
  metaDescription: string;
  metaImage: string;
};
export const getStaticProps: GetStaticProps<EventListProps> = async () => {
  // be sure to strip away personal information before passing it down, we'll painstakingly and explicitly select exactly what fields
  // we want from the query (:
  const fields =
    '_id,address,ageLimit,county,digitalEventUrl,eventDates,eventDescription,eventFilters,eventLink,eventName,eventTypes,eventOrganizer,image,postalCode,ticketPrice';
  const query = `{
    "configuration": *[_id in ["global_configuration", "drafts.global_configuration"]] | order(_updatedAt desc) [0],
    "events": *[_type == 'eventRequest' && approved == true && !(_id in path('drafts.**'))]{${fields}},
  }`;
  const res = await sanity.fetch(query);
  const image = urlFor(res?.configuration?.header?.background).auto('format').url().toString();
  const metaImage = urlFor(res?.configuration?.header?.background).size(1200, 630).auto('format').url().toString();

  // Do as much as we can to massage the data here instead of client-side
  const sanityEvents: Array<PublicSanityEvent> = res?.events || [];
  const events: Array<EventProps> = [];
  for (const event of sanityEvents) {
    // for each date of an event, create a new event
    for (const { eventEnd, eventStart } of event.eventDates || []) {
      const image = event.image ? urlFor(event.image).size(400, 250).auto('format').url().toString() : null;
      const { ...oldEvent } = event;
      const newEvent: EventProps = {
        ...oldEvent,
        image,
        eventStart,
        eventEnd,
      };
      events.push(newEvent);
    }
  }
  events.sort((a, b) => {
    if (a.eventStart < b.eventStart) {
      return -1;
    }
    if (a.eventStart > b.eventStart) {
      return 1;
    }
    return 0;
  });
  const props: EventListProps = {
    image: image || null,
    title: res?.configuration?.header?.title || null,
    subTitle: res?.configuration?.header?.subtitle || null,
    ctaText: res?.configuration?.cta?.text || '',
    ctaButton: res?.configuration?.cta?.button || '',
    ctaHeader: res?.configuration?.cta?.title || '',
    metaTitle: res?.configuration?.meta?.title || '',
    metaDescription: res?.configuration?.meta?.description || '',
    metaImage,
    events,
  };

  return {
    props,
    revalidate: 3600, // 1 hr
  };
};
