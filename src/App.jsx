import { useState, useEffect } from "react";
import axios from "axios";

import "./assets/style.css";

import Login from "./components/Login";
import ProductList from "./components/ProductList";
import ProductModal from "./components/ProductModal";

const API_BASE = "https://ec-course-api.hexschool.io/v2";
const API_PATH = "book-rental";

/**
 * App - 主應用程式元件
 */
export default function App() {
  // 狀態管理
  const [isAuth, setisAuth] = useState(false); // 用於記錄使用者是否登入
  const [products, setProducts] = useState([]); // 用於存放產品清單
  const [templateData, setTemplateData] = useState({
    id: "",
    imageUrl: "",
    title: "",
    category: "",
    unit: "",
    origin_price: "",
    price: "",
    description: "",
    content: "",
    is_enabled: false,
    imagesUrl: [],
  }); // 用於管理 Modal 的表單資料
  const [modalType, setModalType] = useState(""); // 記錄 Modal 的類型 ("edit" | "new" | "delete")

  /**
   * getProductData - 取得產品資料
   */
  const getProductData = async () => {
    try {
      const response = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products`
      );
      setProducts(response.data.products); // 更新產品清單狀態
    } catch (err) {
      console.error(
        "取得產品資料失敗:",
        err.response?.data?.message || err.message
      );
    }
  };

  /**
   * updateProductData - 新增或更新產品資料
   *
   * @param {string} id - 產品 ID
   */
  const updateProductData = async (id) => {
    const url =
      modalType === "edit"
        ? `${API_BASE}/api/${API_PATH}/admin/product/${id}`
        : `${API_BASE}/api/${API_PATH}/admin/product`;

    const productData = {
      data: {
        ...templateData,
        origin_price: Number(templateData.origin_price), // 確保原價是數字
        price: Number(templateData.price), // 確保售價是數字
        is_enabled: templateData.is_enabled ? 1 : 0, // 將布林值轉為數字
        imagesUrl: templateData.imagesUrl, // 圖片 URL 陣列
      },
    };

    try {
      if (modalType === "edit") {
        await axios.put(url, productData); // 發送更新請求
        console.log("產品更新成功");
      } else {
        await axios.post(url, productData); // 發送新增請求
        console.log("產品新增成功");
      }
      setModalType(""); // 關閉 Modal
      getProductData(); // 重新載入產品清單
    } catch (err) {
      console.error(
        modalType === "edit" ? "更新失敗:" : "新增失敗:",
        err.response?.data?.message || err.message
      );
    }
  };

  /**
   * delProductData - 刪除產品資料
   *
   * @param {string} id - 產品 ID
   */
  const delProductData = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/admin/product/${id}`);
      console.log("產品刪除成功");
      setModalType(""); // 關閉 Modal
      getProductData(); // 重新載入產品清單
    } catch (err) {
      console.error(
        "刪除產品失敗:",
        err.response?.data?.message || err.message
      );
    }
  };

  /**
   * openModal - 開啟 Modal
   *
   * @param {Object} product - 要編輯的產品資料，或空物件（新增時）
   * @param {string} type - Modal 的類型 ("edit" | "new" | "delete")
   */
  const openModal = (product, type) => {
    setTemplateData({
      id: product.id || "",
      imageUrl: product.imageUrl || "",
      title: product.title || "",
      category: product.category || "",
      unit: product.unit || "",
      origin_price: product.origin_price || "",
      price: product.price || "",
      description: product.description || "",
      content: product.content || "",
      is_enabled: product.is_enabled || false,
      imagesUrl: product.imagesUrl || [],
    });
    setModalType(type); // 設定 Modal 類型
  };

  /**
   * closeModal - 關閉 Modal
   */
  const closeModal = () => {
    setModalType(""); // 清空 Modal 類型
  };

  /**
   * useEffect - 初始驗證登入狀態，並嘗試取得產品清單
   */
  useEffect(() => {
    // 取得 Token
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common.Authorization = token; // 設定 Axios 的授權標頭

    // 驗證使用者是否已登入
    (async () => {
      try {
        await axios.post(`${API_BASE}/api/user/check`);
        setisAuth(true); // 設定為已登入
        getProductData(); // 取得產品資料
      } catch (err) {
        console.error("驗證失敗:", err.response?.data?.message || err.message);
        setisAuth(false); // 設定為未登入
      }
    })();
  }, []); // 僅在元件初次渲染時執行

  return (
    <>
      {isAuth ? (
        <>
          {/* 顯示產品清單 */}
          <ProductList
            products={products}
            openModal={openModal}
            setisAuth={setisAuth} // 用於處理登出
          />
          {/* 顯示產品操作 Modal */}
          <ProductModal
            modalType={modalType}
            templateData={templateData}
            handleModalInputChange={(e) => {
              const { id, value, type, checked } = e.target;
              setTemplateData((prevData) => ({
                ...prevData,
                [id]: type === "checkbox" ? checked : value,
              }));
            }}
            handleImageChange={(index, value) => {
              setTemplateData((prevData) => {
                const newImages = [...prevData.imagesUrl];
                newImages[index] = value;

                // 確保新增新圖片欄位
                if (
                  value !== "" &&
                  index === newImages.length - 1 &&
                  newImages.length < 5
                ) {
                  newImages.push("");
                }

                // 移除空的圖片欄位
                if (
                  newImages.length > 1 &&
                  newImages[newImages.length - 1] === ""
                ) {
                  newImages.pop();
                }

                return { ...prevData, imagesUrl: newImages };
              });
            }}
            handleAddImage={() => {
              setTemplateData((prevData) => ({
                ...prevData,
                imagesUrl: [...prevData.imagesUrl, ""],
              }));
            }}
            handleRemoveImage={() => {
              setTemplateData((prevData) => {
                const newImages = [...prevData.imagesUrl];
                newImages.pop();
                return { ...prevData, imagesUrl: newImages };
              });
            }}
            closeModal={closeModal}
            updateProductData={updateProductData}
            delProductData={delProductData}
          />
        </>
      ) : (
        // 顯示登入頁面
        <Login setisAuth={setisAuth} getProductData={getProductData} />
      )}
    </>
  );
}
