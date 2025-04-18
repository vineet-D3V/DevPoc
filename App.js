import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import QRCode from 'react-native-qrcode-svg';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [inputText, setInputText] = useState('');
  const [generatedText, setGeneratedText] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setScannedData(data);
  };

  if (hasPermission === null) return <Text>Requesting for camera permission</Text>;
  if (hasPermission === false) return <Text>No access to camera</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Liquor Barcode App</Text>

      <View style={styles.section}>
        <Text style={styles.subheader}>Scan a Barcode</Text>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.scanner}
        />
        {scanned && (
          <>
            <Text style={styles.result}>Scanned Data: {scannedData}</Text>
            <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
          </>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.subheader}>Generate a Barcode</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter liquor details"
          value={inputText}
          onChangeText={setInputText}
        />
        <Button title="Generate" onPress={() => setGeneratedText(inputText)} />

        {generatedText !== '' && (
          <View style={{ marginTop: 20 }}>
            <QRCode value={generatedText} size={200} />
            <Text style={{ marginTop: 10 }}>{generatedText}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subheader: {
    fontSize: 18,
    marginBottom: 10,
  },
  scanner: {
    width: 300,
    height: 200,
  },
  result: {
    marginTop: 10,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: 300,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  section: {
    marginBottom: 40,
    alignItems: 'center',
  },
});