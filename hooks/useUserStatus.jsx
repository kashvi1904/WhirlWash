// import {useState, useEffect} from 'react';
// import firestore from '@react-native-firebase/firestore';
// import {Alert} from 'react-native';

// /**
//  * Custom hook to manage user status related to booking restrictions
//  * @param {string} userEmail - Current user's email
//  * @returns {Object} User status information
//  */
// const useUserStatus = userEmail => {
//   const [userCooldownUntil, setUserCooldownUntil] = useState(null);
//   const [penaltyUntil, setPenaltyUntil] = useState(null);
//   const [restrictionSeconds, setRestrictionSeconds] = useState(0);
//   const [restrictionType, setRestrictionType] = useState(null);
//   const [hasPenaltyNotification, setHasPenaltyNotification] = useState(false);

//   // Listen for user status changes
//   useEffect(() => {
//     if (!userEmail) return;

//     const userStatusUnsubscribe = firestore()
//       .collection('students')
//       .where('Email', '==', userEmail)
//       .limit(1)
//       .onSnapshot(
//         snapshot => {
//           if (!snapshot.empty) {
//             const userData = snapshot.docs[0].data();
//             const userRef = snapshot.docs[0].ref;

//             // Check for cooldown period
//             if (userData.cooldownUntil) {
//               const cooldownTime = new Date(userData.cooldownUntil);
//               if (cooldownTime > new Date()) {
//                 setUserCooldownUntil(cooldownTime);
//               } else {
//                 setUserCooldownUntil(null);
//               }
//             } else {
//               setUserCooldownUntil(null);
//             }

//             // Check for penalty period
//             if (userData.penaltyUntil) {
//               const penaltyTime = new Date(userData.penaltyUntil);
//               if (penaltyTime > new Date()) {
//                 setPenaltyUntil(penaltyTime);

//                 // CHANGE: First update the restriction states immediately
//                 setRestrictionType('penalty');
//                 setRestrictionSeconds(
//                   Math.ceil((penaltyTime - new Date()) / 1000),
//                 );

//                 // Check if there's a pending notification
//                 if (userData.hasPenaltyNotification === true) {
//                   Alert.alert(
//                     'Penalty Applied',
//                     'You did not unbook your machine and it was automatically released. You will not be able to book again for 1 minute.',
//                   );

//                   // Clear the notification flag
//                   userRef.update({hasPenaltyNotification: false});
//                 }
//               } else {
//                 setPenaltyUntil(null);
//               }
//             } else {
//               setPenaltyUntil(null);
//             }

            
            
//           }
//         },
//         error => {
//           console.error('Error listening to user status:', error);
//         },
//       );

//     return () => userStatusUnsubscribe();
//   }, [userEmail]);

//   // Update the restriction timer
//   useEffect(() => {
//     const now = new Date();

//     if (penaltyUntil && penaltyUntil > now) {
//       setRestrictionType('penalty');
//       setRestrictionSeconds(Math.ceil((penaltyUntil - now) / 1000));
//     } else if (userCooldownUntil && userCooldownUntil > now) {
//       setRestrictionType('cooldown');
//       setRestrictionSeconds(Math.ceil((userCooldownUntil - now) / 1000));
//     } else {
//       setRestrictionType(null);
//       setRestrictionSeconds(0);
//     }

//     const timer = setInterval(() => {
//       const currentTime = new Date();

//       if (penaltyUntil && penaltyUntil > currentTime) {
//         setRestrictionType('penalty');
//         setRestrictionSeconds(Math.ceil((penaltyUntil - currentTime) / 1000));
//       } else if (userCooldownUntil && userCooldownUntil > currentTime) {
//         setRestrictionType('cooldown');
//         setRestrictionSeconds(
//           Math.ceil((userCooldownUntil - currentTime) / 1000),
//         );
//       } else {
//         setRestrictionType(null);
//         setRestrictionSeconds(0);
//       }
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [penaltyUntil, userCooldownUntil]);

