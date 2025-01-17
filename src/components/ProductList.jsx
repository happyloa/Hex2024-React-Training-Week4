import { useState } from "react";
import axios from "axios";

export default function ProductList({ products, openModal, setisAuth }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await axios.post("https://ec-course-api.hexschool.io/v2/logout");
      document.cookie =
        "hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setisAuth(false);
      console.log("登出成功！");
    } catch (error) {
      console.error(
        "登出失敗:",
        error.response?.data?.message || error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold">產品清單</h2>
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={handleLogout}
            disabled={isLoading}>
            {isLoading ? (
              <div
                className="spinner-border spinner-border-sm text-light"
                role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              "登出"
            )}
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => openModal({}, "new")}
            disabled={isLoading}>
            建立新產品
          </button>
        </div>
      </div>

      <div className="table-responsive" style={{ maxWidth: "100%" }}>
        <table
          className="table table-bordered table-striped table-hover"
          style={{ minWidth: "900px", whiteSpace: "nowrap" }}>
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
            {isLoading ? (
              <tr>
                <td colSpan="7" className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td>{product.category}</td>
                  <td>
                    {/* 判斷標籤是否存在 */}
                    {Array.isArray(product.tags) && product.tags.length > 0 ? (
                      product.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="badge bg-success rounded-pill me-1">
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="badge bg-danger">沒有標籤</span>
                    )}
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
