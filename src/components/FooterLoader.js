import { ActivityIndicator, StyleSheet, View } from "react-native";

export const FooterLoader = ({ visible }) => {
    return visible ? (
      <View style={styles.FooterLoader}>
        <ActivityIndicator
          color={'#626262'}
          size="large"
        />
      </View>
    ) : null;
  };

  const styles = StyleSheet.create({
    FooterLoader: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 20,
    },
  });