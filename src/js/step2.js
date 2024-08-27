// [x] localStorage에 데이터를 저장하여 새로고침해도 데이터가 남아있게 한다.
// [x] 에스프레소, 프라푸치노, 블렌디드, 티바나, 디저트 각각의 종류별로 메뉴판을 관리할 수 있게 만든다.
// [x] 페이지에 최초로 접근할 때는 에스프레소 메뉴가 먼저 보이게 한다.
// [x] 품절 상태인 경우를 보여줄 수 있게, 품절 버튼을 추가하고 sold-out class를 추가하여 상태를 변경한다.
// 품절 상태 메뉴의 마크업

/*
 TODO: localStorage Read & Write
 - [x] localStorage에 데이터를 저장한다.
 - [x] 메뉴를 추가할 때
 - [x] 메뉴를 수정할 때
 - [x] 메뉴를 삭제할 때
 - [x] localStorage에 있는 데이터를 읽어온다.
 
 TODO: 카테고리별 메뉴판 관리
 - [x] 에스프레소 메뉴판 관리
 - [x] 프라푸치노 메뉴판 관리
 - [x] 블렌디드 메뉴판 관리
 - [x] 티바나 메뉴판 관리
 - [x] 디저트 메뉴판 관리
 
*/
const $ = (selector) => document.querySelector(selector);

const store = {
  setLocalStorage(menu) {
    localStorage.setItem("menu", JSON.stringify(menu));
  },
  getLocalStorage() {
    return JSON.parse(localStorage.getItem("menu"));
  },
};

function App() {
  //상태는 변하는 데이터, 앱에서 변하는 것 -> 메뉴명
  //this.menu = [];
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };
  this.currentCategory = "espresso";

  this.init = () => {
    if (store.getLocalStorage()) {
      this.menu = store.getLocalStorage();
    }
    render();
  };

  const render = () => {
    const template = this.menu[this.currentCategory]
      .map((item, idx) => {
        return `<li data-menu-id="${idx}" class="menu-list-item d-flex items-center py-2">
      <span class="w-100 pl-2 menu-name ${item.soldOut ? "sold-out" : ""}">${
          item.name
        }</span>
      <button
      type="button"
      class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
      >
      품절
    </button>
      <button
        type="button"
        class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
      >
        수정
      </button>
      <button
        type="button"
        class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
      >
        삭제
      </button>
    </li>`;
      })
      .join("");
    $("#espresso-menu-list").innerHTML = template;

    menuCount();
  };

  const addMenuItem = () => {
    const espressoMenuName = $("#espresso-menu-name").value;
    if (espressoMenuName.trim() === "") return;

    this.menu[this.currentCategory].push({ name: espressoMenuName });
    store.setLocalStorage(this.menu);
    render();
    $("#espresso-menu-name").value = "";
  };

  const updateMenuName = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정하세요.", $menuName.innerText);

    this.menu[this.currentCategory][menuId].name = updatedMenuName;
    store.setLocalStorage(this.menu);

    $menuName.innerText = updatedMenuName;
  };

  const removeMenuName = (e) => {
    if (confirm(`정말 삭제하시겠습니까?`)) {
      const menuId = e.target.closest("li").dataset.menuId;
      this.menu[this.currentCategory].splice(menuId, 1);
      store.setLocalStorage(this.menu);
      e.target.closest("li").remove();
      render();
    }
  };

  const soldoutMenuName = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    this.menu[this.currentCategory][menuId].soldOut =
      !this.menu[this.currentCategory][menuId].soldOut;
    store.setLocalStorage(this.menu);
    render();
  };

  const menuCount = () => {
    const menuCountValue = document.querySelector(".menu-count");
    let count = document.querySelector("#espresso-menu-list").children.length;
    menuCountValue.textContent = `총 ${count}개`;
  };

  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  $("#espresso-menu-name").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addMenuItem();
    }
  });

  $("#espresso-menu-submit-button").addEventListener("click", addMenuItem);

  $("#espresso-menu-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-edit-button")) {
      updateMenuName(e);
      return;
    }
    if (e.target.classList.contains("menu-remove-button")) {
      removeMenuName(e);
      return;
    }

    if (e.target.classList.contains("menu-sold-out-button")) {
      soldoutMenuName(e);
      return;
    }
  });

  $("nav").addEventListener("click", (e) => {
    const isButton = e.target.classList.contains("cafe-category-name");
    if (isButton) {
      //const menuId = e.target.closest("li").dataset.menuId;
      const categoryName = e.target.dataset.categoryName;
      this.currentCategory = categoryName;

      $("#menu-header").innerText = `${e.target.innerText} 메뉴 관리`;
      render();
    }
  });
}

const app = new App();
app.init();
