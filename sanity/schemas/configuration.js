import { MdSettings } from 'react-icons/md';

export default {
  title: 'Configuration',
  icon: MdSettings,
  name: 'configuration',
  type: 'document',
  __experimental_actions: ['create', 'update', /*'delete',*/ 'publish'],
  fields: [
    {
      title: 'Header',
      name: 'header',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
        },
        {
          name: 'subtitle',
          title: 'Subtitle',
          type: 'string',
        },
        {
          name: 'background',
          title: 'Background image',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    },
    {
      title: 'CTA seksjon',
      name: 'cta',
      type: 'object',
      fields: [
        {
          title: 'Tittel',
          name: 'title',
          type: 'string',
        },
        {
          title: 'Tekst på knapp',
          name: 'button',
          type: 'string',
        },
        {
          title: 'Hovedtekst',
          description: 'Tekst i rød boks på hovedsiden',
          name: 'text',
          type: 'string',
        }
      ],
    },
  ],
};
