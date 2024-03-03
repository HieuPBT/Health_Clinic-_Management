import React, { useState, useEffect } from 'react';
import { FlatList, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import ArticleItem from '../ArticleItem/ArticleItem';
import ArticleDetails from '../ArticleDetails/ArticleDetails';
import CustomButton from '../CustomButton/CustomButton';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../configs/constants';

const ArticleList = () => {
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [articles, setArticles] = useState([
        {
            id: 1,
            date: '12/12/2022',
            title: 'Bộ Y tế đề xuất phương án chi trả cho người khám chữa bệnh BHYT trái tuyến',
            description: 'Bộ Y tế đề xuất người tham gia BHYT khám chữa bệnh trái tuyến tại bệnh viện tỉnh hạng 2 và hạng 1 (không được phân loại tuyến cuối) được chi trả khi khám chữa bệnh ngoại trú...',
            content: 'Cũng tại dự thảo, Bộ Y tế nêu: Mức hưởng BHYT đối với một số trường hợp không phải theo trình tự, thủ tục khám bệnh, chữa bệnh BHYT phân cấp chuyên môn kỹ thuật liên quan đến khám bệnh, chữa bệnh BHYT chuyển người bệnh giữa các cơ sở khám bệnh, chữa bệnh BHYT như sau:\n\nNgười bệnh được chẩn đoán xác định đối với một số bệnh hiếm, bệnh hiểm nghèo, bệnh cần phẫu thuật hoặc sử dụng kỹ thuật cao được đến khám bệnh, chữa bệnh tại cơ sở khám bệnh, chữa bệnh có chuyên khoa thuộc cấp khám bệnh, chữa bệnh cơ bản, cấp khám bệnh, chữa bệnh chuyên sâu theo quy định của Bộ Y tế được quỹ BHYT thanh toán 100% chi phí khám bệnh, chữa bệnh và có mức hưởng theo quy định...\n\nNgười bệnh đã được chẩn đoán xác định đối với một số bệnh mạn tính được chuyển về cơ sở khám bệnh, chữa bệnh đăng ký ban đầu hoặc cấp khám bệnh, chữa bệnh ban đầu để quản lý, cấp phát thuốc chuyên khoa, thuốc sử dụng cho cơ sở khám bệnh, chữa bệnh thuộc cấp chuyên môn kỹ thuật cao hơn (cơ bản, chuyên sâu) theo quy định của Bộ Y tế, được quỹ BHYT thanh toán 100% chi phí khám bệnh, chữa bệnh và có mức hưởng theo quy định...\n\nNgười bệnh được tự đến khám bệnh, chữa bệnh tại cơ sở khám bệnh, chữa bệnh thuộc cấp chuyên môn kỹ thuật cao hơn trong phạm vi địa phương hoặc địa phương giáp ranh trong trường hợp cơ sở đăng ký khám bệnh, chữa bệnh ban đầu, cơ sở khám bệnh, chữa bệnh cấp chuyên môn kỹ thuật cao hơn liền kề với cơ sở mà người bệnh đăng ký khám bệnh, chữa bệnh ban đầu không có đủ năng lực, phạm vi hoạt động chuyên môn đối với một số dịch vụ kỹ thuật, một số bệnh theo quy định của Bộ Y tế, được quỹ BHYT thanh toán 100% chi phí khám bệnh, chữa bệnh và có mức hưởng theo quy định tại khoản 1 Điều này. Sở Y tế phối hợp với cơ quan bảo hiểm xã hội cấp tỉnh xác định và công khai các trường hợp không có đủ năng lực, phạm vi hoạt động chuyên môn đối với một số dịch vụ kỹ thuật, một số bệnh để người bệnh biết.\n\nĐề xuất không chi trả BHYT cho việc sử dụng vật tư y tế thay thế \n\nTại dự thảo này, Bộ Y tế đề xuất danh mục điều trị lác, cận thị và tật khúc xạ của mắt, trừ trường hợp người dưới 18 tuổi sẽ được chi trả BHYT.\n\nTheo đó, tại khoản 7 Điều 23 Luật BHYT quy định người "điều trị lác, cận thị và tật khúc xạ của mắt, trừ trường hợp trẻ em dưới 6 tuổi", là một trong các đối tượng không được hưởng BHYT. Trong dự thảo Luật sửa đổi, Bộ Y tế đề xuất sửa đổi thành: "Điều trị lác, cận thị và tật khúc xạ của mắt, trừ trường hợp người dưới 18 tuổi" (nghĩa là nâng phạm vi tuổi được hưởng BHYT lên).\n\nNgoài ra, Bộ Y tế đề xuất không chi trả BHYT cho việc sử dụng vật tư y tế thay thế bao gồm mắt giả, răng giả, kính mắt, phương tiện trợ giúp vận động trong khám bệnh, chữa bệnh và phục hồi chức năng.\n\nTrước đó, danh mục không chi trả bao gồm sử dụng vật tư y tế thay thế bao gồm chân tay giả, mắt giả, răng giả, kính mắt, máy trợ thính, phương tiện trợ giúp vận động trong khám chữa bệnh và phục hồi chức năng không được BHYT chi trả.\n\nNhư vậy, người tham gia BHYT chỉ được chi trả vật tư y tế là chân tay giả, máy trợ thính.',
            image: 'https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2023/6/30/kcb-bhyt-1688149086140498161512.jpeg',
        },
        {
            id: 2,
            date: '12/12/2022',
            title: 'Bỏ bữa sáng có thực sự không tốt?',
            description: 'Hạnh phúc giúp cải thiện sức khỏe, nghiên cứu mối liên hệ giữa hạnh phúc và sức khỏe',
            content: 'Nội dung bài báo 2...',
            image: 'https://image.giacngo.vn/950x633/Uploaded/2024/xpcwvolc/2023_04_27/cut-sk-4607.jpg',
        },
        {
            id: 4,
            date: '12/12/2022',
            title: 'Xuất hiện ổ dịch thủy đậu, người mắc bệnh cần làm gì để nhanh khỏi?',
            description: 'Thời tiết nồm ẩm, mưa nhiều kèm theo thay đổi về nhiệt độ là thời điểm bệnh thủy đậu dễ bùng phát. Vậy người bệnh thủy đậu cần chăm sóc, ăn uống thế nào để nhanh khỏi bệnh và không để lại sẹo?',
            content: 'Vừa qua, tỉnh Đắk Lắk ghi nhận nhiều ổ dịch thủy đậu với hàng chục trường hợp mắc là học sinh. Đây là thời điểm các ca bệnh thủy đậu có xu hướng gia tăng tuy nhiên nhiều người lại không biết cách chăm sóc, xử trí. Vậy khi mắc thủy đậu, người bệnh cần làm gì để bệnh nhanh khỏi, không để lại sẹo?\nBị thủy đậu bao nhiêu ngày là khỏi? Nếu chăm sóc đúng cách, thủy đậu có thể tự khỏi trong vòng từ 7-10 ngày, thông thường bệnh trải qua 3 giai đoạn: \n- Sau khi tiếp xúc với người bệnh đến lúc phát hiện ra bệnh sẽ rơi vào khoảng từ 2-3 tuần. Khoảng thời gian ủ bệnh này, người bệnh không có bất kỳ triệu chứng nào.\n- Sau khi ủ bệnh từ 10-21 ngày, người bệnh sẽ có các biểu hiện sốt nhẹ, mệt mỏi, chán ăn. Những triệu chứng này dễ gây nhầm lẫn với các bệnh lý như cảm cúm.\n- Giai đoạn toàn phát: Người bệnh sốt, ngứa, xuất hiện mụn nước ở các vị trí: đầu, cổ, mặt, thân người, cơ quan sinh dục, lưỡi, miệng… Mụn nước có thể lan ra toàn thân trong vòng từ 12-24 giờ với kích thước từ 1-3mm. Mụn nước thủy đậu thường có quầng viêm đỏ xung quanh, bên trong chứa dịch trong và lõm ở giữa.\nTrong trường hợp mụn nước bị bội nhiễm có thể chuyển sang màu đục do chứa mủ. Sau khoảng 3-4 ngày các triệu chứng giảm dần, không xuất hiện mụn nước mới, các mụn nước cũ khô dần và bong vảy, không để lại sẹo nếu được chăm sóc đúng cách.Tuy nhiên, với những người có bệnh lý nền hoặc chăm sóc không đúng cách sẽ gây ra các biến chứng nguy hiểm như:\n\n- Nhiễm trùng huyết\n\n- Viêm não, viêm tiểu não\n\n- Viêm phổi\n\n- Đặc biệt với phụ nữ mang thai có thể gây ra tình trạng viêm phổi, sẩy thai, trẻ sinh ra bị nhiều dị tật bẩm sinh.\n\n- Sau khi khỏi bệnh thủy đậu, virus thủy đậu vẫn sẽ tồn tại trong các hạch thần kinh dưới dạng ngủ đông và chờ điều kiện thích hợp như khi sức đề kháng giảm sẽ phát triển và gây ra bệnh zona thần kinh.\n\nNhững lưu ý khi chăm sóc người bệnh thủy đậu\nCó rất nhiều câu hỏi liên quan đến cách chăm sóc người bệnh mắc thủy đậu. Sau đây là một số vấn đề thường gặp:\n\n- Bị thủy đậu có cần kiêng tắm? Trước đây người dân thường quan niệm khi mắc thủy đậu cần chùm kín chăn, kiêng gió, kiêng tắm để các nốt rạ không mọc nhiều. Tuy nhiên, việc người bệnh thủy đậu không tắm có thể sẽ gây mất vệ sinh trên da và dẫn tới việc nhiễm trùng sau khi mắc thủy đậu. \n\nNgười bệnh thủy đậu có thể tắm nhưng nên tắm nhanh để không bị nhiễm lạnh, nên tắm bằng nước ấm và tắm ở những nơi kín gió, nhiệt độ ấm, không chà sát mạnh tránh việc các mụn nước bị vỡ. Sau khi tắm xong nên lau người bằng khăn mềm.',
            image: 'https://suckhoedoisong.qltns.mediacdn.vn/thumb_w/640/324455921873985536/2024/2/23/edit-edit-thuy-dau-1-17086622399312139182405.jpeg',
        },

        {
            id: 5,
            date: '12/12/2022',
            title: "Nhiều trẻ ngộ độc chì nặng vì cha mẹ cho uống thuốc 'đẹn' chữa bệnh",
            description: 'Để con bớt quấy khóc, người nhà tự ý mua thuốc "đẹn" cho trẻ uống. Sau dùng thuốc, tình trạng của trẻ không những không cải thiện mà còn nặng hơn. Trẻ được đưa tới viện cấp cứu khi tình trạng đã nặng, co giật toàn thân nhiều lần, hôn mê.',
            content: 'Tối 23/2, trao đổi với phóng viên Báo Sức khỏe và Đời sống, BS CKII Nguyễn Hùng Mạnh, Trưởng khoa Hồi sức tích cực - chống độc, Bệnh viện Sản Nhi Nghệ An cho biết, thời gian gần đây, khoa tiếp nhận cấp cứu 4 trường hợp trẻ từ hơn 1 tháng đến 6 tháng tuổi bị ngộ độc chì nặng.\n\nNguyên nhân đều bắt nguồn từ việc gia đình mua thuốc “đẹn” về cho con uống với mong muốn con bớt quấy khóc, tăng cân, mau lớn. Trong số trẻ này, có 2 trường hợp tiên lượng nặng, đe dọa các chức năng sống, đã được chuyển ra tuyến trung ương điều trị tiếp; 2 trường hợp còn lại hiện đang điều trị tích cực tại khoa.\n\nCụ thể, Bé N.T.D.L (4 tháng tuổi, ở huyện Hưng Nguyên, Nghệ An) bị ho, khò khè, chơi ít. Nghe lời mách bảo, người nhà đã mua thuốc “đẹn” gần nhà dạng viên nén và cho trẻ dùng trong vòng 7 ngày.\n\nSau dùng thuốc, tình trạng của trẻ không những không cải thiện mà còn nặng hơn. Trẻ bỏ bú, da xanh tái, nôn. Người nhà đã đưa trẻ đến khám tại Bệnh viện Sản Nhi Nghệ An khi tình trạng đã nặng, co giật toàn thân nhiều lần, hôn mê.\n\nTại đây, các bác sĩ đã tiến hành đặt ống nội khí quản, thở máy, hồi sức tích cực, định lượng chì trong máu tăng cao 216 µg/dL(ngưỡng được chấp nhận là dưới 5 µg/dL). Hiện tại, sau gần 1 tuần điều trị tại khoa Hồi sức Tích cực-chống độc, tình trạng sức khỏe của trẻ vẫn rất nặng.\n\nTrường hợp thứ 2 là bé trai P.N.K.Đ (3 tháng tuổi, ở huyện Nghi Xuân, Hà Tĩnh), nhập viện ngày 11/2. Tương tự bé L, trong vòng 1 tháng nay, gia đình thấy trẻ quấy khóc nhiều, ít chơi, người nhà đã mua thuốc “đẹn” về pha loãng cho bé uống. Sau dùng thuốc, trẻ xuất hiện nhiều triệu chứng lạ: bỏ bú, da xanh tái, co giật toàn thân. Trẻ được nhập viện và điều trị tại khoa Hồi sức Tích cực-chống độc.',
            image: 'https://suckhoedoisong.qltns.mediacdn.vn/thumb_w/640/324455921873985536/2024/2/23/edit-z5186812329501fd78d0193b3a71f4d371c3adfc7c6f79-17086981521051017377766.jpeg',
        },

        {
            id: 6,
            date: '12/12/2022',
            title: 'Việt Nam triển khai vaccine não mô cầu mới từ 2 tháng tuổi',
            description: 'Vaccine não mô cầu nhóm B thế hệ mới đang được Hệ thống tiêm chủng VNVC triển khai tiêm sớm cho trẻ từ 2 tháng tuổi và người lớn đến 50 tuổi, hiệu quả bảo vệ cao trước căn bệnh nguy hiểm có thể cướp đi tính mạng chỉ trong vòng 24 giờ.',
            content: 'Vừa qua, tỉnh Đắk Lắk ghi nhận nhiều ổ dịch thủy đậu với hàng chục trường hợp mắc là học sinh. Đây là thời điểm các ca bệnh thủy đậu có xu hướng gia tăng tuy nhiên nhiều người lại không biết cách chăm sóc, xử trí. Vậy khi mắc thủy đậu, người bệnh cần làm gì để bệnh nhanh khỏi, không để lại sẹo?\nBị thủy đậu bao nhiêu ngày là khỏi? Nếu chăm sóc đúng cách, thủy đậu có thể tự khỏi trong vòng từ 7-10 ngày, thông thường bệnh trải qua 3 giai đoạn: \n- Sau khi tiếp xúc với người bệnh đến lúc phát hiện ra bệnh sẽ rơi vào khoảng từ 2-3 tuần. Khoảng thời gian ủ bệnh này, người bệnh không có bất kỳ triệu chứng nào.\n- Sau khi ủ bệnh từ 10-21 ngày, người bệnh sẽ có các biểu hiện sốt nhẹ, mệt mỏi, chán ăn. Những triệu chứng này dễ gây nhầm lẫn với các bệnh lý như cảm cúm.\n- Giai đoạn toàn phát: Người bệnh sốt, ngứa, xuất hiện mụn nước ở các vị trí: đầu, cổ, mặt, thân người, cơ quan sinh dục, lưỡi, miệng… Mụn nước có thể lan ra toàn thân trong vòng từ 12-24 giờ với kích thước từ 1-3mm. Mụn nước thủy đậu thường có quầng viêm đỏ xung quanh, bên trong chứa dịch trong và lõm ở giữa.\nTrong trường hợp mụn nước bị bội nhiễm có thể chuyển sang màu đục do chứa mủ. Sau khoảng 3-4 ngày các triệu chứng giảm dần, không xuất hiện mụn nước mới, các mụn nước cũ khô dần và bong vảy, không để lại sẹo nếu được chăm sóc đúng cách.Tuy nhiên, với những người có bệnh lý nền hoặc chăm sóc không đúng cách sẽ gây ra các biến chứng nguy hiểm như:\n\n- Nhiễm trùng huyết\n\n- Viêm não, viêm tiểu não\n\n- Viêm phổi\n\n- Đặc biệt với phụ nữ mang thai có thể gây ra tình trạng viêm phổi, sẩy thai, trẻ sinh ra bị nhiều dị tật bẩm sinh.\n\n- Sau khi khỏi bệnh thủy đậu, virus thủy đậu vẫn sẽ tồn tại trong các hạch thần kinh dưới dạng ngủ đông và chờ điều kiện thích hợp như khi sức đề kháng giảm sẽ phát triển và gây ra bệnh zona thần kinh.\n\nNhững lưu ý khi chăm sóc người bệnh thủy đậu\nCó rất nhiều câu hỏi liên quan đến cách chăm sóc người bệnh mắc thủy đậu. Sau đây là một số vấn đề thường gặp:\n\n- Bị thủy đậu có cần kiêng tắm? Trước đây người dân thường quan niệm khi mắc thủy đậu cần chùm kín chăn, kiêng gió, kiêng tắm để các nốt rạ không mọc nhiều. Tuy nhiên, việc người bệnh thủy đậu không tắm có thể sẽ gây mất vệ sinh trên da và dẫn tới việc nhiễm trùng sau khi mắc thủy đậu. \n\nNgười bệnh thủy đậu có thể tắm nhưng nên tắm nhanh để không bị nhiễm lạnh, nên tắm bằng nước ấm và tắm ở những nơi kín gió, nhiệt độ ấm, không chà sát mạnh tránh việc các mụn nước bị vỡ. Sau khi tắm xong nên lau người bằng khăn mềm.',
            image: 'https://suckhoedoisong.qltns.mediacdn.vn/thumb_w/640/324455921873985536/2024/2/23/thumb-vnvc-ra-mat-vaccine-viem-mang-nao-mo-cau-the-he-moi-17086939860052050927666.png',
        },
    ]);

    // Hàm để tải dữ liệu bài báo
    //   const loadArticles = async () => {
    //     setLoading(true);
    //     // Gọi API để lấy dữ liệu bài báo theo trang (page)
    //     try {
    //       const response = await fetch(`YOUR_API_ENDPOINT?page=${page}`);
    //       const data = await response.json();
    //       setArticles(prevArticles => [...prevArticles, ...data.articles]);
    //       setPage(page + 1);
    //     } catch (error) {
    //       console.error('Error fetching articles:', error);
    //     } finally {
    //       setLoading(false);
    //     }
    //   };

    //   useEffect(() => {
    //     loadArticles();
    //   }, []);

    // Hàm để hiển thị activity indicator khi đang tải dữ liệu
    const renderFooter = () => {
        return loading ? <ActivityIndicator size="large" color="#0000ff" /> : null;
    };


    return (
        <>
            {selectedArticle ? (<>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }} onPress={() => { setSelectedArticle(null) }}>
                    <Icon name='arrow-back-outline' size={20} color={COLORS.green_primary} />
                    <Text style={{ fontSize: 15, color: COLORS.green_primary, fontWeight: '900' }}>TẤT CẢ</Text>
                </TouchableOpacity>
                <ArticleDetails article={selectedArticle} />
                {/* <CustomButton title={'Thoát'} onPress={} /> */}
            </>) :
                <FlatList
                    data={articles}
                    renderItem={({ item }) => <ArticleItem article={item} onPress={() => setSelectedArticle(item)} />}
                    keyExtractor={(item, index) => index.toString()}
                    //   onEndReached={loadArticles}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={renderFooter}
                />
            }
        </>
    );
};

export default ArticleList;
