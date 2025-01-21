import { useState, useEffect } from "react";
import axios from "axios";

import "./assets/style.css";

import Login from "./components/Login";
import ProductList from "./components/ProductList";
import ProductModal from "./components/ProductModal";

const API_BASE = "https://ec-course-api.hexschool.io/v2";
const API_PATH = "book-rental";

export default function App() {
  const [isAuth, setIsAuth] = useState(false); // 記錄使用者是否登入
  const [products, setProducts] = useState([]); // 產品清單
  const [pagination, setPagination] = useState(null); // 分頁資訊
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

  /**
   * handleModalInputChange - 處理 Modal 表單的輸入變更
   * @param {Event} event - 表單輸入事件
   */
  const handleModalInputChange = (event) => {
    const { id, value, type, checked } = event.target;

    setTemplateData((prevData) => ({
      ...prevData,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  /**
   * handleAddImage - 新增圖片網址
   */
  const handleAddImage = () => {
    setTemplateData((prevData) => ({
      ...prevData,
      imagesUrl: [...(prevData.imagesUrl || []), ""],
    }));
  };

  /**
   * handleRemoveImage - 移除最後一張圖片網址
   */
  const handleRemoveImage = () => {
    setTemplateData((prevData) => ({
      ...prevData,
      imagesUrl: prevData.imagesUrl.slice(0, -1),
    }));
  };

  /**
   * handleImageChange - 更新指定圖片網址
   * @param {number} index - 圖片索引
   * @param {string} value - 圖片網址
   */
  const handleImageChange = (index, value) => {
    setTemplateData((prevData) => {
      const updatedImagesUrl = [...prevData.imagesUrl];
      updatedImagesUrl[index] = value;
      return {
        ...prevData,
        imagesUrl: updatedImagesUrl,
      };
    });
  };

  /**
   * fetchProducts - 取得產品清單
   * @param {number} page - 頁碼（預設為 1）
   */
  const fetchProducts = async (page = 1) => {
    try {
      const response = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products?page=${page}`
      );
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error(
        "取得產品資料失敗:",
        error.response?.data?.message || error.message
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
      fetchProducts(); // 初次驗證成功後載入產品清單
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
      setModalType("");
      fetchProducts(); // 更新成功後重新取得產品列表
    } catch (err) {
      console.error("操作失敗:", err.response?.data?.message || err.message);
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
      setModalType("");
      fetchProducts(); // 刪除成功後重新取得產品列表
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
          <ProductList
            openModal={openModal}
            setIsAuth={setIsAuth}
            products={products}
            pagination={pagination}
            fetchProducts={fetchProducts}
          />
          <ProductModal
            modalType={modalType}
            handleModalInputChange={handleModalInputChange}
            handleImageChange={handleImageChange}
            handleAddImage={handleAddImage}
            handleRemoveImage={handleRemoveImage}
            templateData={templateData}
            closeModal={closeModal}
            updateProductData={updateProductData}
            delProductData={delProductData}
            fetchProducts={fetchProducts}
          />
        </div>
      ) : (
        <Login setIsAuth={setIsAuth} />
      )}
    </>
  );
}
