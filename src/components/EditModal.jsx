import { useEffect, useRef, useState } from "react";
import * as bootstrap from "bootstrap";

export default function EditModal({
  templateData,
  handleModalInputChange,
  handleImageChange,
  handleAddImage,
  handleRemoveImage,
  closeModal,
  updateProductData,
}) {
  const modalRef = useRef(null);
  const bsModal = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (modalRef.current) {
      bsModal.current = new bootstrap.Modal(modalRef.current, {
        backdrop: "static",
        keyboard: false,
      });
      bsModal.current.show();
    }

    return () => {
      if (bsModal.current) {
        bsModal.current.dispose();
      }
    };
  }, []);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await updateProductData(templateData.id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="modal fade"
      tabIndex="-1"
      aria-labelledby="editModalLabel"
      ref={modalRef}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header bg-dark text-white">
            <h5 className="modal-title">編輯產品</h5>
            <button
              type="button"
              className="btn-close bg-light"
              data-bs-dismiss="modal"
              onClick={closeModal}
              disabled={isLoading}></button>
          </div>
          <div className="modal-body">
            {/* 主圖網址輸入與預覽 */}
            <div className="row">
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
                    value={templateData.imageUrl || ""}
                    onChange={(e) =>
                      handleModalInputChange({
                        target: { id: "imageUrl", value: e.target.value },
                      })
                    }
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
                {/* 多圖輸入與管理 */}
                <div>
                  {templateData.imagesUrl?.map((image, index) => (
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
                    {templateData.imagesUrl?.length > 0 && (
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
              <div className="col-md-8">
                {/* 標題欄位 */}
                <div className="mb-3">
                  <label htmlFor="title" className="form-label fw-bold">
                    標題
                  </label>
                  <input
                    id="title"
                    type="text"
                    className="form-control"
                    placeholder="請輸入標題"
                    value={templateData.title || ""}
                    onChange={handleModalInputChange}
                    disabled={isLoading}
                  />
                </div>
                {/* 分類與標籤欄位 */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="category" className="form-label fw-bold">
                      分類
                    </label>
                    <input
                      id="category"
                      type="text"
                      className="form-control"
                      placeholder="請輸入分類"
                      value={templateData.category || ""}
                      onChange={handleModalInputChange}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="tags" className="form-label fw-bold">
                      標籤
                    </label>
                    <input
                      id="tags"
                      type="text"
                      className="form-control"
                      placeholder="請輸入標籤，用逗號隔開，例如：標籤1, 標籤2"
                      value={templateData.tags || ""}
                      onChange={handleModalInputChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                {/* 單位欄位 */}
                <div className="mb-3">
                  <label htmlFor="unit" className="form-label fw-bold">
                    單位
                  </label>
                  <input
                    id="unit"
                    type="text"
                    className="form-control"
                    placeholder="請輸入單位（例如：本、件、箱）"
                    value={templateData.unit || ""}
                    onChange={handleModalInputChange}
                    disabled={isLoading}
                  />
                </div>
                {/* 價格資訊輸入 */}
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
                      <label htmlFor={field.id} className="form-label fw-bold">
                        {field.label}
                      </label>
                      <input
                        id={field.id}
                        type={field.type}
                        className="form-control"
                        placeholder={field.placeholder}
                        value={templateData[field.id] || ""}
                        onChange={handleModalInputChange}
                        disabled={isLoading}
                      />
                    </div>
                  ))}
                </div>
                {/* 描述與簡介輸入 */}
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
                      value={templateData[field.id] || ""}
                      onChange={handleModalInputChange}
                      disabled={isLoading}
                    />
                  </div>
                ))}
                {/* 啟用狀態切換 */}
                <div className="form-check mb-3">
                  <input
                    id="is_enabled"
                    className="form-check-input"
                    type="checkbox"
                    checked={!!templateData.is_enabled}
                    onChange={handleModalInputChange}
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="is_enabled"
                    className="form-check-label fw-bold">
                    是否啟用
                  </label>
                </div>
              </div>
            </div>
          </div>
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
              className="btn btn-primary"
              onClick={handleConfirm}
              disabled={isLoading}>
              {isLoading ? (
                <span
                  className="spinner-border spinner-border-sm text-light"
                  role="status"
                  aria-hidden="true"></span>
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
