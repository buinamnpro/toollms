document.addEventListener("DOMContentLoaded", () => {
    const searchResults = document.getElementById("searchResults");
    const fileInput = document.getElementById("wordFile");
  
    // Kiểm tra xem nội dung file Word đã lưu hay chưa
    const savedFileContent = localStorage.getItem("wordFileContent");
    if (savedFileContent) {
      console.log("File Word đã được lưu trước đó.");
    } else {
      console.log("Chưa có file Word được lưu.");
    }
  
    // Xử lý tải file Word
    document.getElementById("loadFileButton").addEventListener("click", () => {
      const file = fileInput.files[0];
  
      if (!file) {
        searchResults.textContent = "Vui lòng chọn một file Word.";
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
            searchResults.textContent = "Đã xảy ra lỗi khi đọc tệp Word.";
          });
      };
  
      reader.readAsArrayBuffer(file);
    });
  
    function normalizeString(str) {
      return str
          .replace(/\s+/g, " ") // Loại bỏ khoảng trắng thừa
          .trim() // Loại bỏ khoảng trắng ở đầu và cuối chuỗi
          .toLowerCase(); // Chuyển thành chữ thường
  }
  
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
                          break; // Dừng sau khi tìm thấy câu hỏi và đáp án liên quan
                      }
                  }
  
                  searchResults.textContent = output || "Không tìm thấy câu hỏi và đáp án!";
              }
          );
      });
  });
  
  
    // Xử lý nút xóa dữ liệu
    document.getElementById("clearDataButton").addEventListener("click", () => {
      localStorage.removeItem("wordFileContent");
      alert("Dữ liệu file Word đã được xóa.");
      searchResults.textContent = "";
    });
  });
  