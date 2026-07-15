export interface Verse {
  arabic: string;
  reference: string;
  meaning: string;
}

export interface Hadith {
  text: string;
  source: string;
}

// Günün âyeti için seçilmiş âyetler
export const verses: Verse[] = [
  {
    arabic: "اَلَٓا اِنَّ مَعَ الْعُسْرِ يُسْرًا",
    reference: "İnşirâh Sûresi, 6. Âyet",
    meaning:
      "Şüphesiz zorlukla beraber bir kolaylık vardır. Evet, o zorlukla beraber mutlaka bir kolaylık vardır.",
  },
  {
    arabic: "فَاِنَّ مَعَ الْعُسْرِ يُسْرًا",
    reference: "İnşirâh Sûresi, 5. Âyet",
    meaning: "Demek ki, gerçekten zorlukla beraber kolaylık vardır.",
  },
  {
    arabic: "وَمَٓا اَرْسَلْنَاكَ اِلَّا رَحْمَةً لِلْعَالَم۪ينَ",
    reference: "Enbiyâ Sûresi, 107. Âyet",
    meaning: "Biz seni ancak âlemlere rahmet olarak gönderdik.",
  },
  {
    arabic: "اَلًا بِذِكْرِ اللّٰهِ تَطْمَئِنُّ الْقُلُوبُ",
    reference: "Ra'd Sûresi, 28. Âyet",
    meaning: "Biliniz ki, kalpler ancak Allah'ı anmakla huzur bulur.",
  },
  {
    arabic: "وَاللّٰهُ خَيْرُ الرَّازِق۪ينَ",
    reference: "Cuma Sûresi, 11. Âyet",
    meaning: "Ve Allah, rızık verenlerin en hayırlısıdır.",
  },
  {
    arabic: "اِنَّ اللّٰهَ مَعَ الصَّابِر۪ينَ",
    reference: "Bakara Sûresi, 153. Âyet",
    meaning: "Şüphesiz Allah, sabredenlerle beraberdir.",
  },
  {
    arabic: "وَهُوَ مَعَكُمْ اَيْنَ مَا كُنْتُمْ",
    reference: "Hadîd Sûresi, 4. Âyet",
    meaning: "Ve O, nerede olursanız olun sizinle beraberdir.",
  },
  {
    arabic: "رَبَّنَٓا اٰتِنَا فِى الدُّنْيَا حَسَنَةً وَفِى الْاٰخِرَةِ حَسَنَةً",
    reference: "Bakara Sûresi, 201. Âyet",
    meaning: "Rabbimiz! Bize dünyada da iyilik ver, âhirette de iyilik ver.",
  },
  {
    arabic: "اِنَّ رَحْمَتَ اللّٰهِ قَر۪يبٌ مِنَ الْمُحْسِن۪ينَ",
    reference: "A'râf Sûresi, 56. Âyet",
    meaning: "Şüphesiz Allah'ın rahmeti iyilik edenlere çok yakındır.",
  },
  {
    arabic: "وَفَوَّضْتُ اَمْر۪ى اِلَى اللّٰهِ",
    reference: "Mü'min Sûresi, 44. Âyet",
    meaning: "Ve işimi Allah'a havale ettim.",
  },
  {
    arabic: "حَسْبُنَا اللّٰهُ وَنِعْمَ الْوَك۪يلُ",
    reference: "Âl-i İmrân Sûresi, 173. Âyet",
    meaning: "Bize Allah yeter. O ne güzel vekildir!",
  },
  {
    arabic: "وَاِذَا سَاَلَكَ عِبَاد۪ي عَنّ۪ي فَاِنّ۪ي قَر۪يبٌ",
    reference: "Bakara Sûresi, 186. Âyet",
    meaning: "Kullarım sana beni sorarlarsa, işte onlara de ki: Ben çok yakınım.",
  },
];

// Günün hadisi için seçilmiş hadis-i şerifler
export const hadiths: Hadith[] = [
  {
    text: "Müslüman, dilinden ve elinden Müslümanların selâmette olduğu kimsedir.",
    source: "Buhârî, Îmân, 4",
  },
  {
    text: "Kolaylaştırınız, zorlaştırmayınız. Müjdeleyiniz, nefret ettirmeyiniz.",
    source: "Buhârî, İlim, 11",
  },
  {
    text: "Sizin en hayırlınız, Kur'ân-ı Kerîm'i öğrenen ve öğretendir.",
    source: "Buhârî, Fezâilü'l-Kur'ân, 21",
  },
  {
    text: "Allah'a ve âhiret gününe îman eden, ya hayır söylesin ya da sussun.",
    source: "Buhârî, Edeb, 31",
  },
  {
    text: "Allah katında amellerin en sevimlisi, az da olsa devamlı yapılanıdır.",
    source: "Buhârî, Îmân, 32",
  },
  {
    text: "Temizlik îmanın yarısıdır.",
    source: "Müslim, Tahâret, 1",
  },
  {
    text: "Kim bir kötülük görürse onu eliyle değiştirsin; gücü yetmiyorsa diliyle; buna da gücü yetmiyorsa kalbiyle buğzetsin.",
    source: "Müslim, Îmân, 78",
  },
  {
    text: "Sizden biriniz, kendisi için istediğini kardeşi için istemedikçe (gerçek anlamda) îman etmiş olmaz.",
    source: "Buhârî, Îmân, 7",
  },
  {
    text: "Allah, yumuşak huyluluğa bahşiş verir, sertliğe ise vermez.",
    source: "Müslim, Birr, 78",
  },
  {
    text: "Allah Resûlü (s.a.s.) şöyle buyurdu: Merhamet edenlere, Rahmân olan Allah da merhamet eder. Yeryüzündekilere merhamet edin ki, gökteki de size merhamet etsin.",
    source: "Tirmizî, Birr, 16",
  },
  {
    text: "İnsanların en hayırlısı insanlara faydalı olandır.",
    source: "Buhârî, Mevâkîtu's-Salât, 5",
  },
  {
    text: "İki nimet vardır ki, insanların çoğu onlarda aldanmıştır: Sıhhat ve boş vakit.",
    source: "Buhârî, Rikâk, 1",
  },
];

// Günlük içeriği günün tarihine göre seç (her gün farklı)
export function getDailyVerse(): Verse {
  const day = Math.floor(Date.now() / 86400000);
  return verses[day % verses.length];
}

export function getDailyHadith(): Hadith {
  const day = Math.floor(Date.now() / 86400000);
  return hadiths[day % hadiths.length];
}
