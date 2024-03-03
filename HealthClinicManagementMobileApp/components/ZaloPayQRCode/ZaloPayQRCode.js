import React, { useContext, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, View, StatusBar, Image, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import CustomButton from '../CustomButton/CustomButton';
import { COLORS } from '../../configs/constants';
import Icon from 'react-native-vector-icons/Ionicons';
import API, { authApi, endpoints } from '../../configs/API';
import Context from '../../Context';
import showFailedToast from '../../utils/ShowFailedToast';


const ZaloPayQRCode = ({ navigation, route }) => {
    const { accessToken } = useContext(Context);
    const { apptransid, onSuccess, amount, appointmentId, qrcode } = route.params;

    const handleQuery = async () => {
        try {
            const res = await authApi(accessToken).post(endpoints['query_zalopay'], {
                apptransid: apptransid,
            })

            if (res.data.returncode === 1) {
                onSuccess();
                navigation.navigate('Xuất hóa đơn');
            } else {
                showFailedToast('Người dùng chưa thanh toán!');
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleCancel = async () => {
        navigation.navigate('Xuất hóa đơn');
    }


    const MoneyFormat = ({ value }) => {
        const formattedValue = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);

        return <Text style={{ fontSize: 35, color: '#777', marginVertical: 10 }}>{formattedValue}</Text>;
    };

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <View style={styles.row}>
                    <Image source={require('../../assets/images/zalopay.png')} style={styles.zaloPayLogo} />
                </View>
                <View style={styles.row}>
                    <Text>Mã lịch khám:</Text>
                    <Text style={{ fontWeight: '900' }}> {appointmentId} </Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <View style={{
                        marginVertical: 8
                    }}>
                        <QRCode
                            value={qrcode}
                            size={200}
                        />
                    </View>
                    <MoneyFormat value={amount} />
                    <View style={styles.row}>
                        <Icon name='scan' size={25} style={{ marginRight: 5 }} />
                        <Text>
                            Sử dụng app
                        </Text>
                        <Text style={{ fontWeight: '900' }}> ZaloPay </Text>
                        <Text>
                            hoặc ứng dụng
                        </Text>
                    </View>
                    <Text> Camera có hỗ trợ QR Code để quét mã
                    </Text>
                </View>

                <CustomButton title={"Hủy giao dịch"} onPress={handleCancel} color={COLORS.dark_green} />
                <CustomButton title={"Kiểm tra"} onPress={handleQuery} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.zalo,
        paddingVertical: 50,
        paddingHorizontal: 40
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        justifyContent: 'space-between',
        width: '100%'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    zaloPayLogo: {
        width: 150,
        aspectRatio: 16 / 7
    },
    rowItem: {
        alignSelf: 'flex-start'
    }
})

export default ZaloPayQRCode;
