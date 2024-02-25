import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView, Image, ActivityIndicator } from 'react-native';
import RNMomosdk from 'react-native-momosdk';

const merchantname = "CGV Cinemas";
const merchantcode = "CGV01";
const merchantNameLabel = "Nhà cung cấp";
const billdescription = "Fast and Furious 8";
const amount = 50000;
const enviroment = "0"; //"1": production

const App = () => {
  const [state, setState] = useState({
    textAmount: formatNumberToMoney(amount, null, ""),
    amount: amount,
    description: "",
    processing: false
  });

  useEffect(() => {
    DeviceEventEmitter.addListener('RCTMoMoNoficationCenterRequestTokenReceived', function (e) {
      console.log("<MoMoPay>App_got TokenReceived.::" + e);
      setState({ ...state, description: "RequestTokenReceived...", processing: false });
      let dataResponse = e;
      if (typeof e === 'string'){
        dataResponse = JSON.parser(e);
      }

      if (dataResponse && dataResponse.status == 0) {
        setState({ ...state, description: "message: Get token " + dataResponse.data, processing: false });
        let data = dataPayment.data;
        let phonenumber = dataPayment.phonenumber;
      } else {
        setState({ ...state, description: "Thất bại", processing: false });
      }
    });
  }, []);

  const onPress = async () => {
    if (!state.processing){
      let jsonData = {};
      jsonData.enviroment = enviroment;
      jsonData.action = "gettoken";
      jsonData.merchantname = merchantname;
      jsonData.merchantcode = merchantcode;
      jsonData.merchantnamelabel = merchantNameLabel;
      jsonData.description = billdescription;
      jsonData.amount = state.amount;
      jsonData.orderId = "bill234284290348";
      jsonData.orderLabel = "Ma don hang";
      jsonData.appScheme = "momocgv20170101";
      console.log("data_request_payment " + JSON.stringify(jsonData));
      if (Platform.OS === 'android'){
        let dataPayment = await RNMomosdk.requestPayment(jsonData);
        momoHandleResponse(dataPayment);
        console.log("data_request_payment " + dataPayment.status);
      }else{
          RNMomosdk.requestPayment(JSON.stringify(jsonData));
      }
      setState({ ...state, description: ".....", processing: true });
    }
    else{
      setState({ ...state, description: ".....", processing: false });
    }
  }

  const momoHandleResponse = async(dataPayment) => {
    if (dataPayment) {
      console.log("data_request_payment 1 = " + dataPayment.status);
      if (dataPayment.status == 0) {
        setState({ ...state, description: "message: Get token " + dataPayment.data, processing: false });
        let data = dataPayment.data;
        if (data) {
          //success
        }
      } else {
        setState({ ...state, description: "Thất bại", processing: false });
      }
    } else {
      setState({ ...state, description: "Không gởi được yêu cầu vui lòng kiểm tra lại", processing: false });
    }
  }

  const onChangeText = (value) => {
    let newValue = value.replace(/\./g, "").trim();
    let amount = formatNumberToMoney(newValue, null, "");
    setState({ ...state, amount: newValue, textAmount: amount, description: "" });
  }

  const formatNumberToMoney = (number, defaultNum, predicate) => {
    // implementation
  }

  return (
    <SafeAreaView style={{flex: 1, marginTop: 50, backgroundColor: 'transparent'}}>
      <View style={styles.container}>
        <View style={[{backgroundColor: 'transparent', alignItems:'center', justifyContent:'center', height: 100}]}>
            {/* <Image style={{flex:1, width:100, height:100}} source={require('./img/iconReact.png')}/> */}
        </View>
        <Text style={[styles.text, { color: 'red', fontSize: 22 }]}>{"MOMO DEVELOPMENT"}</Text>
        <Text style={[styles.text, { color: 'red', fontSize: 20 }]}>{"React native version"}</Text>
        <Text style={[styles.text, { color: '#000', fontSize: 14, textAlign:'left' }]}>{"MerchantCode : " + merchantcode}</Text>
        <Text style={[styles.text, { color: '#000', fontSize: 14, textAlign:'left' }]}>{"MerchantName : " + merchantname}</Text>
        <Text style={[styles.text, { color: '#000', fontSize: 14, textAlign:'left' }]}>{"Description : " + billdescription}</Text>
        <View style={styles.formInput}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{flex:1, fontSize: 18 }}>{"Total amount"}</Text>
            <TextInput
              autoFocus={true}
              maxLength={10}
              placeholderTextColor={"#929292"}
              placeholder={"Nhập số tiền"}
              keyboardType={"numeric"}
              returnKeyType="done"
              value={state.textAmount == 0 ? "" : state.textAmount}
              style={[styles.textInput, { flex: 1, paddingRight: 30 }]}
              onChangeText={onChangeText}
              underlineColorAndroid="transparent"
            />
            <Text style={{ position: 'absolute', right: 20, fontSize: 30 }}>{"đ"}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={onPress} style={styles.button} >
          {
            state.processing ?
            <Text style={styles.textGrey}> Chờ Xác nhận từ app MoMo</Text>
            :
            <Text style={styles.text}> Xác nhận thanh toán</Text>
          }
        </TouchableOpacity>
        { state.processing ?
            <ActivityIndicator size="small" color="#000" />
            : null
        }
        {
          state.description != "" ?
            <Text style={[styles.text, { color: 'red' }]}>{state.description}</Text>
            : null
        }
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2'
  },
  textInput: {
    fontSize: 16,
    marginHorizontal: 15,
    marginTop: 5,
    height: 50,
    paddingBottom: 2,
    borderBottomColor: '#dadada',
    borderBottomWidth: 1,
  },
  formInput: {
    backgroundColor: '#FFF',
    borderBottomColor: '#dadada',
    borderTopColor: '#dadada',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#b0006d',
    borderRadius: 4,
    marginHorizontal: 40,
    marginVertical: 10
  },
  text: {
    color: "#FFFFFF",
    fontSize: 18,
    textAlign: 'center',
  },
  textGrey: {
    color: "grey",
    fontSize: 18,
    textAlign: 'center',
  }
});

export default App;
