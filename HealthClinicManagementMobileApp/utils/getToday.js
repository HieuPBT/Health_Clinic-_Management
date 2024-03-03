const getToday = () => {
    // Tạo một đối tượng Date đại diện cho ngày hiện tại
    const today = new Date();

    // Lấy thông tin về ngày, tháng và năm
    let year = today.getFullYear();
    let month = today.getMonth() + 1; // Lưu ý: Tháng bắt đầu từ 0
    let day = today.getDate();

    // Đảm bảo rằng tháng và ngày có định dạng hh:mm:ss như 01, 02, vv.
    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }

    // Tạo chuỗi theo định dạng yyyy-mm-dd
    const formattedDate = year + '-' + month + '-' + day;

    return formattedDate;
};

export default getToday;
