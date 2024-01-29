'use client'
import { useState,useEffect } from "react"
import PromptCard from "./PromptCard"

function PromptCardList ({data,handleTagClick})
{
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post)=>
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
          />
      )}
    </div>
  )

}



function Feed() {
  const [searchText, setSearchText] = useState('')
  const [allPosts, setAllPosts] = useState([])
  const [searchResult, setSearchResult] = useState([])
  const [searchTimeOut, setSearchTimeOut] = useState(null)



  
  useEffect(()=>{
    const fetchallPosts = async ()=>{
      const response = await fetch('/api/prompt');
      const data = await response.json();
      setAllPosts(data);
    }
    fetchallPosts();
  },[]);

const filterPrompt = (searchText)=>{
    const regex = new RegExp(searchText,"i");
    return allPosts.filter( item =>
      regex.test(item.creator.username) ||
      regex.test(item.tag) ||
      regex.test(item.prompt)
    )

}


const handleSearchChange =(e)=>{
  clearTimeout(searchTimeOut);
  setSearchText(e.target.value)
  setSearchTimeOut(setTimeout(()=>{
    const searchedResult = filterPrompt(e.target.value);
    setSearchResult(searchedResult);
  },3000))
}

const handleTagClick = (tagName)=>{
  setSearchText(tagName);
  const searchedResult = filterPrompt(tagName);
  setSearchResult(searchedResult);

}
console.log(allPosts);
  
  return (
    <section className="feed">
      <form className="realtive w-full flex-center">
        <input
        type="text"
        value={searchText}
        onChange={handleSearchChange}
        className="search_input peer"
        placeholder="Search for a tag or a username"
        required/>
      </form>
      {searchText ?
      (<PromptCardList
      data ={searchResult}
      handleTagClick={handleTagClick}
      />):(<PromptCardList
      data ={allPosts}
      handleTagClick={handleTagClick}
      />)
      }
      
    </section>
  )
}

export default Feed