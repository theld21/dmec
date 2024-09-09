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

        const uploadPack = document.querySelector("#uploadPack");
        let dataSource = rows.map((row) => row[headers.length - 1].trim());
        dataSource = [...new Set(dataSource)];

        dataSource.forEach((value) => {
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
          uploadPack.appendChild(group);
        });
      };
      reader.readAsText(file);
    });

  document.getElementById("startBtn").addEventListener("click", async () => {
    const groupFile = document.getElementsByClassName("group-upload");
    var fileGroups = {};

    Array.from(groupFile).map((group) => {
      let fileObject = {};
      Array.from(group.getElementsByTagName("input")).forEach((input) => {
        if (input.type === "file" && input.files.length) {
          const file = input.files[0];
          let reader = new FileReader();
          reader.onload = function (e) {
            let bufferData = new Uint8Array(reader.result);
            fileObject[input.name] = {
              buffer: bufferData,
              name: file.name,
              type: file.type,
            };
          };
          reader.readAsArrayBuffer(file);
        }
      });
      fileGroups[group.getAttribute("target")] = fileObject;
    });

    console.log(fileGroups);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: changeContent,
        args: [csv, fileGroups],
      });
    });
  });
});

function start(csv) {}

function changeContent(csv, fileGroups) {
  console.log(fileGroups);

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
  let _isLoaded = () => {
    return !_form().find(".loadingmask-message:visible").length;
  };
  let _isDone = () => {
    return !$("#addChungLoaiMaPopup").hasClass("modal-focused");
  };

  async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function fillData(item) {
    // let bufferData = fileGroups[item.filePatch];

    // for (var key in bufferData) {
    //   if (!bufferData.hasOwnProperty(key)) continue;
    //   let targetInputFile = null;
    //   switch (key) {
    //     case "fileTaiLieuKyThuat":
    //       targetInputFile = _fileTaiLieuKyThuat();
    //       break;
    //     case "fileTaiLieuHuongDan":
    //       targetInputFile = _fileTaiLieuHuongDan();
    //       break;
    //     case "fileTaiLieuHuongDanVn":
    //       targetInputFile = _fileTaiLieuHuongDanVn();
    //       break;
    //     case "fileMauNhan":
    //       targetInputFile = _fileMauNhan();
    //       break;
    //   }

    //   const { buffer, name, type } = bufferData;
    //   const file = new File([buffer], name, { type: type });
    //   const dataTransfer = new DataTransfer();
    //   dataTransfer.items.add(file);

    //   targetInputFile[0].files = dataTransfer.files;
    //   targetInputFile.trigger("change");
    // }

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
    // _addMoreBtn.click();
    // await waitUntil(_isLoaded);
    // fillData(dataSource[0]);
    // await waitUntil(_isDone);
    // return true;

    for (const item of dataSource) {
      _addMoreBtn.click();

      await sleep(1000);

      while (!_isLoaded()) {
        await sleep(1000);
      }

      fillData(item);

      // let files = [
      //   _fileTaiLieuKyThuat().first(),
      //   _fileTaiLieuHuongDan().first(),
      //   _fileTaiLieuHuongDanVn().first(),
      //   _fileMauNhan().first(),
      // ];

      console.log("3s");

      await sleep(3000);
      let a = _fileTaiLieuKyThuat().get(0);
      a.click();

      console.log(a);

      // while (_fileTaiLieuKyThuat().files.length == 0) {
      //   await sleep(1000);
      // }
      await sleep(1000);

      while (!_isDone()) {
        await sleep(1000);
      }
      await sleep(1000);
    }
  };

  startCode();
}
