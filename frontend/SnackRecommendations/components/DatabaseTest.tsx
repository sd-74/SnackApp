// components/DatabaseTest.tsx
// Create this file to test your database connection

import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { supabase } from '../lib/supabase';
import { Snack, UserSnackInteraction } from '../lib/database-types';
import { Session } from '@supabase/supabase-js';

interface Props {
  session: Session;
}

export default function DatabaseTest({ session }: Props) {
  const [snacks, setSnacks] = useState<Snack[]>([]);
  const [interactions, setInteractions] = useState<UserSnackInteraction[]>([]);
  const [loading, setLoading] = useState(false);

  // Test fetching snacks
  const fetchSnacks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('snacks')
        .select('*');
      
      if (error) {
        console.error('Error fetching snacks:', error);
        return;
      }
      
      setSnacks(data || []);
      console.log('Fetched snacks:', data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Test creating an interaction
  const testInteraction = async () => {
    if (snacks.length === 0) return;
    
    setLoading(true);
    try {
      const firstSnack = snacks[0];
      
      // Insert interaction
      const { data, error } = await supabase
        .from('user_snack_interactions')
        .insert({
          user_id: session.user.id,
          snack_id: firstSnack.id,
          action: 'like'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating interaction:', error);
        return;
      }

      console.log('Created interaction:', data);
      
      // Fetch interactions to see the result
      await fetchInteractions();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Test adding a rating
  const testRating = async () => {
    if (interactions.length === 0) return;
    
    setLoading(true);
    try {
      const firstInteraction = interactions[0];
      
      const { data, error } = await supabase
        .from('user_snack_interactions')
        .update({ 
          rating: 4, 
          notes: 'Pretty tasty!' 
        })
        .eq('id', firstInteraction.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating rating:', error);
        return;
      }

      console.log('Updated with rating:', data);
      await fetchInteractions();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's interactions
  const fetchInteractions = async () => {
    try {
      const { data, error } = await supabase
        .from('user_snack_interactions')
        .select(`
          *,
          snacks (name, brand)
        `)
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error fetching interactions:', error);
        return;
      }

      setInteractions(data || []);
      console.log('Fetched interactions:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchSnacks();
    fetchInteractions();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Database Test</Text>
      <Text>User ID: {session.user.id}</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Snacks ({snacks.length})</Text>
        {snacks.map(snack => (
          <Text key={snack.id} style={styles.item}>
            {snack.name} - {snack.brand}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Interactions ({interactions.length})</Text>
        {interactions.map(interaction => (
          <Text key={interaction.id} style={styles.item}>
            Action: {interaction.action} | Rating: {interaction.rating || 'None'} | Notes: {interaction.notes || 'None'}
          </Text>
        ))}
      </View>

      <View style={styles.buttons}>
        <Button 
          title="Refresh Snacks" 
          onPress={fetchSnacks} 
          disabled={loading}
        />
        <Button 
          title="Test Like First Snack" 
          onPress={testInteraction} 
          disabled={loading || snacks.length === 0}
        />
        <Button 
          title="Test Rating" 
          onPress={testRating} 
          disabled={loading || interactions.length === 0}
        />
        <Button 
          title="Refresh Interactions" 
          onPress={fetchInteractions} 
          disabled={loading}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    fontSize: 14,
    marginVertical: 2,
    paddingLeft: 10,
  },
  buttons: {
    marginTop: 20,
    gap: 10,
  },
});