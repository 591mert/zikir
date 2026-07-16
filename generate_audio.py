import asyncio
import edge_tts
import os

VOICE = "ar-SA-HamedNeural"
PITCH = "+15Hz"
RATE = "-15%"
BASE = "public"

duas = [
    # namaz
    ("public/audio/namaz/iftitah-tekbiri.mp3", "اَللّٰهُ اَكْبَرُ"),
    ("public/audio/namaz/subhaneke.mp3", "سُبْحَانَكَ اللّٰهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالٰى جَدُّكَ وَلَٓا اِلٰهَ غَيْرُكَ"),
    ("public/audio/namaz/ettehiyyatu.mp3", "اَلتَّحِيَّاتُ لِلّٰهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ. اَلسَّلَامُ عَلَيْكَ اَيُّهَا النَّبِيُّ وَرَحْمَةُ اللّٰهِ وَبَرَكَاتُهُ. اَلسَّلَامُ عَلَيْنَا وَعَلٰى عِبَادِ اللّٰهِ الصَّالِح۪ينَ. اَشْهَدُ اَنْ لَٓا اِلٰهَ اِلَّا اللّٰهُ وَاَشْهَدُ اَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ"),
    ("public/audio/namaz/allahumme-salli.mp3", "اَللّٰهُمَّ صَلِّ عَلٰى مُحَمَّدٍ وَعَلٰى اٰلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلٰى اِبْرَاه۪يمَ وَعَلٰى اٰلِ اِبْرَاه۪يمَ اِنَّكَ حَم۪يدٌ مَج۪يدٌ"),
    ("public/audio/namaz/allahumme-barik.mp3", "اَللّٰهُمَّ بَارِكْ عَلٰى مُحَمَّدٍ وَعَلٰى اٰلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلٰى اِبْرَاه۪يمَ وَعَلٰى اٰلِ اِبْرَاه۪يمَ اِنَّكَ حَم۪يدٌ مَج۪يدٌ"),
    ("public/audio/namaz/kunut-duasi.mp3", "اَللّٰهُمَّ اِنَّ نَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ وَمِنْ عَذَابِ الْقَبْرِ وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ وَمِنْ فِتْنَةِ الْمَس۪يحِ الدَّجَّالِ"),
    ("public/audio/namaz/selam-verirken.mp3", "اَلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللّٰهِ"),
    ("public/audio/namaz/tesbihat.mp3", "سُبْحَانَ اللّٰهِ. وَالْحَمْدُ لِلّٰهِ. وَاللّٰهُ اَكْبَرُ. لَٓا اِلٰهَ اِلَّا اللّٰهُ وَحْدَهُ لَا شَر۪يكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلٰى كُلِّ شَيْءٍ قَد۪يرٌ"),
    # kisa
    ("public/audio/kisa/besmele.mp3", "بِسْمِ اللّٰهِ"),
    ("public/audio/kisa/istigfar.mp3", "اَسْتَغْفِرُ اللّٰهَ"),
    ("public/audio/kisa/sukur-duasi.mp3", "اَلْحَمْدُ لِلّٰهِ"),
    ("public/audio/kisa/tehlil.mp3", "لَٓا اِلٰهَ اِلَّا اللّٰهُ"),
    ("public/audio/kisa/sadakallah.mp3", "صَدَقَ اللّٰهُ الْعَظ۪يمُ"),
    ("public/audio/kisa/yeni-ise-baslarken.mp3", "بِسْمِ اللّٰهِ تَوَكَّلْتُ عَلَى اللّٰهِ لَا حَوْلَ وَلَا قُوَّةَ اِلَّا بِاللّٰهِ"),
    ("public/audio/kisa/unutunca.mp3", "اللّٰهُمَّ لَٓا يَسْهُلُ اِلَّا مَا جَعَلْتَهُ سَهْلًا"),
    ("public/audio/kisa/guzel-soz.mp3", "حَسْبُنَا اللّٰهُ وَنِعْمَ الْوَك۪يلُ"),
    # before-action
    ("public/audio/before-action/ise-baslarken.mp3", "اللّٰهُمَّ بَارِكْ لَنَا ف۪يمَا رَزَقْتَنَا"),
    # food
    ("public/audio/food/yemege-baslarken.mp3", "بِسْمِ اللّٰهِ اَوَّلَهُ وَاٰخِرَهُ"),
    ("public/audio/food/yemekten-sonra.mp3", "اَلْحَمْدُ لِلّٰهِ الَّذ۪ي اَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِم۪ينَ"),
    # sleep
    ("public/audio/sleep/uyumadan-once.mp3", "بِاسْمِكَ اللّٰهُمَّ اَمُوتُ وَاَحْيَا"),
    ("public/audio/sleep/uyaninca.mp3", "اَلْحَمْدُ لِلّٰهِ الَّذ۪ي اَحْيَانَا بَعْدَ مَٓا اَمَاتَنَا وَاِلَيْهِ النُّشُورُ"),
    # distress
    ("public/audio/distress/yunus-duasi.mp3", "لَٓا اِلٰهَ اِلَّٓا اَنْتَ سُبْحَانَكَ اِنّ۪ي كُنْتُ مِنَ الظَّالِم۪ينَ"),
    ("public/audio/distress/genislik-ve-kolaylik.mp3", "اَللّٰهُمَّ لَٓا سَهْلَ اِلَّا مَا جَعَلْتَهُ سَهْلًا وَاَنْتَ تَجْعَلُ الْحُزْنَ اِذَا شِئْتَ سَهْلًا"),
    # travel
    ("public/audio/travel/yola-cikarken.mp3", "سُبْحَانَ الَّذ۪ي سَخَّرَ لَنَا هٰذَا وَمَا كُنَّا لَهُ مُقْرِن۪ينَ وَاِنَّٓا اِلٰى رَبِّنَا لَمُنْقَلِبُونَ"),
    ("public/audio/travel/eve-girerken.mp3", "بِسْمِ اللّٰهِ وَلَجْنَا وَبِسْمِ اللّٰهِ خَرَجْنَا وَعَلٰى رَبِّنَا تَوَكَّلْنَا"),
    # morning-evening
    ("public/audio/morning-evening/sabah-aksam-zikri.mp3", "اَصْبَحْنَا وَاَصْبَحَ الْمُلْكُ لِلّٰهِ وَالْحَمْدُ لِلّٰهِ"),
    ("public/audio/morning-evening/korunma-duasi.mp3", "بِسْمِ اللّٰهِ الَّذ۪ي لَٓا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْاَرْضِ وَلَٓا فِي السَّمَٓاءِ وَهُوَ السَّم۪يعُ الْعَل۪يمُ"),
]

async def generate():
    for i, (path, text) in enumerate(duas, 1):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        print(f"[{i}/{len(duas)}] {os.path.basename(path)}")
        communicate = edge_tts.Communicate(text, VOICE, pitch=PITCH, rate=RATE)
        await communicate.save(path)
    print("Done!")

if __name__ == "__main__":
    asyncio.run(generate())
