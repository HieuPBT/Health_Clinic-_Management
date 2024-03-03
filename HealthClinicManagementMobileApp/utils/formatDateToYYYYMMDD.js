function formatDateToYMD(date) {
    const year = date.getFullYear();
    let month = date.getMonth() + 1; // Lưu ý: getMonth() trả về giá trị từ 0 đến 11
    let day = date.getDate();

    // Thêm số 0 phía trước nếu tháng hoặc ngày chỉ có một chữ số
    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }

    // Trả về chuỗi đã định dạng "yyyy-mm-dd"
    return year + '-' + month + '-' + day;
}

export default formatDateToYMD;
