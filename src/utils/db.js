import { db } from '../config/firebase'


const testData = {
  morae: {
    hiragana: {
      count: {
        start: "3041",
        end: "3093",
        length: 83
      },
      array: [
        "xa",   "a",              "xi", "i",                "xu",     "u",                "xe", "e",              "xo",   "o",
                "ka", "ga",             "ki",   "gi",                 "ku",   "gu",             "ke", "ge",               "ko", "go",
                "sa", "za",             "shi",  "ji",                 "su",   "zu",             "se", "ze",               "so", "zo",
                "ta", "da",             "chi",  "ji",       "xtsu",   "tsu",  "zu",             "te", "de",               "to", "do",
                "na",                   "ni",                         "nu",                     "ne",                     "no", 
                "ha", "ba", "pa",       "hi",   "bi", "pi",           "fu",   "bu", "pu",       "he", "be", "pe",         "ho", "bo", "po",
                "ma",                   "mi",                         "mu",                     "me",                     "mo", 
        "xya",  "ya",                                       "xyu",    "yu",                                       "xyo",  "yo",
                "ra",                   "ri",                         "ru",                     "re",                     "ro",
        "xwa",  "wa",                   "wi",                                                   "we",                     "wo",
        "n"
      ],
      except: ["xa", "xi", "xu", "xe", "xo", "xwa", "wi", "we"]
    },
    katakana: {}
  },
  words: {}
}


export async function getTest(url)  {
  const abortController = new AbortController()

  return testData

  // try {
  //   const promise = await fetch(url, {
  //     headers: { Authorization: '' },
  //     method: 'GET',
  //     mode: 'cors',
  //     signal: abortController.signal,
  //   })
  //   const res = res.json()
  // } 
  // catch(err => {
  //   console.error(err)
  // })
}
