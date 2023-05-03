import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Modal, 
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TouchableHighlight,
  Animated, 
  Easing,
  Image,
  Button,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Linking
} from 'react-native';
import * as Progress from 'react-native-progress';
import Task from './components/task';

const Stack = createStackNavigator();

const TaskPage = ({ route }) => {
  const [task, setTask] = useState();
  const [taskItems, setTaskItems] = useState([]);
  const [progress, setProgress] = useState(0);
  const [taskCounter, setTaskCounter] = useState(0);
  const [taskCompleted, setTaskCompleted] = useState(0);

  const Welcome = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(Welcome, {
      duration: 4000,
      toValue: 10,
      easing: Easing.elastic(20),
    }).start(() => {});
  }, [Welcome]);

  const handleAddTask = () => {
    Keyboard.dismiss();
    setTaskItems([...taskItems, task]);
    setTask(null);
    setTaskCounter(taskCounter + 1);
  };

  const completeTask = (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy);
    setTaskCompleted(taskCompleted + 1);
    setProgress(taskCompleted / taskCounter);

  };

  return (
    <View style={styles.page}>
    <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled">
      <Animated.View
        style={[
          styles.texts,
          {
            left: Welcome,
            backgroundColor: Welcome.interpolate({
              inputRange: [0, 100],
              outputRange: ['transparent', 'transparent'],
            }),
          },
        ]}>

      </Animated.View>

      {/* Added this scroll view to enable scrolling when list gets longer than the page */}
        {/* Today's Tasks */}
        <View style={styles.tasksWrapper}>
          <Text style={styles.sectionTitle}>Today's Tasks</Text>
        
          <Text style={styles.progBar}> Max Tasks: {taskCounter} / 10  </Text>
          <Text style={styles.progBar}> Progress: {taskCompleted}%</Text>

        <Progress.Bar
          style={{ fill: 'blue', borderColor:'#c7bce1' }}
          progress={progress}
          size={10}
        />

          <View style={styles.items}>
            {/* This is where the tasks will go! */}
            {taskItems.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => completeTask(index)}>
                  <Task text={item} />
                </TouchableOpacity>
              );
            })}
            <ActivityIndicator
              style={{ justifyContent: 'center' }}
              color="#c7bce1"
              size={30}
              animating={task}
            />
          </View>
        </View>
      </ScrollView>

      {/* Write a task */}
      {/* Uses a keyboard avoiding view which ensures the keyboard does not cover the items on screen */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.writeTaskWrapper}>
        <TextInput
          style={styles.input}
          placeholder={'Write A Task'}
          value={task}
          onChangeText={(text) => setTask(text)}
        />
        <TouchableOpacity onPress={() => handleAddTask()}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Group 
          screenOptions={{
            headerTintColor: 'white',
            headerTitleAlign: 'left',
            headerStyle: { backgroundColor: '#FFD79E', fontWeight: 'bold'},
           
          }}>
          <Stack.Screen name="Task Page" component={TaskPage} />
          
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
    tasksWrapper: {
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 7,
  },
  progBar: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
  },
  items: {
    marginTop: 30,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFD79E',
    borderRadius: 60,
    borderColor: '#FFD79E',
    borderWidth: 1,
    width: 200,
    color: 'white',
    fontWeight: 'bold',
  },
  addWrapper: {
    width: 50,
    height: 50,
    backgroundColor: '#FFD79E',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#c7bce1',
    borderWidth: 1,
  },
  addText: {
    color: 'white',
  },
  page: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 30,
    flex: 1,
    backgroundColor: '#72D0FF',
  },

});
