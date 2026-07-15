export interface GuideStep {
  title: string;
  text: string;
  icon: string;
  image?: string;
}

export interface NamazVariant {
  intro: string;
  image: string;
  note: string;
  steps: GuideStep[];
}

export interface GuideSection {
  id: string;
  title: string;
  icon: string;
  intro?: string;
  steps?: GuideStep[];
  list?: { title: string; text?: string }[];
  genderSpecific?: boolean;
  variants?: { male: NamazVariant; female: NamazVariant };
}

// Namaz Rehberi — yaşlılar için sade ve anlaşılır anlatım
export const guideSections: GuideSection[] = [
  {
    id: "abdest",
    title: "Abdest Nasıl Alınır?",
    icon: "💧",
    intro:
      "Abdest, namazın geçerli olması için gereken temizliktir. Önce niyet eder, sonra şu sırayı izlersiniz. (Erkek ve kadın için aynıdır.)",
    steps: [
      { title: "1. Niyet ve Besmele", icon: "🌿", text: "Kalpten abdest almaya niyet edilir ve 'Bismillâh' denilir." },
      { title: "2. Eller", icon: "✋", image: "./images/abdest-1-el.png", text: "Eller bileklere kadar üç kez yıkanır, parmak araları ovulur." },
      { title: "3. Ağzı ve Burun", icon: "💧", text: "Ağza üç kez su verilir, buruna üç kez su çekilip sümkürülür." },
      { title: "4. Yüz", icon: "🙂", image: "./images/abdest-2-yuz.png", text: "Yüz, saç bitiminden çene altına, kulaklara kadar üç kez yıkanır." },
      { title: "5. Kollar", icon: "💪", image: "./images/abdest-3-kol.png", text: "Sağ ve sol kol dirseklerle beraber üçer kez yıkanır." },
      { title: "6-8. Baş, Kulaklar ve Ayaklar", icon: "🦶", image: "./images/abdest-4-bas-ayak.png", text: "Eller ıslatılıp başın dörtte biri meshedilir (sıvazlanır), kulakların içi-arkası ve boyun meshedilir. Sonra sağ ve sol ayak topuklarla beraber üçer kez yıkanır." },
    ],
  },
  {
    id: "abdest-farz",
    title: "Abdestin Farzları",
    icon: "✅",
    intro: "Abdestin geçerli olması için dört farz vardır. Bunlar yapılırsa abdest tamamdır. (Erkek ve kadın için aynıdır.)",
    list: [
      { title: "1. Yüzü yıkamak", text: "Saç bitiminden çene altına, kulaklara kadar." },
      { title: "2. Kolları yıkamak", text: "Dirsekler dahil, sağ ve sol kol." },
      { title: "3. Başı meshetmek", text: "Başın dörtte birini ıslak elle sıvazlamak." },
      { title: "4. Ayakları yıkamak", text: "Topuklar dahil, sağ ve sol ayak." },
    ],
  },
  {
    id: "kilinis",
    title: "Namaz Nasıl Kılınır?",
    icon: "🕌",
    genderSpecific: true,
    variants: {
      male: {
        intro:
          "İki rekatlık bir namazın erkekler için kılınışı adım adım aşağıdadır. Her hareketi sırayla yapın.",
        image: "images/namaz-erkek.png",
        note:
          "Erkekler: Elleri göbeğin altında bağlarsınız. Rükûda sırt düz ve dizler gerilir, secdede kollar vücuttan ve yanlardan ayrı tutulur.",
        steps: [
          { title: "1. Niyet", icon: "❤️", text: "Kalpten hangi namazı kılacağınızı niyet edersiniz." },
          { title: "2. İftitah Tekbiri", icon: "🙌", text: "Eller kulaklara kaldırılıp 'Allâhu Ekber' denir ve göbek altında sağ el sol elin üzerine konup bağlanır." },
          { title: "3. Sübhâneke", icon: "📖", text: "Başlangıç duası olan Sübhâneke okunur." },
          { title: "4. Eûzu - Besmele - Fâtiha", icon: "📚", text: "Eûzübillâhimineşşeytânirracîm, Besmele ve Fâtiha sûresi okunur, 'Âmin' denilir." },
          { title: "5. Bir Sûre", icon: "📜", text: "Fâtiha'dan sonra İhlâs gibi kısa bir sûre okunur." },
          { title: "6. Rükû", icon: "🙇", text: "'Allâhu Ekber' diyerek eğilinir, sırt düz tutulur, 'Sübhâne Rabbiye'l-azîm' (3 kez) denilir." },
          { title: "7. Doğrulma", icon: "🧍", text: "'Semiallâhu limen hamideh' diyerek doğrulunur, 'Rabbenâ leke'l-hamd' denilir." },
          { title: "8. Secde", icon: "🧎", text: "'Allâhu Ekber' diyerek secdeye varılır; kollar yanlardan ayrılır, 'Sübhâne Rabbiye'l-a'lâ' (3 kez) denilir." },
          { title: "9. İkinci Rekat", icon: "🔄", text: "Aynı şekilde Fâtiha + sûre, rükû ve iki secde tekrarlanır." },
          { title: "10. Ettehiyyâtü", icon: "🤲", text: "Sol ayağın üzerine oturulur, sağ ayak dik tutulur. Ettehiyyâtü, Salli ve Bârik okunur." },
          { title: "11. Selâm", icon: "👋", text: "Önce sağa, sonra sola 'Esselâmü aleyküm ve rahmetullâh' denilir. Namaz tamamlanır." },
        ],
      },
      female: {
        intro:
          "İki rekatlık bir namazın kadınlar için kılınışı adım adım aşağıdadır. Her hareketi sırayla yapın.",
        image: "images/namaz-kadin.png",
        note:
          "Kadınlar: Elleri göğüs üzerinde bağlarsınız. Rükûda biraz daha az eğilir, uzuvlar vücuda yakındır; secdede kollar yere konur ve vücut toparlak durur.",
        steps: [
          { title: "1. Niyet", icon: "❤️", text: "Kalpten hangi namazı kılacağınızı niyet edersiniz." },
          { title: "2. İftitah Tekbiri", icon: "🙌", text: "Eller omuz hizasına kaldırılıp 'Allâhu Ekber' denir ve göğüs üzerinde sağ el sol elin üzerine konup bağlanır." },
          { title: "3. Sübhâneke", icon: "📖", text: "Başlangıç duası olan Sübhâneke okunur." },
          { title: "4. Eûzu - Besmele - Fâtiha", icon: "📚", text: "Eûzübillâhimineşşeytânirracîm, Besmele ve Fâtiha sûresi okunur, 'Âmin' denilir." },
          { title: "5. Bir Sûre", icon: "📜", text: "Fâtiha'dan sonra İhlâs gibi kısa bir sûre okunur." },
          { title: "6. Rükû", icon: "🙇", text: "'Allâhu Ekber' diyerek biraz eğilirsiniz, uzuvlar vücuda yakındır, 'Sübhâne Rabbiye'l-azîm' (3 kez) denilir." },
          { title: "7. Doğrulma", icon: "🧍", text: "'Semiallâhu limen hamideh' diyerek doğrulunur, 'Rabbenâ leke'l-hamd' denilir." },
          { title: "8. Secde", icon: "🧎", text: "'Allâhu Ekber' diyerek secdeye varılır; kollar yere yakın ve yanlara bitişik, vücut toparlak durur, 'Sübhâne Rabbiye'l-a'lâ' (3 kez) denilir." },
          { title: "9. İkinci Rekat", icon: "🔄", text: "Aynı şekilde Fâtiha + sûre, rükû ve iki secde tekrarlanır." },
          { title: "10. Ettehiyyâtü", icon: "🤲", text: "İki yana oturulur (sağ tarafa). Ettehiyyâtü, Salli ve Bârik okunur." },
          { title: "11. Selâm", icon: "👋", text: "Önce sağa, sonra sola 'Esselâmü aleyküm ve rahmetullâh' denilir. Namaz tamamlanır." },
        ],
      },
    },
  },
  {
    id: "namaz-farz",
    title: "Namazın Farzları",
    icon: "✅",
    intro: "Namazın farzları iki kısımdır: namazın dışındaki (şartları) ve içindeki farzlar. (Erkek ve kadın için aynıdır.)",
    list: [
      { title: "Dışındaki Şartlar:", text: "Hadesten tahâret (abdest/gusül), necâsetten tahâret (beden/elbise/mekân temizliği), setr-i avret (avret yerini örtmek), istikbâl-i kıble (Kâbe'ye dönmek) ve vakit." },
      { title: "İçindeki Farzlar:", text: "Niyet, iftitah tekbiri (Allâhu Ekber), kıyâm (ayakta durmak), kıraat (Kur'an okumak), rükû, secde ve son oturuş (ka'de-i âhire)." },
    ],
  },
  {
    id: "bes-vakit",
    title: "Beş Vakit Namaz",
    icon: "🕌",
    intro: "Günde beş vakit namaz, müminin Allah'a olan kulluğunun göstergesidir. (Erkek ve kadın için rekat sayıları aynıdır.)",
    list: [
      { title: "🌙 Sabah Namazı", text: "Tan yeri ağarırken kılınır. 2 sünnet + 2 farz." },
      { title: "☀️ Öğle Namazı", text: "Güneş tepeden batıya kayınca kılınır. 4 sünnet + 4 farz + 2 sünnet." },
      { title: "🌤️ İkindi Namazı", text: "Her şeyin gölgesi kendi boyunun iki katına ulaşınca kılınır. 4 sünnet + 4 farz." },
      { title: "🌇 Akşam Namazı", text: "Güneş batınca kılınır. 3 farz + 2 sünnet." },
      { title: "🌌 Yatsı Namazı", text: "Karanlık çöktükten sonra kılınır. 4 sünnet + 4 farz + 2 sünnet + 3 vitir." },
    ],
  },
];
