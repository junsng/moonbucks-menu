const BASE_URL = "http://localhost:3000/api";

const request = async (url, option) => {
  try {
    const response = await fetch(url, option);
    if (!response.ok) {
      alert("에러가 발생했습니다.");
      //console.error(e);
    }
    // 응답 본문이 있을 경우에만 JSON을 반환, 없으면 null 반환
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }
  } catch (error) {
    alert("network error");
    console.error("Error : ", error);
    return null;
  }
};

const requestWithoutResponse = async (url, option) => {
  const response = await fetch(url, option);
  if (!response.ok) {
    alert("오류발생");
  }
  return response;
};

const HTTP_METHOD = {
  POST(data) {
    return {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  },
  PUT(data) {
    return {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : null,
    };
  },
  DELETE() {
    return {
      method: "DELETE",
    };
  },
};

const MenuApi = {
  getAllMenuByCategory(category) {
    // * 1
    // return await fetch(`${BASE_URL}/category/${category}/menu`).then((res) => {
    //   return res.json();
    // });
    // * 2
    // const response = await fetch(`${BASE_URL}/category/${category}/menu`);
    // return response.json();
    // * 3
    return request(`${BASE_URL}/category/${category}/menu`);
  },
  createMenu(category, name) {
    // const response = await fetch(`${BASE_URL}/category/${category}/menu`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ name }),
    // });

    // if (!response.ok) {
    //   alert("에러 발생했습니다.");
    //   console.error("createMenu error !!");
    //   return;
    // }
    // const data = await response.json();
    // console.log(data);

    return request(
      `${BASE_URL}/category/${category}/menu`,
      HTTP_METHOD.POST({ name })
    );
  },
  updateMenu(category, name, id) {
    return request(
      `${BASE_URL}/category/${category}/menu/${id}`,
      HTTP_METHOD.PUT({ name })
    );
  },
  toggleSoldOutMenu(category, id) {
    return request(
      `${BASE_URL}/category/${category}/menu/${id}/soldout`,
      HTTP_METHOD.PUT()
    );
  },
  removeMenu(category, id) {
    return request(
      `${BASE_URL}/category/${category}/menu/${id}`,
      HTTP_METHOD.DELETE()
    );
    // const response = await fetch(
    //   `${BASE_URL}/category/${category}/menu/${id}`,
    //   {
    //     method: "DELETE",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );
    // if (!response.ok) {
    //   console.error("delete error");
    //   return;
    // }
  },
};

export default MenuApi;
