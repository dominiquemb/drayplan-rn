import { StatusBar } from "expo-status-bar";
import React, { useState }  from "react";
import { StyleSheet, Text, View } from "react-native";
import GetLocation from "react-native-get-location";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export default function App() {
  const [loc, setLoc] = useState({});
  const id = uuidv4();

  GetLocation.getCurrentPosition({
    enableHighAccuracy: true,
  })
    .then((location) => {
      if ((location.latitude !== loc.latitude && location.longitude !== loc.longitude)) {
        setLoc(location);
        console.log(location);
      }
    })
    .catch((error) => {
      const { code, message } = error;
      console.warn(code, message);
    });

  const sendBeacon = async() => {
    const rawResponse = await fetch('https://us-central1-warm-sunlight-227712.cloudfunctions.net/beacon', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: id,
        lat: loc.latitude,
        long: loc.longitude,
        time: loc.time,
        speed: loc.speed,
        accuracy: loc.accuracy,
      })
    });
    const content = await rawResponse.json();
  
    console.log(content);
  }

  React.useEffect(() => {
    sendBeacon();
  }, [loc]);

  return (
    <View style={styles.container}>
      <Text>Location coordinates:</Text>
      <Text>Longitude: {loc.longitude}</Text>
      <Text>Longitude: {loc.latitude}</Text>
      <Text>Time: {loc.time}</Text>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
