import {StyleSheet, Text, View, StatusBar, Button} from 'react-native';
import * as React from 'react';
import AppContext from '../AppContext';

export default Timer = () => {
  const [counter, setCounter] = React.useState(0);
  const [second, setSecond] = React.useState(0);
  const [minute, setMinute] = React.useState(0);
  const startTimeRef = React.useRef(0);
  const requestAnimationFrameRef = React.useRef();
  const [start, setStart] = React.useState(false);
  
  const updateTimer = () => {
    const currentTime = performance.now();
    const elapsedMilliseconds = currentTime - startTimeRef.current;
  
    if (start) {
      setCounter(Math.floor(elapsedMilliseconds % 1000));
      setSecond(Math.floor(elapsedMilliseconds / 1000) % 60);
      setMinute(Math.floor(elapsedMilliseconds / (1000 * 60)));
  
      requestAnimationFrameRef.current = requestAnimationFrame(updateTimer);
    }
  };
  
  React.useEffect(() => {
    if (start) {
      startTimeRef.current = performance.now();
      requestAnimationFrameRef.current = requestAnimationFrame(updateTimer);
    }else{
      setTimeout(() => {
        cancelAnimationFrame(requestAnimationFrameRef.current);
      }, 0);
    }
  }, [start]);
  

  const context = React.useContext(AppContext);

  
  const saveTime = () => {
    let tempboard = [...context.leaderBoard];
    let time = [minute, second, Math.round(counter)];
    const timeFormat = minute + "." + second + "." + Math.round(counter);
  
    if (tempboard.length === 0) {
      context.setLeaderboard([{ user: context.curUser, finalTime: timeFormat }]);
      return;
    }
  
    let insertIndex = tempboard.length;
  
    for (let times = 0; times < tempboard.length; times++) {
      let splitValues = tempboard[times].finalTime.split(".");
      let greaterValue = false;
  
      for (let i = 0; i < splitValues.length; i++) {
        if (time[i] < splitValues[i]) {
          greaterValue = true;
          break;
        } else if (time[i] > splitValues[i]) {
          break;
        }
      }
  
      if (greaterValue) {
        insertIndex = times;
        break;
      }
    }
  
    context.setLeaderboard([
      ...tempboard.slice(0, insertIndex),
      { user: context.curUser, finalTime: timeFormat },
      ...tempboard.slice(insertIndex),
    ]);
  };

  const restTimer = ()=>{
    setCounter(0);
    setSecond(0);
    setMinute(0);
  }
  

  return (
    <View style={styles.container}>
      <View style= {{width:"80%", alignItems:"center", justifyContent: 'center', flex: 1}}>
        <Text style={{fontSize:40}}>
          {' '}
          {minute < 10 ? '0' : null}
          {minute} : {second < 10 ? '0' : null}
          {second} : {Math.round(counter) < 10 ? '0' : null}
          {Math.round(counter/10)}
        </Text>
      </View>
      <View style={{flex: 1, justifyContent:'space-around'}}>
        <Button
          title={!start ? 'Start' : 'Stop'}
          onPress={() => setStart(!start)}
        />

        <Button
          title="Save"
          disabled={((minute === 0 && counter === 0 && second === 0) || start) ? true : false}
          onPress={() =>{saveTime();
            restTimer();
          }}
        />
        <Button
          title="Reset"
          disabled={((minute === 0 && counter === 0 && second === 0) || start) ? true : false}
          onPress={() => {
            restTimer();
          }}
        />
        <StatusBar style="auto" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
