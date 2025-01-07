import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

/*export default function App() {

  const [recommendation, setRecommendation] = useState([]);

  const getRecommendation = async () => {
    try {
      const response = await fetch("http://192.168.1.227:5000/recommend", {
      // const response = await fetch("http://127.0.0.1:5000/recommend", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ likes_sweet: true, likes_salty: false })
      });
      const data = await response.json();
      setRecommendation(data);
    } catch (error) {
      console.error("error getting from backend", error);
    }
  };


  return (
    <View style={styles.container}>
      <Text>Snack Recommendations: </Text>
      <Button title="Get Recommendation" onPress={getRecommendation} />
      {recommendation.length > 0 && (
        <View>
          {recommendation.map((snack, index) => (
            
            <Text key={index}>{snack}</Text>
          ))}

        </View>

      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
*/

export default function App() {
  const [recommendation, setRecommendation] = useState([]);

  const getRecommendation = async () => {
    try {
      const response = await fetch("http://192.168.1.227:5000/recommend", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ likes_sweet: true, likes_salty: false })
      });
      const data = await response.json();
      setRecommendation(data);
    } catch (error) {
      console.error("error getting from backend", error);
      setRecommendation(["Error: Unable to fetch reccomendations"]);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Snack Recommendations:</Text>
      {recommendation.length > 0 && (
        recommendation.map((snack, index) => (
          <Text key={index}>{snack}</Text>
        ))
      )}
      <Button title="Get Recommendation" onPress={getRecommendation} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
