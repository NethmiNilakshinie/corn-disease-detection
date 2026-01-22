import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Alert, LayoutAnimation, Platform, UIManager } from 'react-native';
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
  const [history, setHistory] = useState<any[]>([]); // History state
  const isFocused = useIsFocused();

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedLang = await AsyncStorage.getItem('userLanguage');
        if (savedLang) setLang(savedLang as 'en' | 'si' | 'ta');
        
        // Load history from AsyncStorage
        const savedHistory = await AsyncStorage.getItem('scanHistory');
        if (savedHistory) {
          setHistory(JSON.parse(savedHistory));
        } else {
          // Default data if empty
          setHistory([
            { id: '1', disease: 'Common Rust', date: '2026/01/21', accuracy: '71.5%' },
            { id: '2', disease: 'Healthy', date: '2026/01/21', accuracy: '97.8%' },
          ]);
        }
      } catch (e) { console.error("Failed to load data", e); }
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
      title: "Explore 🌽",
      tabs: ["Guide", "Tips", "History"],
      guideTitle: "Agri Handbook 📖",
      tipsTitle: "Care Tips 💡",
      historyTitle: "Scan History 📜",
      noHistory: "No scan history found.",
      blightName: "Leaf Blight",
      blightDesc: "Development worsened by over 6 hours of leaf wetness and moderate temperatures (65-82°F). Lesions develop 7-12 days after infection.",
      rustName: "Common Rust",
      rustDesc: "Caused by Puccinia sorghi. Appears as small, oval dark-reddish-brown pustules on both leaf surfaces.",
      anthracnoseName: "Anthracnose",
      anthracnoseDesc: "Attacks at various stages. Early as leaf blight, later causing 'top dieback' or stalk rot.",
      eyespotName: "Eyespot",
      eyespotDesc: "Small, light green circular lesions with yellow halos. Develops brown/purple rings as they age.",
      tarspotName: "Tar Spot",
      tarspotDesc: "Raised, circular black spots that cannot be rubbed or scraped off. Thrives in cool, wet conditions.",
      rootwormName: "Corn Rootworm (CRW)",
      rootwormDesc: "• Identification: Larvae feed on roots in June/July. Causes scars, tunneling, or roots chewed to the base.\n• Impact: Lodging, reduced water/nutrient uptake.\n• Action: Perform root digs and use yellow sticky traps.",
      cutwormName: "Black Cutworm",
      cutwormDesc: "• Identification: Causes 'dead heart'. Cuts young plants at soil surface.\n• Larvae: Black/pale-gray, grainy skin.\n• Action: Timely scouting early in the season is key.",
      armywormName: "Fall Armyworm (FAW)",
      armywormDesc: "• Identification: Damages leaf or ear tissues. Ragged edges in leaves.\n• Larvae: Inverted 'Y' on head.\n• Action: Pull and unroll whorls to make larval counts.",
      earwormName: "Corn Earworm (CEW)",
      earwormDesc: "• Identification: Favors ear feeding. Extensive excrement at the ear tip.\n• Impact: Entry point for fungal pathogens.\n• Action: Use pheromone traps.",
      beanCutwormName: "Western Bean Cutworm",
      beanCutwormDesc: "• Identification: Feeds on tassels, silks, and kernels.\n• Larvae: Two black squares above the head.\n• Action: Scout for egg masses on upper leaf surfaces.",
      earlyTitle: "1. Planting & Early Stage (0-4 Weeks)",
      early1: "Seed Depth: Plant 1-2 inches deep in moist soil.",
      early2: "Gap Filling: Replace missing plants within 7-10 days.",
      growthTitle: "2. Growth & Flowering (5-10 Weeks)",
      growth1: "Fertilizer: Apply Urea at 4th and 8th weeks.",
      growth2: "Watering: Critical during tasseling and silking stages.",
      harvestTitle: "3. Maturation & Harvesting (12+ Weeks)",
      harvest1: "Indicator: Harvest when kernels are hard and moisture is low.",
      harvest2: "Storage: Dry grains properly to avoid weevil attacks.",
      deleteTitle: "Delete Record", deleteMsg: "Are you sure?", cancel: "Cancel", delete: "Delete"
    },
    si: {
      title: "ගවේෂණය 🌽",
      tabs: ["මගපෙන්වීම", "උපදෙස්", "ඉතිහාසය"],
      guideTitle: "වගා අත්පොත 📖",
      tipsTitle: "වගා උපදෙස් 💡",
      historyTitle: "පරීක්ෂණ ඉතිහාසය 📜",
      noHistory: "පරීක්ෂණ දත්ත හමු නොවීය.",
      blightName: "කොළ පාළුව (Blight)",
      blightDesc: "පැය 6කට වඩා පත්‍ර තෙත්ව පැවතීම නිසා වර්ධනය වේ. ආසාදනය වී දින 7-12 අතර ලප ඇතිවේ.",
      rustName: "මලකඩ රෝගය (Common Rust)",
      rustDesc: "පත්‍ර දෙපසම කුඩා ඕවලාකාර තද රතු-දුඹුරු බිබිලි ඇතිවේ.",
      anthracnoseName: "ඇන්ත්‍රැක්නෝස් (Anthracnose)",
      anthracnoseDesc: "මුල් කාලයේ පත්‍ර පාළුවක් ලෙසත්, පසුව කඳ කුණුවීමටත් හේතු වේ.",
      eyespotName: "අයිස්පොට් (Eyespot)",
      eyespotDesc: "කහ වටයක් සහිත ලා කොළ පාට ලප ඇතිවේ.",
      tarspotName: "ටාර් ස්පොට් (Tar Spot)",
      tarspotDesc: "පත්‍ර මත මැකීමට නොහැකි කුඩා කළු පැහැති තද ලප ඇතිවේ.",
      rootwormName: "මුල් පණුවා (Corn Rootworm)",
      rootwormDesc: "• හඳුනාගැනීම: ජූනි/ජූලි කාලයේ මුල් ආහාරයට ගනී. මේ නිසා ජලය සහ පෝෂක උරා ගැනීම අඩාල වේ.\n• පියවර: මුල් හාරා පරික්ෂා කිරීම සහ කහ පැහැති ඇලෙන සුළු උගුල් භාවිතය.",
      cutwormName: "කළු කපන පණුවා (Black Cutworm)",
      cutwormDesc: "• හඳුනාගැනීම: ළපටි පැළ පාමුලින් කපා 'Dead Heart' තත්ත්වය ඇති කරයි.\n• පියවර: වගාවේ මුල් අවධියේදී නිරන්තරයෙන් නිරීක්ෂණය කරන්න.",
      armywormName: "සේනා දළඹුවා (Fall Armyworm)",
      armywormDesc: "• හඳුනාගැනීම: පත්‍ර සහ කරල් විනාශ කරයි. පත්‍රවල සිදුරු ඇති කරයි.\n• ලක්ෂණ: හිස මත 'Y' සලකුණක් ඇත.",
      earwormName: "කරල් විදින පණුවා (Corn Earworm)",
      earwormDesc: "• හඳුනාගැනීම: කරල්වල අග කොටසට හානි කරයි. කරල අග අසූචි දක්නට ලැබේ.",
      beanCutwormName: "බීන් කට්වර්ම් (Bean Cutworm)",
      beanCutwormDesc: "• හඳුනාගැනීම: මල් මංජරිය සහ කරල්වල බීජ ආහාරයට ගනී.\n• ලක්ෂණ: හිසට ඉහළින් කළු පැහැති කොටු දෙකක් ඇත.",
      earlyTitle: "1. සිටුවීම සහ මුල් අවධිය (සති 0-4)",
      early1: "බීජ ගැඹුර: අඟල් 1-2 ක් ගැඹුරින් තෙතමනය සහිත පසෙහි සිටුවන්න.",
      early2: "අඩුව පිරවීම: පැළ නොවූ තැන් ඇත්නම් දින 10 ක් තුළ නැවත සිටුවන්න.",
      growthTitle: "2. වර්ධනය සහ මල් පිපීම (සති 5-10)",
      growth1: "පොහොර: වගාවට සති 4 දී සහ 8 දී යූරියා පොහොර යොදන්න.",
      growth2: "ජල සම්පාදනය: කරල් මතුවන කාලයේ තෙතමනය අත්‍යවශ්‍ය වේ.",
      harvestTitle: "3. මේරීම සහ අස්වනු නෙළීම (සති 12+)",
      harvest1: "හඳුනාගැනීම: බීජ තද වී පත්‍ර වියළී ගිය පසු අස්වනු නෙළන්න.",
      harvest2: "ගබඩා කිරීම: බීජ හොඳින් වියළා ගබඩා කරන්න.",
      deleteTitle: "මකන්න", deleteMsg: "මකන්නද?", cancel: "අවලංගු කරන්න", delete: "මකන්න"
    },
    ta: {
        title: "ஆராய்ந்து பாருங்கள் 🌽",
        tabs: ["வழிகாட்டி", "குறிப்புகள்", "வரலாறு"],
        guideTitle: "விவசாய கையேடு 📖",
        tipsTitle: "பராமரிப்பு குறிப்புகள் 💡",
        historyTitle: "பரிசோதனை வரலாறு 📜",
        noHistory: "வரலாறு எதுவும் இல்லை.",
        rootwormName: "வேர் புழு",
        rootwormDesc: "• அடையாளம்: ஜூன்/ஜூலை மாதங்களில் வேர்களை உண்ணும். செடிகள் சாய்வதற்கு இது காரணமாகிறது.",
        cutwormName: "கருப்பு வெட்டுப்புழு",
        cutwormDesc: "• அடையாளம்: இளம் செடிகளை வெட்டி 'Dead Heart' நிலையை உண்டாக்கும்.",
        armywormName: "சேனா படைப்புழு",
        armywormDesc: "• அடையாளம்: இலைகளில் துளைகளையும் கிழிந்த ஓரங்களையும் உண்டாக்கும்.",
        earwormName: "கதிர் புழு",
        earwormDesc: "• அடையாளம்: கதிரின் நுனியில் இருந்து உண்ணத் தொடங்குகிறது.",
        beanCutwormName: "பீன் வெட்டுப்புழு",
        beanCutwormDesc: "• அடையாளம்: கதிர் மற்றும் தானியங்களை உண்ணும்.",
        earlyTitle: "1. நடுதல் மற்றும் ஆரம்ப நிலை (0-4 வாரங்கள்)",
        early1: "ஆழம்: விதைகளை 1-2 அங்குல ஆழத்தில் நடவும்.",
        early2: "மறுநடவு: 7-10 நாட்களுக்குள் காலியாக உள்ள இடங்களில் நடவும்.",
        growthTitle: "2. வளர்ச்சி நிலை (5-10 வாரங்கள்)",
        growth1: "உரம்: 4 மற்றும் 8 வது வாரங்களில் யூரியா இடவும்.",
        growth2: "நீர்: பூக்கும் மற்றும் கதிர் வரும் காலத்தில் நீர் அவசியம்.",
        harvestTitle: "3. அறுவடை (12+ வாரங்கள்)",
        harvest1: "அறுவடை: தானியங்கள் கடினமானதும் அறுவடை செய்யவும்.",
        harvest2: "சேமிப்பு: நன்கு உலர்த்தி சேமிக்கவும்.",
        deleteTitle: "நீக்கு", deleteMsg: "நீக்க வேண்டுமா?", cancel: "ரத்து", delete: "நீக்கு"
    }
  };

  const ExpandableCard = ({ id, name, desc }: { id: string, name: string, desc: string }) => (
    <TouchableOpacity activeOpacity={0.8} onPress={() => toggleExpand(id)} style={styles.guideCard}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.guideName}>{name}</Text>
        <Ionicons name={expandedId === id ? "chevron-up" : "chevron-down"} size={18} color="#666" />
      </View>
      {expandedId === id && desc ? (
        <View style={styles.descContainer}>
          <Text style={styles.guideDesc}>{desc}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#1b5e20', '#f0f4f7']} style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.mainTitle}>{t[lang].title}</Text>
        <View style={styles.tabRow}>
          {t[lang].tabs.map((tab: string, index: number) => {
            const tabKeys = ['Guide', 'Tips', 'History'];
            return (
              <TouchableOpacity key={tab} style={[styles.tabButton, activeTab === tabKeys[index] && styles.activeTabButton]} onPress={() => { setActiveTab(tabKeys[index]); setExpandedId(null); }}>
                <Text style={[styles.tabText, activeTab === tabKeys[index] && styles.activeTabText]}>{tab}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {activeTab === 'Guide' && (
            <View style={{ paddingBottom: 20 }}>
              <Text style={styles.tabTitle}>{t[lang].guideTitle}</Text>
              <View style={styles.sectionHeader}><Ionicons name="leaf" size={18} color="#1b5e20" /><Text style={styles.sectionHeaderText}> Diseases</Text></View>
              <ExpandableCard id="d1" name={t[lang].blightName} desc={t[lang].blightDesc} />
              <ExpandableCard id="d2" name={t[lang].rustName} desc={t[lang].rustDesc} />
              <ExpandableCard id="d3" name={t[lang].anthracnoseName} desc={t[lang].anthracnoseDesc} />
              <ExpandableCard id="d4" name={t[lang].eyespotName} desc={t[lang].eyespotDesc} />
              <ExpandableCard id="d5" name={t[lang].tarspotName} desc={t[lang].tarspotDesc} />

              <View style={styles.sectionHeader}><Ionicons name="bug" size={18} color="#c62828" /><Text style={[styles.sectionHeaderText, {color: '#c62828'}]}> Pests</Text></View>
              <ExpandableCard id="p1" name={t[lang].rootwormName} desc={t[lang].rootwormDesc} />
              <ExpandableCard id="p2" name={t[lang].cutwormName} desc={t[lang].cutwormDesc} />
              <ExpandableCard id="p3" name={t[lang].armywormName} desc={t[lang].armywormDesc} />
              <ExpandableCard id="p4" name={t[lang].earwormName} desc={t[lang].earwormDesc} />
              <ExpandableCard id="p5" name={t[lang].beanCutwormName} desc={t[lang].beanCutwormDesc} />
            </View>
          )}

          {activeTab === 'Tips' && (
            <View style={{ paddingBottom: 20 }}>
              <Text style={styles.tabTitle}>{t[lang].tipsTitle}</Text>
              <Text style={styles.subHeader}>{t[lang].earlyTitle}</Text>
              <View style={styles.tipItem}><Ionicons name="sunny" size={20} color="#1b5e20" /><Text style={styles.tipText}>{t[lang].early1}</Text></View>
              <View style={styles.tipItem}><Ionicons name="refresh-circle" size={20} color="#1b5e20" /><Text style={styles.tipText}>{t[lang].early2}</Text></View>
              
              <Text style={styles.subHeader}>{t[lang].growthTitle}</Text>
              <View style={styles.tipItem}><Ionicons name="leaf" size={20} color="#1b5e20" /><Text style={styles.tipText}>{t[lang].growth1}</Text></View>
              <View style={styles.tipItem}><Ionicons name="water" size={20} color="#1b5e20" /><Text style={styles.tipText}>{t[lang].growth2}</Text></View>
              
              <Text style={styles.subHeader}>{t[lang].harvestTitle}</Text>
              <View style={styles.tipItem}><Ionicons name="checkmark-done-circle" size={20} color="#1b5e20" /><Text style={styles.tipText}>{t[lang].harvest1}</Text></View>
              <View style={styles.tipItem}><Ionicons name="archive" size={20} color="#1b5e20" /><Text style={styles.tipText}>{t[lang].harvest2}</Text></View>
            </View>
          )}

          {activeTab === 'History' && (
            <View style={{ paddingBottom: 20 }}>
              <Text style={styles.tabTitle}>{t[lang].historyTitle}</Text>
              <FlatList
                data={history}
                scrollEnabled={false}
                keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.historyCard}>
                    <View>
                      <Text style={[styles.historyDisease, { color: item.disease === 'Healthy' ? '#2e7d32' : '#c62828' }]}>{item.disease}</Text>
                      <Text style={styles.historyDate}>{item.date}</Text>
                    </View>
                    <View style={styles.historyRight}>
                      <View style={[styles.accuracyBadge, { backgroundColor: item.disease === 'Healthy' ? '#e8f5e9' : '#ffebee' }]}>
                        <Text style={[styles.accuracyText, { color: item.disease === 'Healthy' ? '#2e7d32' : '#c62828' }]}>{item.accuracy}</Text>
                      </View>
                      <TouchableOpacity onPress={() => deleteHistoryItem(item.id)}><Ionicons name="trash-outline" size={20} color="#c62828" style={{ marginTop: 8 }} /></TouchableOpacity>
                    </View>
                  </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>{t[lang].noHistory}</Text>}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 60 },
  mainTitle: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  tabRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 15, padding: 5, marginBottom: 20 },
  tabButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
  activeTabButton: { backgroundColor: '#fff' },
  tabText: { color: '#eee', fontWeight: 'bold' },
  activeTabText: { color: '#1b5e20' },
  tabTitle: { fontSize: 20, fontWeight: 'bold', color: '#1b5e20', marginBottom: 15 },
  subHeader: { fontSize: 16, fontWeight: 'bold', color: '#1b5e20', marginTop: 15, marginBottom: 8, backgroundColor: '#e8f5e9', padding: 10, borderRadius: 10 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginTop: 15, marginBottom: 8 },
  sectionHeaderText: { fontWeight: 'bold', fontSize: 16, color: '#1b5e20' },
  guideCard: { backgroundColor: '#fff', padding: 15, borderRadius: 15, marginBottom: 10, elevation: 3 },
  guideName: { fontSize: 17, fontWeight: 'bold', color: '#333' },
  descContainer: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  guideDesc: { fontSize: 14, color: '#444', lineHeight: 21 },
  tipItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 15, marginBottom: 10, elevation: 2 },
  tipText: { marginLeft: 12, fontSize: 14, color: '#333', flex: 1 },
  historyCard: { backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderRadius: 20, marginBottom: 12, elevation: 3 },
  historyDisease: { fontSize: 18, fontWeight: 'bold' },
  historyDate: { color: '#999', fontSize: 12 },
  historyRight: { alignItems: 'flex-end' },
  accuracyBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  accuracyText: { fontWeight: 'bold', fontSize: 14 },
  emptyText: { textAlign: 'center', marginTop: 30, color: '#999' }
});