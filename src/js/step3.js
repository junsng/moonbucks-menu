import { $ } from "./utils/dom.js";
//import store from "./store/index.js";
import MenuApi from "./api/index.js";

// [X] 링크에 있는 웹 서버 저장소를 clone하여 로컬에서 웹 서버를 실행시킨다.
// [x] 웹 서버를 띄워서 실제 서버에 데이터의 변경을 저장하는 형태로 리팩터링한다.
// - [x] localStorage에 저장하는 로직은 지운다.
// - [x] fetch 비동기 api를 사용하는 부분을 async await을 사용하여 구현한다.
// - [x] API 통신이 실패하는 경우에 대해 사용자가 알 수 있게 alert으로 예외처리를 진행한다.
// [x] 중복되는 메뉴는 추가할 수 없다.

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

  this.init = async () => {
    render();
    menuEventListener();
  };

  const render = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );

    const template = this.menu[this.currentCategory]
      .map((item, idx) => {
        return `<li data-menu-id="${
          item.id
        }" class="menu-list-item d-flex items-center py-2">
      <span class="w-100 pl-2 menu-name ${item.isSoldOut ? "sold-out" : ""}">${
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
    $("#menu-list").innerHTML = template;

    menuCount();
  };

  const addMenuItem = async () => {
    const menuName = $("#menu-name").value;
    if (menuName.trim() === "") return;

    const duplicatedMenu = this.menu[this.currentCategory].find(
      (e) => e.name === menuName
    );
    if (duplicatedMenu) {
      alert("이미 등록된 메뉴입니다.");
      $("#menu-name").value = "";
      return;
    }

    await MenuApi.createMenu(this.currentCategory, menuName);
    render();
    $("#menu-name").value = "";
  };

  const updateMenuName = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정하세요.", $menuName.innerText);
    if (updatedMenuName) {
      await MenuApi.updateMenu(this.currentCategory, updatedMenuName, menuId);
      render();
    }
  };

  const removeMenuName = async (e) => {
    if (confirm(`정말 삭제하시겠습니까?`)) {
      const menuId = e.target.closest("li").dataset.menuId;
      await MenuApi.removeMenu(this.currentCategory, menuId);
      render();
    }
  };

  const soldoutMenuName = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    await MenuApi.toggleSoldOutMenu(this.currentCategory, menuId);
    render();
  };

  const menuCount = () => {
    const menuCountValue = document.querySelector(".menu-count");
    let count = document.querySelector("#menu-list").children.length;
    menuCountValue.textContent = `총 ${count}개`;
  };

  const changeCategory = async (e) => {
    const isButton = e.target.classList.contains("cafe-category-name");
    if (isButton) {
      const categoryName = e.target.dataset.categoryName;
      this.currentCategory = categoryName;
      $("#menu-header").innerText = `${e.target.innerText} 메뉴 관리`;
      render();
    }
  };

  const menuEventListener = () => {
    $("#menu-form").addEventListener("submit", (e) => {
      e.preventDefault();
    });

    $("#menu-name").addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        addMenuItem();
      }
    });

    $("#menu-submit-button").addEventListener("click", addMenuItem);

    $("#menu-list").addEventListener("click", (e) => {
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

    $("nav").addEventListener("click", changeCategory);
  };
}

const app = new App();
app.init();
