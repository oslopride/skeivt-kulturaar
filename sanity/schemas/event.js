export default {
  name: "eventRequest",
  title: "External event request",
  type: "document",
  liveEdit: true,
  __experimental_actions: ["create", "update", /* 'delete', */ "publish"],
  fields: [
    {
      name: "eventName",
      title: "Event name",
      description: "The name of this event",
      type: "string",
    },
    {
      name: "eventDescription",
      title: "Event description",
      description: "The description of the event",
      type: "string",
    },
    {
      name: "eventLink",
      title: "Event link",
      description: "e.g. Facebook link for the event",
      type: "url",
    },
    {
      name: "eventTypes",
      title: "Event type(s)",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "eventFilters",
      title: "Event filter(s)",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "eventDates",
      title: "Event dates",
      description: "The dates that this event will happen",
      type: "array",
      of: [
        {
          name: "eventDate",
          type: "object",
          fields: [
            { name: "eventStart", title: "Event start", type: "datetime" },
            { name: "eventEnd", title: "Event end", type: "datetime" },
          ],
        },
      ],
    },
    { name: "address", title: "Address", type: "string" },
    { name: "postalCode", title: "Postal code", type: "string" },
    { name: "county", title: "County", type: "string" },
    { name: "digitalEventUrl", title: "Digital event URL", type: "url" },
    { name: "ageLimit", title: "Age limit", type: "number" },
    { name: "ticketPrice", title: "Ticket price", type: "number" },
    { name: "ticketUrl", title: "Ticket URL", type: "url" },
    {
      name: "contactName",
      title: "Contact person's first name",
      type: "string",
    },
    { name: "pronoun", title: "Contact person's pronoun", type: "string" },
    {
      name: "tlfNr",
      title: "Contact person's telephone number",
      type: "string",
    },
    {
      name: "contactEmail",
      title: "Contact person's email",
      type: "string",
    },
    {
      name: "additionalInfo",
      title: "Additional info",
      desription: "Extra information written for the editor",
      type: "text",
    },
    {
      name: "image",
      title: "Image",
      description: "Image for event",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "approved",
      title: "Er denne forespørselen allerede godkjent",
      type: "boolean",
    },
  ],
  preview: {
    select: {
      title: "eventName",
      subtitle: "contactName",
    },
    prepare: ({ title, subtitle }) => ({
      title: title,
      subtitle: subtitle,
    }),
  },
};
