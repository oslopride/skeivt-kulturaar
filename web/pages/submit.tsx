import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { MultiSelect, NativeSelect } from '@mantine/core';

import { Calendar } from '../components/icons/calendar';
import { Info } from '../components/icons/info';
import { Location } from '../components/icons/location';
import Layout from '../components/layout';
import sanity, { urlFor } from '../sanity';

import styles from '../styles/form.module.css';
import Thanks from '../components/thanks';

const COUNTIES = [
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
];

const EVENT_TYPES = [
  'Musikk',
  'Dans',
  'Teater',
  'Drag',
  'Film',
  'Litteratur / Poesi',
  'Samtale / Debatt',
  'Workshop',
  'Andre kunstformer',
];

const EVENT_FILTERS = ['Universelt utformet', 'Tegnespråktolk', 'WC', 'Rusfritt'];

export default function SubmitEvent({ image, title, subTitle }: InferGetStaticPropsType<typeof getStaticProps>) {
  const [ageLimit, setAgelimit] = useState(false);
  const [isPhysical, setIsPhysical] = useState(true);
  const [isDigital, setIsDigital] = useState(false);
  const [eventTypes, setEventTypes] = useState<Array<typeof EVENT_TYPES[number]>>([]);
  const [eventFilters, setEventFilters] = useState<Array<typeof EVENT_FILTERS[number]>>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    maxSize: 5000000,
    accept: '.jpg,.png,.jpeg',
  });

  return (
    <Layout image={image} title={title} subTitle={subTitle}>
      {submitted ? (
        <Thanks />
      ) : (
        <>
          <h2>Meld inn ditt arrangement</h2>
          <p>Kort informasjon om kalenderen her</p>
          <form
            className={styles.form}
            onSubmit={(e) => {
              setSubmitting(true);
              e.preventDefault();
              const target = e.target as HTMLFormElement;
              try {
                const formData = new FormData(target);
                for (const eventType of eventTypes) {
                  formData.append('eventTypes[]', eventType);
                }
                for (const eventFilter of eventFilters) {
                  formData.append('eventFilters[]', eventFilter);
                }

                fetch('/api/submit', {
                  method: 'POST',
                  body: formData,
                }).then((res) => {
                  if (res.status !== 201) {
                    setError(true);
                  } else {
                    setSubmitted(true);
                  }
                });
              } catch (err) {
                console.log('Error:', err);
                setError(true);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            <fieldset>
              <h3>
                <figure>
                  <Info />
                </figure>
                Arrangementinformasjon
              </h3>

              <label htmlFor="name" aria-required="true">
                Navn på arrangementet
              </label>
              <input name="name" required placeholder="Navn på arrangementet" className={styles.input} />

              <label htmlFor="organizer-name" aria-required="true">
                Arrangørnavn
              </label>
              <input name="organizer-name" required placeholder="Arrangørnavn" className={styles.input} />

              <label htmlFor="event-link">Lenke til arrangementet</label>
              <input
                name="event-link"
                placeholder="URL"
                aria-describedby="event-link-help-text"
                className={styles.input}
              />
              <small id="event-link-help-text">Lenke til Facebook arrangement f.eks.</small>
              <div className={styles.layout}>
                <div>
                  <MultiSelect
                    className={styles.multiSelect}
                    data={EVENT_TYPES}
                    label="Type arrangement"
                    placeholder="Velg type"
                    onChange={setEventTypes}
                    value={eventTypes}
                    required
                  />
                </div>
                <div>
                  <MultiSelect
                    className={styles.multiSelect}
                    data={EVENT_FILTERS}
                    label="Filter"
                    placeholder="Velg filter"
                    onChange={setEventFilters}
                    value={eventFilters}
                  />
                </div>
              </div>
            </fieldset>
            <fieldset>
              <h3>
                <figure>
                  <Calendar />
                </figure>
                Dato og klokkeslett
              </h3>
              <div className={styles.layout}>
                <div>
                  <label htmlFor="start-date" aria-required="true">
                    Startdato
                  </label>
                  <input name="start-date" required type="date" className={styles.input} />
                </div>
                <div>
                  <label htmlFor="end-date" aria-required="true">
                    Sluttdato
                  </label>
                  <input name="end-date" required type="date" className={styles.input} />
                </div>
                <div>
                  <label htmlFor="start-time" aria-required="true">
                    Klokkeslett: starttidspunkt
                  </label>
                  <input name="start-time" required type="time" className={styles.input} />
                </div>
                <div>
                  <label htmlFor="end-time" aria-required="true">
                    Klokkeslett: sluttidspunkt
                  </label>
                  <input name="end-time" required type="time" className={styles.input} />
                </div>
              </div>
            </fieldset>
            <fieldset>
              <h3>
                <figure>
                  <Location />
                </figure>
                Velg sted
              </h3>
              <div className={styles.layout}>
                <div className={`${styles.checkboxContainer} ${styles.gridSpan}`}>
                  <input
                    name="physical"
                    type="checkbox"
                    checked={isPhysical}
                    onChange={(e) => setIsPhysical(e.target.checked)}
                    className={styles.input}
                    disabled={!isDigital}
                  />
                  <label htmlFor="physical">Fysisk</label>
                  <input
                    name="digital"
                    type="checkbox"
                    checked={isDigital}
                    onChange={(e) => setIsDigital(e.target.checked)}
                    className={styles.input}
                    disabled={!isPhysical}
                  />
                  <label htmlFor="digital">Digitalt</label>
                </div>

                {isPhysical && (
                  <>
                    <div>
                      <label htmlFor="address" aria-required={isPhysical}>
                        Addresse
                      </label>
                      <input name="address" required={isPhysical} className={styles.input} />
                    </div>
                    <div>
                      <label htmlFor="postalNumber">Postnummer</label>
                      <input name="postalNumber" className={styles.input} />
                    </div>
                    <div className={styles.gridSpan}>
                      <NativeSelect name="county" data={COUNTIES} placeholder="Velg fylke" label="Fylke" required />
                    </div>
                  </>
                )}
                {isDigital && (
                  <div className={styles.gridSpan}>
                    <label htmlFor="digital-event-link">Lenke til digital event</label>
                    <input
                      name="digital-event-link"
                      placeholder="URL"
                      aria-describedby="digital-event-link"
                      className={styles.input}
                    />
                  </div>
                )}
              </div>
            </fieldset>
            <fieldset>
              <h3>
                <figure>
                  <Info />
                </figure>
                Tillegsinformasjon
              </h3>
              <div>
                <label htmlFor="age-limit">Aldersgrense</label>
                <div className={styles.checkboxContainer}>
                  <input
                    name="age-limit"
                    type="checkbox"
                    checked={ageLimit}
                    onChange={() => setAgelimit((prev) => !prev)}
                    className={styles.input}
                  />{' '}
                  Ja
                </div>
                {ageLimit && (
                  <div>
                    <label htmlFor="age-limit-age" aria-required={ageLimit}>
                      Spesifiser alder
                    </label>
                    <input
                      name="age-limit-age"
                      placeholder="18"
                      type="number"
                      required={ageLimit}
                      className={styles.input}
                    />
                  </div>
                )}
                <div>
                  <label htmlFor="ticket-price">Billettpris</label>
                  <input name="ticket-price" placeholder="kr" className={styles.input} />
                </div>
                <div className={styles.checkboxContainer}>
                  <input name="ticket-free" type="checkbox" className={styles.input} />
                  <label htmlFor="ticket-free">Gratis</label>
                </div>
                <div>
                  <label htmlFor="ticket-purchase-link">Eventuell lenke til billettkjøp:</label>
                  <input name="ticket-purchase-link" placeholder="URL" className={styles.input} />
                </div>
                <div>
                  <label htmlFor="event-info">Om arrangementet</label>
                  <textarea name="event-info" placeholder="Om arrangementet" className={styles.input} />
                </div>
                <label htmlFor="image">Last opp bilde</label>
                <div>
                  <div className={styles.dropzone} {...getRootProps()}>
                    <input type="file" {...getInputProps({ name: 'image' })} />
                    <p>+</p>
                    <p>Trykk eller drag &apos;n drop filer her...</p>
                  </div>
                  <div className={styles.dropzone__info}>
                    Krav for at bildet skal bli godkjent:
                    <ul>
                      <li>Bildet må eies av arrangør</li>
                      <li> Last opp filformat: .jpg, eller .png</li>
                      <li> Max 5mb</li>
                    </ul>
                  </div>
                </div>
              </div>
            </fieldset>
            <fieldset>
              <h3>
                <figure>
                  <Calendar />
                </figure>
                Kontaktperson
              </h3>
              <p>
                Ved spørsmål så trenger redaktør kontaktinformasjon til arrangement. Dette vil ikke bli synlig i
                kalenderen.
              </p>
              <div className={styles.layout}>
                <div>
                  <label htmlFor="contact-name" aria-required>
                    Fullt navn
                  </label>
                  <input name="contact-name" placeholder="Fullt navn" required className={styles.input} />
                </div>
                <div>
                  <label htmlFor="pronoun">Pronomen</label>
                  <input name="pronoun" placeholder="Pronomen" className={styles.input} />
                </div>
                <div>
                  <label htmlFor="phone-number" aria-required>
                    Telefonnummer
                  </label>
                  <input name="phone-number" placeholder="Telefonnummer" required className={styles.input} />
                </div>
                <div>
                  <label htmlFor="contact-email">E-postaddresse</label>
                  <input name="contact-email" placeholder="E-postaddresse" className={styles.input} />
                </div>
                <div className={styles.gridSpan}>
                  <label htmlFor="contact-info">Informasjon til redaktør</label>
                  <textarea name="contact-info" placeholder="Informasjon til redaktør" className={styles.input} />
                </div>
              </div>
            </fieldset>
            <fieldset>
              <div className={styles.checkboxContainer}>
                <label htmlFor="agree" aria-required>
                  Jeg samtykker til at min persondata blir lagret
                </label>
                <input type="checkbox" name="agree" className={styles.input} required />
              </div>
            </fieldset>
            <button className={styles.button} disabled={submitting}>
              Send inn arrangement
            </button>
            {error && <p>Her skjedde det dessverre noe feil. Se over alle feltene igjen for sikkerhets skyld!</p>}
            <input type="text" name="password" className={styles.form_hp} tabIndex={-1} autoComplete="off" />
            <input type="text" name="username" className={styles.form_hp} tabIndex={-1} autoComplete="off" />
            <input type="text" name="withdraw_amount" className={styles.form_hp} tabIndex={-1} autoComplete="off" />
          </form>
        </>
      )}
    </Layout>
  );
}

export type Data = {
  image?: string | null;
  title?: string | null;
  subTitle?: string | null;
};
export const getStaticProps: GetStaticProps = async () => {
  const res = await sanity.fetch(
    `*[_id in ["global_configuration", "drafts.global_configuration"]] | order(_updatedAt desc) [0]`
  );
  const image = urlFor(res?.header?.background).auto('format').url().toString();
  return {
    props: {
      image: image || null,
      title: res?.header?.title || null,
      subTitle: res?.header?.subtitle || null,
    },
    revalidate: 3600,
  };
};
