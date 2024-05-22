import React, { useState, useEffect } from 'react';
import Pagination from './Pagination';
import SortButton from './SortButton';
import './styles.css'; // Ensure this imports your CSS

const BookTable = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const response = await fetch('https://openlibrary.org/subjects/programming.json?limit=100');
      const data = await response.json();
      const formattedData = data.works.map(work => ({
        title: work.title,
        authorName: work.authors?.[0]?.name || 'Unknown',  
        firstPublishYear: work.first_publish_year || 'N/A', 
        subject: work.subject ? work.subject.join(', ') : 'N/A',
        authorBirthDate: work.authors?.[0]?.birth_date || 'N/A', 
        authorTopWork: work.authors?.[0]?.top_work || 'N/A', 
        ratingsAverage: work.ratings_average || 'N/A' 
      }));
      setBooks(formattedData);
      setLoading(false);
    };
    fetchBooks();
  }, []);
  const filteredBooks = books.filter(book =>
    book.authorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedBooks = filteredBooks.sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const indexOfLastBook = currentPage * recordsPerPage;
  const indexOfFirstBook = indexOfLastBook - recordsPerPage;
  const currentBooks = sortedBooks.slice(indexOfFirstBook, indexOfLastBook);

  const handlePageChange = pageNumber => setCurrentPage(pageNumber);
  const handleRecordsPerPageChange = event => {
    setRecordsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); 
  };
  const handleSort = key => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="react-pagination-table">
      <h1>Book Records</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="table-options-area">
            <div className="search-container">
              <label htmlFor="search">Search by Author:</label>
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="pagination-settings-container">
              <label htmlFor="recordsPerPage">Records per page:</label>
              <select value={recordsPerPage} onChange={handleRecordsPerPageChange}>
                <option value={10}>10</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
          <table className="items-table">
            <thead>
              <tr>
                <th>
                  <SortButton column="title" sortConfig={sortConfig} onSort={handleSort}>
                    <span className="table-header-text">
                      Title <span className="sort-icon">{sortConfig.key === 'title' ? (sortConfig.direction === 'asc' ? '🔽' : '🔼') : ''}</span>
                    </span>
                  </SortButton>
                </th>
                <th>
                  <SortButton column="authorName" sortConfig={sortConfig} onSort={handleSort}>
                    <span className="table-header-text">
                      Author Name <span className="sort-icon">{sortConfig.key === 'authorName' ? (sortConfig.direction === 'asc' ? '🔽' : '🔼') : ''}</span>
                    </span>
                  </SortButton>
                </th>
                <th>
                  <SortButton column="firstPublishYear" sortConfig={sortConfig} onSort={handleSort}>
                    <span className="table-header-text">
                      First Publish Year <span className="sort-icon">{sortConfig.key === 'firstPublishYear' ? (sortConfig.direction === 'asc' ?'🔽' : '🔼') : ''}</span>
                    </span>
                  </SortButton>
                </th>
                <th className="subject-column">
                  <SortButton column="subject" sortConfig={sortConfig} onSort={handleSort}>
                    <span className="table-header-text">
                      Subject <span className="sort-icon">{sortConfig.key === 'subject' ? (sortConfig.direction === 'asc' ? '🔽' : '🔼') : ''}</span>
                    </span>
                  </SortButton>
                </th>
                <th>
                  <SortButton column="authorBirthDate" sortConfig={sortConfig} onSort={handleSort}>
                    <span className="table-header-text">
                      Author Birth Date <span className="sort-icon">{sortConfig.key === 'authorBirthDate' ? (sortConfig.direction === 'asc' ? '🔽' : '🔼') : ''}</span>
                    </span>
                  </SortButton>
                </th>
                <th>
                  <SortButton column="authorTopWork" sortConfig={sortConfig} onSort={handleSort}>
                    <span className="table-header-text">
                      Author Top Work <span className="sort-icon">{sortConfig.key === 'authorTopWork' ? (sortConfig.direction === 'asc' ? '🔽' : '🔼') : ''}</span>
                    </span>
                  </SortButton>
                </th>
                <th>
                  <SortButton column="ratingsAverage" sortConfig={sortConfig} onSort={handleSort}>
                    <span className="table-header-text">
                      Ratings Average <span className="sort-icon">{sortConfig.key === 'ratingsAverage' ? (sortConfig.direction === 'asc' ? '🔽' : '🔼') : ''}</span>
                    </span>
                  </SortButton>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentBooks.map((book, index) => (
                <tr key={index}>
                  <td>{book.title}</td>
                  <td>{book.authorName}</td>
                  <td>{book.firstPublishYear}</td>
                  <td className="subject-column">{book.subject}</td>
                  <td>{book.authorBirthDate}</td>
                  <td>{book.authorTopWork}</td>
                  <td>{book.ratingsAverage}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            totalRecords={filteredBooks.length}
            recordsPerPage={recordsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default BookTable;
