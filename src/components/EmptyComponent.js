import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React from 'react';

const EmptyComponent = ({isLoading}) => {
  return (
    <View style={styles.loader}>
      {isLoading ? (
        <ActivityIndicator visible size="large" color={'#626262'} />
      ) : (
        <Text>{'No data'}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 300,
  },
});

export default EmptyComponent;
