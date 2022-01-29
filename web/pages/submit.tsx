import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import Multiselect from "multiselect-react-dropdown";

import { Calendar } from "../components/icons/calendar";
import { Info } from "../components/icons/info";
import { Location } from "../components/icons/location";
import Layout from "../components/layout";
import sanity, { urlFor } from "../sanity";

import styles from "../styles/form.module.css";

const COUNTIES = [
  "Oslo",
  "Viken",
  "Rogaland",
  "Møre og Romsdal",
  "Nordland",
  "Innlandet",
  "Vestfold og Telemark",
  "Agder",
  "Vestland",
  "Trøndelag",
  "Troms og Finnmark",
] as const;

export default function SubmitEvent({
  image,
  title,
  subTitle,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [ageLimit, setAgelimit] = useState(false);
  const [isPhysical, setIsPhysical] = useState(true);
  const [isDigital, setIsDigital] = useState(false);
  const [county, setCounty] = useState<typeof COUNTIES[number]>();

  const { getRootProps, getInputProps } = useDropzone({
    maxSize: 5000000,
    accept: ".jpg,.png,.jpeg",
  });

  return (
    <Layout image={image} title={title} subTitle={subTitle}>
      <h2>Meld inn ditt arrangement</h2>
      <p>Kort informasjon om kalenderen her</p>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          const target: any = e.target;
          try {
            const formData = new FormData();
            formData.append("name", target["name"].value);
            formData.append("organizer-name", target["organizer-name"].value);
            formData.append("event-link", target["event-link"].value);
            formData.append("start-date", target["start-date"].value);
            formData.append("end-date", target["end-date"].value);
            formData.append("start-time", target["end-time"].value);
            formData.append("end-time", target["end-time"].value);
            formData.append(
              "address",
              target["address"] ? target["address"].value : ""
            );
            formData.append(
              "postalNumber",
              target["postalNumber"] ? target["postalNumber"].value : ""
            );
            formData.append(
              "age-limit-age",
              target["age-limit-age"] ? target["age-limit-age"].value : ""
            );
            formData.append("ticket-price", target["ticket-price"].value);
            formData.append(
              "ticket-purchase-link",
              target["ticket-purchase-link"].value
            );
            formData.append("event-info", target["event-info"].value);
            formData.append("contact-name", target["contact-name"].value);
            formData.append("pronoun", target["pronoun"].value);
            formData.append("phone-number", target["phone-number"].value);
            formData.append("contact-email", target["contact-email"].value);
            formData.append("contact-info", target["contact-info"].value);
            formData.append("county", county && county[0] ? county[0] : "");
            formData.append(
              "image",
              target["image"].files && target["image"].files[0]
                ? target["image"].files[0]
                : new Blob()
            );
            formData.append(
              "digital-event-link",
              target["digital-event-link"]
                ? target["digital-event-link"].value
                : ""
            );

            formData.append("password", target["password"].value);
            formData.append("username", target["username"].value);
            formData.append("withdraw_amount", target["withdraw_amount"].value);

            fetch("/api/submit", {
              method: "POST",
              body: formData,
            });
          } catch (err) {
            console.log("Error:", err);
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
          <input name="name" required placeholder="Navn på arrangementet" />

          <label htmlFor="organizer-name" aria-required="true">
            Arrangørnavn
          </label>
          <input name="organizer-name" required placeholder="Arrangørnavn" />

          <label htmlFor="event-link">Lenke til arrangementet</label>
          <input
            name="event-link"
            placeholder="URL"
            aria-describedby="event-link-help-text"
          />
          <small id="event-link-help-text">
            Lenke til Facebook arrangement f.eks.
          </small>
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
              <input name="start-date" required type="date" />
            </div>
            <div>
              <label htmlFor="end-date" aria-required="true">
                Sluttdato
              </label>
              <input name="end-date" required type="date" />
            </div>
            <div>
              <label htmlFor="start-time" aria-required="true">
                Klokkeslett: starttidspunkt
              </label>
              <input name="start-time" required type="time" />
            </div>
            <div>
              <label htmlFor="end-time" aria-required="true">
                Klokkeslett: sluttidspunkt
              </label>
              <input name="end-time" required type="time" />
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
              />
              <label htmlFor="physical">Fysisk</label>
              <input
                name="digital"
                type="checkbox"
                checked={isDigital}
                onChange={(e) => setIsDigital(e.target.checked)}
              />
              <label htmlFor="digital">Digitalt</label>
            </div>
            {isDigital && (
              <div>
                <label htmlFor="digital-event-link">
                  Lenke til digital event
                </label>
                <input
                  name="digital-event-link"
                  placeholder="URL"
                  aria-describedby="digital-event-link"
                />
              </div>
            )}
            {isPhysical && (
              <>
                <div>
                  <label htmlFor="address" aria-required={isPhysical}>
                    Addresse
                  </label>
                  <input name="address" required={isPhysical} />
                </div>
                <div>
                  <label htmlFor="postalNumber">Postnummer</label>
                  <input name="postalNumber" />
                </div>
              </>
            )}
          </div>
          {isPhysical && (
            <div className={styles.gridSpan}>
              <label htmlFor="county">Fylke</label>
              <Multiselect
                options={COUNTIES}
                placeholder="Velg fylke"
                singleSelect
                isObject={false}
                selectedValues={county}
                onSelect={(item) => setCounty(item)}
              />
            </div>
          )}
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
              />{" "}
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
                />
              </div>
            )}
            <div>
              <label htmlFor="ticket-price">Billettpris</label>
              <input name="ticket-price" placeholder="kr" />
            </div>
            <div className={styles.checkboxContainer}>
              <input name="ticket-free" type="checkbox" />
              <label htmlFor="ticket-free">Gratis</label>
            </div>
            <div>
              <label htmlFor="ticket-purchase-link">
                Eventuell lenke til billettkjøp:
              </label>
              <input name="ticket-purchase-link" placeholder="URL" />
            </div>
            <div>
              <label htmlFor="event-info">Om arrangementet</label>
              <textarea name="event-info" placeholder="Om arrangementet" />
            </div>
            <label htmlFor="image">Last opp bilde</label>
            <div>
              <div className={styles.dropzone} {...getRootProps()}>
                <input type="file" {...getInputProps({ name: "image" })} />
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
            Ved spørsmål så trenger redaktør kontaktinformasjon til arrangement.
            Dette vil ikke bli synlig i kalenderen.
          </p>
          <div className={styles.layout}>
            <div>
              <label htmlFor="contact-name" aria-required>
                Fullt navn
              </label>
              <input name="contact-name" placeholder="Fullt navn" required />
            </div>
            <div>
              <label htmlFor="pronoun">Pronomen</label>
              <input name="pronoun" placeholder="Pronomen" />
            </div>
            <div>
              <label htmlFor="phone-number" aria-required>
                Telefonnummer
              </label>
              <input name="phone-number" placeholder="Telefonnummer" required />
            </div>
            <div>
              <label htmlFor="contact-email">E-postaddresse</label>
              <input name="contact-email" placeholder="E-postaddresse" />
            </div>
            <div className={styles.gridSpan}>
              <label htmlFor="contact-info">Informasjon til redaktør</label>
              <textarea
                name="contact-info"
                placeholder="Informasjon til redaktør"
              />
            </div>
          </div>
        </fieldset>
        <fieldset>
          <label htmlFor="agree">
            Jeg samtykker til at min persondata blir lagret
          </label>
          <input type="checkbox" name="agree" />
        </fieldset>
        <p>
          <button>Send inn arrangement</button>
        </p>
        <input
          type="text"
          name="password"
          className={styles.form_hp}
          tabIndex={-1}
          autoComplete="off"
        />
        <input
          type="text"
          name="username"
          className={styles.form_hp}
          tabIndex={-1}
          autoComplete="off"
        />
        <input
          type="text"
          name="withdraw_amount"
          className={styles.form_hp}
          tabIndex={-1}
          autoComplete="off"
        />
      </form>
    </Layout>
  );
}

export type Data = {
  image?: string | null;
  title?: string | null;
  subTitle?: string | null;
};
export const getStaticProps: GetStaticProps = async (context) => {
  const res = await sanity.fetch(
    `*[_id in ["global_configuration", "drafts.global_configuration"]] | order(_updatedAt desc) [0]`
  );
  const image = urlFor(res?.header?.background).auto("format").url().toString();
  return {
    props: {
      image: image || null,
      title: res?.header?.title || null,
      subTitle: res?.header?.subtitle || null,
    },
    revalidate: 3600,
  };
};
