import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import HomePage from '../screens/HomePage';
import MachinePage from '../screens/MachinePage';
import Bookings from '../screens/Bookings';
import ContactUs from '../screens/ContactUs';
import Profile from '../screens/Profile';
import Rules from '../screens/Rules';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoadingScreen from '../screens/loadingScreen';
// import MachineTimer from '../screens/MachineTimer';
import Icon from 'react-native-vector-icons/Foundation';
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/Octicons';
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import Icon4 from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Bottom Tab Navigator (unchanged)
const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomePage"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 80,
          paddingHorizontal: 5,
          paddingTop: 20,
          backgroundColor: "#3D4EB0",
          borderRadius: 15,
          position: 'absolute',
        },
      }}
    >
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={tabIconStyle(focused)}>
              <Icon name="home" size={25} color={focused ? '#3D4EB0' : 'white'} />
            </View>
          ),
        }}
        name="HomePage"
        component={HomePage}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={tabIconStyle(focused)}>
              <Icon1 name="washing-machine" size={30} color={focused ? '#3D4EB0' : 'white'} />
            </View>
          ),
        }}
        name="Machines"
        component={MachinePage}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={tabIconStyle(focused)}>
              <Icon2 name="log" size={25} color={focused ? '#3D4EB0' : 'white'} />
            </View>
          ),
        }}
        name="BookingPage"
        component={Bookings}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={tabIconStyle(focused)}>
              <Icon3 name="contact-phone" size={30} color={focused ? '#3D4EB0' : 'white'} />
            </View>
          ),
        }}
        name="ContactUsPage"
        component={ContactUs}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={tabIconStyle(focused)}>
              <Icon4 name="person" size={30} color={focused ? '#3D4EB0' : 'white'} />
            </View>
          ),
        }}
        name="ProfilePage"
        component={Profile}
      />
    </Tab.Navigator>
  );
};

// Stack Navigator (updated)
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {/* Loading screen first */}
      <Stack.Screen name="Loading" component={LoadingScreen} />

        {/* Welcome screen without bottom tab */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        
        {/* Main Tabs (with bottom navigation) */}
        <Stack.Screen 
          name="Main" 
          component={BottomTabNavigator} 
          options={{ headerShown: false }}
        />
        
        {/* Rules screen without bottom tab */}
        <Stack.Screen name="Rules" component={Rules} />
        {/* <Stack.Screen name="MachineTimer" component={MachineTimer} options={{ headerShown: false }} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

// Helper function for styling tab icons (unchanged)
const tabIconStyle = (focused) => ({
  backgroundColor: focused ? 'white' : 'transparent',
  borderRadius: 25,
  padding: 10,
  width: 70,
  height: 50,
  justifyContent: 'center',
  alignItems: 'center'
});