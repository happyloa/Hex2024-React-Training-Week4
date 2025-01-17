export default function Pagination({ pagination, changePage }) {
  const { total_pages, current_page, has_pre, has_next } = pagination;

  const handlePageChange = (event, page) => {
    event.preventDefault(); // 阻止預設行為
    if (page > 0 && page <= total_pages) {
      changePage(page); // 呼叫父元件傳入的切換頁面函式
    }
  };

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination justify-content-center mt-4">
        {/* 上一頁按鈕 */}
        <li className={`page-item ${has_pre ? "" : "disabled"}`}>
          <a
            href="/"
            className="page-link"
            aria-label="Previous"
            onClick={(event) => handlePageChange(event, current_page - 1)}>
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>

        {/* 分頁按鈕 */}
        {Array.from({ length: total_pages }, (_, index) => index + 1).map(
          (page) => (
            <li
              key={`page_${page}`}
              className={`page-item ${current_page === page ? "active" : ""}`}>
              <a
                href="/"
                className="page-link"
                onClick={(event) => handlePageChange(event, page)}>
                {page}
              </a>
            </li>
          )
        )}

        {/* 下一頁按鈕 */}
        <li className={`page-item ${has_next ? "" : "disabled"}`}>
          <a
            href="/"
            className="page-link"
            aria-label="Next"
            onClick={(event) => handlePageChange(event, current_page + 1)}>
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}
