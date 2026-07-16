export interface Dua {
  title: string;
  arabic: string;
  meaning: string;
  // Kur'an âyeti ise "sûre:âyet" referansı (gerçek sesli okuma için)
  audioRef?: string;
  // Tam sûre ise sûre ID'si (tüm âyetleri sırayla çalar)
  surahId?: number;
}

export interface DuaCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  duas: Dua[];
  // Namazda okunan sûreler (tam sûre sesli dinleme için)
  surahIds?: number[];
}

// Namazın içinde ve sonunda okunan dualar
export const prayerCategory: DuaCategory = {
  id: "namaz",
  title: "Namaz Duaları",
  icon: "🕌",
  description: "Namazın içinde okunan dualar (sırasıyla)",
  surahIds: [1, 108, 103, 112, 113, 114, 109, 110],
  duas: [
    {
      title: "İftitah Tekbiri (Namaza Başlarken)",
      arabic: "اَللّٰهُ اَكْبَرُ",
      meaning:
        "Allah en büyüktür. (Namaza başlarken eller kaldırılırken ve her rükû/secdede okunur.)",
    },
    {
      title: "Sübhâneke (İftitah Duası)",
      arabic:
        "سُبْحَانَكَ اللّٰهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالٰى جَدُّكَ وَلَٓا اِلٰهَ غَيْرُكَ",
      meaning:
        "Allah'ım! Seni hamdinle tesbih ve takdis ederim. Senin adın mübarektir. Senin şanın yücedir. Senden başka ilâh yoktur.",
    },
    {
      title: "Fâtiha Sûresi",
      arabic:
        "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّح۪يمِ. اَلْحَمْدُ لِلّٰهِ رَبِّ الْعَالَم۪ينَ. اَلرَّحْمٰنِ الرَّح۪يمِ. مَالِكِ يَوْمِ الدّ۪ينِ. اِيَّاكَ نَعْبُدُ وَاِيَّاكَ نَسْتَع۪ينُ. اِهْدِنَا الصِّرَاطَ الْمُسْتَق۪يمَ. صِرَاطَ الَّذ۪ينَ اَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّآلّ۪ينَ. اٰم۪ينَ",
      meaning:
        "(Her rekâtın başında okunur.) Rahmân ve Rahîm olan Allah'ın adıyla. Âlemlerin Rabbi Allah'a hamdolsun. O, Rahmân ve Rahîm'dir. Hesap gününün sahibidir. Ancak sana kulluk ederiz ve yalnız senden yardım dileriz. Bizi doğru yola ilet.",
      surahId: 1,
    },
    {
      title: "Ettehiyyâtü",
      arabic:
        "اَلتَّحِيَّاتُ لِلّٰهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ. اَلسَّلَامُ عَلَيْكَ اَيُّهَا النَّبِيُّ وَرَحْمَةُ اللّٰهِ وَبَرَكَاتُهُ. اَلسَّلَامُ عَلَيْنَا وَعَلٰى عِبَادِ اللّٰهِ الصَّالِح۪ينَ. اَشْهَدُ اَنْ لَٓا اِلٰهَ اِلَّا اللّٰهُ وَاَشْهَدُ اَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
      meaning:
        "Bütün dilekler, ibadetler ve güzel sözler Allah'a mahsustur. Ey Peygamber! Selâm, Allah'ın rahmeti ve bereketi senin üzerine olsun. Selâm bizim ve Allah'ın sâlih kullarının üzerine olsun. Şehâdet ederim ki, Allah'tan başka ilâh yoktur. Yine şehâdet ederim ki, Muhammed O'nun kulu ve elçisidir.",
    },
    {
      title: "Allâhümme Salli (Salavat)",
      arabic:
        "اَللّٰهُمَّ صَلِّ عَلٰى مُحَمَّدٍ وَعَلٰى اٰلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلٰى اِبْرَاه۪يمَ وَعَلٰى اٰلِ اِبْرَاه۪يمَ اِنَّكَ حَم۪يدٌ مَج۪يدٌ",
      meaning:
        "Allah'ım! Muhammed'e ve Muhammed'in âline, İbrahim'e ve İbrahim'in âline salat ettiğin gibi salat eyle. Şüphesiz Sen, hamde lâyık ve şanı yüce olansın.",
    },
    {
      title: "Allâhümme Bârik (Salavat)",
      arabic:
        "اَللّٰهُمَّ بَارِكْ عَلٰى مُحَمَّدٍ وَعَلٰى اٰلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلٰى اِبْرَاه۪يمَ وَعَلٰى اٰلِ اِبْرَاه۪يمَ اِنَّكَ حَم۪يدٌ مَج۪يدٌ",
      meaning:
        "Allah'ım! Muhammed'e ve Muhammed'in âline, İbrahim'e ve İbrahim'in âline bereket ihsan ettiğin gibi bereket ihsan eyle. Şüphesiz Sen, hamde lâyık ve şanı yüce olansın.",
    },
    {
      title: "Kunut Duâsı",
      arabic:
        "اَللّٰهُمَّ اِنَّ نَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ وَمِنْ عَذَابِ الْقَبْرِ وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ وَمِنْ فِتْنَةِ الْمَس۪يحِ الدَّجَّالِ",
      meaning:
        "Allah'ım! Cehennem azabından, kabir azabından, hayatın ve ölümün fitnesinden ve Deccal fitnesinden Sana sığınırız. (Vitir namazının son rekatında okunur.)",
    },
    {
      title: "Selâm Verirken",
      arabic: "اَلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللّٰهِ",
      meaning:
        "Selâm ve Allah'ın rahmeti üzerinize olsun. (Sağa ve sonra sola dönülerek okunur; namaz böyle tamamlanır.)",
    },
    {
      title: "Namazdan Sonra Tesbihat",
      arabic:
        "سُبْحَانَ اللّٰهِ ×٣٣ وَالْحَمْدُ لِلّٰهِ ×٣٣ وَاللّٰهُ اَكْبَرُ ×٣٤ لَٓا اِلٰهَ اِلَّا اللّٰهُ وَحْدَهُ لَا شَر۪يكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلٰى كُلِّ شَيْءٍ قَد۪يرٌ",
      meaning:
        "Sübhânallah (33), Elhamdülillâh (33), Allâhu Ekber (34) denir. Sonra: 'Allah'tan başka ilâh yoktur. O tektir, ortağı yoktur. Mülk O'nundur, hamd O'nadır ve O her şeye kâdirdir' denir.",
    },
  ],
};

