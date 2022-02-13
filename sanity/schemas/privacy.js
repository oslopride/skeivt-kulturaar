import { MdLink } from 'react-icons/md';

export default {
  title: 'Privacy Policy',
  icon: MdLink,
  name: 'privacy',
  type: 'document',
  __experimental_actions: ['create', 'update', /*'delete',*/ 'publish'],
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    
    {
      title: 'Body',
      name: 'body',
      description: `Pågrunn av at vi samler inn persondata (navn, email, pronomen), må vi ha en personvernerklæring som inneholder enkelt språk om hvordan vi behandler persondata.\n
      Denne burde inneholde informasjon om hvordan vi bruker dataen, hvordan den blir lagret, og hvordan man kan kontakte noen for å slette den.`,
      type: 'array',
      of: [
        { type: 'block' },
      ],
    },
  ],
};
