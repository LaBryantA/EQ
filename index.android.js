/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Alert,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Dimensions
} from 'react-native';

class EarthquakeInformation extends Component{
  constructor(props){
    super(props);
    this.state = {
      currentlyDisplaying: 0
    }
  }

  render(){
    if(this.props.dataArray.length == 0){
      return(
        <View>
          <Text>No information currently available.</Text>
        </View>
      )
    }
    else {
      return(
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
          <View style={{borderColor: '#00BFFF', borderWidth: 3, borderRadius:5, padding: 15}}>
            <View>
              <Text>Date and Time: {this.props.dataArray[this.state.currentlyDisplaying].datetime}</Text>
              <Text>Magnitude: {this.props.dataArray[this.state.currentlyDisplaying].magnitude}</Text>
              <Text>Depth: {this.props.dataArray[this.state.currentlyDisplaying].depth}</Text>
            </View>

            <View style={{flexDirection:'row', justifyContent:'space-around'}}>
              <Button
                title="Previous"
                disabled={this.state.currentlyDisplaying == 0}
                onPress={()=>{
                  this.setState({currentlyDisplaying: this.state.currentlyDisplaying - 1})
                }}
              />

              <Button
                title="Next"
                disabled={this.state.currentlyDisplaying == (this.props.dataArray.length - 1)}
                onPress={()=>{
                  this.setState({currentlyDisplaying: this.state.currentlyDisplaying + 1})
                }}
              />
            </View>
          </View>
        </View>
      )
    }
  }
}

export default class EQ extends Component {
  constructor(props){
    super(props);
    this.state = {
      longitude : '',
      latitude : '',
      earthquakeData: [],
    }
  }



  _getData(){
      var eastWest = parseFloat(this.state.longitude);
      var northSouth = parseFloat(this.state.latitude);
      var north = 0;
      var south = 0;
      var west = 0;
      var east = 0;

      if(eastWest > 0){
        east = eastWest;
      }
      else{
        west = -1 * eastWest;
      }

      if(northSouth > 0){
        north = northSouth;
      }
      else{
        south = -1 * northSouth;
      }

      var eqURL = 'http://api.geonames.org/earthquakesJSON?north='+ north + '&south=' + south + '&east=' + east + '&west=' + west + '&username=bryanttest';
      console.log(eqURL);
      var eqJson = fetch(eqURL)
      .then((response) => response.json())
      .then((jsonEQ) =>{
        console.log(jsonEQ);
        this.setState({earthquakeData: jsonEQ.earthquakes})

        this.setState({all: ''});
        let length = this.state.earthquakeData.length;
        for(var i = 0; i < length; i++){
          this.setState({all: this.state.all + (this.state.earthquakeData[i].datetime) + '\n'});
        }

        console.log("north: " + north + "\neast: " + east + "\nsouth: " + south + "\nwest :" + west);
      })
      .catch((error)=>{
        console.log("Api call error");
        alert(error.message);
      });

  }



  render() {
    var width = Dimensions.get('window').width;
    return (
      <View style={{flexDirection:'column',flex:1}}>
        {/*Longitude and Latitude input area*/}
        <View style={{flex:3, alignItems: 'center', justifyContent:'center'}}>
          <View style={{paddingBottom:10}}>
            <Text>Longitude:</Text>
            <TextInput
              style={{width: width * .9, height: 40, borderColor: 'gray', borderWidth: 1}}
              keyboardType="numeric"
              onChangeText={(text) => this.setState({longitude: text})}
            />
          </View>

          <View style={{paddingBottom:10}}>
            <Text>Latitude:</Text>
            <TextInput
                style={{width: width * .9, height: 40, borderColor: 'gray', borderWidth: 1}}
                keyboardType="numeric"
                onChangeText={(text) => this.setState({latitude: text})}
            />
          </View>

          <View style={{alignItems:'center'}}>
            <Button
              onPress={()=>this._getData.bind(this)()}
              title="Get Earthquake Data"
              />
          </View>
        </View>

        {/*Earthquake information area*/}
        <View style={{flex:6, justifyContent:'center', alignItems:'center'}}>
          <EarthquakeInformation style={{flex:1}} dataArray={this.state.earthquakeData}/>
        </View>
      </View>
    );
  }
}


AppRegistry.registerComponent('EQ', () => EQ);
