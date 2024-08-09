// content.js
function changeButtonColor() {
  const button = $('input[type=button][value="Thêm chủng loại/mã sản phẩm"]');
  if (button.length > 0) {
    button.css("background-color", "red");
    console.log("Button color changed to red:", button);
  } else {
    console.log("Button not found.");
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "changeColor") {
    changeButtonColor();
    sendResponse({ status: "done" });
  }
});
