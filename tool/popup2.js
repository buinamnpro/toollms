document.addEventListener("DOMContentLoaded", () => {
    const searchResults = document.getElementById("searchResults");
    const fileInput = document.getElementById("wordFile");

    // Hiển thị dữ liệu đã lưu khi popup được mở
    renderStoredData();

    // Xử lý nút "Tải File"
    document.getElementById("loadFileButton").addEventListener("click", () => {
        const file = fileInput.files[0];

        if (!file) {
            alert("Vui lòng chọn một file Word.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const arrayBuffer = event.target.result;

            mammoth
                .extractRawText({ arrayBuffer })
                .then((result) => {
                    const content = result.value;
                    localStorage.setItem("wordFileContent", content);
                    alert("File Word đã được tải và lưu thành công!");
                })
                .catch((err) => {
                    console.error("Lỗi khi đọc file Word:", err);
                    alert("Đã xảy ra lỗi khi đọc file Word.");
                });
        };

        reader.readAsArrayBuffer(file);
    });

    // Xử lý nút "Tìm Kiếm"
    function normalizeString(str) {
        return str
            .replace(/\s+/g, " ") // Loại bỏ khoảng trắng thừa
            .trim() // Loại bỏ khoảng trắng ở đầu và cuối chuỗi
            .toLowerCase(); // Chuyển thành chữ thường
    }
    
    // Xử lý tìm kiếm
    document.getElementById("searchButton").addEventListener("click", () => {
        const wordContent = localStorage.getItem("wordFileContent");
    
        if (!wordContent) {
            alert("Không có nội dung file Word nào được lưu. Vui lòng tải file trước.");
            return;
        }
    
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (chrome.runtime.lastError) {
                console.error("Lỗi khi truy vấn tab:", chrome.runtime.lastError.message);
                alert("Lỗi khi truy vấn tab.");
                return;
            }
    
            if (!tabs || tabs.length === 0) {
                alert("Không tìm thấy tab hiện tại.");
                return;
            }
    
            const tab = tabs[0];
    
            chrome.scripting.executeScript(
                {
                    target: { tabId: tab.id },
                    files: ["content.js"],
                },
                (results) => {
                    if (chrome.runtime.lastError) {
                        console.error("Lỗi khi thực thi content.js:", chrome.runtime.lastError.message);
                        alert("Lỗi khi thực thi content.js.");
                        return;
                    }
    
                    if (!results || !results[0]?.result) {
                        alert("Không nhận được dữ liệu từ content.js.");
                        return;
                    }
    
                    const { question } = results[0].result;
                    const normalizedQuestion = normalizeString(question);
                    const lines = wordContent.split("\n");
                    let output = "";
    
                    for (let i = 0; i < lines.length; i++) {
                        const normalizedLine = normalizeString(lines[i]);
                        if (normalizedLine.includes(normalizedQuestion)) {
                            // Thêm câu hỏi gốc vào kết quả
                            output += lines[i] + "\n";
    
                            // Lấy các đáp án có dấu *
                            for (let j = i + 1; j < lines.length; j++) {
                              const line = lines[j].trim();
                              if (line.startsWith("*")) {
                                  output += line + "\n";
                              } else if (line.startsWith("Question")) {
                                  break; // Dừng nếu gặp câu hỏi mới
                              }
                          }
                            break;// Dừng sau khi tìm thấy câu hỏi và đáp án liên quan
                        }
                    }
    
                    searchResults.textContent = output || "Không tìm thấy câu hỏi và đáp án!";
                }
            );
        });
    });
    

    // Xử lý nút "Thêm Dữ Liệu"
    document.getElementById("getDataButton").addEventListener("click", async () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (chrome.runtime.lastError) {
                console.error("Lỗi khi truy vấn tab:", chrome.runtime.lastError.message);
                return;
            }

            if (!tabs || tabs.length === 0) {
                console.error("Không tìm thấy tab hiện tại.");
                return;
            }

            const tab = tabs[0];

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

                    if (!results || !results[0]?.result) {
                        console.error("content.js không trả về kết quả hoặc không được thực thi.");
                        return;
                    }

                    const result = results[0].result;
                    console.log("Kết quả từ content.js:", result);

                    if (result.question && result.answers) {
                        saveData(result);
                        renderStoredData();
                    } else {
                        console.error("Dữ liệu từ content.js không hợp lệ:", result);
                    }
                }
            );
        });
    });
    document.getElementById("copyDataButton").addEventListener("click", async () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (chrome.runtime.lastError) {
                console.error("Lỗi khi truy vấn tab:", chrome.runtime.lastError.message);
                return;
            }
    
            if (!tabs || tabs.length === 0) {
                console.error("Không tìm thấy tab hiện tại.");
                return;
            }
    
            const tab = tabs[0];
    
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
    
                    if (!results || !results[0]?.result) {
                        console.error("content.js không trả về kết quả hoặc không được thực thi.");
                        return;
                    }
    
                    const result = results[0].result;
                    console.log("Kết quả từ content.js:", result);
    
                    if (result.question && result.answers) {
                        // Chuẩn bị dữ liệu để sao chép
                        const dataToCopy = ` chọn một đáp án \n Câu hỏi: ${result.question}\nĐáp án:\n` + result.answers.map((a) => `- ${a}`).join("\n");
    
                        // Sao chép dữ liệu vào clipboard
                        navigator.clipboard.writeText(dataToCopy)
                            .then(() => {
                                //alert("Dữ liệu đã được sao chép vào clipboard!");
                            })
                            .catch((err) => {
                                console.error("Lỗi khi sao chép dữ liệu:", err);
                                //alert("Đã xảy ra lỗi khi sao chép dữ liệu!");
                            });
                    } else {
                        console.error("Dữ liệu từ content.js không hợp lệ:", result);
                    }
                }
            );
        });
    });
    
    // Xử lý nút "Xóa Dữ Liệu"
    document.getElementById("clearDataButton").addEventListener("click", () => {
        clearData();
        renderStoredData();
    });
});

// Hàm lưu dữ liệu vào localStorage
function saveData(data) {
    const existingData = JSON.parse(localStorage.getItem("storedData")) || [];
    existingData.push(data);
    localStorage.setItem("storedData", JSON.stringify(existingData));
    console.log("Dữ liệu đã được lưu vào localStorage.");
}

// Hàm hiển thị dữ liệu đã lưu
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
    localStorage.removeItem("wordFileContent");
    console.log("Dữ liệu đã được xóa khỏi localStorage.");
}
