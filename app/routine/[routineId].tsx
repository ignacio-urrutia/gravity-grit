import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Button, TextInput, TouchableOpacity, Alert, Pressable, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { doc, getDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '@/firebaseConfig'; // Adjust the import path as necessary
import { Exercise, Routine, ExerciseInRoutine } from '@/types'; // Adjust the import path as necessary
import { useRouter, Stack, useNavigation } from 'expo-router';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { ParamListBase } from '@react-navigation/native';

import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { Modal } from 'native-base';

export default function Page() {
  const colorScheme = useColorScheme();

  const { routineId } = useLocalSearchParams<{ routineId: string }>();
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [exercises, setExercises] = useState<ExerciseInRoutine[]>([]);
  const router = useRouter();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const [showAddExercise, setShowAddExercise] = useState(false);
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  
  const [showOptions, setShowOptions] = useState(false);
  const [loading, setLoading] = useState(true);

  const auth = FIREBASE_AUTH;


  useEffect(() => {

    const fetchRoutineDetails = async () => {
      if (!routineId) return;

      // Fetch the routine details
      const routineRef = doc(FIRESTORE_DB, 'users/' + auth.currentUser?.uid + '/routines', routineId);
      const routineSnap = await getDoc(routineRef);

      if (routineSnap.exists()) {
        setRoutine({
          id: routineSnap.id,
          ...routineSnap.data(),
        } as Routine);

        setExercises(routineSnap.data().exercises);
        setLoading(false);
      }
    };

    fetchRoutineDetails();
  }, [routineId]);

  const handleEdit = () => {
    setShowOptions(false);
    // navigate to the edit screen
    if (!routineId) return;

    router.push({
      pathname: '/routine/edit/[routineId]',
      params: { routineId },
    });

  }

  const handleDelete = async () => {
    setShowOptions(false);
    if (!routineId) return;

    await deleteDoc(doc(FIRESTORE_DB, 'users/' + auth.currentUser?.uid + '/routines', routineId));
    // After deletion, navigate back or to another screen as needed
    navigation.navigate('index');
  };

  // Consider adding a function for editing that navigates to an edit screen or opens an edit mode

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ 
        title: '', 
        headerRight: () => (
          <Pressable onPress={() => setShowOptions(true)}>
            <Text style={{ 
              color: Colors['primary'], 
              marginRight: 10,
              fontSize: 18,
              fontWeight: 'bold',
              }}>...</Text>
          </Pressable>
        )
        }} />
      {loading && 
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors[colorScheme === 'dark' ? 'dark' : 'light'].tint} />
        </View>
      }
      {!loading &&
        <View style={{
          flex: 1,
        }}>
          <Text style={[styles.title, { color: Colors['primary'] }]}>{routine?.name}</Text>
          <Text style={styles.description}>{routine?.description}</Text>
          <FlatList
            data={exercises}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={[styles.exerciseContainer, {
                backgroundColor: Colors[colorScheme === 'dark' ? 'dark' : 'light'].tabBackgroundColor,
              }]}>
                <Text style={[styles.exerciseName,{
                  color: Colors[colorScheme === 'dark' ? 'dark' : 'light'].text,
                }]}>{item.name}</Text>
                <Text style={{ 
                  color: Colors[colorScheme === 'dark' ? 'dark' : 'light'].text,
                }}
                >{item.quantity} {item.unit}</Text>
              </View>
            )}
          />
        {/* Implement navigation or state change for editing here */}
        <View style={styles.buttonsContainer}>
          
          <Link href={{
            pathname: '/routine/run/[routineId]',
            params: { routineId }
          }} asChild>
            <TouchableOpacity style={{backgroundColor: Colors['primary'], ...styles.button}}>
              <Text>Run</Text>
            </TouchableOpacity>
          </Link>

          </View>
        </View>
      }

        <Modal 
          isOpen={showOptions} 
          animationPreset="slide"
          onClose={() => setShowOptions(false)}
          size='full'
          avoidKeyboard
        >
          <Modal.Content 
            marginBottom={0} 
            marginTop={'auto'}
            style={{
              backgroundColor: Colors[colorScheme === 'dark' ? 'dark' : 'light'].tabBackgroundColor,
            }}
          >
            <Modal.Body>

              <Button title="Edit" onPress={handleEdit} />
              <Button 
                title="Delete" 
                onPress={handleDelete} 
                color={Colors['red']}
              />
              
            </Modal.Body>
          </Modal.Content>
        </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    marginBottom: 10,
    color: '#666666',
  },
  exerciseContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    alignItems: 'center',
  },
  button: {
    padding: 15,
    margin: 10,
    borderRadius: 20,
    alignItems: 'center',
    width: '30%',
  },

});
