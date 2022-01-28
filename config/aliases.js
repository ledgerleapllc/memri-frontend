const aliases = (prefix = `src`) => ({
  '@assets': `${prefix}/assets`,
  '@shared': `${prefix}/shared`,
  '@stores': `${prefix}/stores`,
  '@routes': `${prefix}/routes`,
  '@redux': `${prefix}/redux`,
  '@utils': `${prefix}/utils`,
  '@pages': `${prefix}/pages`,
  '@src': `${prefix}`,
});

module.exports = aliases;
