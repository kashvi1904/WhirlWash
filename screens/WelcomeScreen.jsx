import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/AntDesign';

const WelcomeScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white', alignItems: 'center', gap: 200, paddingTop: 40 }}>
      
      <View>
        <Text
          style={{
            color: 'black',
            fontWeight: 'bold',
            fontSize: 32,
            textAlign: 'center',
            fontFamily: 'Poppins-Regular',
          }}
        >
          Welcome!
        </Text>
      </View>
      
      <View style={{ alignItems: 'center' }}>
        <Image
          source={require("../assets/image1.png")}
          style={{ width: 250, height: 250 }}
        />
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 8, color: '#3D4EB0', fontWeight: '600' }}>
          WHIRLWASH
        </Text>
      </View>

      {/* Button at the bottom */}
      <View style={{ position: 'absolute', width: '80%', bottom: 60 }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#3D4EB0',
            paddingVertical: 12,
            borderRadius: 10,
            width: '100%',
            flexDirection: 'row',  // Align items horizontally
            justifyContent: 'center',  // Center the contents
            alignItems: 'center',  // Vertically align
          }}
          onPress = {() => navigation.navigate('Main')}
        >
          <Icon
           name="google"
           size={20}
           color="white"
           style={{marginRight:5}}
           />
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              textAlign: 'center',
              color: 'white',
            }}
          >
            Login with Google
          </Text>
        </TouchableOpacity>
      </View>
      
    </SafeAreaView>
  );
}

export default WelcomeScreen;

const styles = StyleSheet.create({});