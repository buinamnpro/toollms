
// (() => {
//     // Trích xuất câu hỏi
//     const questionElement = document.querySelector(".present-single-question__direction");
//     const questionParagraphs = questionElement ? questionElement.querySelectorAll("p") : [];
//     const questionText = Array.from(questionParagraphs).map(p => p.innerText.trim()).join(" ");

//     // Kiểm tra kiểu câu hỏi (radio hoặc checkbox)
//     const isRadioQuestion = document.querySelector(".question-type-radio__answer-content p") !== null;
//     const isCheckboxQuestion = document.querySelector(".question-type-check-box__answer-content p") !== null;

//     // Xử lý câu hỏi dạng radio
//     let answers = [];
//     if (isRadioQuestion) {
//         const answerElementsRadio = document.querySelectorAll(".question-type-radio__answer-content p");
//         answers = Array.from(answerElementsRadio)
//             .map((el, idx) => {
//                 const labelElement = el.closest("label");
//                 const radioInput = labelElement ? labelElement.previousElementSibling.querySelector('input[type="radio"]') : null;
//                 const isChecked = radioInput ? radioInput.checked : false;
//                 const answerText = el.innerText.trim();
//                 return answerText ? { text: answerText, isChecked } : null;
//             })
//             .filter(answer => answer !== null)
//             .map((answer, idx) => {
//                 const prefix = `${answer.isChecked ? "*" : ""}${String.fromCharCode(65 + idx)}. `;
//                 return prefix + answer.text;
//             });
//     }

//     // Xử lý câu hỏi dạng checkbox
//     if (isCheckboxQuestion) {
//         const answerElementsCheckbox = document.querySelectorAll(".question-type-check-box__answer-content p");
//         answers = Array.from(answerElementsCheckbox)
//             .map((el, idx) => {
//                 const labelElement = el.closest("label");
//                 const checkboxInput = labelElement ? labelElement.querySelector('input[type="checkbox"]') : null;
//                 const isChecked = checkboxInput ? checkboxInput.checked : false;
//                 const answerText = el.innerText.trim();
//                 return answerText ? { text: answerText, isChecked } : null;
//             })
//             .filter(answer => answer !== null)
//             .map((answer, idx) => {
//                 const prefix = `${answer.isChecked ? "*" : ""}${String.fromCharCode(65 + idx)}. `;
//                 return prefix + answer.text;
//             });
//     }

//     // Gửi dữ liệu về popup hoặc background script
//     chrome.runtime.sendMessage({ question: questionText, answers });

//     return { question: questionText, answers };
// })();

// (() => {
//     const questionElement = document.querySelector(".present-single-question__direction");
//     const questionParagraphs = questionElement ? questionElement.querySelectorAll("p") : [];
//     const questionText = "Các tiêu chí cần thẩm định đối với các NEEDs là gì? (chọn 3 đáp án đúng)";
//     return { question: questionText };
// })();
// (() => {
//     // Trích xuất câu hỏi
//     const questionElement = document.querySelector(".present-single-question__direction");
//     const questionParagraphs = questionElement ? questionElement.querySelectorAll("p") : [];
//     const questionText = Array.from(questionParagraphs).map(p => p.innerText.trim()).join(" ");

//     // Kiểm tra kiểu câu hỏi (radio hoặc checkbox)
//     const isRadioQuestion = document.querySelector(".question-type-radio__answer-content p") !== null;
//     const isCheckboxQuestion = document.querySelector(".question-type-check-box__answer-content p") !== null;

//     // Xử lý câu hỏi dạng radio
//     let answers = [];
//     if (isRadioQuestion) {
//         const answerElementsRadio = document.querySelectorAll(".question-type-radio__answer-content p");
//         answers = Array.from(answerElementsRadio)
//             .map((el, idx) => {
//                 const labelElement = el.closest("label");
//                 const radioInput = labelElement ? labelElement.previousElementSibling.querySelector('input[type="radio"]') : null;
//                 const isChecked = radioInput ? radioInput.checked : false;
//                 const prefix = isChecked ? "*" : ""; // Thêm dấu * nếu được chọn
//                 const answerText = el.innerText.trim();
//                 return answerText ? `${prefix}${String.fromCharCode(65 + idx)}. ${answerText}` : null;
//             })
//             .filter(answer => answer !== null);
//     }

//     //Xử lý câu hỏi dạng checkbox
//     if (isCheckboxQuestion) {
//         const answerElementsCheckbox = document.querySelectorAll(".question-type-check-box__answer-content p");
//         answers = Array.from(answerElementsCheckbox)
//             .map((el, idx) => {
//                 const labelElement = el.closest("label");
//                 const checkboxInput = labelElement ? labelElement.querySelector('input[type="checkbox"]') : null;
//                 const isChecked = checkboxInput ? checkboxInput.checked : false;
//                 const prefix = isChecked ? "*" : ""; // Thêm dấu * nếu được chọn
//                 const answerText = el.innerText.trim();
//                 return answerText ? `${prefix}${String.fromCharCode(65 + idx)}. ${answerText}` : null;
//             })
//             .filter(answer => answer !== null);
//     }
   
    
    

//     // Gửi dữ liệu về popup hoặc background script
//     chrome.runtime.sendMessage({ question: questionText, answers });

//     return { question: questionText, answers };
// })();
(() => {
    // Trích xuất câu hỏi
    const questionElement = document.querySelector(".present-single-question__direction");
    const questionParagraphs = questionElement ? questionElement.querySelectorAll("p") : [];
    const questionText = Array.from(questionParagraphs).map(p => p.innerText.trim()).join(" ");

    // Kiểm tra kiểu câu hỏi (radio hoặc checkbox)
    const isRadioQuestion = document.querySelector(".question-type-radio__option") !== null;
    const isCheckboxQuestion = document.querySelector(".question-type-check-box__answer-content p") !== null;

    let answers = [];
    if (isRadioQuestion) {
        // Xử lý câu hỏi dạng radio
        const answerElementsRadio = document.querySelectorAll(".question-type-radio__option");

        answers = Array.from(answerElementsRadio)
            .map(el => {
                const prefix = el.getAttribute("data-ictu-question-prefix");
                const isChecked = el.querySelector('input[type="radio"]').checked;
                const textElements = el.querySelectorAll("p");
                const answerText = Array.from(textElements).map(p => p.innerText.trim()).join(" ");
                return answerText ? `${isChecked ? "*" : ""}${prefix}. ${answerText}` : null;
            })
            .filter(answer => answer !== null);
    }

    if (isCheckboxQuestion) {
        // Xử lý câu hỏi dạng checkbox
        const answerElementsCheckbox = document.querySelectorAll(".question-type-check-box__answer-content p");
        answers = Array.from(answerElementsCheckbox)
            .map((el, idx) => {
                const labelElement = el.closest("label");
                const checkboxInput = labelElement ? labelElement.querySelector('input[type="checkbox"]') : null;
                const isChecked = checkboxInput ? checkboxInput.checked : false;
                const prefix = isChecked ? "*" : ""; // Thêm dấu * nếu được chọn
                const answerText = el.innerText.trim();
                return answerText ? `${prefix}${String.fromCharCode(65 + idx)}. ${answerText}` : null;
            })
            .filter(answer => answer !== null);
    }

    // Gửi dữ liệu về popup hoặc background script
    chrome.runtime.sendMessage({ question: questionText, answers });
    return { question: questionText, answers };
})();




