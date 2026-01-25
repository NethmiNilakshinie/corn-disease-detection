import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function App() {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. පින්තූරයක් තෝරාගැනීමට හෝ ගැනීමට (Camera/Gallery)
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square image එකක් ගන්න
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setPrediction(null); // කලින් තිබ්බ result මකන්න
    }
  };

  // 2. API එකට පින්තූරය යවන්න
  const uploadImage = async () => {
    if (!image) return alert("කරුණාකර පින්තූරයක් තෝරන්න!");

    setLoading(true);
    const formData = new FormData();
    formData.append('file', {
      uri: image,
      name: 'photo.jpg',
      type: 'image/jpeg',
    });

    try {
      // වැදගත්: මෙතන 'YOUR_IP_ADDRESS' වෙනුවට ඔයාගේ පරිගණකයේ IP එක දාන්න
      const response = await axios.post('http://172.20.10.7:8000/predict', formData, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
  });
      setPrediction(response.data);
    } catch (error) {
      console.error(error);
      alert("API එකට සම්බන්ධ විය නොහැක. IP එක පරීක්ෂා කරන්න!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>AI Corn Care</Text>
      <Text style={styles.subtitle}>බඩඉරිඟු රෝග හඳුනාගැනීමේ පද්ධතිය</Text>

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>පින්තූරයක් තෝරන්න</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.image} />}

      {image && !prediction && (
        <TouchableOpacity style={[styles.button, {backgroundColor: '#2e7d32'}]} onPress={uploadImage}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>පරීක්ෂා කරන්න</Text>}
        </TouchableOpacity>
      )}

      {prediction && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>ප්‍රතිඵලය: {prediction.disease}</Text>
          <Text style={styles.confidence}>විශ්වාසනීයත්වය: {prediction.confidence}</Text>
          <View style={styles.solutionBox}>
            <Text style={styles.solutionText}>විසඳුම: {prediction.solution}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#f5f5f5', alignItems: 'center', padding: 20, paddingTop: 60 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#1b5e20' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 20 },
  button: { backgroundColor: '#1976d2', padding: 15, borderRadius: 10, marginVertical: 10, width: '100%', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  image: { width: 300, height: 300, borderRadius: 15, marginVertical: 20 },
  resultContainer: { width: '100%', padding: 20, backgroundColor: '#fff', borderRadius: 15, elevation: 3 },
  resultTitle: { fontSize: 22, fontWeight: 'bold', color: '#d32f2f' },
  confidence: { fontSize: 14, color: '#555', marginBottom: 10 },
  solutionBox: { backgroundColor: '#e8f5e9', padding: 15, borderRadius: 10 },
  solutionText: { fontSize: 16, color: '#1b5e20', lineHeight: 22 }
});