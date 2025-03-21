import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

function Articles() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { getToken } = useAuth();

  // Fetch Articles
  async function getArticles() {
    try {
      const token = await getToken();
      let res = await axios.get("http://localhost:3003/author-api/articles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.message === "articles") {
        setArticles(res.data.payload);
        setFilteredArticles(res.data.payload);
        setError("");
        extractCategories(res.data.payload);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError("Failed to fetch articles. Please try again.");
    }
  }

  // Extract unique categories
  function extractCategories(articles) {
    const uniqueCategories = ["All", ...new Set(articles.map((article) => article.category))];
    setCategories(uniqueCategories);
  }

  // Handle category filter change
  function handleCategoryChange(event) {
    const category = event.target.value;
    setSelectedCategory(category);
    
    if (category === "All") {
      setFilteredArticles(articles);
    } else {
      setFilteredArticles(articles.filter((article) => article.category === category));
    }
  }

  // Navigate to Article
  function gotoArticleById(articleObj) {
    navigate(`../${articleObj.articleId}`, { state: articleObj });
  }

  useEffect(() => {
    getArticles();
  }, []);

  return (
    <div className="container mt-4">
      {error && <p className="text-center text-danger">{error}</p>}
      
      {/* Category Filter aligned to the right */}
      <div className="d-flex justify-content-end mb-3">
        <select className="form-select form-select-sm w-auto" value={selectedCategory} onChange={handleCategoryChange}>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {filteredArticles.length === 0 && !error ? (
        <p className="text-center text-muted">No articles available.</p>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          {filteredArticles.map((articleObj) => (
            <div className="col" key={articleObj.articleId}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  {/* Author Details */}
                  <div className="author-details text-end">
                    <img
                      src={articleObj.authorData.profileImageUrl || "fallback-image.jpg"}
                      width="40px"
                      className="rounded-circle border"
                      alt="Author"
                    />
                    <p className="text-secondary small">{articleObj.authorData.nameOfAuthor}</p>
                  </div>
                  {/* Article Title */}
                  <h5 className="card-title">{articleObj.title}</h5>
                  {/* Article Excerpt */}
                  <p className="card-text">{articleObj.content.substring(0, 80)}...</p>
                  {/* Read More Button */}
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => gotoArticleById(articleObj)}
                  >
                    Read More
                  </button>
                </div>
                <div className="card-footer text-muted small">
                  Last updated on {articleObj.dateOfModification}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Articles;