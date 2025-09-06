import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import axios from 'axios';

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: false, shouldSetBadge: false }),
});

export default function App() {
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => console.log('push token', token));
  }, []);

  async function pickImage() {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.All, quality: 0.6 });
    if (!res.cancelled) setImageUri(res.uri);
  }

  async function uploadToSignedUrl() {
    if (!imageUri) return Alert.alert('No image');
    try {
      const meta = { filename: 'upload.jpg', mime: 'image/jpeg', size: 0 };
      const resp = await axios.post('http://localhost:3000/mobile/practices/PRID/requests/REQID/upload-url', meta);
      const { url } = resp.data;
      const blob = await (await fetch(imageUri)).blob();
      await fetch(url, { method: 'PUT', body: blob });
      await axios.post('http://localhost:3000/mobile/uploads/confirm', { objectName: resp.data.objectName, bucket: resp.data.bucket });
      Alert.alert('Uploaded');
    } catch (err) {
      console.error(err);
      Alert.alert('Upload failed');
    }
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Patronato - App (Demo)</Text>
      <Button title="Pick an image" onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />}
      <Button title="Upload" onPress={uploadToSignedUrl} />
    </View>
  );
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }
  return token;
}
