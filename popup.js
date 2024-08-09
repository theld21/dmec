// A minimal popup script for a manifest v3 Chrome extension.
// Add your popup logic here.

document.addEventListener("DOMContentLoaded", function () {
  const alertButton = document.getElementById("alertButton");

  alertButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: changeContent,
      });
    });
  });
});

function changeContent() {
  let _addMoreBtn = $(
    'input[type=button][value="Thêm chủng loại/mã sản phẩm"]'
  );
  let _form = () => {
    return $("#addChungLoaiMaPopup_iframe_").contents();
  };
  let _deviceName = () => {
    return _form().find("[id$='_tenThietBi']");
  };
  let _saleName = () => {
    return _form().find("[id$='_tenThuongMai']");
  };
  let _quality = () => {
    return _form().find("[id$='_tieuChuanApDung']");
  };
  let _type = () => {
    return _form().find("[id$='_chungLoaiTB']");
  };
  let _pack = () => {
    return _form().find("[id$='_quyCachDongGoi']");
  };
  let _code = () => {
    return _form().find("[id$='_maTB']");
  };
  let _addFactoryBtn = () => {
    return _form().find('input[type=button][value="Thêm cơ sở sản xuất"]');
  };
  let _factoryName = (index) => {
    return _form().find(`[id$='_dsCoSoSx.ten_${index}']`);
  };
  let _factoryAddress = (index) => {
    return _form().find(`[id$='_dsCoSoSx.diachi_${index}']`);
  };
  let _factoryCountry = (index) => {
    return _form().find(`[id$='_dsCoSoSx.nuocsx_${index}']`);
  };
  let _updateCountry = (index, name) => {
    _factoryCountry().find("option");
  };
  let _isLoaded = () => {
    console.log(111, _form().find(".loadingmask-message:visible").length);
    return !_form().find(".loadingmask-message:visible").length;
  };

  const waitUntil = (f) => {
    return new Promise((resolve) => {
      const intervalId = setInterval(() => {
        if (f()) {
          clearInterval(intervalId);
          resolve();
        }
      }, 1000);
    });
  };

  function test() {
    _deviceName().val("bơm tiêm trâu");
    _saleName().val("bơm tiêm gà");
    _quality().val("Tiêu chuẩn của NSX");
    _type().val("Chủng loại 1");
    _pack().val("30 cái/hộp");
    _code().val("ldt1234");
    _addFactoryBtn().click();
    _factoryName(0).val("Cơ sở 1");
    _factoryAddress(0).val("Số 123");
  }

  _addMoreBtn.click();
  waitUntil(_isLoaded).then(() => test());
}
