// components/Account.tsx
// User profile management component

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View, Alert } from 'react-native'
import { Button, Input } from '@rneui/themed'
import { Session } from '@supabase/supabase-js'

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true)
  const [displayName, setDisplayName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    if (session) getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('user_profiles')
        .select(`display_name, avatar_url`)
        .eq('id', session?.user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setDisplayName(data.display_name || '')
        setAvatarUrl(data.avatar_url || '')
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({
    displayName,
    avatarUrl,
  }: {
    displayName: string
    avatarUrl: string
  }) {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const updates = {
        id: session?.user.id,
        display_name: displayName,
        avatar_url: avatarUrl,
        updated_at: new Date(),
      }

      const { error } = await supabase.from('user_profiles').upsert(updates)

      if (error) {
        throw error
      }

      Alert.alert('Profile updated successfully!')
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input 
          label="Email" 
          value={session?.user?.email} 
          disabled 
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Display Name"
          value={displayName || ''}
          onChangeText={(text) => setDisplayName(text)}
          placeholder="Enter your display name"
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Avatar URL (optional)"
          value={avatarUrl || ''}
          onChangeText={(text) => setAvatarUrl(text)}
          placeholder="https://example.com/avatar.jpg"
        />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title={loading ? 'Loading ...' : 'Update Profile'}
          onPress={() => updateProfile({ displayName, avatarUrl })}
          disabled={loading}
        />
      </View>

      <View style={styles.verticallySpaced}>
        <Button 
          title="Sign Out" 
          onPress={() => supabase.auth.signOut()} 
          color="error"
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})