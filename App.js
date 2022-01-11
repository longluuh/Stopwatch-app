import React, { Component } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import moment from "moment";

function Timer({ interval, style }) {
  const pad = (n) => (n < 10 ? "0" + n : n);
  const duration = moment.duration(interval);
  const centiseconds = Math.floor(duration.milliseconds() / 10);
  return (
    <View style={styles.timerContainer}>
      <Text style={style}>{pad(duration.minutes())}:</Text>
      <Text style={style}>{pad(duration.seconds())},</Text>
      <Text style={style}>{pad(centiseconds)}</Text>
    </View>
  );
}
function RoundButton({ title, color, background, onPress, disabled }) {
  return (
    <TouchableOpacity
      onPress={() => !disabled && onPress()}
      style={[styles.button, { backgroundColor: background }]}
      activeOpacity={disabled ? 1.0 : 0.7}
    >
      <View style={styles.buttonBorder}>
        <Text style={[styles.buttonTitle, { color }]}>{title}</Text>
      </View>
    </TouchableOpacity>
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
      <Timer style={[lapStyle, styles.lapTimer]} interval={interval} />
    </View>
  );
}
function LapTables({ laps, timer }) {
  const finishedLaps = laps.slice(1);
  let min = Number.MAX_SAFE_INTEGER;
  let max = Number.MIN_SAFE_INTEGER;
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
          interval={index === 0 ? timer + lap : lap}
          fastest={lap === min}
          slowest={lap === max}
        />
      ))}
    </ScrollView>
  );
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: 0,
      now: 0,
      laps: [],
    };
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  start = () => {
    const now = new Date().getTime();
    this.setState({
      start: now,
      now,
      laps: [0],
    });
    this.timer = setInterval(() => {
      this.setState({ now: new Date().getTime() });
    }, 100);
  };
  lap = () => {
    const timestamp = new Date().getTime();
    const { laps, now, start } = this.state;
    const [firstLap, ...other] = laps;
    this.setState({
      laps: [0, firstLap + now - start, ...other],
      start: timestamp,
      now: timestamp,
    });
  };
  stop = () => {
    clearInterval(this.timer);
    const { laps, now, start } = this.state;
    const [firstLap, ...other] = laps;
    this.setState({
      laps: [firstLap + now - start, ...other],
      start: 0,
      now: 0,
    });
  };
  reset = () => {
    this.setState({
      laps: [],
      start: 0,
      now: 0,
    });
  };
  resume = () => {
    const now = new Date().getTime();
    this.setState({
      start: now,
      now,
    });
    this.timer = setInterval(() => {
      this.setState({ now: new Date().getTime() });
    }, 100);
  };

  render() {
    const { now, start, laps } = this.state;
    const timer = now - start;
    return (
      <View style={styles.container}>
        <Timer
          interval={laps.reduce((total, curr) => total + curr, 0) + timer}
          style={styles.Timer}
        />
        {laps.length === 0 && (
          <ButtonsRow>
            <RoundButton
              title={"Lap"}
              color={"#8b8b90"}
              background={"#151515"}
              disabled
            />
            <RoundButton
              title={"Start"}
              color={"#23C34F"}
              background={"#122B15"}
              onPress={this.start}
            />
          </ButtonsRow>
        )}
        {start > 0 && (
          <ButtonsRow>
            <RoundButton
              title={"Lap"}
              color={"#FCFCFC"}
              background={"#343434"}
              onPress={this.lap}
            />
            <RoundButton
              title={"Stop"}
              color={"#e33935"}
              background={"#3c1715"}
              onPress={this.stop}
            />
          </ButtonsRow>
        )}
        {laps.length > 0 && start === 0 && (
          <ButtonsRow>
            <RoundButton
              title={"Reset"}
              color={"#FCFCFC"}
              background={"#343434"}
              onPress={this.reset}
            />
            <RoundButton
              title={"Start"}
              color={"#23C34F"}
              background={"#122B15"}
              onPress={this.resume}
            />
          </ButtonsRow>
        )}
        <LapTables laps={laps} timer={timer} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#202020",
    alignItems: "center",
    paddingTop: 130,
    paddingHorizontal: 20,
  },
  timerContainer: {
    flexDirection: "row",
  },
  Timer: {
    color: "#F9F9F9",
    fontSize: 76,
    fontWeight: "200",
    width: 110,
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
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonsRow: {
    // nut bam ngang hang
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
  lapTimer: {
    width: 30,
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
