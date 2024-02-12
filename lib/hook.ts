import useSWR from 'swr';

export function GetDataProduct(
  search?: string,
  typeSearch?: string[] | '',
  typePrice?: number[] | '',
  limit?: number,
  offset?: number
) {
  const {data, isLoading} = useSWR(
    [
      `/api/product${search ? '?q=' + search : ''}${
        typePrice?.length && search
          ? '&price=' + JSON.stringify(typePrice)
          : '?price=' + JSON.stringify(typePrice)
      }${
        typeSearch?.length ? '&type=' + JSON.stringify(typeSearch) : '&type=[]'
      }&limit=${limit}&offset=${offset}`,
    ],
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 3600000,
    }
  );
  return {data, isLoading};
}
export function GetDataCartShopping(ids: string | null) {
  const option = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ids}),
  };
  const {data, isLoading} = useSWR(
    ids ? [`/api/product/cartShopping`, option] : null,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 3600000,
    }
  );
  return {dataCartShopping: data};
}
export function GetProductFeatured() {
  const {data} = useSWR([`/api/product/featured`], fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 3600000,
  });
  return {data};
}
export function GetFrontPage() {
  const {data} = useSWR([`/api/product/frontPage`], fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 3600000,
  });
  return {data};
}
async function fetcher(dataParams: any[]) {
  const option = dataParams[1] || {};
  const response = await fetch(
    (process.env.NEXT_PUBLIC_API || 'http://localhost:3000') + dataParams[0],
    option
  );
  const data = await response.json();
  // const data: any = {
  //   results: [
  //     {
  //       type: ['billeteras'],
  //       vendor: 'marfaust',
  //       Name: 'MINI BILLETERAS',
  //       Images: [
  //         {
  //           id: 'attmHNl3pRePtve8d',
  //           width: 720,
  //           height: 535,
  //           url: 'https://v5.airtableusercontent.com/v3/u/25/25/1707760800000/GuVV9aAhu2002jcFEJ6hmw/qHR4_p6R90Mcuiqaj6OFC47SFwSPE9E6LZIeM2wcElkZI3rslACE2ycB3gKD0W_9hchXuH8eT_v04kprEwUj5jj2LHcR2dw-Pf_Ef1u9lUcpqiW3BrSaiGNZ-6_X8YbJuZvpZcxaxrtU-TWxGVyWhqeBZdSM5LFUVVRbiSi2O_QTKwlsawWtjMq1brQ9swGy/3vpLtGkXQIO-emtapZnbG-1O8tTYPnYjH_s5JhJgAH4',
  //           filename:
  //             'Imagen de WhatsApp 2024-02-12 a las 09.08.18_a2225348.jpg',
  //           size: 50794,
  //           type: 'image/jpeg',
  //           thumbnails: {
  //             small: {
  //               url: 'https://v5.airtableusercontent.com/v3/u/25/25/1707760800000/vBBk0AAwkV_tZsyD8saRWg/43ssu2K81jRJHxKgN6AJLgJRXaCUrJsj8Aql03Dxmn93ySunWm5g331KMYNldPCEyyNkUs7clSn9ckIfBg-81JrKVb3r_Zy4EFwG19XG9h48Z4v1BQ4UO2Sd5jdiG5BDguW_XUctD231U6F_NiYiCA/jJOErddT85sDhpIlxIGwYsrNDUqtr3FFXW2BR-j8YuE',
  //               width: 48,
  //               height: 36,
  //             },
  //             large: {
  //               url: 'https://v5.airtableusercontent.com/v3/u/25/25/1707760800000/tjmUcx-I3ypBn39iU29jhw/LwfeWhgigK78Sp-yFOzGvco9cwbXm_Llrh_4313VSiC3f6mpVt7O1hLXtb-Q6TqplcKBuzXtxky155vtGV6v8UDNo6JOsXfMvuHkIXIzPU36fcU3hsOGwPbvora7Tf6KkfoTE_j9GM0gwTVuG8OHtw/rvt9cTzgGWduF8FkNvrUZxpOQbmz1Ld27aPmO07oXd8',
  //               width: 689,
  //               height: 512,
  //             },
  //             full: {
  //               url: 'https://v5.airtableusercontent.com/v3/u/25/25/1707760800000/q1Snj-RbgYLZTB4o8HVlmg/2fbsQ7ncWsvUkK7pPNpubO2RNFixQTrTF6Ug7ywz2krZzgitEpDRlO0ObuHXfjStGajWzt4a4LgOqrptplR0xakumjQ9q_fYu0LG0nbWnhVrPhUagJGhjvFR1dnotcBJ3S0ruxRETFmeBoIVexujeQ/vckOVbmtDKqQtHFQdaAps9ER8mXgQQJ9VwMMvEpNsSo',
  //               width: 720,
  //               height: 535,
  //             },
  //           },
  //         },
  //       ],
  //       'Unit cost': 7000,
  //       objectID: 'recwCCgJaKwoX52Wx',
  //       _highlightResult: {
  //         Name: {
  //           value: 'MINI BILLETERAS',
  //           matchLevel: 'none',
  //           matchedWords: [],
  //         },
  //       },
  //     },
  //     {
  //       type: ['billeteras'],
  //       vendor: 'marfaust',
  //       Name: 'BILLETERA UN CIERRE',
  //       Images: [
  //         {
  //           id: 'att5Q4y1TsFnzTCwP',
  //           width: 720,
  //           height: 939,
  //           url: 'https://v5.airtableusercontent.com/v3/u/25/25/1707760800000/VHi7cBaHWgArLAcaXvYUPw/RA7ft1oznJgiYc-Doqne5VMDTUzx9-k-RRRdpVTUMIvMSY9L5EZ1PQGIlcBpwyvPV-LVnv2_WwDSsJKdpxRNj2Kzr8dh6S0kurT5c1_Ol8f6gytwu25k2kbsuBeffw8tIHnkLPw6IWQNhmzQxnVxWyaFssycUi_96hlryvriP0Fv34Dx_59Hu1PSon27-zf4/0RxdjHoLud3vVGmdPIupTBs8YflQhtgI36eiNfG4OwE',
  //           filename:
  //             'Imagen de WhatsApp 2024-02-12 a las 09.08.18_77d72b76.jpg',
  //           size: 71004,
  //           type: 'image/jpeg',
  //           thumbnails: {
  //             small: {
  //               url: 'https://v5.airtableusercontent.com/v3/u/25/25/1707760800000/P6TqnUAGaYNW4WL0Y65mHw/33jdGYSrpRl8LHGODdwFZFp1ZKaX_Ms79_pztTzVuFTRggUBRo01uVlAY3ZAAE5auyGU622SUEWXudF9A88NB2bMaC3WovvzZYsiYH6Fe9qEkjqG-52Wu2M6frQlRUthtXOXjhpR9zvQ3TBZ4lTifw/pJ2PKzTQ5EpO0QMtwItVRLFMY0UCq8UQiBWv82vrLhE',
  //               width: 27,
  //               height: 36,
  //             },
  //             large: {
  //               url: 'https://v5.airtableusercontent.com/v3/u/25/25/1707760800000/eogtyFfguvX4Bv5S-Velqw/tfiXApzpmtt3zx-eG6qnxKFpsqkfVW2VNk7mQWolkki7hH9z9VshYRJyGRXm5QLPtWtkX0oBrqHhM69wJ0o6CnNLpvrfwmW9fJh6ebfjNoCa4JpUmxncOdmp-GR3egAO1qjHIpVumfQ8uDRdkh4kNA/iTlacQvh53Z0lS4Ut3YpjD6aFPiCvf3N3Dhs36-BDrk',
  //               width: 512,
  //               height: 668,
  //             },
  //             full: {
  //               url: 'https://v5.airtableusercontent.com/v3/u/25/25/1707760800000/ZF4XbBFObYpk4CGFqLXM8Q/PV4SZj1rtOs6tTIYqZtL8MxiU0reGBv69S4F5hF8pXCherc08fLTBE3wgYfs6tjhyEzxAC4ECtogzoX6QOrGMzhWo2q3yk4ZPg_ph6vQpqgKXAfXrhK4Y8tBK4X-2Aa_5FxmyCSOQwZqwlsKG79h6w/Kg_0r_iA6Sh8VQOKgl-acBaxI6w1jN6wsg-s2OPkUzY',
  //               width: 720,
  //               height: 939,
  //             },
  //           },
  //         },
  //       ],
  //       'Unit cost': 6500,
  //       objectID: 'rec5ZRvlkUf8O9Uh6',
  //       _highlightResult: {
  //         Name: {
  //           value: 'BILLETERA UN CIERRE',
  //           matchLevel: 'none',
  //           matchedWords: [],
  //         },
  //       },
  //     },
  //     {
  //       type: ['billeteras'],
  //       vendor: 'marfaust',
  //       Name: 'PORTA CELULAR IMPORTADO ',
  //       Images: [
  //         {
  //           id: 'att6dFnPEZAV2Vv9V',
  //           width: 720,
  //           height: 615,
  //           url: 'https://v5.airtableusercontent.com/v3/u/25/25/1707760800000/dBnTLOc8MB51nGJCoNpMnA/mSggRLv7Li_Qzn5kYpINx6OZRuaOYeydbjfn1f0vssc3z9TkxsR6z2h-Dl-2SJJy16H1HiFHj7oviT28NCKXeOpqW8a-CiRB-SHv1RjQRdUgBuK0OLEO37GAypxJmp4i2ksYTQy3S-iuElslcORKCi5IJyWUrYuG7lKxtvA7aT8/pYZSjckMUv8gyjQl8wYmmc5xvc0yzC8q3ef9ENoBieo',
  //           filename: 'IMG-20240126-WA0053.jpg',
  //           size: 46844,
  //           type: 'image/jpeg',
  //           thumbnails: {
  //             small: {
  //               url: 'https://v5.airtableusercontent.com/v3/u/25/25/1707760800000/PC5cKM-qKgRjd9aFACW4sw/5Vs9KVUudlAkoWJDzCa3YMT67sIhuEz1vXJRA_KB8vMTTvFKhXV10JUlB3XM2kkngrEwc0Y4QYwW-zNJd2wv7jjAHEboCeIMPjUtiWUEFwicziChy81JjIrfAIc3dJJWQbIFGpJRWjlXuc_CVUJkeA/2Bpa_b7OUD0OjDVdqDyGF05maOgYK5xKZToV5ELbq7o',
  //               width: 42,
  //               height: 36,
  //             },
  //             large: {
  //               url: 'https://v5.airtableusercontent.com/v3/u/25/25/1707760800000/vK6KieLLpHBYVZg6bO9bYQ/LbZ-9YKG-fW9ffWcTI45_QkUAa3QgCHc_lbFZWZzai7OeLQQdN5vRl_8188yVMRKRaB0EUd9w_3gaUTPhp2aTdZdgcWytaEOwRO_NOqHi9UKjYuMASLmRRSbD_GG-nA1KQD--MWDnbLGbJvpSeS9xQ/sayPKr8vzBuaM9EFb_x0eqbXwRbwCcRZrJV3X8jGyIw',
  //               width: 599,
  //               height: 512,
  //             },
  //             full: {
  //               url: 'https://v5.airtableusercontent.com/v3/u/25/25/1707760800000/yNbk-d7ZcOJdZQTLVbxCDA/Vlp_e7bwvK6172MZu_cAKAWKoOpTzU32gQcPq-rmHroQ6ESGvKhm-1hh7F3GO7GGS8nHH_3pSr_3MIf3bjp-FQ4nw5CjAJrORpF6M2ClTSrY5ZkWUvDTpxx63sYqnXqzCa8UPKvD99xI6QBeI-IkAA/lSJosv9WG7lPd-1rN8HYMJkEITAF7YyAhSO4g6AEeoo',
  //               width: 720,
  //               height: 615,
  //             },
  //           },
  //         },
  //       ],
  //       'Unit cost': 12000,
  //       objectID: 'rec4gsFspwG2Osfxb',
  //       _highlightResult: {
  //         Name: {
  //           value: 'PORTA CELULAR IMPORTADO ',
  //           matchLevel: 'none',
  //           matchedWords: [],
  //         },
  //       },
  //     },
  //   ],
  //   pagination: {
  //     limit: 15,
  //     offset: 0,
  //     total: 3,
  //   },
  // };
  return data;
}
