document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("tsvFile")
    .addEventListener("change", function (event) {
      let file = event.target.files[0];
      if (!file) {
        return;
      }
      let reader = new FileReader();
      reader.onload = function (e) {
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
                input.setAttribute("name", "urlTaiLieuKyThuat");
                break;
              case 1:
                input.setAttribute("name", "urlTaiLieuHuongDan");
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

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: test,
            args: [dataSource],
          });
        });
      };
      reader.readAsText(file);
    });

  document.getElementById("startBtn").addEventListener("click", () => {
    const groupFile = document.getElementsByClassName("group-upload");

    const fileArray = Array.from(groupFile).map((group) => {
      const fileObject = {};
      Array.from(group.getElementsByTagName("input")).forEach((input) => {
        if (input.type === "file" && input.files.length) {
          fileObject[input.name] = input.files;
        }
      });
      return fileObject;
    });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: test,
        args: [fileArray],
      });
    });
  });
});

function test(data) {
  console.log(data);
}

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
  let _isLoaded = () => {
    return !_form().find(".loadingmask-message:visible").length;
  };

  async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function waitUntil(check, interval = 1000) {
    await sleep(interval);
    do {
      await new Promise((resolve) => setTimeout(resolve, interval));
    } while (!(await check()));
  }

  function fillData(item) {
    console.log(item);

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
    console.log(listCountries);

    _factoryName(0).val(item.factoryName);
    _factoryAddress(0).val(item.factoryAddress);
    _factoryCountry(0).val(listCountries[item.factoryCountry]);
  }

  const startCode = async (f) => {
    _addMoreBtn.click();

    await waitUntil(_isLoaded);

    fillData(dataSource[0]);
    return true;
    dataSource.forEach(async (item) => {
      _addMoreBtn.click();
      await waitUntil(_isLoaded);
      fillData(item);
    });
  };

  startCode();
}
