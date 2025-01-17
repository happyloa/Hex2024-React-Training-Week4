import AddNewModal from "./AddNewModal";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";

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
  // 根據 modalType 渲染對應的子元件
  return (
    <>
      {modalType === "new" && (
        <AddNewModal
          templateData={templateData}
          handleModalInputChange={handleModalInputChange}
          handleImageChange={handleImageChange}
          handleAddImage={handleAddImage}
          handleRemoveImage={handleRemoveImage}
          closeModal={closeModal}
          updateProductData={updateProductData}
        />
      )}
      {modalType === "edit" && (
        <EditModal
          templateData={templateData}
          handleModalInputChange={handleModalInputChange}
          handleImageChange={handleImageChange}
          handleAddImage={handleAddImage}
          handleRemoveImage={handleRemoveImage}
          closeModal={closeModal}
          updateProductData={updateProductData}
        />
      )}
      {modalType === "delete" && (
        <DeleteModal
          templateData={templateData}
          closeModal={closeModal}
          delProductData={delProductData}
        />
      )}
    </>
  );
}
