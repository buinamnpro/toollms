
document.addEventListener("DOMContentLoaded", () => {
    // Hiển thị dữ liệu khi popup được mở
    renderStoredData();

    // Thêm sự kiện cho nút "Thêm Dữ Liệu"
    document.getElementById("getDataButton").addEventListener("click", async () => {
        // Sử dụng API của Chrome để lấy tab hiện tại
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (chrome.runtime.lastError) {
                console.error("Lỗi khi truy vấn tab:", chrome.runtime.lastError.message);
                return;
            }
    
            // Kiểm tra nếu không có tab hoặc tab không hợp lệ
            if (!tabs || tabs.length === 0) {
                console.error("Không tìm thấy tab hiện tại.");
                return;
            }
    
            const tab = tabs[0]; // Tab hiện tại
    
            // Thực thi content.js trong tab hiện tại
            chrome.scripting.executeScript(
                {
                    target: { tabId: tab.id },
                    files: ["content.js"],
                },
                (results) => {
                    if (chrome.runtime.lastError) {
                        console.error("Lỗi khi thực thi content.js:", chrome.runtime.lastError.message);
                        return;
                    }
    
                    // Kiểm tra kết quả từ content.js
                    if (!results || !results[0]?.result) {
                        console.error("content.js không trả về kết quả hoặc không được thực thi.");
                        return;
                    }
    
                    const result = results[0].result;
                    console.log("Kết quả từ content.js:", result);
    
                    // Lưu dữ liệu vào localStorage
                    if (result.question && result.answers) {
                        saveData(result);
                        renderStoredData(); // Cập nhật giao diện
                    } else {
                        console.error("Dữ liệu từ content.js không hợp lệ:", result);
                    }
                }
            );
        });
    });
    

    // Thêm sự kiện cho nút "Xóa Dữ Liệu"
    document.getElementById("clearDataButton").addEventListener("click", () => {
        clearData();
        renderStoredData(); // Cập nhật giao diện sau khi xóa
    });
});

// Hàm lưu dữ liệu vào localStorage
function saveData(data) {
    const existingData = JSON.parse(localStorage.getItem("storedData")) || [];
    existingData.push(data);
    localStorage.setItem("storedData", JSON.stringify(existingData));
    console.log("Dữ liệu đã được lưu vào localStorage.");
}

function renderStoredData() {
    const outputContainer = document.getElementById("outputContainer");
    outputContainer.innerHTML = ""; // Xóa nội dung cũ

    const storedData = JSON.parse(localStorage.getItem("storedData")) || [];

    storedData.forEach((item, index) => {
        const newDiv = document.createElement("div");
        newDiv.style.marginBottom = "20px";
        newDiv.style.border = "2px solid #007BFF";
        newDiv.style.padding = "10px";
        newDiv.style.borderRadius = "5px";
        // newDiv.style.display= "block";
        newDiv.style.fontFamily = "Cambria, Cochin, Georgia, Times, 'Times New Roman', serif";

        // Hiển thị câu hỏi với định dạng mới
        const title = document.createElement("h3");
        title.innerText = `Question ${index + 1}`;
        title.style.fontSize = "16px";
        title.style.fontWeight = "normal";
        newDiv.appendChild(title);

        // Thêm nội dung câu hỏi
        const questionText = document.createElement("p");
        questionText.innerText = item.question;
        questionText.style.fontSize = "16px";
        questionText.style.fontWeight= "700";
        questionText.style.margin = "12px 0px"; // Thêm khoảng cách nhỏ sau câu hỏi
        newDiv.appendChild(questionText);

        // Hiển thị đáp án
        item.answers.forEach((answer) => {
            const answerElement = document.createElement("p");
            answerElement.innerText = answer;
            answerElement.style.fontSize = "16px";
            answerElement.style.margin = "5px 0px"; // Giảm khoảng cách giữa các đáp án
            // answerElement.style.border = " 1px solid red";
            if (answer.includes("*")) {
                answerElement.style.color = "green"; // Đặt màu xanh lá cây
                answerElement.style.fontWeight = "bold"; // Làm đậm để nổi bật hơn
            }

            newDiv.appendChild(answerElement);
        });

        outputContainer.appendChild(newDiv);
    });

    if (storedData.length === 0) {
        const message = document.createElement("p");
        message.innerText = "Chưa có dữ liệu.";
        outputContainer.appendChild(message);
    }
}

// Hàm xóa dữ liệu trong localStorage
function clearData() {
    localStorage.removeItem("storedData");
    console.log("Dữ liệu đã được xóa khỏi localStorage.");
}
