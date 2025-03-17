// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
//   TouchableOpacity,
//   Image,
//   Dimensions
// } from 'react-native';
// import firestore from '@react-native-firebase/firestore';
// import auth from '@react-native-firebase/auth';

// const Bookings = ({ navigation }) => {
//   const [userBookings, setUserBookings] = useState([]);
//   const [lastUses, setLastUses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [usageHistoryLoading, setUsageHistoryLoading] = useState(true);
//   const currentUser = auth().currentUser;

//   useEffect(() => {
//     let unsubscribe = () => {};

//     if (currentUser) {
//       setLoading(true);

//       // Set up real-time listener for bookings
//       unsubscribe = firestore()
//         .collection('machines')
//         .where('inUse', '==', true)
//         .where('bookedBy', '==', currentUser.email)
//         .onSnapshot(
//           snapshot => {
//             const bookings = [];
//             snapshot.forEach(doc => {
//               bookings.push({ id: doc.id, ...doc.data() });
//             });
//             setUserBookings(bookings);
//             setLoading(false);
//           },
//           error => {
//             console.error('Listening for bookings failed: ', error);
//             Alert.alert('Error', 'Failed to load your bookings.');
//             setLoading(false);
//           }
//         );

//       // Fetch last uses history for current user
//       listenToLastUses();
//     } else {
//       setLoading(false);
//       setUsageHistoryLoading(false);
//     }

//     // Clean up listener when component unmounts
//     return () => unsubscribe();
//   }, [currentUser]);

//   const listenToLastUses = () => {
//     setUsageHistoryLoading(true);
  
//     firestore()
//       .collection('students')
//       .where('Email', '==', currentUser.email)
//       .limit(1)
//       .onSnapshot(
//         snapshot => {
//           if (!snapshot.empty) {
//             const userData = snapshot.docs[0].data();
//             // Filter out empty entries
//             const filteredUses = (userData.lastUses || []).filter(use => use && use !== "");
//             setLastUses(filteredUses);
//           } else {
//             console.log('No user document found with email:', currentUser.email);
//             setLastUses([]);
//           }
//           setUsageHistoryLoading(false);
//         },
//         error => {
//           console.error('Error fetching last uses:', error);
//           Alert.alert('Error', 'Failed to load usage history.');
//           setUsageHistoryLoading(false);
//         }
//       );
//   };

//   const handleUnbookMachine = async (machine) => {
//     try {
//       if (machine.bookedBy !== currentUser.email) {
//         Alert.alert('Error', 'You can only unbook machines that you have booked.');
//         return;
//       }
  
//       const machineRef = firestore().collection('machines').doc(machine.id);
//       const userQuerySnapshot = await firestore()
//         .collection('students')
//         .where('Email', '==', currentUser.email)
//         .limit(1)
//         .get();
  
//       if (!userQuerySnapshot.empty) {
//         const userDoc = userQuerySnapshot.docs[0].ref;
//         const userData = userQuerySnapshot.docs[0].data();
  
//         let updatedLastUses = userData.lastUses || ["", "", "", "", ""];
  
//         // Get current timestamp as a string
//         const newEntry = new Date().toISOString();
  
//         // Shift array to the left and insert the new entry at the end
//         updatedLastUses.shift();
//         updatedLastUses.push(newEntry);
  
//         // Update the student's lastUses field
//         await userDoc.update({
//           lastUses: updatedLastUses,
//         });
  
//         console.log('Updated lastUses:', updatedLastUses);
//       }
  
//       // Unbook the machine
//       await machineRef.update({
//         inUse: false,
//         bookedBy: null,
//         status: 'available',
//       });
  
//       Alert.alert(`Success! Machine No. ${machine.number} has been unbooked!`);
//     } catch (error) {
//       console.error('Error unbooking machine:', error);
//       Alert.alert('Error', 'Failed to unbook machine.');
//     }
//   };

//   const formatDate = (timestamp) => {
//     if (!timestamp || timestamp === "") return '';

//     try {
//       const date = new Date(timestamp);
//       if (!isNaN(date.getTime())) {
//         return date.toLocaleString('en-US', {
//           day: 'numeric',
//           month: 'short',
//           year: 'numeric',
//           hour: 'numeric',
//           minute: 'numeric',
//           hour12: true
//         });
//       }
//     } catch (e) {
//       console.error('Error parsing date:', e);
//     }
    
//     return '';
//   };

//   // New function to navigate to the timer screen
//   // const navigateToTimer = (machine) => {
//   //   navigation.navigate('MachineTimer', { machine });
//   // };

//   // Only show history section if we have entries
//   const showHistorySection = lastUses.length > 0;

