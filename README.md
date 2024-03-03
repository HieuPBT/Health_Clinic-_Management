# Quản Lý Phòng Mạch Tư
## Hướng dẫn cài đặt
1. **Clone Repository**

    ```bash 
    git clone https://github.com/HieuPBT/Health_Clinic_Management.git             
    ```

    hoặc

    ```bash 
    git clone -b <tên-nhánh> https://github.com/HieuPBT/Health_Clinic_Management.git
    ```

2. **Di chuyển vào thư mục dự án**

    ```bash
    cd Health_Clinic_Management
    ```

3. **Tạo môi trường ảo**

    ```bash
    python -m venv venv
    ```

4. **Truy cập môi trường ảo**

    - **Window**

    ```bash
    .\venv\Scripts\activate
    ```
    hoặc

    ```bash
    .\venv\bin\activate
    ```

    - **Bash**

    ```bash
    source venv/Scripts/activate
    ```
    hoặc

    ```bash
    source venv/bin/activate
    ```
5. **Cài đặt thư viện**

    ```bash
    pip install -r requirements.txt
    ```