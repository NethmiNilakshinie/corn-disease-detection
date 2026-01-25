import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en');

  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        const savedLang = await AsyncStorage.getItem('userLanguage');
        if (savedLang !== null) setSelectedLang(savedLang);
      } catch (error) {
        console.error("Error loading language:", error);
      }
    };
    loadSavedLanguage();
  }, []);

  const changeLanguage = async (lang) => {
    try {
      setSelectedLang(lang);
      await AsyncStorage.setItem('userLanguage', lang);
    } catch (error) {
      console.error("Error saving language:", error);
    }
  };

  const saveToHistory = async (diseaseName, confidence) => {
    try {
      const existingHistory = await AsyncStorage.getItem('scanHistory');
      let historyArray = existingHistory ? JSON.parse(existingHistory) : [];
      const newScan = {
        id: Date.now().toString(),
        disease: diseaseName,
        accuracy: confidence ? `${(confidence * 100).toFixed(1)}%` : 'N/A',
        date: new Date().toLocaleDateString(),
      };
      historyArray.unshift(newScan);
      await AsyncStorage.setItem('scanHistory', JSON.stringify(historyArray));
    } catch (error) {
      console.error("Failed to save history:", error);
    }
  };

  const openAgriMaps = () => {
    const query = "Agriculture Service Center Sri Lanka";
    const url = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
    Linking.openURL(url).catch(() => Alert.alert("Error", "Could not open Google Maps"));
  };

  const diseaseData = {
    en: {
      "Blight": {
        desc: "Northern corn leaf blight occurs commonly in most areas where corn is grown. Yield losses are typically minimal, but can become significant with susceptible hybrids or inbreds if infected before silking.",
        symptoms: "* Canoe-shaped lesions 1 inch to 6 inches long.\n* Initially bordered by gray-green margins, eventually turning tan.\n* May contain dark areas of fungal sporulation.\n* Lesions begin on lower leaves and spread to upper leaves.\n* Can be confused with Goss's leaf blight or Stewart's wilt.",
        conditions: "* Moderate temperatures (64 to 80 °F).\n* Prolonged periods of moisture.\n* Typically appears at or after silking.",
        pathogen: "Exserohilum turcicum (syn. Helminthosporium turcicum). Overwinters on corn leaf debris.",
        management: "* Use resistant hybrids.\n* Fungicides for seed production inbreds.\n* Crop rotation and tillage practices."
      },
      "Common Rust": {
        desc: "Frequently occurs in mid to later summer. It rarely reaches levels that cause yield loss in commercial hybrids but is most problematic during cool, wet weather.",
        symptoms: "* Rust-colored to dark brown, elongated pustules on both leaf surfaces.\n* Pustules contain cinnamon brown urediniospores.\n* Pustules darken as they age.\n* Severe conditions may cause leaf chlorosis and death.\n* Differentiated from Southern rust by pustules on both top and bottom leaf surfaces.",
        conditions: "* Cool temperatures (60 - 76 °F).\n* Heavy dews, ~6 hours of leaf wetness, and relative humidity > 95%.\n* Temperatures above 80 °F suppress development.",
        pathogen: "Puccinia sorghi. Overwinters in southern U.S. and Mexico; spores blown north in summer.",
        management: "* Best practice is to use resistant corn hybrids.\n* Fungicides are beneficial if applied early."
      },
      "Gray Leaf Spot": {
        desc: "Typically the most serious foliar disease of corn. Requires extended periods of high humidity and warm conditions.",
        symptoms: "* Small, necrotic spots with halos initially.\n* Expands to rectangular lesions (1/8 inch wide by 2-3 inches long).\n* Gray to brown appearance with distinct parallel edges.\n* Appear opaque when held up to light.\n* Lesions are usually limited on the sides by veins.",
        conditions: "* Moderate to warm temperatures.\n* Extended periods (>24 hr) of high humidity (>95%) or wet weather.\n* Problematic in minimum tillage and corn-on-corn rotations.",
        pathogen: "Cercospora zeae-maydis. Overwinters in debris on the soil surface.",
        management: "* Use resistant corn hybrids.\n* Conventional tillage where appropriate.\n* Crop rotation.\n* Foliar fungicides if economically warranted."
      },
      "Healthy": { 
        desc: "The plant is in optimal condition.", 
        symptoms: "Green vibrant leaves, no spots.", 
        conditions: "Balanced nutrients and proper water.",
        pathogen: "None",
        management: "Continue organic fertilization and monitoring."
      }
    },
    si: {
      "Blight": {
        desc: "බඩඉරිඟු වගා කරන බොහෝ ප්‍රදේශවල බහුලව දක්නට ලැබේ. සාමාන්‍යයෙන් අස්වනු හානිය අවම වුවද, කරල් මතුවීමට පෙර ආසාදනය වුවහොත් සැලකිය යුතු හානියක් විය හැක.",
        symptoms: "* අඟල් 1 සිට 6 දක්වා දිගැති ඔරු හැඩැති ලප.\n* මුලින් අළු-කොළ පැහැති වන අතර පසුව තැඹිලි/දුඹුරු පැහැයට හැරේ.\n* ලප පහළ පත්‍රවලින් ආරම්භ වී ඉහළට පැතිරෙයි.\n* මෙය Goss's blight හෝ Stewart's wilt සමඟ පටලවා ගත හැක.",
        conditions: "* මධ්‍යස්ථ උෂ්ණත්වය (64 - 80 °F).\n* දිගුකාලීන තෙතමනය සහිත කාලගුණය.\n* සාමාන්‍යයෙන් කරල් මතුවන කාලයේදී හෝ පසුව ඇතිවේ.",
        pathogen: "Exserohilum turcicum දිලීරය. බෝග අවශේෂ මත ජීවත් වේ.",
        management: "* ප්‍රතිරෝධී ප්‍රභේද භාවිතා කරන්න.\n* අවශ්‍ය විට දිලීර නාශක යොදන්න.\n* බෝග මාරුව සහ පස පෙරලීම සිදු කරන්න."
      },
      "Common Rust": {
        desc: "මධ්‍යම හෝ පසුගිය ග්‍රීෂ්ම කාලයේ බහුලව ඇතිවේ. වාණිජ බෝග වලට විශාල හානියක් නොකළද, සිසිල් සහ තෙත් කාලගුණයේදී රෝගය දරුණු විය හැක.",
        symptoms: "* පත්‍රයේ දෙපසම මලකඩ පැහැති හෝ තද දුඹුරු දිගටි බිබිලි ඇතිවේ.\n* බිබිලි වයසට යත්ම තද පැහැ වේ.\n* දැඩි අවස්ථාවලදී කොළ කහ පැහැ වී මිය යා හැක.\n* දකුණු මලකඩ (Southern rust) රෝගයෙන් වෙන්කර හඳුනාගත හැක්කේ පත්‍රයේ දෙපසම බිබිලි තිබීමෙනි.",
        conditions: "* සිසිල් උෂ්ණත්වය (60 - 76 °F).\n* අධික පිනි, පැය 6කට වඩා පත්‍ර තෙත්ව පැවතීම සහ 95% ට වැඩි ආර්ද්‍රතාවය.\n* 80 °F ට වැඩි උෂ්ණත්වයකදී රෝගය පැතිරීම අඩුවේ.",
        pathogen: "Puccinia sorghi දිලීරය. සුළඟ මගින් බීජාණු පැතිරෙයි.",
        management: "* හොඳම ක්‍රමය ප්‍රතිරෝධී බීජ භාවිතා කිරීමයි.\n* මුල් අවස්ථාවේදී දිලීර නාශක භාවිතා කිරීම සාර්ථක වේ."
      },
      "Gray Leaf Spot": {
        desc: "බඩඉරිඟු වගාවේ ඇතිවන දරුණුතම පත්‍ර රෝගයයි. අධික ආර්ද්‍රතාවය සහ උණුසුම් තත්ත්වයන් මෙයට අවශ්‍ය වේ.",
        symptoms: "* මුලින්ම කුඩා තිත් ලෙස හටගනී.\n* පසුව අඟල් 2-3ක් දිගැති සෘජුකෝණාස්‍රාකාර අළු හෝ දුඹුරු ලප බවට පත්වේ.\n* ලප වල දාර සමාන්තරව පිහිටයි.\n* ලප පත්‍රයේ නහර (veins) වලට සීමා වී පවතී.",
        conditions: "* උණුසුම් උෂ්ණත්වය.\n* පැය 24කට වඩා වැඩි කාලයක් පවතින අධික ආර්ද්‍රතාවය (>95%).\n* එකම බිමේ දිගින් දිගටම බඩඉරිඟු වගා කරන විට රෝගය වැඩිවේ.",
        pathogen: "Cercospora zeae-maydis දිලීරය. පස මතුපිට ඇති බෝග අවශේෂ වල ජීවත් වේ.",
        management: "* ප්‍රතිරෝධී ප්‍රභේද භාවිතා කරන්න.\n* බෝග මාරුව සිදු කරන්න.\n* ආර්ථික වශයෙන් වාසිදායක නම් දිලීර නාශක යොදන්න."
      },
      "Healthy": { 
        desc: "බෝගය නිරෝගී මට්ටමේ පවතී.", 
        symptoms: "පැහැපත් තද කොළ පැහැති පත්‍ර.", 
        conditions: "නිසි පෝෂණය සහ ජලය.",
        pathogen: "නැත",
        management: "කාබනික පොහොර යෙදීම දිගටම කරගෙන යන්න."
      }
    },
    ta: {
      "Blight": {
        desc: "மக்காச்சோளம் வளர்க்கப்படும் பெரும்பாலான பகுதிகளில் இது பொதுவாகக் காணப்படுகிறது. மகசூல் இழப்பு பொதுவாகக் குறைவாக இருந்தாலும், சில ரகங்களில் பாதிப்பு அதிகமாக இருக்கலாம்.",
        symptoms: "* 1 முதல் 6 அங்குல நீளமான படகு வடிவ வடுக்கள்.\n* ஆரம்பத்தில் சாம்பல்-பச்சை நிறமாகவும், பின்னர் பழுப்பு நிறமாகவும் மாறும்.\n* வடுக்கள் கீழ் இலைகளில் தொடங்கி மேல் இலைகளுக்குப் பரவும்.",
        conditions: "* மிதமான வெப்பநிலை (64 - 80 °F).\n* நீண்ட கால ஈரப்பதம்.\n* பொதுவாக பூக்கும் காலத்தில் அல்லது அதற்குப் பிறகு தோன்றும்.",
        pathogen: "Exserohilum turcicum பூஞ்சை. பயிர் எச்சங்களில் உயிர்வாழும்.",
        management: "* எதிர்ப்பு ரகங்களை பயிரிடவும்.\n* பயிர் சுழற்சி முறையைப் பின்பற்றவும்.\n* தேவையான போது பூஞ்சைக் கொல்லிகளைப் பயன்படுத்தவும்."
      },
      "Common Rust": {
        desc: "மத்திய அல்லது பிற்பகுதி கோடை காலத்தில் இது அடிக்கடி நிகழ்கிறது. குளிர்ந்த மற்றும் ஈரமான காலநிலையில்தான் இது அதிக பாதிப்பை ஏற்படுத்துகிறது.",
        symptoms: "* இலையின் இரு பக்கங்களிலும் துரு நிற அல்லது கரும் பழுப்பு நிற கொப்புளங்கள்.\n* கொப்புளங்களில் இலவங்கப்பட்டை பழுப்பு நிற வித்திகள் இருக்கும்.\n* கடுமையான நிலையில் இலைகள் மஞ்சள் நிறமாகி காய்ந்துவிடும்.",
        conditions: "* குளிர்ந்த வெப்பநிலை (60 - 76 °F).\n* அதிக பனி மற்றும் 95% க்கும் அதிகமான ஈரப்பதம்.\n* 80 °F க்கு மேல் வெப்பநிலை இருந்தால் நோய் பரவல் குறையும்.",
        pathogen: "Puccinia sorghi பூஞ்சை. காற்று மூலம் வித்திகள் பரவுகின்றன.",
        management: "* எதிர்ப்பு ரக மக்காச்சோளத்தை பயன்படுத்துவதே சிறந்தது.\n* ஆரம்ப கட்டத்தில் பூஞ்சைக் கொல்லிகளைப் பயன்படுத்துவது பலன் தரும்."
      },
      "Gray Leaf Spot": {
        desc: "மக்காச்சோளத்தின் மிகக் கடுமையான இலை நோயாகும். இதற்கு அதிக ஈரப்பதம் மற்றும் வெப்பமான சூழல் தேவை.",
        symptoms: "* முதலில் சிறிய புள்ளிகளாகத் தோன்றும்.\n* பின்னர் செவ்வக வடிவ சாம்பல் அல்லது பழுப்பு நிற வடுக்களாக (2-3 அங்குல நீளம்) மாறும்.\n* வடுக்கள் இலையின் நரம்புகளுக்குள் மட்டுப்படுத்தப்பட்டிருக்கும்.",
        conditions: "* வெப்பமான சூழல்.\n* 24 மணி நேரத்திற்கும் மேலாக நீடிக்கும் அதிக ஈரப்பதம் (>95%).\n* ஒரே நிலத்தில் தொடர்ந்து மக்காச்சோளம் பயிரிடுவதால் பாதிப்பு கூடும்.",
        pathogen: "Cercospora zeae-maydis பூஞ்சை. மண் மேற்பரப்பில் உள்ள எச்சங்களில் வாழும்.",
        management: "* எதிர்ப்பு ரகங்களை பயன்படுத்தவும்.\n* பயிர் சுழற்சியைப் பின்பற்றவும்.\n* பொருளாதார ரீதியாக சாத்தியமெனில் பூஞ்சைக் கொல்லிகளைத் தெளிக்கவும்."
      },
      "Healthy": { 
        desc: "பயிர் ஆரோக்கியமான நிலையில் உள்ளது.", 
        symptoms: "பச்சை நிற இலைகள், புள்ளிகள் இல்லை.", 
        conditions: "சரியான நீர் மற்றும் சத்துக்கள்.",
        pathogen: "இல்லை",
        management: "இயற்கை உரங்களை தொடர்ந்து பயன்படுத்தவும்."
      }
    }
  };

  const analyzeImage = async () => {
    if (!image) { Alert.alert("Error", "Please select a photo."); return; }
    setLoading(true);
    const formData = new FormData();
    formData.append('file', { uri: image, name: 'photo.jpg', type: 'image/jpeg' });

    try {
      const response = await axios.post('https://autogamic-damaris-impatiently.ngrok-free.dev/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      let rawClass = response.data.class;
      let mappedClass = rawClass.includes("Blight") ? "Blight" : rawClass.includes("Rust") ? "Common Rust" : rawClass.includes("Gray") ? "Gray Leaf Spot" : "Healthy";
      setPrediction({ ...response.data, class: mappedClass });
      await saveToHistory(mappedClass, response.data.confidence);
    } catch (error) {
      Alert.alert("Analysis Failed", "Check your internet or server.");
    } finally { setLoading(false); }
  };

  const getConfidenceString = (confidence) => {
    const val = confidence * 100;
    const perc = `${val.toFixed(1)}%`;
    if (val >= 90) return { msg: selectedLang === 'si' ? `High Confidence (${perc})` : `High Confidence (${perc})`, color: '#2e7d32' };
    if (val >= 70) return { msg: selectedLang === 'si' ? `Reliable (${perc})` : `Reliable (${perc})`, color: '#ffa000' };
    return { msg: selectedLang === 'si' ? `Check again with a clearer photo (${perc})` : `Check again with a clearer photo (${perc})`, color: '#d32f2f' };
  };

  return (
    <LinearGradient colors={['#1b5e20', '#f0f4f7']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>AI CornCare</Text>

        <View style={styles.imageCard}>
          {image ? <Image source={{ uri: image }} style={styles.image} /> : 
          <View style={styles.placeholder}><Ionicons name="image-outline" size={60} color="#ccc" /><Text style={{color:'#999'}}>Select a corn leaf</Text></View>}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.btnIcon} onPress={async () => {
            let res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 1 });
            if (!res.canceled) { setImage(res.assets[0].uri); setPrediction(null); }
          }}><Ionicons name="images" size={24} color="#1b5e20" /><Text style={styles.btnLabel}>Gallery</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btnIcon} onPress={async () => {
            let res = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 1 });
            if (!res.canceled) { setImage(res.assets[0].uri); setPrediction(null); }
          }}><Ionicons name="camera" size={24} color="#1b5e20" /><Text style={styles.btnLabel}>Camera</Text></TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.analyzeBtn} onPress={analyzeImage} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.analyzeText}>Analyze Now</Text>}
        </TouchableOpacity>

        <View style={styles.langSection}>
            <View style={styles.langHeader}>
                <Ionicons name="language" size={16} color="#fff" style={{marginRight: 6}} />
                <Text style={styles.langHint}>Select Language</Text>
            </View>
            <View style={styles.modernLangContainer}>
            {['en', 'si', 'ta'].map((l) => (
                <TouchableOpacity 
                key={l} 
                onPress={() => changeLanguage(l)} 
                style={[styles.modernLangBtn, selectedLang === l && styles.activeModernLang]}
                >
                <Text style={[styles.modernLangText, selectedLang === l && {color: '#1b5e20'}]}>
                    {l === 'en' ? 'English' : l === 'si' ? 'සිංහල' : 'தமிழ்'}
                </Text>
                </TouchableOpacity>
            ))}
            </View>
        </View>

        {prediction && diseaseData[selectedLang][prediction.class] && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>{prediction.class}</Text>
            
            {/* අලුතින් එක් කළ Confidence Message එක රෝගයේ නමට පහළින් */}
            <Text style={{ fontSize: 13, fontWeight: '700', color: getConfidenceString(prediction.confidence).color, marginBottom: 8 }}>
                {getConfidenceString(prediction.confidence).msg}
            </Text>
            
            <Text style={styles.descText}>{diseaseData[selectedLang][prediction.class].desc}</Text>
            
            <Text style={styles.subHeader}>{selectedLang === 'si' ? "රෝග ලක්ෂණ:" : selectedLang === 'ta' ? "அறிகுறிகள்:" : "Symptoms:"}</Text>
            <Text style={styles.infoText}>{diseaseData[selectedLang][prediction.class].symptoms}</Text>

            <Text style={styles.subHeader}>{selectedLang === 'si' ? "හිතකර තත්ත්වයන්:" : selectedLang === 'ta' ? "சாதகமான சூழல்:" : "Conditions & Timing:"}</Text>
            <Text style={styles.infoText}>{diseaseData[selectedLang][prediction.class].conditions}</Text>

            <Text style={styles.subHeader}>{selectedLang === 'si' ? "රෝග කාරකයා:" : selectedLang === 'ta' ? "காரணி:" : "Causal Pathogen:"}</Text>
            <Text style={styles.infoText}>{diseaseData[selectedLang][prediction.class].pathogen}</Text>

            <Text style={styles.subHeader}>{selectedLang === 'si' ? "කළමනාකරණය:" : selectedLang === 'ta' ? "மேலாண்மை:" : "Disease Management:"}</Text>
            <Text style={styles.infoText}>{diseaseData[selectedLang][prediction.class].management}</Text>

            <TouchableOpacity style={styles.mapBtn} onPress={openAgriMaps}>
              <Ionicons name="location" size={20} color="#fff" />
              <Text style={styles.mapBtnText}>{selectedLang === 'si' ? "ළඟම සේවා මධ්‍යස්ථානය සොයන්න" : selectedLang === 'ta' ? "அருகிலுள்ள சேவை மையம்" : "Find Service Center"}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 50, alignItems: 'center' },
  header: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  imageCard: { width: '100%', height: 250, backgroundColor: '#fff', borderRadius: 25, overflow: 'hidden', elevation: 8 },
  image: { width: '100%', height: '100%' },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  buttonRow: { flexDirection: 'row', marginTop: 20, width: '100%', justifyContent: 'space-between' },
  btnIcon: { backgroundColor: '#fff', padding: 15, borderRadius: 20, width: '48%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  btnLabel: { marginLeft: 10, fontWeight: '600' },
  analyzeBtn: { backgroundColor: '#2e7d32', width: '100%', padding: 18, borderRadius: 20, marginTop: 20, alignItems: 'center' },
  analyzeText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  langSection: { marginTop: 25, alignItems: 'center', width: '100%' },
  langHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  langHint: { color: '#fff', fontSize: 12, fontWeight: '500', opacity: 0.9 },
  modernLangContainer: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.2)', padding: 5, borderRadius: 25, width: '100%', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  modernLangBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 20 },
  activeModernLang: { backgroundColor: '#fff', elevation: 3 },
  modernLangText: { fontWeight: 'bold', color: '#fff', fontSize: 13 },
  resultCard: { backgroundColor: '#fff', width: '100%', padding: 25, borderRadius: 25, marginTop: 20, elevation: 8 },
  resultTitle: { fontSize: 24, fontWeight: 'bold', color: '#c62828', marginBottom: 2 },
  subHeader: { fontWeight: 'bold', marginTop: 15, color: '#1b5e20', fontSize: 16 },
  descText: { fontSize: 16, color: '#444', lineHeight: 22, fontStyle: 'italic' },
  infoText: { fontSize: 15, color: '#666', marginTop: 5, lineHeight: 22 },
  mapBtn: { flexDirection: 'row', backgroundColor: '#1976d2', padding: 15, borderRadius: 15, marginTop: 20, alignItems: 'center', justifyContent: 'center' },
  mapBtnText: { color: '#fff', fontWeight: 'bold', marginLeft: 10, fontSize: 13 }
});