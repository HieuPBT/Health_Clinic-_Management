import React, { useEffect } from 'react';
import { View, Button } from 'react-native';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';

const GoogleSignInComponent = () => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '813306665421-n54ad2r1erti1im6ehig6pcjkjtvufo0.apps.googleusercontent.com',
      scopes:["email","profile"],
    });
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign in is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available or outdated');
      } else {
        console.log('Something went wrong:', error.message);
      }
    }
  };

  return (
    <View>
      <GoogleSigninButton
        style={{ width: 192, height: 48 }}
        // size={GoogleSigninButton.Size.Wide}
        // color={GoogleSigninButton.Color.Dark}
        onPress={signIn}
      />
    </View>
  );
};

export default GoogleSignInComponent;
