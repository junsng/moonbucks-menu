const BASE_URL = "http://localhost:3000/api";

const MenuApi = {
  async getAllMenuByCategory(category) {
    // return await fetch(`${BASE_URL}/category/${category}/menu`).then((res) => {
    //   return res.json();
    // });
    const response = await fetch(`${BASE_URL}/category/${category}/menu`);
    return response.json();
  },
  async createMenu(category, name) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      alert("에러 발생했습니다.");
      console.error("createMenu error !!");
      return;
    }

    const data = await response.json();
    console.log(data);
  },
  async updateMenu(category, name, id) {
    const response = await fetch(
      `${BASE_URL}/category/${category}/menu/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      }
    );
    if (!response.ok) {
      console.error("updateMenu error");
      return;
    }
    const data = await response.json();
    console.log("data :: ", data);
  },

  //메뉴 품절처리
  async toggleSoldOutMenu(category, id) {
    const response = await fetch(
      `${BASE_URL}/category/${category}/menu/${id}/soldout`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      console.error("soldout toggle error");
      return;
    }
    console.log("response : ", response.json());
  },

  async removeMenu(category, id) {
    const response = await fetch(
      `${BASE_URL}/category/${category}/menu/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      console.error("delete error");
      return;
    }
  },
};

export default MenuApi;
