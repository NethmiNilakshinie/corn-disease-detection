import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, LayoutAnimation, Platform, UIManager, Image, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ExploreScreen() {
  const [activeTab, setActiveTab] = useState('Guide');
  const [lang, setLang] = useState<'en' | 'si' | 'ta'>('en');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const isFocused = useIsFocused();

  const openVideo = (url: string) => {
    Linking.openURL(url).catch((err) => console.error("Error loading video", err));
  };

  const itemImages: Record<string, any> = {
    d1: require('../../assets/Corn-Anthracnose.jpg'),
    d2: require('../../assets/diplodi_aer_rot.jpg'),
    d3: require('../../assets/fusarium_ear_rot.jpg'),
    d4: require('../../assets/gibberella_ear_rot.jpeg'),
    d6: require('../../assets/tar_spot.webp'),
    p1: require('../../assets/fall_armyworm.webp'),
    p2: require('../../assets/european_corn_borer.jpg'),
    p3: require('../../assets/corn_leafhopper.jpg'),
    p4: require('../../assets/corn_leaf_miner.webp'),
    p5: require('../../assets/cucumber_beetles.jpg'),
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedLang = await AsyncStorage.getItem('userLanguage');
        if (savedLang) setLang(savedLang as 'en' | 'si' | 'ta');
        const savedHistory = await AsyncStorage.getItem('scanHistory');
        if (savedHistory) setHistory(JSON.parse(savedHistory));
      } catch (e) { console.error("Load error", e); }
    };
    if (isFocused) loadData();
  }, [isFocused]);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const deleteHistoryItem = async (id: string) => {
    Alert.alert(t[lang].deleteTitle, t[lang].deleteMsg, [
      { text: t[lang].cancel, style: "cancel" },
      { text: t[lang].delete, style: "destructive", onPress: async () => {
          const updatedHistory = history.filter(item => item.id !== id);
          setHistory(updatedHistory);
          await AsyncStorage.setItem('scanHistory', JSON.stringify(updatedHistory));
        } 
      }
    ]);
  };

  const t: Record<string, any> = {
    en: {
      title: "Explore", tabs: ["Guide", "Tips", "History"], guideTitle: "Agri Handbook", tipsTitle: "Care Tips", historyTitle: "Scan History", noHistory: "No history found.",
      cat1: "Cultivation Stages", cat2: "Fertilizer Management", cat3: "Water Management",
      harvestVid: "Watch YouTube: Harvesting Guide", fertVid: "Watch YouTube: Fertilizer Guide", waterVid: "Watch YouTube: Water Management Guide",
      d1Name: "Anthracnose", d1Desc: "• Caused by: Colletotrichum truncatum\n• Thrives in: High temps, wet weather\n• Infects at: Seedling phase or full maturity\n• Looks like: Long, tan to reddish-brown oval lesions; travels upward.\n• Results in: Damage to leaf tissue, reduced stalk strength and yield potential.\n💡 Pro tip: Use Trivapro fungicide for up to 42 days of control.",
      d2Name: "Diplodia Ear Rot", d2Desc: "• Caused by: Stenocarpella maydis\n• Thrives in: Moderate temps, wet conditions (severe in no-till)\n• Infects: At and up to 3 weeks post-R1/silk\n• Looks like: White mold turning gray-brown.\n• Results in: Reduced grain quality and yield.\n💡 Pro tip: Apply Miravis Neo fungicide at R1.",
      d3Name: "Fusarium Ear Rot", d3Desc: "• Caused by: Fusarium verticilliodes\n• Thrives in: Warm, wet weather before harvest\n• Infects: Silking, often after insect/hail damage (R5-R6)\n• Looks like: White to lavender kernels with brown streaks throughout ear.\n• Results in: Increased mycotoxins and reduced yield.\n💡 Pro tip: Use an R1 application of Miravis Neo fungicide.",
      d4Name: "Gibberella Ear Rot", d4Desc: "• Caused by: Gibberella zeae\n• Thrives in: Cooler conditions during silking.\n• Infects: At Silk stage\n• Looks like: White to pink mold at ear tip; moves towards base.\n• Results in: Increased vomitoxin (DON) and reduced grain quality.\n💡 Pro tip: Apply Miravis Neo at green silk to R1 stage.",
      d6Name: "Tar Spot", d6Desc: "• Caused by: Phyllachora maydis\n• Thrives in: Cool, humid conditions, prolonged leaf wetness.\n• Looks like: Small, raised, circular black spots that don’t rub off.\n• Results in: Damage to leaf tissue, stalks, husks, and lodging.\n💡 Pro tip: Apply Miravis Neo or Trivapro at VT/R1.",
      p1Name: "Fall Armyworm", p1Desc: "Damage: Larvae eat corn leaves, silks, and kernels. They weaken plants and reduce yields.\nWhen: June to August.\nInsecticides: Lambda-Cyhalothrin, Chlorantraniliprole, Cypermethrin.",
      p2Name: "European Corn Borer", p2Desc: "Damage: Tunnel into stalks and ears, causing structural damage.\nWhen: June to July.\nInsecticides: Bt, Carbaryl, Permethrin.",
      p3Name: "Corn Leafhopper", p3Desc: "Damage: Spreads diseases like corn stunt and feeds on sap.\nWhen: Early spring and early summer.\nInsecticides: Imidacloprid, Thiamethoxam, Malathion.",
      p4Name: "Corn Leaf Miner", p4Desc: "Damage: Larvae create tunnels in leaves, reducing photosynthesis.\nWhen: March to May.\nInsecticides: Lambda-Cyhalothrin, Pyrethroids.",
      p5Name: "Cucumber Beetles", p5Desc: "Damage: Feed on leaves and roots; spread bacterial wilt.\nWhen: Early spring to mid-summer.\nInsecticides: Imidacloprid, Carbaryl, Permethrin.",
      prepTitle: "Soil Preparation", prep1: "Plowing: Plow 20-30 cm deep.", prep2: "Fertilizer: Apply compost before planting.",
      earlyTitle: "Planting & Early Stage", early1: "Seed Depth: Plant 1-2 inches deep.", early2: "Gap Filling: Within 10 days.",
      growthTitle: "Growth & Flowering", growth1: "Fertilizer: Apply Urea at 4th and 8th weeks.", growth2: "Watering: Critical during silking.",
      weedTitle: "Weed & Protection", weed1: "Weeding: Perform at 3 and 6 weeks.", weed2: "Mulching: Use straw.",
      harvestTitle: "Maturation & Harvesting", harvest1: "Indicator: Kernels are hard.", harvest2: "Storage: Dry grains properly.",
      fertTitle: "Fertilizer Management", fert1: "Basal: Apply Urea, TSP, and MOP before planting.", fert2: "Top Dressing: Apply Urea at 4th and 8th weeks.",
      waterTitle: "Water Management", water1: "Flowering: Critical during silking and grain filling.", water2: "Drainage: Avoid waterlogging in the field.",
      emptyTitle: "Empty History", deleteTitle: "Delete Record", deleteMsg: "Are you sure?", cancel: "Cancel", delete: "Delete"
    },
    si: {
      title: "ගවේෂණය", tabs: ["මගපෙන්වීම", "උපදෙස්", "ඉතිහාසය"], guideTitle: "වගා අත්පොත", tipsTitle: "වගා උපදෙස්", historyTitle: "පරීක්ෂණ ඉතිහාසය", noHistory: "දත්ත පරීක්ෂා කර නොමැත.",
      cat1: "වගා අවධීන්", cat2: "පොහොර කළමනාකරණය", cat3: "ජල කළමනාකරණය",
      harvestVid: "YouTube වෙතින්: අස්වනු නෙළීමේ මඟපෙන්වීම", fertVid: "YouTube වෙතින්: පොහොර යෙදීමේ මඟපෙන්වීම", waterVid: "YouTube වෙතින්: ජල කළමනාකරණ මඟපෙන්වීම",
      d1Name: "ඇන්ත්‍රැක්නෝස්", d1Desc: "• රෝග කාරකය: Colletotrichum truncatum\n• හිතකර කාලගුණය: අධික උෂ්ණත්වය සහ තෙත් සහිත බව.\n• හානිය: පත්‍ර මත තැඹිලි-දුඹුරු පැහැති ඕවලාකාර ලප ඇති කරයි; කඳේ ශක්තිය සහ අස්වැන්න අඩු කරයි.\n💡 විසඳුම: දින 42ක් දක්වා ආරක්ෂාව සඳහා Trivapro දිලීර නාශකය භාවිතා කරන්න.",
      d2Name: "ඩිප්ලෝඩියා කරල් කුණුවීම", d2Desc: "• රෝග කාරකය: Stenocarpella maydis\n• හිතකර කාලගුණය: මධ්‍යස්ථ උෂ්ණත්වය සහ තතමනය.\n• ලක්ෂණ: කරල් පාමුල සුදු පැහැති පුස් හටගෙන පසුව අළු-දුඹුරු පැහැයට හැරේ.\n💡 විසඳුම: R1 අවධියේදී Miravis Neo දිලීර නාශකය යොදන්න.",
      d3Name: "ෆියුසාරියම් කරල් කුණුවීම", d3Desc: "• රෝග කාරකය: Fusarium verticilliodes\n• හිතකර කාලගුණය: අස්වැන්නට පෙර පවතින උණුසුම් හා තෙත් කාලගුණය.\n• ලක්ෂණ: කරල් පුරා විසිරුණු සුදු හෝ රෝස පැහැති පුස් සහ දුඹුරු ඉරි.\n💡 විසඳුම: Miravis Neo දිලීර නාශකය R1 අවධියේදී භාවිතා කරන්න.",
      d4Name: "ගිබරෙල්ලා කරල් කුණුවීම", d4Desc: "• රෝග කාරකය: Gibberella zeae\n• හිතකර කාලගුණය: සේද (Silk) අවධියේ පවතින සිසිල් කාලගුණය.\n• ලක්ෂණ: කරල් අග සිට පාමුලට විහිදෙන සුදු හෝ රෝස පැහැති පුස්.\n💡 විසඳුම: සේද අවධියේ සිට R1 දක්වා Miravis Neo යොදන්න.",
      d6Name: "ටාර් ස්පොට් (Tar Spot)", d6Desc: "• රෝග කාරකය: Phyllachora maydis\n• හිතකර කාලගුණය: සිසිල් සහ තෙතමනය සහිත කාලගුණය.\n• ලක්ෂණ: පත්‍ර මත මකා දැමිය නොහැකි කුඩා කළු පැහැති තිත්.\n💡 විසඳුම: VT/R1 අවධියේදී Miravis Neo හෝ Trivapro භාවිතා කරන්න.",
      p1Name: "සේනා දළඹුවා", p1Desc: "හානිය: පත්‍ර, සේද සහ කරල් ආහාරයට ගෙන ශාකය දුර්වල කරයි.\nකාලය: ජුනි - අගෝස්තු.\nකෘමිනාශක: Lambda-Cyhalothrin, Chlorantraniliprole, Cypermethrin.",
      p2Name: "යුරෝපීය බෝරර්", p2Desc: "හානිය: කඳ සහ කරල් විදගෙන හානි කරන අතර ශාකය දුර්වල කරයි.\nකාලය: ජුනි - ජූලි.\nකෘමිනාශක: Bt, Carbaryl, Permethrin.",
      p3Name: "කොළ පලඟැටියා", p3Desc: "හානිය: යුෂ උරා බීමෙන් ශාකය දුර්වල කරන අතර රෝග පතුරුවයි.\nකාලය: වසන්තය සහ මුල් ගිම්හානය.\nකෘමිනාශක: Imidacloprid, Thiamethoxam, Malathion.",
      p4Name: "කොළ පතල් පණුවා", p4Desc: "හානිය: පත්‍ර තුළ උමං සාදා ප්‍රභාසංශ්ලේෂණය අඩාල කරයි.\nකාලය: මාර්තු - මැයි.\nකෘමිනාශක: Lambda-Cyhalothrin, Pyrethroids.",
      p5Name: "පිපිඤ්ඤා කුරුමිණියා", p5Desc: "හානිය: පත්‍ර, කඳ සහ මුල් ආහාරයට ගෙන රෝග පතුරුවයි.\nකාලය: වසන්තයේ සිට මැද ගිම්හානය දක්වා.\nකෘමිනාශක: Imidacloprid, Carbaryl, Permethrin.",
      prepTitle: "පස සකස් කිරීම", prep1: "පස පෙරළීම: සෙ.මී. 20-30 ගැඹුරට.", prep2: "පොහොර: සිටුවීමට පෙර කොම්පෝස්ට්.",
      earlyTitle: "සිටුවීම & මුල් අවධිය", early1: "ගැඹුර: අඟල් 1-2 ගැඹුරට.", early2: "අඩුව පිරවීම: දින 10ක් තුළ.",
      growthTitle: "වර්ධනය & මල් පිපීම", growth1: "යූරියා: 4 සහ 8 සති වලදී.", growth2: "ජලය: කරල් මතු වන විට අත්‍යවශ්‍යයි.",
      weedTitle: "වල් නෙළීම & ආරක්ෂාව", weed1: "වල් නෙළීම: 3 සහ 6 සති වලදී.", weed2: "වැස්ම: පස තෙතමනයට පිදුරු යොදන්න.",
      harvestTitle: "මේරීම & අස්වනු නෙළීම", harvest1: "හඳුනාගැනීම: බීජ තද වූ පසු.", harvest2: "ගබඩා: හොඳින් වියළා ගබඩා කරන්න.",
      fertTitle: "පොහොර කළමනාකරණය", fert1: "මූලික පොහොර: සිටුවීමට පෙර යූරියා, TSP සහ MOP යොදන්න.", fert2: "අතිරේක පොහොර: 4 සහ 8 වන සති වලදී යූරියා යොදන්න.",
      waterTitle: "ජල කළමනාකරණය", water1: "මල් පිපීම: සේද අවධිය සහ කරල් පිරෙන කාලය ඉතා තීරණාත්මකයි.", water2: "ජලාපවහනය: වගා බිමේ වතුර රැඳීම වළක්වා ගන්න.",
      emptyTitle: "හිස්ව පවතී", deleteTitle: "මකන්න", deleteMsg: "ඔබට මෙය මැකීමට අවශ්‍යද?", cancel: "අවලංගු කරන්න", delete: "මකන්න"
    },
    ta: {
      title: "ஆராய்ந்து பாருங்கள்", tabs: ["வழிகாட்டி", "குறிப்புகள்", "வரலாறு"], guideTitle: "விவசாயக் கையேடு", tipsTitle: "பராமரிப்பு", historyTitle: "வரலாறு", noHistory: "தகவல்கள் இல்லை.",
      cat1: "சாகுபடி நிலைகள்", cat2: "உர மேலாண்மை", cat3: "நீர் மேலாண்மை",
      harvestVid: "YouTube: அறுவடை கையேடு", fertVid: "YouTube: உர மேலாண்மை", waterVid: "YouTube: நீர் மேலாண்மை",
      d1Name: "ஆந்த்ராக்னோஸ்", d1Desc: "• காரணம்: Colletotrichum truncatum\n• அறிகுறிகள்: இலைகளில் நீண்ட பழுப்பு நிற தழும்புகள்; தண்டு வலிமையை குறைக்கும்.\n💡 குறிப்பு: 42 நாட்கள் பாதுகாப்பிற்கு Trivapro பூஞ்சைக் கொல்லியைப் பயன்படுத்தவும்.",
      d2Name: "டிப்ளோடியா அழுகல்", d2Desc: "• காரணம்: Stenocarpella maydis\n• அறிகுறிகள்: கதிரின் அடியில் வெள்ளை பூஞ்சை, பின்னர் சாம்பல்-பழுப்பு நிறமாக மாறும்.\n💡 குறிப்பு: R1 நிலையில் Miravis Neo பயன்படுத்தவும்.",
      d3Name: "புசாரியம் அழுகல்", d3Desc: "• காரணம்: Fusarium verticilliodes\n• அறிகுறிகள்: வெள்ளை அல்லது ஊதா நிற தானியங்கள் மற்றும் பழுப்பு நிற கோடுகள்.\n💡 குறிப்பு: Miravis Neo பூஞ்சைக் கொல்லியை R1 நிலையில் பயன்படுத்தவும்.",
      d4Name: "கிபெரெல்லா அழுகல்", d4Desc: "• காரணம்: Gibberella zeae\n• அறிகுறிகள்: கதிரின் நுனியில் இருந்து சிவந்த அல்லது இளஞ்சிவப்பு பூஞ்சை.\n💡 குறிப்பு: பச்சை சில்க் நிலையில் Miravis Neo பயன்படுத்தவும்.",
      d6Name: "தார் புள்ளி நோய்", d6Desc: "• காரணம்: Phyllachora maydis\n• அறிகுறிகள்: இலைகளில் தேய்த்தாலும் நீங்காத சிறிய கருப்பு புள்ளிகள்.\n💡 குறிப்பு: VT/R1 நிலையில் Miravis Neo அல்லது Trivapro பயன்படுத்தவும்.",
      p1Name: "சேனா படைப்புழு", p1Desc: "பாதிப்பு: இலைகள் மற்றும் கதிர்களை உண்ணும்; மகசூலை குறைக்கும்.\nபூச்சிக்கொல்லிகள்: Lambda-Cyhalothrin, Chlorantraniliprole.",
      p2Name: "சோளத் துளைப்பான்", p2Desc: "பாதிப்பு: தண்டு மற்றும் கதிர்களை துளைத்து பலவீனப்படுத்தும்.\nபூச்சிக்கொல்லிகள்: Bt, Carbaryl, Permethrin.",
      p3Name: "இலைத் தத்துப்பூச்சி", p3Desc: "பாதிப்பு: சாற்றை உறிஞ்சி நோய்களை பரப்பும்.\nபூச்சிக்கொல்லிகள்: Imidacloprid, Thiamethoxam.",
      p4Name: "இலைச் சுரங்கப்புழு", p4Desc: "பாதிப்பு: இலைகளுக்குள் சுரங்கம் அமைத்து ஒளிச்சேர்க்கையை குறைக்கும்.\nபூச்சிக்கொல்லிகள்: Lambda-Cyhalothrin.",
      p5Name: "வெள்ளரி வண்டு", p5Desc: "பாதிப்பு: வேர், தண்டு மற்றும் இலைகளை உண்ணும்.\nபூச்சிக்கொல்லிகள்: Imidacloprid, Carbaryl.",
      prepTitle: "நிலம் தயாரிப்பு", prep1: "உழுதல்: 20-30 செ.மீ ஆழம்.", prep2: "உரம்: இயற்கை உரம் இடுங்கள்.",
      earlyTitle: "நடுதல்", early1: "ஆழம்: 1-2 அங்குல ஆழம்.", early2: "இடைவெளி: 10 நாளில் நிரப்பவும்.",
      growthTitle: "வளர்ச்சி", growth1: "உரம்: 4, 8 வது வாரங்களில்.", growth2: "நீர்: பூக்கும் போது அவசியம்.",
      weedTitle: "பாதுகாப்பு", weed1: "களை: 3, 6 வது வாரங்களில்.", weed2: "மூடாக்கு: வைக்கோல் இடவும்.",
      harvestTitle: "அறுவடை", harvest1: "அறுவடை: தானியம் கடினமானதும்.", harvest2: "சேமிப்பு: உலர்த்தி சேமிக்கவும்.",
      fertTitle: "உர மேலாண்மை", fert1: "அடிப்படை: நடவு செய்வதற்கு முன் யூரியா, TSP மற்றும் MOP இடவும்.", fert2: "மேல் உரம்: 4 மற்றும் 8 வது வாரங்களில் யூரியா இடவும்.",
      waterTitle: "நீர் மேலாண்மை", water1: "பூக்கும் நிலை: பூக்கும் மற்றும் தானியம் நிரப்பும் போது நீர் அவசியம்.", water2: "வடிகால்: வயலில் நீர் தேங்குவதை தவிர்க்கவும்.",
      emptyTitle: "காலியாக உள்ளது", deleteTitle: "நீக்கு", deleteMsg: "நீக்க வேண்டுமா?", cancel: "ரத்து", delete: "நீக்கு"
    }
  };

  const ExpandableCard = ({ id, name, desc }: { id: string, name: string, desc: string }) => (
    <TouchableOpacity activeOpacity={0.9} onPress={() => toggleExpand(id)} style={[styles.guideCard, expandedId === id && styles.expandedCard]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={[styles.indicator, { backgroundColor: id.startsWith('p') ? '#ef5350' : '#66bb6a' }]} />
          <Text style={styles.guideName}>{name}</Text>
        </View>
        <Ionicons name={expandedId === id ? "chevron-up-circle" : "chevron-down-circle"} size={24} color="#1b5e20" />
      </View>
      {expandedId === id && (
        <View style={styles.descContainer}>
          {itemImages[id] && <Image source={itemImages[id]} style={styles.diseaseImg} resizeMode="cover" />}
          <Text style={styles.guideDesc}>{desc}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#1b5e20', '#2e7d32', '#f0f4f7']} style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.mainTitle}>{t[lang].title}</Text>
        <View style={styles.modernTabBar}>
          {[{ id: 'Guide', icon: 'book', color: '#4caf50' }, { id: 'Tips', icon: 'bulb', color: '#ffb300' }, { id: 'History', icon: 'time', color: '#2196f3' }].map((tab, idx) => (
            <TouchableOpacity key={tab.id} style={[styles.modernTabItem, activeTab === tab.id && { backgroundColor: tab.color }]} onPress={() => { setActiveTab(tab.id); setExpandedId(null); }}>
              <Ionicons name={tab.icon as any} size={18} color={activeTab === tab.id ? "#fff" : "#1b5e20"} />
              <Text style={[styles.modernTabText, activeTab === tab.id && { color: '#fff' }]}>{t[lang].tabs[idx]}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
          {activeTab === 'Guide' && (
            <View>
              <Text style={styles.tabTitle}>{t[lang].guideTitle}</Text>
              <View style={styles.sectionDivider}><Text style={styles.sectionHeaderText}>{lang === 'ta' ? 'நோய்கள்' : 'Diseases'}</Text></View>
              {['d1', 'd2', 'd3', 'd4', 'd6'].map(id => <ExpandableCard key={id} id={id} name={t[lang][id + 'Name']} desc={t[lang][id + 'Desc']} />)}
              <View style={[styles.sectionDivider, { marginTop: 20 }]}><Text style={[styles.sectionHeaderText, { color: '#c62828' }]}>{lang === 'ta' ? 'பூச்சிகள்' : 'Pests'}</Text></View>
              {['p1', 'p2', 'p3', 'p4', 'p5'].map(id => <ExpandableCard key={id} id={id} name={t[lang][id + 'Name']} desc={t[lang][id + 'Desc']} />)}
            </View>
          )}
          {activeTab === 'Tips' && (
            <View>
              <Text style={styles.tabTitle}>{t[lang].tipsTitle}</Text>
              
              <View style={styles.categoryHeader}><Text style={styles.categoryHeaderText}>{t[lang].cat1}</Text></View>
              {[ 
                { t: t[lang].prepTitle, s: [t[lang].prep1, t[lang].prep2] }, 
                { t: t[lang].earlyTitle, s: [t[lang].early1, t[lang].early2] }, 
                { t: t[lang].growthTitle, s: [t[lang].growth1, t[lang].growth2] }, 
                { t: t[lang].weedTitle, s: [t[lang].weed1, t[lang].weed2] }, 
                { t: t[lang].harvestTitle, s: [t[lang].harvest1, t[lang].harvest2] }
              ].map((sec, i) => (
                <View key={i} style={styles.tipSectionContainer}>
                  <Text style={styles.tipSectionTitle}>{sec.t}</Text>
                  {sec.s.map((tip, j) => <View key={j} style={styles.tipItem}><View style={styles.bullet} /><Text style={styles.tipText}>{tip}</Text></View>)}
                  {i === 4 && (
                    <TouchableOpacity onPress={() => openVideo('https://youtu.be/3kFUMKVzG9I?si=KkIYSFc9D_v2aU1q')}>
                      <Text style={styles.hyperlinkText}>🔗 {t[lang].harvestVid}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              <View style={styles.categoryHeader}><Text style={styles.categoryHeaderText}>{t[lang].cat2}</Text></View>
              <View style={styles.tipSectionContainer}>
                <Text style={styles.tipSectionTitle}>{t[lang].fertTitle}</Text>
                <View style={styles.tipItem}><View style={styles.bullet} /><Text style={styles.tipText}>{t[lang].fert1}</Text></View>
                <View style={styles.tipItem}><View style={styles.bullet} /><Text style={styles.tipText}>{t[lang].fert2}</Text></View>
                <TouchableOpacity onPress={() => openVideo('https://youtu.be/p6hln7DBqnY?si=I1c7oKL2845t5xDc')}>
                  <Text style={styles.hyperlinkText}>🔗 {t[lang].fertVid}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.categoryHeader}><Text style={styles.categoryHeaderText}>{t[lang].cat3}</Text></View>
              <View style={styles.tipSectionContainer}>
                <Text style={styles.tipSectionTitle}>{t[lang].waterTitle}</Text>
                <View style={styles.tipItem}><View style={styles.bullet} /><Text style={styles.tipText}>{t[lang].water1}</Text></View>
                <View style={styles.tipItem}><View style={styles.bullet} /><Text style={styles.tipText}>{t[lang].water2}</Text></View>
                <TouchableOpacity onPress={() => openVideo('https://youtu.be/cwrzI2yrSTc?si=xIEQ7HYyNM7P-9f3')}>
                  <Text style={styles.hyperlinkText}>🔗 {t[lang].waterVid}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {activeTab === 'History' && (
            <View>
              <Text style={styles.tabTitle}>{t[lang].historyTitle}</Text>
              {history.length === 0 ? (
                <View style={styles.emptyStateContainer}>
                  <View style={styles.emptyIconCircle}><Ionicons name="document-text-outline" size={60} color="#1b5e20" /></View>
                  <Text style={styles.emptyTitleText}>{t[lang].emptyTitle}</Text>
                  <Text style={styles.emptySubText}>{t[lang].noHistory}</Text>
                </View>
              ) : (
                history.map((item) => (
                <View key={item.id} style={styles.hCard}>
                  <View style={styles.hTop}><Text style={[styles.hName, { color: item.disease === 'Healthy' ? '#2e7d32' : '#c62828' }]}>{item.disease}</Text><Text style={styles.hAcc}>{item.accuracy}</Text></View>
                  <View style={styles.hBot}><Text style={styles.hDate}>{item.date}</Text><TouchableOpacity onPress={() => deleteHistoryItem(item.id)}><Ionicons name="trash" size={18} color="#ef5350" /></TouchableOpacity></View>
                </View>
              )))}
            </View>
          )}
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 60 },
  mainTitle: { fontSize: 32, fontWeight: '900', color: '#fff', marginBottom: 25 },
  modernTabBar: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: 6, marginBottom: 25 },
  modernTabItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 15 },
  modernTabText: { marginLeft: 6, fontWeight: 'bold', fontSize: 12, color: '#fff' },
  tabTitle: { fontSize: 24, fontWeight: 'bold', color: '#1b5e20', marginBottom: 20 },
  sectionDivider: { borderLeftWidth: 4, borderLeftColor: '#1b5e20', paddingLeft: 10, marginBottom: 15 },
  sectionHeaderText: { fontSize: 18, fontWeight: '800', color: '#1b5e20' },
  categoryHeader: { backgroundColor: '#1b5e20', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 10, marginBottom: 15, marginTop: 10 },
  categoryHeaderText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  guideCard: { backgroundColor: '#fff', borderRadius: 22, marginBottom: 12, padding: 16 },
  expandedCard: { borderColor: '#1b5e20', borderWidth: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  indicator: { width: 4, height: 24, borderRadius: 2, marginRight: 12 },
  guideName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  descContainer: { marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  diseaseImg: { width: '100%', height: 200, borderRadius: 15, marginBottom: 10 },
  guideDesc: { fontSize: 14, color: '#444', lineHeight: 22 },
  tipSectionContainer: { backgroundColor: '#fff', borderRadius: 22, padding: 18, marginBottom: 15 },
  tipSectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#1b5e20', marginBottom: 10 },
  tipItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 5 },
  bullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#1b5e20', marginTop: 7, marginRight: 8 },
  tipText: { fontSize: 14, color: '#444', flex: 1 },
  hyperlinkText: { color: '#0066cc', textDecorationLine: 'underline', fontSize: 14, fontWeight: '600', marginTop: 10 },
  hCard: { backgroundColor: '#fff', borderRadius: 20, padding: 18, marginBottom: 10 },
  hTop: { flexDirection: 'row', justifyContent: 'space-between' },
  hName: { fontSize: 17, fontWeight: 'bold' },
  hAcc: { fontWeight: 'bold', color: '#666' },
  hBot: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  hDate: { color: '#999', fontSize: 13 },
  emptyStateContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 60, padding: 20 },
  emptyIconCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255, 255, 255, 0.4)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  emptyTitleText: { fontSize: 20, fontWeight: 'bold', color: '#1b5e20', marginBottom: 8 },
  emptySubText: { fontSize: 14, color: '#666', textAlign: 'center' },
});