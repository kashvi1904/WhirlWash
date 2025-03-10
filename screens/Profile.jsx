import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Profile = ({route}) => {
  // Mock user data (Replace this with API data if needed)
  const user = route?.params?.user || {
    name: 'Kashvi Jain',
    rollNo: '123456',
    email: 'kashvi@example.com',
    mobile: '+91 9876543210',
    role: 'Student',
    roomNo: 'B-305',
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Profile</Text>

      <Image source={require('../assets/user.png')} style={styles.img} />
      <Text style={styles.name}>{user.name}</Text>

      <View style={styles.detailsContainer}>
        <ProfileDetail label="Roll No." value={user.rollNo} />
        <ProfileDetail label="Email" value={user.email} />
        <ProfileDetail label="Mobile No." value={user.mobile} />
        <ProfileDetail label="Role" value={user.role} />
        <ProfileDetail label="Room No." value={user.roomNo} />
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: '#F5F5F5',
          height: '8%',
          width: '85%',
          borderRadius: 10,
          marginLeft: 30,
          borderWidth: 2,
          borderColor: 'black',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          gap: 10,
          marginTop:50,
        }}>
        <Icon name="log-out-outline" size={20} color="#3D4EB0" />
        <Text
          style={{
            color: 'grey',
            fontSize: 20,
            fontWeight: 'semibold',
            fontWeight: 700,
          }}>
          Log Out
        </Text>
      </TouchableOpacity>

      <Text style={styles.note}>
        *If any of the above values are incorrect, contact the admin (caretaker)
        for updates.
      </Text>
    </ScrollView>
  );
};

// Component for displaying user details
const ProfileDetail = ({label, value}) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 15,
    zIndex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  img: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',  // Align label and value in one line
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '400',
    marginTop: 5,
  },
  note: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginBottom: 10,
    marginTop:60,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#3b82f6',
    paddingVertical: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default Profile;
