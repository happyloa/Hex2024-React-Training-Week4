import { useState, useEffect } from "react";
import axios from "axios";

import "./assets/style.css";

import Login from "./components/Login";
import ProductList from "./components/ProductList";
import ProductModal from "./components/ProductModal";
import Pagination from "./components/Pagination";

const API_BASE = "https://ec-course-api.hexschool.io/v2";
const API_PATH = "book-rental";

/**
 * App - 主應用程式元件
 */
export default function App() {
  const [isAuth, setIsAuth] = useState(false); // 記錄使用者是否登入
  const [products, setProducts] = useState([]); // 產品清單
  const [pagination, setPagination] = useState({
    total_pages: 1,
    current_page: 1,
    has_pre: false,
    has_next: false,
  }); // 分頁資訊
  const [templateData, setTemplateData] = useState({
    id: "",
    imageUrl: "",
    title: "",
    category: "",
    tags: "",
    unit: "",
    origin_price: "",
    price: "",
    description: "",
    content: "",
    is_enabled: false,
    imagesUrl: [],
  }); // Modal 表單資料
  const [modalType, setModalType] = useState(""); // Modal 類型 ("edit" | "new" | "delete")

  const handleModalInputChange = (event) => {
    const { id, value, type, checked } = event.target;

    setTemplateData((prevData) => ({
      ...prevData,
      [id]:
        id === "tags"
          ? value // 將 tags 作為純字串儲存，後續處理
          : type === "checkbox"
          ? checked
          : value,
    }));
  };

  /**
   * getProductData - 取得產品資料
   * @param {number} page - 頁碼（預設為 1）
   */
  const getProductData = async (page = 1) => {
    try {
      const response = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products?page=${page}`
      );
      setProducts(response.data.products); // 更新產品清單
      setPagination(response.data.pagination); // 更新分頁資訊
    } catch (err) {
      console.error(
        "取得產品資料失敗:",
        err.response?.data?.message || err.message
      );
    }
  };

  /**
   * checkAdmin - 驗證使用者是否登入
   */
  const checkAdmin = async () => {
    try {
      await axios.post(`${API_BASE}/api/user/check`);
      setIsAuth(true);
      getProductData(); // 初次載入第 1 頁的產品資料
    } catch (err) {
      console.error("驗證失敗:", err.response?.data?.message || err.message);
      setIsAuth(false);
    }
  };

  /**
   * useEffect - 初始化驗證登入狀態並設定預設 header
   */
  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common.Authorization = token;
    checkAdmin();
  }, []);

  /**
   * openModal - 開啟 Modal
   * @param {Object} product - 編輯的產品資料，或空物件（新增時）
   * @param {string} type - Modal 的類型 ("edit" | "new" | "delete")
   */
  const openModal = (product, type) => {
    setTemplateData({
      id: product.id || "",
      imageUrl: product.imageUrl || "",
      title: product.title || "",
      category: product.category || "",
      tags: Array.isArray(product.tags)
        ? product.tags.join(", ")
        : product.tags || "",
      unit: product.unit || "",
      origin_price: product.origin_price || "",
      price: product.price || "",
      description: product.description || "",
      content: product.content || "",
      is_enabled: product.is_enabled || false,
      imagesUrl: product.imagesUrl || [],
    });
    setModalType(type);
  };

  /**
   * closeModal - 關閉 Modal
   */
  const closeModal = () => {
    setModalType("");
  };

  /**
   * updateProductData - 新增或更新產品資料
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
        origin_price: Number(templateData.origin_price),
        price: Number(templateData.price),
        is_enabled: templateData.is_enabled ? 1 : 0,
        imagesUrl: templateData.imagesUrl,
        tags:
          typeof templateData.tags === "string"
            ? templateData.tags.split(",").map((tag) => tag.trim())
            : templateData.tags,
      },
    };

    try {
      if (modalType === "edit") {
        await axios.put(url, productData);
        console.log("產品更新成功");
      } else {
        await axios.post(url, productData);
        console.log("產品新增成功");
      }
      setModalType(""); // 關閉 Modal
      getProductData(pagination.current_page); // 重新載入當前頁的產品清單
    } catch (err) {
      console.error(
        modalType === "edit" ? "更新失敗:" : "新增失敗:",
        err.response?.data?.message || err.message
      );
    }
  };

  /**
   * delProductData - 刪除產品資料
   * @param {string} id - 產品 ID
   */
  const delProductData = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/admin/product/${id}`);
      console.log("產品刪除成功");
      setModalType(""); // 關閉 Modal
      getProductData(pagination.current_page); // 重新載入當前頁的產品清單
    } catch (err) {
      console.error(
        "刪除產品失敗:",
        err.response?.data?.message || err.message
      );
    }
  };

  return (
    <>
      {isAuth ? (
        <div className="container mt-4">
          {/* 顯示產品清單 */}
          <ProductList
            products={products}
            openModal={openModal}
            setIsAuth={setIsAuth}
          />
          {/* 顯示分頁 */}
          <Pagination pagination={pagination} changePage={getProductData} />
          {/* 顯示產品操作 Modal */}
          <ProductModal
            modalType={modalType}
            handleModalInputChange={handleModalInputChange}
            templateData={templateData}
            closeModal={closeModal}
            updateProductData={updateProductData}
            delProductData={delProductData}
          />
        </div>
      ) : (
        <Login setIsAuth={setIsAuth} />
      )}
    </>
  );
}