// Günlük hayatta çabuk okunan kısa dualar
export const shortCategory: DuaCategory = {
  id: "kisa",
  title: "Kısa Dualar",
  icon: "✨",
  description: "Günlük hayatta çabuk okunan kısa dualar",
  duas: [
    {
      title: "Her İşte Besmele",
      arabic: "بِسْمِ اللّٰهِ",
      meaning: "Allah'ın adıyla. (Her işin başında okunur.)",
      audioRef: "1:1",
    },
    {
      title: "İstiğfar",
      arabic: "اَسْتَغْفِرُ اللّٰهَ",
      meaning: "Allah'tan bağışlanma dilerim.",
    },
    {
      title: "Şükür Duası",
      arabic: "اَلْحَمْدُ لِلّٰهِ",
      meaning: "Hamd Allah'a olsun. (Bir nimete kavuşunca.)",
      audioRef: "1:2",
    },
    {
      title: "Tehlil (Tevhid)",
      arabic: "لَٓا اِلٰهَ اِلَّا اللّٰهُ",
      meaning: "Allah'tan başka ilâh yoktur.",
      audioRef: "47:19",
    },
    {
      title: "Sözünün Dinlenmesi İçin",
      arabic: "صَدَقَ اللّٰهُ الْعَظ۪يمُ",
      meaning: "Yüce Allah doğru söylemiştir. (Kur'an okuduktan sonra.)",
      audioRef: "3:95",
    },
    {
      title: "Yeni İşe Başlarken",
      arabic: "بِسْمِ اللّٰهِ تَوَكَّلْتُ عَلَى اللّٰهِ لَا حَوْلَ وَلَا قُوَّةَ اِلَّا بِاللّٰهِ",
      meaning:
        "Allah'ın adıyla, Allah'a tevekkül ettim. Güç ve kuvvet ancak Allah iledir.",
    },
    {
      title: "Bir Şey Unuttuğunda",
      arabic: "اللّٰهُمَّ لَٓا يَسْهُلُ اِلَّا مَا جَعَلْتَهُ سَهْلًا",
      meaning: "Allah'ım! Senin kolay kıldığından başka kolaylık yoktur.",
    },
    {
      title: "Güzel Söz",
      arabic: "حَسْبُنَا اللّٰهُ وَنِعْمَ الْوَك۪يلُ",
      meaning: "Bize Allah yeter. O ne güzel vekildir.",
      audioRef: "3:173",
    },
  ],
};

