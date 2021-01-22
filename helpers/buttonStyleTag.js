export default ({lights,doors}) => {
  return `
    <style>${
      [
    ...Object.entries(lights).map(([k,l]) => `
    .${k.toLowerCase().replace(/\W/g, '')} {
      background-image:url(${l.schema.image.off});
    }
    .${k.toLowerCase().replace(/\W/g, '')}.on {
      background-image:url(${l.schema.image.off});
    }
    `),
    ...Object.entries(doors).map(([k,l]) => `
    .${k.toLowerCase().replace(/\W/g, '')} {
      background-image:url(${l.schema.image.off});
    }
    .${k.toLowerCase().replace(/\W/g, '')}.on {
      background-image:url(${l.schema.image.off});
    }
    `)
  ].join('\n')}
    </style>`
}