//   return {
//     userCooldownUntil,
//     penaltyUntil,
//     restrictionSeconds,
//     restrictionType,
//     hasPenaltyNotification,
//   };
// };

// export default useUserStatus;

import { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';

/**
 * Custom hook to track user restriction status
 * @param {string} email - User email
 * @returns {Object} User status including cooldown and penalty information
 */
const useUserStatus = (email) => {
  const [userCooldownUntil, setUserCooldownUntil] = useState(null);
  const [penaltyUntil, setPenaltyUntil] = useState(null);
  const [penaltyStartTime, setPenaltyStartTime] = useState(null);
  const [restrictionType, setRestrictionType] = useState(null);
  const [restrictionSeconds, setRestrictionSeconds] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) {
      setUserCooldownUntil(null);
      setPenaltyUntil(null);
      setPenaltyStartTime(null);
      setRestrictionType(null);
      setRestrictionSeconds(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    const unsubscribe = firestore()
      .collection('students')
      .where('Email', '==', email)
      .limit(1)
      .onSnapshot(
        (snapshot) => {
          if (snapshot.empty) {
            setLoading(false);
            return;
          }

          const userData = snapshot.docs[0].data();
          
          setUserCooldownUntil(userData.cooldownUntil || null);
          setPenaltyUntil(userData.penaltyUntil || null);
          setPenaltyStartTime(userData.penaltyStartTime || null);
          setRestrictionType(userData.restrictionType || null);
          
          // Calculate restriction seconds
          const now = new Date();
          let seconds = 0;
          
          if (userData.restrictionType === 'penalty') {
            if (userData.penaltyUntil) {
              const penaltyTime = new Date(userData.penaltyUntil);
              if (penaltyTime > now) {
                seconds = Math.ceil((penaltyTime - now) / 1000);
              } else if (userData.penaltyStartTime && userData.penaltyDurationSeconds) {
                // Fallback to start time + duration if end time has passed
                const startTime = new Date(userData.penaltyStartTime);
                const endTime = new Date(startTime.getTime() + (userData.penaltyDurationSeconds * 1000));
                
                if (endTime > now) {
                  seconds = Math.ceil((endTime - now) / 1000);
                }
              }
            }
          } else if (userData.restrictionType === 'cooldown' && userData.cooldownUntil) {
            const cooldownTime = new Date(userData.cooldownUntil);
            if (cooldownTime > now) {
              seconds = Math.ceil((cooldownTime - now) / 1000);
            }
          }
          
          setRestrictionSeconds(seconds);
          setLoading(false);
        },
        (error) => {
          console.error('Error in useUserStatus:', error);
          setLoading(false);
        }
      );

    // Counter to update restriction seconds every second
    const interval = setInterval(() => {
      const now = new Date();
      
      if (restrictionType === 'penalty' && (penaltyUntil || penaltyStartTime)) {
        let seconds = 0;
        
        if (penaltyUntil) {
          const penaltyTime = new Date(penaltyUntil);
          if (penaltyTime > now) {
            seconds = Math.ceil((penaltyTime - now) / 1000);
          } else if (penaltyStartTime) {
            // Use the start time + 60 seconds if end time has passed
            const startTime = new Date(penaltyStartTime);
            const endTime = new Date(startTime.getTime() + (60 * 1000)); // 60 seconds penalty
            
            if (endTime > now) {
              seconds = Math.ceil((endTime - now) / 1000);
            }
          }
        }
        
        setRestrictionSeconds(seconds);
      } else if (restrictionType === 'cooldown' && userCooldownUntil) {
        const cooldownTime = new Date(userCooldownUntil);
        if (cooldownTime > now) {
          const seconds = Math.ceil((cooldownTime - now) / 1000);
          setRestrictionSeconds(seconds);
        } else {
          setRestrictionSeconds(0);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [email, restrictionType, penaltyUntil, penaltyStartTime, userCooldownUntil]);

  return {
    userCooldownUntil,
    penaltyUntil,
    restrictionType,
    restrictionSeconds,
    loading,
  };
};

export default useUserStatus;