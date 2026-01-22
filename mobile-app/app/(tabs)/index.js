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
        if (savedLang !== null) {
          setSelectedLang(savedLang);
        }
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

  // Google Maps එකේ ළඟම තියෙන මධ්‍යස්ථාන සෙවීමේ function එක
  const openAgriMaps = () => {
    const query = "Agriculture Service Center Sri Lanka";
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    
    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "Could not open Google Maps");
    });
  };

  const diseaseData = {
    en: {
      "Blight": {
        desc: "A fungal disease that attacks maize leaves, common in humid conditions.",
        symptoms: "Long, elliptical grayish-green or tan lesions on leaves.",
        solutions: "🌿 Natural: Neem oil spray.\n💊 Store: Mancozeb fungicide.\n🚜 Farm: Crop rotation."
      },
      "Common Rust": {
        desc: "A common fungal infection that spreads via wind and moisture.",
        symptoms: "Small, cinnamon-brown powdery pustules on leaf surfaces.",
        solutions: "🌿 Natural: Wood ash.\n💊 Store: Tebuconazole spray.\n🚜 Farm: Proper spacing."
      },
      "Healthy": { 
        desc: "The plant is in good condition.", 
        symptoms: "Green, vibrant leaves with no spots.", 
        solutions: "Keep it up! Use organic fertilizer." 
      }
    },
    si: {
      "Blight": {
        desc: "නිරන්තර තෙතමනය සහිත කාලගුණයේදී ඇතිවන දිලීර රෝගයකි.",
        symptoms: "කොළ මත දිගටි අළු-කොළ හෝ දුඹුරු පැහැති ලප ඇති වේ.",
        solutions: "🌿 ස්වාභාවික: කොහොඹ තෙල්.\n💊 කඩෙන්: මැන්කොසෙබ්.\n🚜 වගාව: බෝග මාරුව."
      },
      "Common Rust": {
        desc: "හුළඟ සහ තෙතමනය මගින් පැතිරෙන දිලීර ආසාදනයකි.",
        symptoms: "කොළ මතුපිට කුඩා තැඹිලි හෝ කුරුඳු පැහැති බිබිලි ඇති වේ.",
        solutions: "🌿 ස්වාභාවික: ලී අළු.\n💊 කඩෙන්: ටෙබුකොනසෝල්.\n🚜 වගාව: නිසි පරතරය තබන්න."
      },
      "Healthy": { 
        desc: "බෝගය නිරෝගී මට්ටමේ පවතී.", 
        symptoms: "පැහැපත් කොළ පැහැති කොළ, ලප කිසිවක් නොමැත.", 
        solutions: "නිරෝගී බව රැක ගැනීමට කාබනික පොහොර යොදන්න." 
      }
    },
    ta: {
      "Blight": {
        desc: "அதிக ஈரப்பதம் இருக்கும்போது ஏற்படும் ஒரு பூஞ்சை நோய்.",
        symptoms: "இலைகளில் நீண்ட சாம்பல்-பச்சை அல்லது பழுப்பு நிற வடுக்கள் ஏற்படும்.",
        solutions: "🌿 இயற்கை: வேப்ப எண்ணெய்.\n💊 மருந்தகம்: மேன்கோசெப்."
      },
      "Common Rust": {
        desc: "காற்று மற்றும் ஈரப்பதம் மூலம் பரவும் ஒரு பூஞ்சை தொற்று.",
        symptoms: "இலைகளில் சிறிய இலவங்கப்பட்டை நிற கொப்புளங்கள் தோன்றும்.",
        solutions: "🌿 இயற்கை: மரச் சாம்பல்.\n💊 மருந்தகம்: டெபுகோனசோல்."
      },
      "Healthy": { 
        desc: "பயிர் ஆரோக்கியமான நிலையில் உள்ளது.", 
        symptoms: "பச்சை நிற இலைகள், புள்ளிகள் எதுவும் இல்லை.", 
        solutions: "தொடர்ந்து இயற்கை உரங்களைப் பயன்படுத்துங்கள்." 
      }
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setPrediction(null);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setPrediction(null);
    }
  };

  const analyzeImage = async () => {
    if (!image) {
        Alert.alert("Error", "Please select or take a photo first.");
        return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('file', { uri: image, name: 'photo.jpg', type: 'image/jpeg' });

    try {
      const response = await axios.post('https://autogamic-damaris-impatiently.ngrok-free.dev/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      let rawClass = response.data.class;
      let mappedClass = rawClass;

      if (rawClass.includes("Blight")) mappedClass = "Blight";
      else if (rawClass.includes("Rust")) mappedClass = "Common Rust";
      else if (rawClass.includes("Healthy")) mappedClass = "Healthy";

      setPrediction({
        ...response.data,
        class: mappedClass
      });

    } catch (error) {
      console.error(error);
      Alert.alert("Analysis Failed", "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#1b5e20', '#f0f4f7']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>AI CornCare 🌽</Text>

        <View style={styles.imageCard}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="image-outline" size={60} color="#ccc" />
              <Text style={{color: '#999', marginTop: 10}}>Select a corn leaf photo</Text>
            </View>
          )}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.btnIcon} onPress={pickImage}>
            <Ionicons name="images" size={24} color="#1b5e20" />
            <Text style={styles.btnLabel}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnIcon} onPress={takePhoto}>
            <Ionicons name="camera" size={24} color="#1b5e20" />
            <Text style={styles.btnLabel}>Camera</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.analyzeBtn} onPress={analyzeImage} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.analyzeText}>Analyze</Text>}
        </TouchableOpacity>

        <View style={styles.langRow}>
          {['en', 'si', 'ta'].map((l) => (
            <TouchableOpacity 
              key={l} 
              onPress={() => changeLanguage(l)} 
              style={[styles.langBtn, selectedLang === l && styles.activeLang]}
            >
              <Text style={[styles.langBtnText, selectedLang === l && {color: '#1b5e20'}]}>{l.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {prediction && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>{prediction.class}</Text>
            
            {diseaseData[selectedLang][prediction.class] ? (
              <View>
                <Text style={styles.descText}>{diseaseData[selectedLang][prediction.class].desc}</Text>
                
                <Text style={styles.subHeader}>
                    {selectedLang === 'si' ? "රෝග ලක්ෂණ:" : selectedLang === 'ta' ? "அறிகுறிகள்:" : "Symptoms:"}
                </Text>
                <Text style={styles.infoText}>{diseaseData[selectedLang][prediction.class].symptoms}</Text>
                
                <Text style={styles.subHeader}>
                    {selectedLang === 'si' ? "විසඳුම්:" : selectedLang === 'ta' ? "தீர்வுகள்:" : "Solutions:"}
                </Text>
                <Text style={styles.infoText}>{diseaseData[selectedLang][prediction.class].solutions}</Text>

                {/* --- Map Button එක මෙතන තියෙනවා --- */}
                <TouchableOpacity style={styles.mapBtn} onPress={openAgriMaps}>
                  <Ionicons name="location" size={20} color="#fff" />
                  <Text style={styles.mapBtnText}>
                    {selectedLang === 'si' ? "ළඟම සේවා මධ්‍යස්ථානය සොයන්න" : 
                     selectedLang === 'ta' ? "அருகிலுள்ள சேவை மையம்" : 
                     "Find Nearby Service Center"}
                  </Text>
                </TouchableOpacity>

              </View>
            ) : (
              <Text style={styles.errorText}>
                {selectedLang === 'si' ? "මෙම රෝගය සඳහා විස්තර සොයාගත නොහැක." : "Details not found for this label."}
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 50, alignItems: 'center' },
  header: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  imageCard: { width: '100%', height: 250, backgroundColor: '#fff', borderRadius: 25, overflow: 'hidden', elevation: 8, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10 },
  image: { width: '100%', height: '100%' },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  buttonRow: { flexDirection: 'row', marginTop: 20, width: '100%', justifyContent: 'space-between' },
  btnIcon: { backgroundColor: '#fff', padding: 15, borderRadius: 20, width: '48%', alignItems: 'center', elevation: 3, flexDirection: 'row', justifyContent: 'center' },
  btnLabel: { marginLeft: 10, fontWeight: '600', color: '#333' },
  analyzeBtn: { backgroundColor: '#2e7d32', width: '100%', padding: 18, borderRadius: 20, marginTop: 20, alignItems: 'center', elevation: 5 },
  analyzeText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  langRow: { flexDirection: 'row', marginTop: 20, backgroundColor: 'rgba(255,255,255,0.2)', padding: 5, borderRadius: 15 },
  langBtn: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 12 },
  activeLang: { backgroundColor: '#fff' },
  langBtnText: { fontWeight: 'bold', color: '#fff' },
  resultCard: { backgroundColor: '#fff', width: '100%', padding: 25, borderRadius: 25, marginTop: 20, elevation: 8 },
  resultTitle: { fontSize: 24, fontWeight: 'bold', color: '#c62828', marginBottom: 10 },
  subHeader: { fontWeight: 'bold', marginTop: 15, color: '#1b5e20', fontSize: 16 },
  descText: { fontSize: 16, color: '#444', lineHeight: 22 },
  infoText: { fontSize: 15, color: '#666', marginTop: 5, lineHeight: 20 },
  errorText: { color: 'red', marginTop: 10, textAlign: 'center' },
  // Map බොත්තම සඳහා අලුත් styles
  mapBtn: {
    flexDirection: 'row',
    backgroundColor: '#1976d2',
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3
  },
  mapBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 14
  }
});