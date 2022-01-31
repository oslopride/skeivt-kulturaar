import Link from 'next/link';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import sanity, { urlFor } from '../sanity';

import styles from '../styles/event-list.module.css';

import { Event } from '../components/event';
import Layout from '../components/layout';
import { PublicSanityEvent } from '../types/sanity';

export type EventProps = Omit<PublicSanityEvent, 'image' | 'eventDates'> & {
  _id: string;
  image?: string;
  eventStart: string;
  eventEnd: string;
};

export default function EventList({ image, title, subTitle, events }: InferGetStaticPropsType<typeof getStaticProps>) {
  console.log(events);
  return (
    <Layout image={image} title={title} subTitle={subTitle}>
      <ol className={styles.eventList}>
        {events.map((event) => (
          <li key={event._id}>
            <Event
              startDate={event.eventStart}
              endDate={event.eventEnd}
              address=""
              eventLink=""
              eventName={event.eventName}
              organizer=""
              tags={[]}
              facebookLink=""
              imgUrl=""
            />
          </li>
        ))}
      </ol>

      <section className={styles.footer}>
        <h2>Legg til arrangement i kalenderen</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Non amet ac velit velit eget. Risus est, risus ac
          vitae eu. Amet, morbi semper eu, amet sed sit in. Maecenas imperdiet enim dignissim amet fermentum, velit at.
        </p>
        <Link href="/submit">Meld inn arrangement</Link>
      </section>
    </Layout>
  );
}

export type EventListProps = {
  image: string | null;
  title: string | null;
  subTitle: string | null;
  events: Array<EventProps>;
};
export const getStaticProps: GetStaticProps<EventListProps> = async () => {
  // be sure to strip away personal information before passing it down, we'll painstakingly and explicitly select exactly what fields
  // we want from the query (:
  const fields =
    '_id,additionalInfo,address,ageLimit,county,digitalEventUrl,eventDates,eventDescription,eventFilters,eventLink,eventName,eventTypes,image,postalCode,ticketPrice,ticketUrl';
  const query = `{
    "configuration": *[_id in ["global_configuration", "drafts.global_configuration"]] | order(_updatedAt desc) [0],
    "events": *[_type == 'eventRequest' && approved == true]{${fields}},
  }`;
  const res = await sanity.fetch(query);
  const image = urlFor(res?.configuration?.header?.background).auto('format').url().toString();

  // Do as much as we can to massage the data here instead of client-side
  const sanityEvents: Array<PublicSanityEvent> = res?.events || [];
  const events: Array<EventProps> = [];
  for (const event of sanityEvents) {
    // for each date of an event, create a new event
    for (const { eventEnd, eventStart } of event.eventDates || []) {
      const image = event.image ? urlFor(event.image).size(400, 250).auto('format').url().toString() : undefined;
      const { eventDates, ...oldEvent } = event;
      const newEvent: EventProps = {
        ...oldEvent,
        image,
        eventStart,
        eventEnd,
      };
      events.push(newEvent);
    }
  }
  const props: EventListProps = {
    image: image || null,
    title: res?.configuration?.header?.title || null,
    subTitle: res?.configuration?.header?.subtitle || null,
    events,
  };

  return {
    props,
    revalidate: 3600,
  };
};
