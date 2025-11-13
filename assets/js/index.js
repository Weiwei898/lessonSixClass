const ticketList = document.querySelector('.ticketList');
//篩選區域監聽事件
const searchBox = document.querySelector('.searchBox');//宣告DOM篩選區域
const cardCityNumEl = document.querySelector('.cardCityNum');//宣告DOM卡片數量
const cantFindAreaEl = document.querySelector('#cantFindArea');//宣告DOM篩選不到渲染的內容
const addBtn = document.querySelector('#addTicketBtn');
const addForm = document.querySelector('.addTicketForm');
const productsUrl ="https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json";
let data = []; //放入API資料用空陣列

  //串接匯入產品API
  axios.get(productsUrl)
    .then((response)=>{
      data = response.data.data;
      // 成功會回傳的內容
      filterAndRender('allCity'); // 初次載入時顯示全部卡片
    })
    .catch((error) =>{
      // 失敗會回傳的內容
      console.log(error);
  })



function getNextId() {
  return data.length ? Math.max(...data.map(i => i.id)) + 1 : 0;
  //三元運算子 (條件 ? 結果 A : 結果 B) 來處理兩種情況
  //檢查data.length(長度)
  //map 函式遍歷 data 陣列中的每個元素 (i)。
  //...(展開運算子, Spread Operator)將上一步生成的 ID 陣列展開成一個參數序列
  //Math.max 接收多個數字，回傳最大值
  //所以最大值+1
  //: 0  如果是空的 (沒有資料)， 就直接回傳 0。
}

function createTicketElement(item) {
  const li = document.createElement('li');
  li.className = 'ticketCard col-4 g-8';
  li.dataset.city = item.area;
  li.innerHTML = `
    <div class="bg-neutral-0 shadow-sm h-100">
      <div class="ticketCard-img position-relative">
        <a href="#">
          <img src="${item.imgUrl}" alt="${item.name}">
        </a>
        <div class="text-center text-neutral-0 fs-5 bg-primary-300 ticketCard-region position-absolute">${item.area}</div>
        <div class="text-center text-neutral-0 bg-primary-400 ticketCard-rank position-absolute">${item.rate}</div>
      </div>
      <div class="ticketCard-content py-6 px-5">
        <div class="mb-6">
          <h3 class="fw-medium border-bottom border-2 pb-1 border-primary-400 mb-4">
            <a href="#" class="ticketCard-name">${item.name}</a>
          </h3>
          <p class="ticketCard-description text-neutral-600">
            ${item.description}
          </p>
        </div>
        <div class="ticketCard-info text-primary-400 d-flex justify-content-between ">
          <p class="ticketCard-num fw-medium d-flex align-items-center gap-1">
            <span><i class="bi bi-exclamation-circle-fill"></i></span>
            剩下最後 <span id="ticketCard-num">${item.group}</span> 組
          </p>
          <p class="ticketCard-price fw-medium d-flex align-items-center gap-1">
            TWD $<span id="ticketCard-price" class="fw-medium fs-2 ">${item.price}</span>
          </p>
        </div>
      </div>
    </div>
  `;
  return li;
}

//將data內的id的資料顯示作為套票卡片新增在html裡
function renderTicketList(filteredData) {
  if (!ticketList) return; // 確保 ticketList 存在
    ticketList.innerHTML = ''; // 清空現有列表
    // 如果沒有資料，直接清空並退出渲染
    if (filteredData.length === 0) {
        updateCardCount(0);
        return; 
    }
    filteredData.forEach(item => {
        const li = createTicketElement(item);
        ticketList.appendChild(li);
        //.appendChild(li) 的意思就是把 li 這個「孩子」，加到 ticketList 這個「父親」的下面(最尾端)
        //概念上與Arry.push 很像一個作用在陣列，一個作用在DOM
    });
    // 呼叫 updateCardCount 函式來更新筆數顯示
    updateCardCount(filteredData.length);
}

//updateCardCount 是一個函式，用來更新顯示的票卡數量。
function updateCardCount(count) {
  if (cardCityNumEl) cardCityNumEl.textContent = count;
}

// 篩選並渲染的統一函式**
function filterAndRender(selectedCity) {
    // 1. 篩選資料
    const filteredData = data.filter(item => {
      const filterKey = selectedCity === '地區搜尋' ? 'allCity' : selectedCity;
      return filterKey === 'allCity' || item.area === filterKey;
    });

    // 2. 渲染篩選後的資料
    renderTicketList(filteredData);

    // 3. **新增：控制「查無資料」區域的顯示**
    if (cantFindAreaEl) {
        if (filteredData.length === 0) {
            // 如果沒有資料：隱藏卡片列表，顯示查無資料區
            ticketList.style.display = 'none';
            cantFindAreaEl.style.display = 'block';
            updateCardCount(0); // 確保筆數顯示為 0
        } else {
            // 如果有資料：顯示卡片列表，隱藏查無資料區
            ticketList.style.display = 'flex';
            cantFindAreaEl.style.display = 'none';
        }
      }
}

