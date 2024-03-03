import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import CustomButton from '../../components/CustomButton/CustomButton';
import { COLORS, afternoonSlots, departmentsDictionary, morningSlots, slots } from '../../configs/constants';
import API, { authApi, endpoints } from '../../configs/API';
import Context from '../../Context';
import formatDate from '../../utils/FormatDateFromYMD';
import TopTab from '../../components/TopTab/TopTab';
import Normalize from '../../utils/Normalize';
import showSuccessToast from '../../utils/ShowSuccessToast';
import showFailedToast from '../../utils/ShowFailedToast';
import Icon from 'react-native-vector-icons/Ionicons';

const AllAppointmentScreen = ({ route, navigation }) => {
    const { accessToken } = useContext(Context);
    const [loading, setLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState(1);
    const [pages, setPages] = useState({
        1: 1,
        2: 1,
        3: 1,
        4: 1,
        5: 1,
        6: 1,
    });
    const [appointmentsByTab, setAppointmentsByTab] = useState({
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
    });

    const handleRefresh = () => {
        setPages({
            1: 1,
            2: 1,
            3: 1,
            4: 1,
            5: 1,
            6: 1,
        });
        setAppointmentsByTab({
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
            6: [],
        });
        loadAppointments();
    }
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={handleRefresh}>
                    <Text style={{ marginRight: 15 }}>
                        <Icon name={'refresh'} size={28} />
                    </Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);


    const cancelAppointment = async (id) => {
        try {
            const res = await authApi(accessToken).patch(
                endpoints['cancel_appointment'](id),
                null
            );

            if (res.status === 200) {
                showSuccessToast(`Hủy thành công lịch hẹn ${id}!`);
            }
        } catch (err) {
            console.log(err);
            if (err.response.status === 500) {
                showFailedToast('Hủy thất bại!');
            }
        }
    };

    const loadAppointments = async (tab) => {
        setLoading(true);
        const page = pages[tab];
        if (page === null) {
            setLoading(false);
            return;
        }
        try {
            const response = await authApi(accessToken).get(`${endpoints['my_appointment']}?page=${page}&${getQueryParams(tab)}`);
            const newAppointments = response.data.results;
            setAppointmentsByTab({
                ...appointmentsByTab,
                [tab]: [...appointmentsByTab[tab], ...newAppointments]
            });
            setPages((prevPages) => ({
                ...prevPages,
                [tab]: response.data.next ? page + 1 : null
            }));
        } catch (error) {
            console.log('Error fetching:', error);
        } finally {
            setLoading(false);
        }
    };

    const getQueryParams = (tab) => {
        switch (tab) {
            case 2:
                return 'is_confirm=ĐÃ XÁC NHẬN';
            case 3:
                return 'is_confirm=CHƯA XÁC NHẬN';
            case 4:
                return 'is_pay=ĐÃ THANH TOÁN';
            case 5:
                return 'is_pay=CHƯA THANH TOÁN';
            case 6:
                return 'is_cancel=True';
            default:
                return '';
        }
    };

    useEffect(() => {
        loadAppointments(selectedTab);
    }, [selectedTab, route.params]);

    const renderFooter = () => {
        return loading ? <ActivityIndicator size="large" color={COLORS.cherry_red} /> : null;
    };

    const renderItem = ({ item }) => {
        if (!item) {
            return null; // Bỏ qua việc hiển thị nếu item không tồn tại
        }
        const handleCancelAppointment = (id) => {
            Alert.alert(
                'Xác nhận hủy lịch hẹn',
                'Bạn có chắc chắn muốn hủy lịch hẹn này?',
                [
                    { text: 'Hủy', style: 'cancel' },
                    { text: 'Xác nhận', onPress: () => cancelAppointment(id) },
                ],
                { cancelable: false }
            );
        };

        const handlePayment = (id) => {
            // Viết logic để xử lý thanh toán ở đây
        };

        const handleViewBill = (id) => {
            // Viết logic để xử lý xem hóa đơn ở đây
        };

        const handleResetAppointment = (appointmentInfo) => {
            navigation.navigate('Đặt lịch khám')
        };

        const renderButton = () => {
            // if (item['status'] == "ĐÃ HUỶ") {
            //     return (
            //         <CustomButton title={"Đặt lại"} color={COLORS.green_primary} fsize={17} onPress={() => handleResetAppointment(item)} />
            //     );
            // }
            // // else if (item['status'] == "ĐÃ THANH TOÁN") {
            // //     return (
            // //         <CustomButton title={"Xem bill"} color={"#3366ff"} fsize={17} onPress={() => handleViewBill(item.id)} />
            // //     );
            // // } else if (item['status'] == "CHƯA THANH TOÁN") {
            // //     return (
            // //         <CustomButton title={"Thanh toán"} color={COLORS.green_primary} fsize={17} onPress={() => handlePayment(item.id)} />
            // //     );
            // // }
            // else
            if (item['status'] == "ĐÃ XÁC NHẬN" || item['status'] == "CHƯA XÁC NHẬN") {
                return (
                    <CustomButton title={"Hủy lịch hẹn"} color={"#b30000"} fsize={17} onPress={() => handleCancelAppointment(item.id)} />
                );
            }
        };

        const renderStatus = () => {
            return (
                <Text style={[styles.itemText, { color: item.status == "ĐÃ XÁC NHẬN" || item.status == "ĐÃ THANH TOÁN" ? 'green' : 'red', alignSelf: 'flex-end' }]}>
                    {Normalize.capitalizeFirstLetter(item.status)}
                </Text>
            )
        }

        return (
            <View style={styles.itemContainer}>
                <Text style={styles.itemText}>Khoa: {(item.department)}</Text>
                <Text style={styles.itemText}>Ngày: {formatDate(item.booking_date)}</Text>
                <Text style={styles.itemText}>Giờ khám dự kiến: {(item.booking_time.slice(0, -3))}</Text>
                {renderStatus()}
                {renderButton()}
            </View>
        );
    };


    const titlesAndCallbacks = [
        { title: 'Tất cả', callback: () => setSelectedTab(1) },
        { title: 'Đã xác nhận', callback: () => setSelectedTab(2) },
        { title: 'Chưa xác nhận', callback: () => setSelectedTab(3) },
        { title: 'Đã thanh toán', callback: () => setSelectedTab(4) },
        { title: 'Chưa thanh toán', callback: () => setSelectedTab(5) },
        { title: 'Đã hủy', callback: () => setSelectedTab(6) },
    ];

    return (
        <View style={styles.container}>
            <TopTab titlesAndCallbacks={titlesAndCallbacks} />
            <FlatList
                data={appointmentsByTab[selectedTab]}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingVertical: 20 }}
                onEndReached={() => loadAppointments(selectedTab)}
                onEndReachedThreshold={0.1}
                ListFooterComponent={renderFooter}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    itemContainer: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
    },
    itemText: {
        fontSize: 16,
        marginBottom: 5,
    },
});

export default AllAppointmentScreen;
