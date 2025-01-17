import { useEffect, useRef, useState } from "react";
import * as bootstrap from "bootstrap";

/**
 * ProductModal - 用於新增、編輯、刪除產品的彈出視窗。
 * 根據 `modalType` 決定顯示的內容及行為。
 *
 * @param {string} modalType - 決定 Modal 的類型 ("new", "edit", 或 "delete")。
 * @param {Object} templateData - Modal 表單中需要顯示或編輯的產品資料。
 * @param {function} handleModalInputChange - 處理表單輸入變更的回調函數。
 * @param {function} handleImageChange - 處理圖片網址輸入的回調函數。
 * @param {function} handleAddImage - 增加圖片輸入欄位的回調函數。
 * @param {function} handleRemoveImage - 移除最後一個圖片輸入欄位的回調函數。
 * @param {function} closeModal - 關閉 Modal 的回調函數。
 * @param {function} updateProductData - 用於提交新增或編輯產品資料的回調函數。
 * @param {function} delProductData - 用於提交刪除產品的回調函數。
 */
export default function ProductModal({
  modalType,
  templateData,
  handleModalInputChange,
  handleImageChange,
  handleAddImage,
  handleRemoveImage,
  closeModal,
  updateProductData,
  delProductData,
}) {
  // Ref 用於指向 Modal DOM 元素
  const modalRef = useRef(null);
  // 保存 Bootstrap Modal 實例
  const bsModal = useRef(null);

  // 控制按鈕 Loading Spinner 的顯示
  const [isLoading, setIsLoading] = useState(false);

  // 初始化 Bootstrap Modal，設定 backdrop 為 "static" 並禁用 Esc 鍵關閉
  useEffect(() => {
    if (modalRef.current) {
      bsModal.current = new bootstrap.Modal(modalRef.current, {
        backdrop: "static",
        keyboard: false,
      });
    }

    // 清理：在元件卸載時銷毀 Bootstrap Modal 實例
    return () => {
      if (bsModal.current) {
        bsModal.current.dispose();
      }
    };
  }, []);

  // 根據 `modalType` 更新時自動顯示 Modal
  useEffect(() => {
    if (modalType && bsModal.current) {
      bsModal.current.show();
    }
  }, [modalType]);

  /**
   * handleConfirm - 處理確認按鈕的點擊事件。
   * 根據 `modalType` 提交對應的操作：新增、編輯或刪除產品。
   */
  const handleConfirm = async () => {
    setIsLoading(true); // 開啟 Loading Spinner
    try {
      if (modalType === "delete") {
        await delProductData(templateData.id); // 刪除操作
      } else {
        await updateProductData(templateData.id); // 新增或更新操作
      }
    } finally {
      setIsLoading(false); // 完成後關閉 Loading Spinner
    }
  };

  return (
    <div
      className="modal fade"
      id="productModal"
      tabIndex="-1"
      aria-labelledby="productModalLabel"
      ref={modalRef} // 綁定 Modal 的 DOM 元素
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content border-0 shadow-lg">
          {/* Modal 標題 */}
          <div
            className={`modal-header ${
              modalType === "delete"
                ? "bg-danger text-white"
                : "bg-dark text-white"
            }`}>
            <h5 id="productModalLabel" className="modal-title">
              {/* 根據 modalType 決定標題 */}
              {modalType === "delete"
                ? "刪除產品"
                : modalType === "edit"
                ? "編輯產品"
                : "新增產品"}
            </h5>
            {/* 右上角關閉按鈕 */}
            <button
              type="button"
              className="btn-close bg-light"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={closeModal}
              disabled={isLoading} // Loading 時禁用
            ></button>
          </div>

          {/* Modal 主體內容 */}
          <div className="modal-body">
            {/* 根據 modalType 決定顯示內容 */}
            {modalType === "delete" ? (
              // 刪除產品確認提示
              <p className="h5">
                確定要刪除
                <span className="text-danger"> {templateData.title} </span>
                嗎?
              </p>
            ) : (
              // 新增或編輯產品表單
              <div className="row">
                {/* 左側：主圖與多圖管理 */}
                <div className="col-md-4">
                  <div className="mb-3">
                    <label htmlFor="imageUrl" className="form-label fw-bold">
                      主圖網址
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="imageUrl"
                      placeholder="請輸入主圖連結"
                      value={templateData.imageUrl}
                      onChange={handleModalInputChange}
                      disabled={isLoading}
                    />
                    {templateData.imageUrl && (
                      <img
                        className="img-fluid mt-3 border"
                        src={templateData.imageUrl}
                        alt="主圖"
                      />
                    )}
                  </div>
                  {/* 多圖輸入與顯示 */}
                  <div>
                    {templateData.imagesUrl.map((image, index) => (
                      <div key={index} className="mb-2">
                        <input
                          type="text"
                          className="form-control mb-2"
                          value={image}
                          onChange={(e) =>
                            handleImageChange(index, e.target.value)
                          }
                          placeholder={`圖片網址 ${index + 1}`}
                        />
                        {image && (
                          <img
                            src={image}
                            alt={`副圖 ${index + 1}`}
                            className="img-thumbnail mb-2"
                          />
                        )}
                      </div>
                    ))}
                    <div className="d-flex justify-content-between">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={handleAddImage}
                        disabled={isLoading}>
                        新增圖片
                      </button>
                      {templateData.imagesUrl.length > 0 && (
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={handleRemoveImage}
                          disabled={isLoading}>
                          刪除最後一張圖片
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* 右側：表單欄位輸入 */}
                <div className="col-md-8">
                  {/* 產品基本資訊 */}
                  {[
                    {
                      id: "title",
                      label: "標題",
                      placeholder: "請輸入標題",
                      type: "text",
                    },
                    {
                      id: "category",
                      label: "分類",
                      placeholder: "請輸入分類",
                      type: "text",
                    },
                    {
                      id: "unit",
                      label: "單位",
                      placeholder: "請輸入單位（例如：本、件、箱）",
                      type: "text",
                    },
                  ].map((field) => (
                    <div className="mb-3" key={field.id}>
                      <label htmlFor={field.id} className="form-label fw-bold">
                        {field.label}
                      </label>
                      <input
                        id={field.id}
                        type={field.type}
                        className="form-control"
                        placeholder={field.placeholder}
                        value={templateData[field.id]}
                        onChange={handleModalInputChange}
                        disabled={isLoading}
                      />
                    </div>
                  ))}
                  {/* 產品價格資訊 */}
                  <div className="row">
                    {[
                      {
                        id: "origin_price",
                        label: "原價",
                        placeholder: "請輸入原價",
                        type: "number",
                      },
                      {
                        id: "price",
                        label: "售價",
                        placeholder: "請輸入售價",
                        type: "number",
                      },
                    ].map((field) => (
                      <div className="col-md-6 mb-3" key={field.id}>
                        <label
                          htmlFor={field.id}
                          className="form-label fw-bold">
                          {field.label}
                        </label>
                        <input
                          id={field.id}
                          type={field.type}
                          className="form-control"
                          placeholder={field.placeholder}
                          value={templateData[field.id]}
                          onChange={handleModalInputChange}
                          disabled={isLoading}
                        />
                      </div>
                    ))}
                  </div>
                  {/* 產品描述與簡介 */}
                  {[
                    {
                      id: "description",
                      label: "產品描述",
                      placeholder: "請輸入產品描述",
                    },
                    {
                      id: "content",
                      label: "產品簡介",
                      placeholder: "請輸入產品簡介",
                    },
                  ].map((field) => (
                    <div className="mb-3" key={field.id}>
                      <label htmlFor={field.id} className="form-label fw-bold">
                        {field.label}
                      </label>
                      <textarea
                        id={field.id}
                        className="form-control"
                        placeholder={field.placeholder}
                        value={templateData[field.id]}
                        onChange={handleModalInputChange}
                        disabled={isLoading}
                      />
                    </div>
                  ))}
                  {/* 是否啟用 */}
                  <div className="form-check mb-3">
                    <input
                      id="is_enabled"
                      className="form-check-input"
                      type="checkbox"
                      checked={templateData.is_enabled}
                      onChange={handleModalInputChange}
                      disabled={isLoading}
                    />
                    <label
                      className="form-check-label fw-bold"
                      htmlFor="is_enabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              data-bs-dismiss="modal"
              onClick={closeModal}
              disabled={isLoading}>
              取消
            </button>
            <button
              type="button"
              className={`btn ${
                modalType === "delete" ? "btn-danger" : "btn-primary"
              }`}
              onClick={handleConfirm}
              disabled={isLoading}>
              {isLoading ? (
                <span
                  className="spinner-border spinner-border-sm text-light"
                  role="status"
                  aria-hidden="true"></span>
              ) : modalType === "delete" ? (
                "刪除"
              ) : (
                "確認"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