//新增套票
function addTicket(item) {
  item.id = getNextId();
  // push 到 data
  data.push(item);

  //根據目前的篩選條件來重新渲染整個列表
  const currentFilter = (searchBox && searchBox.value) ? searchBox.value : 'allCity';
  filterAndRender(currentFilter);

}


// 將 data 新增項目，並輸出成 ticketCard 加入畫面，會配合當前篩選顯示狀態與更新筆數
if (addBtn) {
  addBtn.addEventListener('click', e => {
    // 取消瀏覽器對特定事件的預設處理方式，執行自己的程式碼
    e.preventDefault();
    const nameEl = document.querySelector('#ticketName');
    const imgEl = document.querySelector('#ticketImgUrl');
    const areaEl = document.querySelector('#ticketRegion');
    const descEl = document.querySelector('#ticketDescription');
    const groupEl = document.querySelector('#ticketNum');
    const priceEl = document.querySelector('#ticketPrice');
    const rateEl = document.querySelector('#ticketRate');

    // 取得所有錯誤訊息顯示區 (用於清除前一次的提示)
    const messageElements = document.querySelectorAll('.alert-message p');

    let isValid = true;

    //清空所有舊的錯誤提示
    messageElements.forEach(p => p.innerHTML = '');

    //未輸入資籵的提示
    if (!nameEl.value.trim()) {
      document.querySelector('#ticketName-message').innerHTML = `<i class="bi bi-exclamation-circle-fill"></i>套票名稱<span>必填!</span>`;
      isValid = false;
    }
    if (!imgEl.value.trim()) {
      document.querySelector('#ticketImgUrl-message').innerHTML = `<i class="bi bi-exclamation-circle-fill"></i>圖片網址<span>必填!</span>`;
      isValid = false;
    }
    if (areaEl.value === "") {
      document.querySelector('#ticketRegion-message').innerHTML = `<i class="bi bi-exclamation-circle-fill"></i>景點地區<span>必選!</span>`;
      isValid = false;
    }
    const priceVal = Number(priceEl.value);
    if (!priceEl.value.trim() || priceVal < 0 || isNaN(priceVal)) {
      document.querySelector('#ticketPrice-message').innerHTML = `<i class="bi bi-exclamation-circle-fill"></i>套票金額<span>必填且需 ≥ 0 的數字!</span>`;
      isValid = false;
    }
    const groupVal = Number(groupEl.value);
    if (!groupEl.value.trim() || groupVal < 0 || isNaN(groupVal)) {
      document.querySelector('#ticketNum-message').innerHTML = `<i class="bi bi-exclamation-circle-fill"></i>套票組數<span>必填且需 ≥ 0 的數字!</span>`;
      isValid = false;
    }
    const rateVal = Number(rateEl.value);
    if (!rateEl.value.trim() || rateVal < 0 || rateVal > 10 || isNaN(rateVal)) {
      document.querySelector('#ticketRate-message').innerHTML = `<i class="bi bi-exclamation-circle-fill"></i>套票星級<span>必填且需在 0-10 之間!</span>`;
      isValid = false;
    }
    if (!descEl.value.trim()) {
      document.querySelector('#ticketDescription-message').innerHTML = `<i class="bi bi-exclamation-circle-fill"></i>套票描述<span>必填!</span>`;
      isValid = false;
    }  
    if (!isValid) {
      return;
    }

    const newItem = {
      name: nameEl.value.trim(),
      // 存入顯示名稱（createTicketElement 會用 cityKey 轉成 dataset）
      imgUrl: imgEl.value.trim(),
      area: areaEl.value.trim(), 
      description: descEl ? descEl.value.trim() : '',
      group: groupEl ? Number(groupEl.value) || 0 : 0,
      price: priceEl ? Number(priceEl.value) || 0 : 0,
      rate: rateEl ? Number(rateEl.value) || 0 : 0
    };

    addTicket(newItem);

    // 清空表單
    if (addForm) addForm.reset();
    
  });
}

//篩選區域切換卡片
if (searchBox) {
    searchBox.addEventListener('change', e => {
        const selectedCity = e.target.value;
        filterAndRender(selectedCity);
    });
}

// 頁面啟動時：初始化顯示全部卡片和計數
// 注意：searchBox 的初始值是 "地區搜尋"，這不是 'allCity'
// 所以這裡要用一個固定的值來初始化
filterAndRender('allCity'); // 預設顯示全部資料




