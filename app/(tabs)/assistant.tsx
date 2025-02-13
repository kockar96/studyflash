import { FirstSuggestions } from "@/components/first-suggestions";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Assistant = () => {
  return (
    <View style={styles.container}>
      <FirstSuggestions />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Assistant;
