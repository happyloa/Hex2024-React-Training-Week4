import { useEffect, useRef, useState } from "react";
import * as bootstrap from "bootstrap";
import axios from "axios";

export default function AddNewModal({
  templateData,
  handleModalInputChange,
  handleAddImage,
  handleRemoveImage,
  closeModal,
  updateProductData,
  handleImageChange,
}) {
  const modalRef = useRef(null);
  const bsModal = useRef(null);
  const [isModalReady, setIsModalReady] = useState(false); // 確保 DOM 已掛載
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null); // 存放主圖檔案
  const [files, setFiles] = useState([]); // 存放其他圖片檔案
  const API_PATH = "book-rental";

  // 初始化 Bootstrap Modal
  useEffect(() => {
    setIsModalReady(true);
  }, []);

  useEffect(() => {
    if (isModalReady && modalRef.current) {
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
  }, [isModalReady]);

  // 上傳主圖
  const handleFileUpload = async () => {
    if (!file) {
      alert("請先選擇一張主圖");
      return;
    }
    const formData = new FormData();
    formData.append("file-to-upload", file);

    setIsLoading(true);
    try {
      const response = await axios.post(
        `https://ec-course-api.hexschool.io/v2/api/${API_PATH}/admin/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        handleModalInputChange({
          target: { id: "imageUrl", value: response.data.imageUrl },
        });
        alert("主圖上傳成功！");
      }
    } catch (error) {
      console.error(
        "主圖上傳失敗：",
        error.response?.data?.message || error.message
      );
      alert("主圖上傳失敗，請稍後再試。");
    } finally {
      setIsLoading(false);
    }
  };

  // 上傳其他圖片
  const handleAdditionalImageUpload = async (index, file) => {
    if (!file) {
      alert("請先選擇圖片");
      return;
    }
    const formData = new FormData();
    formData.append("file-to-upload", file);

    setIsLoading(true);
    try {
      const response = await axios.post(
        `https://ec-course-api.hexschool.io/v2/api/${API_PATH}/admin/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        handleImageChange(index, response.data.imageUrl);
        alert("圖片上傳成功！");
      }
    } catch (error) {
      console.error(
        "圖片上傳失敗：",
        error.response?.data?.message || error.message
      );
      alert("圖片上傳失敗，請稍後再試。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const updatedData = {
        ...templateData,
        tags: templateData.tags.split(",").map((tag) => tag.trim()), // 將逗號分隔的字串轉為陣列
      };
      await updateProductData(updatedData.id, updatedData);
      closeModal();
    } finally {
      setIsLoading(false);
    }
  };

  if (!isModalReady) return null;

  return (
    <div
      className="modal fade"
      tabIndex="-1"
      aria-labelledby="addNewModalLabel"
      ref={modalRef}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header bg-dark text-white">
            <h5 className="modal-title">新增產品</h5>
            <button
              type="button"
              className="btn-close bg-light"
              data-bs-dismiss="modal"
              onClick={closeModal}
              disabled={isLoading}></button>
          </div>
          <div className="modal-body">
            <div className="row">
              {/* 左欄 - 圖片處理 */}
              <div className="col-md-6">
                <h5 className="fw-bold">圖片處理</h5>

                {/* 主圖上傳 */}
                <div className="mb-3">
                  <label htmlFor="file-upload" className="form-label fw-bold">
                    上傳主圖
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="file-upload"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-primary mt-2"
                    onClick={handleFileUpload}
                    disabled={isLoading || !file}>
                    {isLoading ? (
                      <span
                        className="spinner-border spinner-border-sm text-primary"
                        role="status"></span>
                    ) : (
                      "上傳主圖"
                    )}
                  </button>
                  {templateData.imageUrl && (
                    <div className="mt-3">
                      <img
                        src={templateData.imageUrl}
                        alt="主圖預覽"
                        className="img-fluid border"
                      />
                    </div>
                  )}
                </div>

                {/* 其他圖片處理 */}
                {templateData.imagesUrl?.map((image, index) => (
                  <div key={index} className="mb-2">
                    <label className="form-label fw-bold">
                      上傳圖片 {index + 1}
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) =>
                        setFiles((prev) => {
                          const newFiles = [...prev];
                          newFiles[index] = e.target.files[0];
                          return newFiles;
                        })
                      }
                      disabled={isLoading}
                    />
                    <button
                      className="btn btn-outline-primary mt-2"
                      onClick={() =>
                        handleAdditionalImageUpload(index, files[index])
                      }
                      disabled={isLoading || !files[index]}>
                      {isLoading ? (
                        <span
                          className="spinner-border spinner-border-sm text-primary"
                          role="status"></span>
                      ) : (
                        "上傳圖片"
                      )}
                    </button>
                    {image && (
                      <div className="mt-2">
                        <img
                          src={image}
                          alt={`圖片 ${index + 1}`}
                          className="img-thumbnail"
                        />
                      </div>
                    )}
                  </div>
                ))}
                <div className="d-flex justify-content-between mt-3">
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

              {/* 右欄 - 其他欄位 */}
              <div className="col-md-6">
                <h5 className="fw-bold">產品資訊</h5>
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
                      onChange={(event) => handleModalInputChange(event)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
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
                <div className="row">
                  {[
                    { id: "origin_price", label: "原價" },
                    { id: "price", label: "售價" },
                  ].map((field) => (
                    <div className="col-md-6 mb-3" key={field.id}>
                      <label htmlFor={field.id} className="form-label fw-bold">
                        {field.label}
                      </label>
                      <input
                        id={field.id}
                        type="number"
                        className="form-control"
                        placeholder={`請輸入${field.label}`}
                        value={templateData[field.id] || ""}
                        onChange={handleModalInputChange}
                        disabled={isLoading}
                      />
                    </div>
                  ))}
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label fw-bold">
                    產品描述
                  </label>
                  <textarea
                    id="description"
                    className="form-control"
                    placeholder="請輸入產品描述"
                    value={templateData.description || ""}
                    onChange={handleModalInputChange}
                    disabled={isLoading}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="content" className="form-label fw-bold">
                    產品簡介
                  </label>
                  <textarea
                    id="content"
                    className="form-control"
                    placeholder="請輸入產品簡介"
                    value={templateData.content || ""}
                    onChange={handleModalInputChange}
                    disabled={isLoading}
                  />
                </div>
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
                  role="status"></span>
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
