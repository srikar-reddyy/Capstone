import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { userAuthorContextObj } from '../contexts/UserAuthorContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function PostArticle() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { currentUser } = useContext(userAuthorContextObj)
  const navigate = useNavigate()
  
  async function postArticle(articleObj){
    const authorData = {
      nameOfAuthor:currentUser.lastName,
      email:currentUser.email,
      profileImageUrl:currentUser.profileImageUrl
    }
    articleObj.authorData = authorData
    articleObj.articleId = Date.now();

    let currentDate = new Date();
    articleObj.dateOfCreation = currentDate.getDate() + "-"
      + currentDate.getMonth() + "-"
      + currentDate.getFullYear() + " "
      + currentDate.toLocaleTimeString("en-US", { hour12: true })

    articleObj.dateOfModification = currentDate.getDate() + "-"
      + currentDate.getMonth() + "-"
      + currentDate.getFullYear() + " "
      + currentDate.toLocaleTimeString("en-US", { hour12: true })
    // await axios.post('',articleObj)

    articleObj.comments = []
    articleObj.isArticleActive = true

    let res = await axios.post('http://localhost:3003/author-api/article',articleObj)
    if(res.status === 201){
      navigate(`/author-profile/${currentUser.email}/articles`)
    }else{
      console.log(res)
      // set Error
    }
    console.log(articleObj)
  }

  return (
    <div className="container ">
      <div className="row justify-content-center mt-5">
        <div className="col-lg-8 col-md-8 col-sm-10">
          <div className="card shadow">
            <div className="card-title text-center border-bottom">
              <h2 className="p-3 " style={{ color: "goldenrod" }}>
                write an aricle
              </h2>
            </div>
            <div className="card-body bg-light">
              {/* {err.length!==0&&<p className='text-danger fs-5'>{err}</p>} */}
              <form onSubmit = {handleSubmit(postArticle)}> 
                <div className="mb-4">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    {...register("title")}
                  />
                  {/* title validation err msg */}

                </div>

                <div className="mb-4">
                  <label htmlFor="category" className="form-label">
                    Select a category
                  </label>
                  <select
                    {...register("category")}
                    id="category"
                    className="form-select"
                    defaultValue=""
                  >
                    <option value="" disabled>--categories--</option>
                    <option value="programming">Programming</option>
                    <option value="AI&ML">AI&ML</option>
                    <option value="database">Database</option>
                  </select>
                  {/* title validation err msg */}

                </div>
                <div className="mb-4">
                  <label htmlFor="content" className="form-label">
                    Content
                  </label>
                  <textarea
                    {...register("content")}
                    className="form-control"
                    id="content"
                    rows="10"
                  ></textarea>
                  {/* title validation err msg */}

                </div>

                <div className="text-end">
                  <button type="submit" className="add-article-btn">
                    Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      </div>
  )
}

export default PostArticle