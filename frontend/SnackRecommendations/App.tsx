import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import Account from './components/Account'
import DatabaseTest from './components/DatabaseTest'
import { View, Button, Text, StyleSheet } from 'react-native'
import { Session } from '@supabase/supabase-js'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [currentView, setCurrentView] = useState<'account' | 'database'>('account')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  if (!session || !session.user) {
    return (
      <Auth />
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.navigation}>
        <Button title="Account" 
        onPress={() => setCurrentView('account')}
        color={currentView === 'account' ? '#007AFF' : '#999'}
        />
        <Button
          title="Database Test"
          onPress={() => setCurrentView('database')}
          color={currentView === 'database' ? '#007AFF' : '#999'}
        />
      </View>

      {currentView === 'account' ? (
        <Account key={session.user.id} session={session} />
      ) : (
        <DatabaseTest session={session} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 50,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});