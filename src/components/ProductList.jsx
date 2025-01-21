import axios from "axios";
import Pagination from "./Pagination";

export default function ProductList({
  openModal,
  setIsAuth,
  products,
  pagination,
  fetchProducts,
}) {
  /**
   * handleLogout - 處理登出功能
   */
  const handleLogout = async () => {
    try {
      await axios.post("https://ec-course-api.hexschool.io/v2/logout");
      document.cookie =
        "hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setIsAuth(false); // 更新登入狀態
      console.log("登出成功！");
    } catch (error) {
      console.error(
        "登出失敗:",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <div className="container mt-4">
      {/* 標題與功能按鈕 */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold">產品清單</h2>
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={handleLogout}>
            登出
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => openModal({}, "new")}>
            建立新產品
          </button>
        </div>
      </div>

      {/* 產品表格 */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th scope="col">分類</th>
              <th scope="col">標籤</th>
              <th scope="col">產品名稱</th>
              <th scope="col">原價</th>
              <th scope="col">售價</th>
              <th scope="col">狀態</th>
              <th scope="col">操作</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.category}</td>
                <td>
                  {product.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="badge bg-success rounded-pill me-1">
                      {tag}
                    </span>
                  )) || <span className="badge bg-danger">沒有標籤</span>}
                </td>
                <td>{product.title}</td>
                <td>${product.origin_price}</td>
                <td>${product.price}</td>
                <td>
                  {product.is_enabled ? (
                    <span className="badge bg-success">啟用</span>
                  ) : (
                    <span className="badge bg-secondary">未啟用</span>
                  )}
                </td>
                <td>
                  <div className="btn-group">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => openModal(product, "edit")}>
                      編輯
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => openModal(product, "delete")}>
                      刪除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分頁元件 */}
      {pagination && (
        <Pagination
          pagination={pagination}
          changePage={(page) => fetchProducts(page)} // 傳遞頁碼給 fetchProducts
        />
      )}
    </div>
  );
}
