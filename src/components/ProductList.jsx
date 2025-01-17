import { useState } from "react";
import axios from "axios";

/**
 * ProductList - 顯示產品清單並提供操作的元件
 *
 * @param {Array} products - 傳入的產品資料陣列。
 * @param {Function} openModal - 打開 Modal 的函數，接受產品資料與操作類型作為參數。
 * @param {Function} setisAuth - 用於設定使用者是否登入的狀態。
 */
export default function ProductList({ products, openModal, setisAuth }) {
  // 控制 Spinner 的顯示狀態
  const [isLoading, setIsLoading] = useState(false);

  /**
   * handleLogout - 處理登出按鈕點擊事件。
   * 執行登出請求，清除 Token 並將登入狀態設為 false。
   */
  const handleLogout = async () => {
    try {
      setIsLoading(true); // 顯示 Spinner
      await axios.post("https://ec-course-api.hexschool.io/v2/logout"); // 發送登出請求
      document.cookie =
        "hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // 清除 Token
      setisAuth(false); // 更新登入狀態
      console.log("登出成功！");
    } catch (error) {
      // 錯誤處理，顯示錯誤訊息於控制台
      console.error(
        "登出失敗:",
        error.response?.data?.message || error.message
      );
    } finally {
      setIsLoading(false); // 關閉 Spinner
    }
  };

  return (
    <div className="container mt-4">
      {/* 頂部控制區域 */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold">產品清單</h2>
        <div className="d-flex gap-2">
          {/* 登出按鈕 */}
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={handleLogout}
            disabled={isLoading} // 在 Loading 狀態下禁用按鈕
          >
            {isLoading ? (
              // 顯示 Spinner
              <div
                className="spinner-border spinner-border-sm text-light"
                role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              "登出"
            )}
          </button>
          {/* 建立新產品按鈕 */}
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => openModal({}, "new")} // 傳入空資料與 "new" 類型
            disabled={isLoading} // 在 Loading 狀態下禁用按鈕
          >
            建立新產品
          </button>
        </div>
      </div>

      {/* 表格容器，支援小螢幕滾動 */}
      <div className="table-responsive" style={{ maxWidth: "100%" }}>
        <table
          className="table table-bordered table-striped table-hover"
          style={{ minWidth: "900px", whiteSpace: "nowrap" }} // 設定表格最小寬度與禁止文字換行
        >
          {/* 表頭 */}
          <thead className="table-dark">
            <tr>
              <th scope="col">分類</th>
              <th scope="col">產品名稱</th>
              <th scope="col" className="text-end">
                原價
              </th>
              <th scope="col" className="text-end">
                售價
              </th>
              <th scope="col">狀態</th>
              <th scope="col">操作</th>
            </tr>
          </thead>
          {/* 表身 */}
          <tbody>
            {isLoading ? (
              // 顯示 Loading Spinner 當前端處於載入狀態
              <tr>
                <td colSpan="6" className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : (
              // 迭代顯示產品資料
              products.map((product) => (
                <tr key={product.id}>
                  <td>{product.category}</td> {/* 顯示產品分類 */}
                  <td>{product.title}</td> {/* 顯示產品名稱 */}
                  <td className="text-end">${product.origin_price}</td>{" "}
                  {/* 顯示原價 */}
                  <td className="text-end">${product.price}</td>{" "}
                  {/* 顯示售價 */}
                  <td>
                    {product.is_enabled ? (
                      // 根據啟用狀態顯示不同的 Badge
                      <span className="badge bg-success">啟用</span>
                    ) : (
                      <span className="badge bg-secondary">未啟用</span>
                    )}
                  </td>
                  <td>
                    {/* 操作按鈕區域 */}
                    <div className="btn-group">
                      {/* 編輯按鈕 */}
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => openModal(product, "edit")} // 傳入產品資料與 "edit" 類型
                      >
                        編輯
                      </button>
                      {/* 刪除按鈕 */}
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => openModal(product, "delete")} // 傳入產品資料與 "delete" 類型
                      >
                        刪除
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
