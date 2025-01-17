import { useEffect, useRef, useState } from "react";
import * as bootstrap from "bootstrap";

export default function DeleteModal({
  templateData,
  closeModal,
  delProductData,
}) {
  const modalRef = useRef(null);
  const bsModal = useRef(null);
  const [isModalReady, setIsModalReady] = useState(false); // 確保 DOM 已掛載
  const [isLoading, setIsLoading] = useState(false);

  // 確保 DOM 完全渲染後初始化
  useEffect(() => {
    setIsModalReady(true); // 標記 DOM 已掛載
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
  }, [isModalReady]); // 當 DOM 準備好後執行初始化

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const updatedData = {
        ...templateData,
        tags: templateData.tags.split(",").map((tag) => tag.trim()), // 將逗號分隔的字串轉為陣列
      };
      await updateProductData(updatedData.id, updatedData);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isModalReady) return null; // 確保 Modal 節點準備好後才渲染

  return (
    <div
      className="modal fade"
      tabIndex="-1"
      aria-labelledby="deleteModalLabel"
      ref={modalRef}>
      <div className="modal-dialog modal-md">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title">刪除產品</h5>
            <button
              type="button"
              className="btn-close bg-light"
              data-bs-dismiss="modal"
              onClick={closeModal}
              disabled={isLoading}></button>
          </div>
          <div className="modal-body">
            <p className="h5">
              確定要刪除
              <span className="text-danger"> {templateData.title} </span> 嗎?
            </p>
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
              className="btn btn-danger"
              onClick={handleConfirm}
              disabled={isLoading}>
              {isLoading ? (
                <span
                  className="spinner-border spinner-border-sm text-light"
                  role="status"
                  aria-hidden="true"></span>
              ) : (
                "刪除"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
