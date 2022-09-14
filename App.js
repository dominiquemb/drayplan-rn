import { StatusBar } from "expo-status-bar";
import React, { useState }  from "react";
import { StyleSheet, Text, View } from "react-native";
import GetLocation from "react-native-get-location";
import { uuid } from 'uuidv4';

export default function App() {
  const [loc, setLoc] = useState();
  const id = uuid();

  GetLocation.getCurrentPosition({
    enableHighAccuracy: true,
  })
    .then((location) => {
      if (location.latitude !== loc.latitude && location.longitude !== loc.longitude) {
        setLoc(location);
      }
    })
    .catch((error) => {
      const { code, message } = error;
      console.warn(code, message);
    });

  React.useEffect(() => {
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
      })
    });
    const content = await rawResponse.json();
  
    console.log(content);
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