//   return (
//     <ScrollView
//     contentContainerStyle={styles.contentContainer}
//     style={styles.container}
//     >
//       <Text style={styles.heading}>Your Bookings</Text>
//       <Text style={styles.subheading}>
//         {userBookings.length} active bookings
//       </Text>

//       {loading ? (
//         <View style={styles.loaderContainer}>
//           <ActivityIndicator size="large" color="#3D4EB0" />
//         </View>
//       ) : (
//         <View style={styles.bookingsContainer}>
//           {userBookings.length > 0 ? (
//             userBookings.map(machine => (
//               <View key={machine.id} style={styles.bookingCard}>
//                 {/* Made the booking info touchable to navigate to timer */}
//                 <TouchableOpacity 
//                   style={styles.bookingInfo}
//                   // onPress={() => navigateToTimer(machine)}
//                 >
//                   <View style={styles.machineIconContainer}>
//                     <Image
//                       source={require('../assets/machine.png')}
//                       style={styles.machineIcon}
//                     />
//                   </View>
//                   <View style={styles.bookingDetails}>
//                     <Text style={styles.washText}>Wash</Text>
//                     <Text style={styles.machineText}>Machine No. {machine.number}</Text>
//                     <Text style={styles.ongoingStatus}>Ongoing</Text>
//                     {machine.bookingTime && (
//                       <Text style={styles.bookingDate}>
//                         {formatDate(machine.bookingTime)}
//                       </Text>
//                     )}
//                   </View>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={styles.unbookButton}
//                   onPress={() => handleUnbookMachine(machine)}
//                 >
//                   <Text style={styles.unbookButtonText}>Unbook</Text>
//                 </TouchableOpacity>
//               </View>
//             ))
//           ) : (
//             <View style={styles.emptyState}>
//               <Text style={styles.emptyStateText}>You don't have any active bookings</Text>
//             </View>
//           )}
//         </View>
//       )}

//       {/* Last 5 Usage History Section */}
//       {showHistorySection && (
//         <>
//           <Text style={[styles.heading, { marginTop: 30 }]}>Your Usage History</Text>
//           <Text style={styles.subheading}>Last 5 uses</Text>
          
//           {usageHistoryLoading ? (
//             <View style={styles.loaderContainer}>
//               <ActivityIndicator size="large" color="#3D4EB0" />
//             </View>
//           ) : (
//             <View style={styles.bookingsContainer}>
//               {lastUses.map((useDate, index) => {
//                 const formattedDate = formatDate(useDate);
//                 return (
//                   <View key={index} style={styles.historyCard}>
//                     <View style={styles.bookingInfo}>
//                       <View style={styles.historyIconContainer}>
//                         <Image
//                           source={require('../assets/machine.png')}
//                           style={styles.machineIcon}
//                         />
//                       </View>
//                       <View style={styles.bookingDetails}>
//                         <Text style={styles.washText}>Previous Use</Text>
//                         <Text style={styles.completedStatus}>Completed</Text>
//                         {formattedDate && (
//                           <Text style={styles.bookingDate}>{formattedDate}</Text>
//                         )}
//                       </View>
//                     </View>
//                   </View>
//                 );
//               })}
//             </View>
//           )}
//         </>
//       )}
//     </ScrollView>
//   );
// };

// // Styles unchanged
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//     padding: 20,
//   },
//   contentContainer: {
//     paddingBottom: 120,
//   },
//   heading: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 5,
//   },
//   subheading: {
//     fontSize: 16,
//     color: '#3D4EB0',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   loaderContainer: {
//     padding: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   bookingsContainer: {
//     marginTop: 10,
//   },
//   bookingCard: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     elevation: 3,
//   },
//   historyCard: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 12,
//     elevation: 3,
//   },
//   bookingInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   machineIconContainer: {
//     backgroundColor: '#EBEEFF',
//     borderRadius: 12,
//     padding: 12,
//     marginRight: 16,
//   },
//   historyIconContainer: {
//     backgroundColor: '#F0F0F0',
//     borderRadius: 12,
//     padding: 12,
//     marginRight: 16,
//   },
//   machineIcon: {
//     width: 40,
//     height: 40,
//   },
//   bookingDetails: {
//     flex: 1,
//   },
//   washText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   machineText: {
//     fontSize: 16,
//     color: '#666',
//     marginBottom: 4,
//   },
//   ongoingStatus: {
//     fontSize: 16,
//     color: '#3D4EB0',
//     fontWeight: '500',
//     marginBottom: 4,
//   },
//   completedStatus: {
//     fontSize: 16,
//     color: '#28a745',
//     fontWeight: '500',
//     marginBottom: 4,
//   },
//   bookingDate: {
//     fontSize: 14,
//     color: '#888',
//   },
//   unbookButton: {
//     backgroundColor: '#3D4EB0',
//     borderRadius: 8,
//     paddingVertical: 12,
//     alignItems: 'center',
//   },
//   unbookButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   emptyState: {
//     padding: 40,
//     alignItems: 'center',
//   },
//   emptyStateText: {
//     fontSize: 16,
//     color: '#888',
//     textAlign: 'center',
//   },
// });