// Günlük hayatta okunan başlıca dualar
export const duaCategories: DuaCategory[] = [
  prayerCategory,
  shortCategory,
  {
    id: "before-action",
    title: "Besmele ve Başlangıç",
    icon: "🌿",
    description: "İşe başlarken okunacak dualar",
    duas: [
      {
        title: "Besmele",
        arabic: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّح۪يمِ",
        meaning:
          "Rahmân ve Rahîm olan Allah'ın adıyla. (Her hayırlı işe başlarken okunur.)",
        audioRef: "1:1",
      },
      {
        title: "İşe Başlarken",
        arabic: "اللّٰهُمَّ بَارِكْ لَنَا ف۪يمَا رَزَقْتَنَا",
        meaning:
          "Allah'ım! Bize rızık olarak verdiklerin hakkında bereket ihsan eyle.",
      },
    ],
  },
  {
    id: "food",
    title: "Yemek Duaları",
    icon: "🍽️",
    description: "Yemekten önce ve sonra",
    duas: [
      {
        title: "Yemeğe Başlarken",
        arabic: "بِسْمِ اللّٰهِ اَوَّلَهُ وَاٰخِرَهُ",
        meaning: "Başında da sonunda da Allah'ın adıyla.",
      },
      {
        title: "Yemekten Sonra",
        arabic: "اَلْحَمْدُ لِلّٰهِ الَّذ۪ي اَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِم۪ينَ",
        meaning:
          "Bizi yediren, içiren ve bizi Müslümanlardan kılan Allah'a hamdolsun.",
      },
    ],
  },
  {
    id: "sleep",
    title: "Uyku ve Uyanma",
    icon: "🌙",
    description: "Yatarken ve kalkarken",
    duas: [
      {
        title: "Uyumadan Önce",
        arabic: "بِاسْمِكَ اللّٰهُمَّ اَمُوتُ وَاَحْيَا",
        meaning: "Allah'ım! Senin isminle ölür ve senin isminle dirilirim.",
      },
      {
        title: "Uyanınca",
        arabic: "اَلْحَمْدُ لِلّٰهِ الَّذ۪ي اَحْيَانَا بَعْدَ مَٓا اَمَاتَنَا وَاِلَيْهِ النُّشُورُ",
        meaning:
          "Bizi öldükten sonra tekrar dirilten Allah'a hamdolsun. Dönüş O'nadır.",
      },
    ],
  },
  {
    id: "distress",
    title: "Sıkıntı ve Dert",
    icon: "🤲",
    description: "Zor zamanlarda okunacak",
    duas: [
      {
        title: "Yunus (a.s.)'ın Duası",
        arabic: "لَٓا اِلٰهَ اِلَّٓا اَنْتَ سُبْحَانَكَ اِنّ۪ي كُنْتُ مِنَ الظَّالِم۪ينَ",
        meaning:
          "Senden başka hiçbir ilâh yoktur. Seni eksikliklerden tenzih ederim. Ben gerçekten zâlimlerden oldum.",
        audioRef: "21:87",
      },
      {
        title: "Genişlik ve Kolaylık Duası",
        arabic: "اَللّٰهُمَّ لَٓا سَهْلَ اِلَّا مَا جَعَلْتَهُ سَهْلًا وَاَنْتَ تَجْعَلُ الْحُزْنَ اِذَا شِئْتَ سَهْلًا",
        meaning:
          "Allah'ım! Senin kolay kıldığından başka kolaylık yoktur. Sen dilediğin zaman hüznü (zorluğu) kolay kılarsın.",
      },
    ],
  },
  {
    id: "travel",
    title: "Yolculuk ve Eve Giriş",
    icon: "🧭",
    description: "Yola çıkarken ve girerken",
    duas: [
      {
        title: "Yola Çıkarken",
        arabic: "سُبْحَانَ الَّذ۪ي سَخَّرَ لَنَا هٰذَا وَمَا كُنَّا لَهُ مُقْرِن۪ينَ وَاِنَّٓا اِلٰى رَبِّنَا لَمُنْقَلِبُونَ",
        meaning:
          "Bunu (bu vasıtayla gitmeyi) bizim emrimize veren Allah'ı tenzih ederiz. Onu kullanma gücüne biz sahip değildik. Şüphesiz biz Rabbimize döneceğiz.",
        audioRef: "43:13",
      },
      {
        title: "Eve Girerken",
        arabic: "بِسْمِ اللّٰهِ وَلَجْنَا وَبِسْمِ اللّٰهِ خَرَجْنَا وَعَلٰى رَبِّنَا تَوَكَّلْنَا",
        meaning:
          "Allah'ın adıyla girdik, Allah'ın adıyla çıktık. Rabbimize tevekkül ettik.",
      },
    ],
  },
  {
    id: "morning-evening",
    title: "Sabah ve Akşam",
    icon: "🌅",
    description: "Günün başında ve sonunda",
    duas: [
      {
        title: "Sabah-Akşam Zikri",
        arabic: "اَصْبَحْنَا وَاَصْبَحَ الْمُلْكُ لِلّٰهِ وَالْحَمْدُ لِلّٰهِ",
        meaning:
          "Sabaha erdik, bütün mülk de Allah'a ait olarak sabaha erdi. Hamd Allah'adır. (Akşam 'amsaynâ' denilir.)",
      },
      {
        title: "Korunma Duası",
        arabic: "بِسْمِ اللّٰهِ الَّذ۪ي لَٓا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْاَرْضِ وَلَٓا فِي السَّمَٓاءِ وَهُوَ السَّم۪يعُ الْعَل۪يمُ",
        meaning:
          "İsmi sayesinde yerde ve gökte hiçbir şeyin zarar veremeyeceği Allah'ın adıyla. O, işiten ve bilendir.",
      },
    ],
  },
];
