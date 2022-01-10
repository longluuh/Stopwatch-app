import React, { Component } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import moment from "moment";

const DATA = {
  timer: 1234567,
  laps: [12345, 2345, 34567, 98765],
};
function Timer({ interval, style }) {
  const duration = moment.duration(interval);
  const centiseconds = Math.floor(duration.milliseconds() / 10);
  return (
    <Text style={style}>
      {duration.minutes()}:{duration.seconds()},{centiseconds}
    </Text>
  );
}
function RoundButton({ title, color, background }) {
  return (
    <View style={[styles.button, { backgroundColor: background }]}>
      <View style={styles.buttonBorder}>
        <Text style={[styles.buttonTitle, { color }]}>{title}</Text>
      </View>
    </View>
  );
}
function ButtonsRow({ children }) {
  return <View style={styles.buttonsRow}>{children}</View>;
}

function Lap({ number, interval, fastest, slowest }) {
  const lapStyle = [
    styles.lapText,
    fastest && styles.fastest,
    slowest && styles.slowest,
  ];
  return (
    <View style={lapStyle.lap}>
      <Text style={lapStyle}>Lap {number} </Text>
      <Timer style={lapStyle} interval={interval} />
    </View>
  );
}
function LapTables({ laps }) {
  const finishedLaps = laps.slice(1);
  let min = Number.MAX_SAFE_INTEGER;
  let max = Number.MAX_SAFE_INTEGER;
  if (finishedLaps.length >= 2) {
    finishedLaps.forEach((lap) => {
      if (lap < min) min = lap;
      if (lap > max) max = lap;
    });
  }
  return (
    <ScrollView style={styles.scrollView}>
      {laps.map((lap, index) => (
        <Lap
          number={laps.length - index}
          key={laps.length - index}
          interval={lap}
          fastest={lap === min}
          slowest={lap === max}
        />
      ))}
    </ScrollView>
  );
}

export default function App() {
  return (
    <View style={styles.container}>
      <Timer interval={DATA.timer} style={styles.Timer} />
      <ButtonsRow>
        <RoundButton title={"Reset"} color={"#FCFCFC"} background={"#343434"} />
        <RoundButton title={"Start"} color={"#23C34F"} background={"#122B15"} />
      </ButtonsRow>
      <LapTables laps={DATA.laps} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#202020",
    alignItems: "center",
    paddingTop: 130,
    paddingHorizontal: 20,
  },
  Timer: {
    color: "#F9F9F9",
    fontSize: 76,
    fontWeight: "300",
  },
  button: {
    // nut bam tron
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignSelf: "center",
  },
  buttonTitle: {
    fontSize: 18,
  },
  buttonBorder: {
    // vien bao quanh
    width: 78,
    height: 78,
    borderRadius: 38,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonsRow: {
    flexDirection: "row",
    alignSelf: "stretch",
    justifyContent: "space-between",
    marginTop: 80,
    marginBottom: 30,
  },
  lapText: {
    color: "#fff",
    fontSize: 18,
  },
  lap: {
    flexDirection: "row",
    alignContent: "space-between",
    borderColor: "#151515",
    borderWidth: 1,
    paddingVertical: 10,
  },
  scrollView: {
    alignSelf: "stretch",
  },
  fastest: {
    color: "#4bc05f",
  },
  slowest: {
    color: "#cc3531",
  },
});