// export default Bookings;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const Bookings = ({ navigation }) => {
  const [userBookings, setUserBookings] = useState([]);
  const [lastUses, setLastUses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usageHistoryLoading, setUsageHistoryLoading] = useState(true);
  const currentUser = auth().currentUser;

  useEffect(() => {
    let unsubscribe = () => {};

    if (currentUser) {
      setLoading(true);

      // Set up real-time listener for bookings
      unsubscribe = firestore()
        .collection('machines')
        .where('inUse', '==', true)
        .where('bookedBy', '==', currentUser.email)
        .onSnapshot(
          snapshot => {
            const bookings = [];
            snapshot.forEach(doc => {
              const data = doc.data();
              // Calculate time remaining for each booking
              const expiryTime = data.expiryTime ? new Date(data.expiryTime) : null;
              const now = new Date();
              const timeRemaining = expiryTime ? Math.max(0, Math.floor((expiryTime - now) / 1000)) : 0;
              
              bookings.push({ 
                id: doc.id, 
                ...data, 
                timeRemaining 
              });
            });
            setUserBookings(bookings);
            setLoading(false);
          },
          error => {
            console.error('Listening for bookings failed: ', error);
            Alert.alert('Error', 'Failed to load your bookings.');
            setLoading(false);
          }
        );

      // Fetch last uses history for current user
      listenToLastUses();
    } else {
      setLoading(false);
      setUsageHistoryLoading(false);
    }

    // Clean up listener when component unmounts
    return () => unsubscribe();
  }, [currentUser]);

  // Set up a timer to update the remaining time
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setUserBookings(prevBookings => {
        return prevBookings.map(booking => {
          const expiryTime = booking.expiryTime ? new Date(booking.expiryTime) : null;
          const now = new Date();
          const timeRemaining = expiryTime ? Math.max(0, Math.floor((expiryTime - now) / 1000)) : 0;
          
          return {
            ...booking,
            timeRemaining
          };
        });
      });
    }, 1000); // Update every second

    return () => clearInterval(timerInterval);
  }, []);

  const listenToLastUses = () => {
    setUsageHistoryLoading(true);
  
    firestore()
      .collection('students')
      .where('Email', '==', currentUser.email)
      .limit(1)
      .onSnapshot(
        snapshot => {
          if (!snapshot.empty) {
            const userData = snapshot.docs[0].data();
            // Filter out empty entries
            const filteredUses = (userData.lastUses || []).filter(use => use && use !== "");
            setLastUses(filteredUses);
          } else {
            console.log('No user document found with email:', currentUser.email);
            setLastUses([]);
          }
          setUsageHistoryLoading(false);
        },
        error => {
          console.error('Error fetching last uses:', error);
          Alert.alert('Error', 'Failed to load usage history.');
          setUsageHistoryLoading(false);
        }
      );
  };

  const handleUnbookMachine = async (machine) => {
    try {
      if (machine.bookedBy !== currentUser.email) {
        Alert.alert('Error', 'You can only unbook machines that you have booked.');
        return;
      }
  
      const machineRef = firestore().collection('machines').doc(machine.id);
      const userQuerySnapshot = await firestore()
        .collection('students')
        .where('Email', '==', currentUser.email)
        .limit(1)
        .get();
  
      if (!userQuerySnapshot.empty) {
        const userDoc = userQuerySnapshot.docs[0].ref;
        const userData = userQuerySnapshot.docs[0].data();
  
        let updatedLastUses = userData.lastUses || ["", "", "", "", ""];
  
        // Get current timestamp as a string
        const newEntry = new Date().toISOString();
  
        // Shift array to the left and insert the new entry at the end
        updatedLastUses.shift();
        updatedLastUses.push(newEntry);
  
        // Update the student's lastUses field
        await userDoc.update({
          lastUses: updatedLastUses,
        });
  
        console.log('Updated lastUses:', updatedLastUses);
      }
  
      // Get user details before unbooking
      const machineData = (await machineRef.get()).data();
      const userName = machineData.userName || '';
      const userMobile = machineData.userMobile || '';
  
      // Unbook the machine but don't show user details when manually unbooking
      await machineRef.update({
        inUse: false,
        bookedBy: null,
        status: 'available',
        lastUsedBy: currentUser.email,
        lastUserName: userName,
        lastUserMobile: userMobile,
        lastUsedTime: new Date().toISOString(),
        autoUnbooked: false // This is the critical flag - set to false for manual unbooking
      });
  
      Alert.alert(`Success! Machine No. ${machine.number} has been unbooked!`);
    } catch (error) {
      console.error('Error unbooking machine:', error);
      Alert.alert('Error', 'Failed to unbook machine.');
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp || timestamp === "") return '';

    try {
      const date = typeof timestamp === 'object' && timestamp.toDate ? 
        timestamp.toDate() : new Date(timestamp);
      
      if (!isNaN(date.getTime())) {
        return date.toLocaleString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        });
      }
    } catch (e) {
      console.error('Error parsing date:', e);
    }
    
    return '';
  };

  // Format time remaining
  const formatTimeRemaining = (seconds) => {
    return `${seconds} ${seconds === 1 ? 'second' : 'seconds'} remaining`;
  };

  // Only show history section if we have entries
  const showHistorySection = lastUses.length > 0;

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      style={styles.container}
    >
      <Text style={styles.heading}>Your Bookings</Text>
      <Text style={styles.subheading}>
        {userBookings.length} active bookings
      </Text>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#3D4EB0" />
        </View>
      ) : (
        <View style={styles.bookingsContainer}>
          {userBookings.length > 0 ? (
            userBookings.map(machine => (
              <View key={machine.id} style={styles.bookingCard}>
                <View style={styles.bookingInfo}>
                  <View style={styles.machineIconContainer}>
                    <Image
                      source={require('../assets/image.png')}
                      style={styles.machineIcon}
                    />
                  </View>
                  <View style={styles.bookingDetails}>
                    <Text style={styles.washText}>Wash</Text>
                    <Text style={styles.machineText}>Machine No. {machine.number}</Text>
                    <Text style={styles.ongoingStatus}>Ongoing</Text>
                    {machine.expiryTime && (
                      <Text style={styles.timerText}>
                        {machine.timeRemaining > 0 
                          ? formatTimeRemaining(machine.timeRemaining) 
                          : 'Time expired'}
                      </Text>
                    )}
                    {machine.bookingTime && (
                      <Text style={styles.bookingDate}>
                        Booked: {formatDate(machine.bookingTime)}
                      </Text>
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.unbookButton}
                  onPress={() => handleUnbookMachine(machine)}
                >
                  <Text style={styles.unbookButtonText}>Unbook</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>You don't have any active bookings</Text>
            </View>
          )}
        </View>
      )}

      {/* Last Usage History Section */}
      {showHistorySection && (
        <>
          <Text style={[styles.heading, { marginTop: 30 }]}>Your Usage History</Text>
          <Text style={styles.subheading}>Last {lastUses.length} uses</Text>
          
          {usageHistoryLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#3D4EB0" />
            </View>
          ) : (
            <View style={styles.bookingsContainer}>
              {lastUses.map((useDate, index) => {
                const formattedDate = formatDate(useDate);
                return (
                  <View key={index} style={styles.historyCard}>
                    <View style={styles.bookingInfo}>
                      <View style={styles.historyIconContainer}>
                        <Image
                          source={require('../assets/image.png')}
                          style={styles.machineIcon}
                        />
                      </View>
                      <View style={styles.bookingDetails}>
                        <Text style={styles.washText}>Previous Use</Text>
                        <Text style={styles.completedStatus}>Completed</Text>
                        {formattedDate && (
                          <Text style={styles.bookingDate}>{formattedDate}</Text>
                        )}
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};

// Styles updated to include timer text
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  contentContainer: {
    paddingBottom: 120, // Increased padding at the bottom
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subheading: {
    fontSize: 16,
    color: '#3D4EB0',
    textAlign: 'center',
    marginBottom: 20,
  },
  loaderContainer: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookingsContainer: {
    marginTop: 10,
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  historyCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12, // Slightly smaller padding
    marginBottom: 12, // Reduced margin for tighter layout
    elevation: 3,
  },
  bookingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12, // Reduced bottom margin
  },
  machineIconContainer: {
    backgroundColor: '#EBEEFF',
    borderRadius: 12,
    padding: 12,
    marginRight: 16,
  },
  historyIconContainer: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    padding: 12,
    marginRight: 16,
  },
  machineIcon: {
    width: 40,
    height: 40,
  },
  bookingDetails: {
    flex: 1,
  },
  washText: {
    fontSize: 18, // Slightly smaller for history section
    fontWeight: 'bold',
  },
  machineText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  ongoingStatus: {
    fontSize: 16,
    color: '#3D4EB0',
    fontWeight: '500',
    marginBottom: 4,
  },
  completedStatus: {
    fontSize: 16,
    color: '#28a745',
    fontWeight: '500',
    marginBottom: 4,
  },
  timerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E53935', // Red color for timer
    marginBottom: 4,
  },
  bookingDate: {
    fontSize: 14,
    color: '#888',
  },
  unbookButton: {
    backgroundColor: '#3D4EB0',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  unbookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});

export default Bookings;