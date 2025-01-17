import { useState } from "react";
import axios from "axios";

// API 的基底 URL
const API_BASE = "https://ec-course-api.hexschool.io/v2";

/**
 * Login - 用於處理使用者登入的元件
 *
 * @param {Function} setisAuth - 用於設定是否登入的狀態。
 * @param {Function} getProductData - 登入後調用以取得產品資料。
 */
export default function Login({ setisAuth, getProductData }) {
  // 管理登入表單的輸入資料
  const [formData, setFormData] = useState({
    username: "", // 使用者名稱（電子郵件）
    password: "", // 密碼
  });

  // 控制加載狀態（是否顯示 Spinner）
  const [isLoading, setIsLoading] = useState(false);

  /**
   * handleInputChange - 處理表單輸入變更。
   *
   * @param {Event} e - 輸入事件
   */
  const handleInputChange = (e) => {
    const { id, value } = e.target; // 從事件目標中解構獲取 id 和 value
    setFormData((prevData) => ({
      ...prevData, // 保留之前的狀態
      [id]: value, // 更新相應的輸入欄位
    }));
  };

  /**
   * handleSubmit - 處理表單提交。
   *
   * @param {Event} e - 表單提交事件
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // 防止表單預設行為（例如重新載入頁面）
    setIsLoading(true); // 顯示加載動畫
    try {
      // 發送 POST 請求進行登入
      const response = await axios.post(`${API_BASE}/admin/signin`, formData);

      // 確保回應有資料
      if (response && response.data) {
        const { token, expired } = response.data; // 從回應中解構 token 與 expired

        // 儲存 Token 到 cookie 並設定過期時間
        document.cookie = `hexToken=${token};expires=${new Date(expired)};`;

        // 設定 Axios 的授權標頭
        axios.defaults.headers.common.Authorization = token;

        // 呼叫 getProductData 取得產品資料
        await getProductData();

        // 設定登入狀態為 true
        setisAuth(true);
      } else {
        // 如果回應格式錯誤，拋出例外
        throw new Error("登入回應格式錯誤，缺少必要的 data 屬性");
      }
    } catch (error) {
      // 錯誤處理，顯示錯誤訊息
      const errorMessage =
        error.response?.data?.message || "無法處理登入請求，請稍後再試";
      alert("登入失敗: " + errorMessage);
    } finally {
      setIsLoading(false); // 停止加載動畫
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      {/* 登入卡片 */}
      <div
        className="card shadow-lg p-4"
        style={{ maxWidth: "400px", width: "100%" }}>
        <div className="card-body">
          {/* 卡片標題 */}
          <h1 className="card-title text-center mb-4 fw-bold">登入系統</h1>

          {/* 登入表單 */}
          <form onSubmit={handleSubmit}>
            {/* 使用者名稱輸入 */}
            <div className="mb-3">
              <label htmlFor="username" className="form-label fw-bold">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="username"
                placeholder="請輸入電子郵件"
                value={formData.username} // 綁定到狀態
                onChange={handleInputChange} // 輸入變更時調用
                required // 設為必填
                autoFocus // 頁面載入時自動聚焦
              />
            </div>

            {/* 密碼輸入 */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-bold">
                密碼
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="請輸入密碼"
                value={formData.password} // 綁定到狀態
                onChange={handleInputChange} // 輸入變更時調用
                required // 設為必填
              />
            </div>

            {/* 登入按鈕 */}
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isLoading} // 加載時禁用按鈕
            >
              {isLoading ? (
                // 顯示 Spinner 當請求正在處理
                <div
                  className="spinner-border spinner-border-sm text-light"
                  role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                "登入"
              )}
            </button>
          </form>
        </div>

        {/* 卡片底部 */}
        <footer className="text-center mt-4">
          <small className="text-muted">
            &copy; 2024~∞ - 六角學院
            <br />
            第三週作業 - 熟練 React.js by{" "}
            <a href="https://www.worksbyaaron.com" target="_blank">
              Aaron
            </a>
          </small>
        </footer>
      </div>
    </div>
  );
}
