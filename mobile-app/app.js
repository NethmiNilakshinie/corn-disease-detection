import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function App() {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  // (Camera/Gallery)
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square image 
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setPrediction(null); 
    }
  };

  // Upload image to API
  const uploadImage = async () => {
    if (!image) return alert("pleace select a photo!");

    setLoading(true);
    const formData = new FormData();
    formData.append('file', {
      uri: image,
      name: 'photo.jpg',
      type: 'image/jpeg',
    });

    try {
      const response = await axios.post('http://172.20.10.7:8000/predict', formData, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
  });
      setPrediction(response.data);
    } catch (error) {
      console.error(error);
      alert("Connection failed! Please check your server IP!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>AI Corn Care</Text>
      <Text style={styles.subtitle}>Corn Leaf Disease Diagnosis System</Text>

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Select Image</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.image} />}

      {image && !prediction && (
        <TouchableOpacity style={[styles.button, {backgroundColor: '#2e7d32'}]} onPress={uploadImage}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Analyze Now</Text>}
        </TouchableOpacity>
      )}

      {prediction && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Detected Disease: {prediction.disease}</Text>
          <Text style={styles.confidence}>Confidence Level: {prediction.confidence}</Text>
          <View style={styles.solutionBox}>
            <Text style={styles.solutionText}>Recommended Solution: {prediction.solution}</Text>
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