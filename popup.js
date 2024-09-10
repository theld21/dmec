document.addEventListener("DOMContentLoaded", function () {
  let csv = null;
  document
    .getElementById("tsvFile")
    .addEventListener("change", function (event) {
      let file = event.target.files[0];
      if (!file) {
        return;
      }
      let reader = new FileReader();
      reader.onload = function (e) {
        csv = e.target.result;
        let [headers, ...rows] = e.target.result
          .trim()
          .split("\n")
          .map((row) => row.split("\t"));

        let fileGroups = rows.map((row) => row[headers.length - 1].trim());
        fileGroups = [...new Set(fileGroups)];

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: startUpload,
            args: [csv, fileGroups],
          });
        });
      };
      reader.readAsText(file);
    });
});

function startUpload(csv, fileGroups) {
  let popup = $(
    "<div><h1>Hello Hyniu</h1><small>v1.1<small><div id='upload_area'></div></div>"
  );
  popup.css({
    position: "fixed",
    top: "0",
    right: "0",
    width: "240px",
    padding: "10px",
    height: "500px",
    overflow: "auto",
    "background-color": "#fff",
    "box-shadow": "0 4px 8px rgba(0, 0, 0, 0.5)",
    padding: "20px",
    "box-sizing": "border-box",
    "z-index": "999999",
  });

  $("body").prepend(popup);

  fileGroups.forEach((value) => {
    const group = document.createElement("div");
    group.classList.add("group-upload");
    group.setAttribute("target", value);

    const title = document.createElement("h4");
    title.textContent = `Nhóm file ${value}`;
    group.appendChild(title);

    for (let i = 0; i < 4; i++) {
      const input = document.createElement("input");
      switch (i) {
        case 0:
          input.setAttribute("name", "fileTaiLieuKyThuat");
          break;
        case 1:
          input.setAttribute("name", "fileTaiLieuHuongDan");
          break;
        case 2:
          input.setAttribute("name", "fileTaiLieuHuongDanVn");
          break;
        case 3:
          input.setAttribute("name", "fileMauNhan");
          break;
      }
      input.type = "file";
      group.appendChild(input);
    }
    $("#upload_area").append(group);
  });

  let startBtn = $("<button id='startToolBtn'>Start</button>");
  $("#upload_area").append(startBtn);

  startBtn.on("click", function () {
    changeContent(csv);
  });

  function changeContent(csv) {
    const [headers, ...rows] = csv
      .trim()
      .split("\n")
      .map((row) => row.split("\t"));

    const dataSource = rows.map((row) =>
      Object.fromEntries(
        row.map((value, i) => [headers[i]?.trim(), value?.trim()])
      )
    );

    var listCountries = [];
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
    let _fileTaiLieuKyThuat = () => {
      return _form().find("input[id$='_fileTaiLieuKyThuat']:first");
    };
    let _fileTaiLieuHuongDan = () => {
      return _form().find("input[id$='_fileTaiLieuHuongDan']:first");
    };
    let _fileTaiLieuHuongDanVn = () => {
      return _form().find("input[id$='_fileTaiLieuHuongDanVn']:first");
    };
    let _fileMauNhan = () => {
      return _form().find("input[id$='_fileMauNhan']:first");
    };
    let _saveButton = () => {
      return _form().find("#saveButton");
    };
    let _isLoaded = () => {
      return !_form().find(".loadingmask-message:visible").length;
    };
    let _isDone = () => {
      return !$("#addChungLoaiMaPopup").hasClass("modal-focused");
    };

    async function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function fillData(item) {
      const groupUpload = $(`.group-upload[target=${item.filePatch}]`);

      for (const key of [
        "fileTaiLieuKyThuat",
        "fileTaiLieuHuongDan",
        "fileTaiLieuHuongDanVn",
        "fileMauNhan",
      ]) {
        let file;
        const dataTransfer = new DataTransfer();

        switch (key) {
          case "fileTaiLieuKyThuat":
            file = groupUpload.find('input[name="fileTaiLieuKyThuat"]');
            if (!file[0].files.length) break;
            dataTransfer.items.add(file[0].files?.[0]);
            _fileTaiLieuKyThuat()[0].files = dataTransfer.files;
            _fileTaiLieuKyThuat()
              .parent()
              .next(".oep-label-uploadfile")
              .text(file[0].files?.[0]?.name);
            break;

          case "fileTaiLieuHuongDan":
            file = groupUpload.find('input[name="fileTaiLieuHuongDan"]');
            if (!file[0].files.length) break;
            dataTransfer.items.add(file[0].files?.[0]);
            _fileTaiLieuHuongDan()[0].files = dataTransfer.files;
            _fileTaiLieuHuongDan()
              .parent()
              .next(".oep-label-uploadfile")
              .text(file[0].files?.[0]?.name);
            break;

          case "fileTaiLieuHuongDanVn":
            file = groupUpload.find('input[name="fileTaiLieuHuongDanVn"]');
            if (!file[0].files.length) break;
            dataTransfer.items.add(file[0].files?.[0]);
            _fileTaiLieuHuongDanVn()[0].files = dataTransfer.files;
            _fileTaiLieuHuongDanVn()
              .parent()
              .next(".oep-label-uploadfile")
              .text(file[0].files?.[0]?.name);
            break;

          case "fileMauNhan":
            file = groupUpload.find('input[name="fileMauNhan"]');
            if (!file[0].files.length) break;
            dataTransfer.items.add(file[0].files?.[0]);
            _fileMauNhan()[0].files = dataTransfer.files;
            _fileMauNhan()
              .parent()
              .next(".oep-label-uploadfile")
              .text(file[0].files?.[0]?.name);
            break;
        }
      }

      _deviceName().val(item.deviceName);
      _saleName().val(item.saleName);
      _quality().val(item.quality);
      _type().val(item.type);
      _pack().val(item.pack);
      _code().val(item.code);
      _addFactoryBtn().click();

      if (!listCountries.length) {
        listCountries = _form()
          .find(`[id$='_dsCoSoSx.nuocsx_0'] option`)
          .toArray()
          .reduce((acc, el) => {
            acc[$(el).text().trim()] = $(el).val();
            return acc;
          }, {});
      }

      _factoryName(0).val(item.factoryName);
      _factoryAddress(0).val(item.factoryAddress);
      _factoryCountry(0).val(listCountries[item.factoryCountry]);
    }

    const startCode = async (f) => {
      for (const item of dataSource) {
        _addMoreBtn.click();

        await sleep(1000);
        while (!_isLoaded()) {
          await sleep(1000);
        }

        fillData(item);
        await sleep(700);
        _saveButton().click();

        while (!_isDone()) {
          await sleep(1000);
        }
        await sleep(1000);
      }
    };

    startCode();
  }
}
