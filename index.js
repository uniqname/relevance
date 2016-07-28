Object.entries = Object.entries || (obj =>
  Object.keys(obj)
    .reduce((entries, key) => [...entries, [key, obj[key]]], []));


const RELEVANCE = Symbol('RELEVANCE');
const REMAINDER = '_';

const keyTermMatcher = /^(\w+):((?:"|').+(?:"|')|\w+)/im;

export default (weightMap={}) => (list=[{}]) => (searchTerm='.+') => {

  // An object whose keys mirrors the searchable object,
  // but whose values are a multiplicative for the number
  // of matches found on the corresponding searchable object.
  const weightOfKeys = Object.keys(list[0])
    .reduce((o, key) => ({
      ...o,
      [key]: (weightMap[key] === undefined) ? 1 : weightMap[key]
    }), {});

  const searchTerms = getTermsForKeys(searchTerm);

  return list
    .map(item => ({
      ...item,
      [RELEVANCE]: Object.entries(item)
        .reduce((relevance, [key, val]) => {
          const propRelevance = (searchTerms[key])
            ? (val.match(searchTerms[key]) || []).length * weightOfKeys[key]
            : 0;

          const generalRelevance = (val.match(searchTerms[REMAINDER]) || []).length * weightOfKeys[key]
          const sum = relevance + propRelevance + generalRelevance;
          return sum;

        }, 0)
    }))
    .filter(item => item[RELEVANCE])
    .sort((a, b) => b[RELEVANCE] - a[RELEVANCE]);
};

// Creates an object of key/regular expression pairs.
// The RegEx is applied to the corrisponding property
// on the searchable object to look for matches.
function getTermsForKeys(keyTerms) {
  if (typeof keyTerms === 'string') {
    return getTermsForKeys({ [REMAINDER]: keyTerms });
  }
  const remainder = keyTerms[REMAINDER];
  const [all, key, val] = remainder.match(keyTermMatcher) || [];

  if (!all) {
    return {
      ...keyTerms,
      [REMAINDER]: new RegExp(keyTerms[REMAINDER], 'gi')
    }
  }

  return getTermsForKeys({
    ...keyTerms,

    //Strip quotes from edges of search term.
    [key]: new RegExp(val.replace(/^"|'/, '').replace(/"|'$/, ''), 'gi'),
    [REMAINDER]: keyTerms[REMAINDER].replace(all, '').trim()
  });

}
